import { type NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const ReportSchema = z.object({
  title: z.string(),
  executiveSummary: z.string(),
  keyMetrics: z.object({
    totalProducts: z.number(),
    totalSavings: z.number(),
    avgWasteReduction: z.number(),
    co2Reduction: z.number(),
  }),
  sections: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
      insights: z.array(z.string()),
    }),
  ),
  recommendations: z.array(z.string()),
  conclusion: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { reportType, dateRange, sections, reportName } = await request.json()

    // Get user's data for the report
    const { data: products } = await supabase.from("products").select("*").eq("user_id", user.id)

    const { data: optimizations } = await supabase.from("optimizations").select("*, products(*)").eq("user_id", user.id)

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    // Calculate metrics
    const totalSavings = optimizations?.reduce((sum, opt) => sum + (opt.cost_savings || 0), 0) || 0
    const avgWasteReduction =
      optimizations?.reduce((sum, opt) => sum + (opt.waste_reduction_percentage || 0), 0) /
        (optimizations?.length || 1) || 0
    const totalCo2Reduction = optimizations?.reduce((sum, opt) => sum + (opt.co2_reduction_kg || 0), 0) || 0

    // Generate AI-powered report content
    const { object: reportContent } = await generateObject({
      model: openai("gpt-4o"),
      schema: ReportSchema,
      prompt: `Generate a comprehensive ${reportType} report for ${profile?.company_name || "the company"}.

Data Summary:
- Total Products: ${products?.length || 0}
- Total Cost Savings: $${totalSavings.toFixed(2)}
- Average Waste Reduction: ${avgWasteReduction.toFixed(1)}%
- Total CO₂ Reduction: ${totalCo2Reduction.toFixed(1)} kg

Products: ${JSON.stringify(products?.slice(0, 5) || [], null, 2)}
Optimizations: ${JSON.stringify(optimizations?.slice(0, 5) || [], null, 2)}

Report Type: ${reportType}
Requested Sections: ${sections?.join(", ") || "All sections"}
Date Range: ${dateRange}

Create a professional, detailed report that includes:
1. Executive summary highlighting key achievements
2. Detailed analysis of packaging optimization results
3. Environmental impact assessment
4. Cost-benefit analysis
5. Strategic recommendations for future improvements
6. Industry benchmarking where relevant

Make the content specific to the actual data provided, with concrete numbers and actionable insights.`,
    })

    // Save report to database
    const { data: savedReport, error: saveError } = await supabase
      .from("reports")
      .insert({
        user_id: user.id,
        name: reportName || `${reportType} Report - ${new Date().toLocaleDateString()}`,
        type: reportType,
        content: reportContent,
        sections: sections || [],
        date_range: dateRange,
        status: "completed",
      })
      .select()
      .single()

    if (saveError) {
      console.error("Error saving report:", saveError)
    }

    return NextResponse.json({
      success: true,
      report: reportContent,
      reportId: savedReport?.id,
    })
  } catch (error) {
    console.error("Report generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate report. Please try again.",
      },
      { status: 500 },
    )
  }
}

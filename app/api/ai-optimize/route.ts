import { type NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const OptimizationSchema = z.object({
  recommendations: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      currentDimensions: z.object({
        length: z.number(),
        width: z.number(),
        height: z.number(),
      }),
      optimizedDimensions: z.object({
        length: z.number(),
        width: z.number(),
        height: z.number(),
      }),
      currentMaterial: z.string(),
      recommendedMaterial: z.string(),
      costSavingsPercentage: z.number(),
      wasteReductionPercentage: z.number(),
      co2ReductionKg: z.number(),
      confidenceScore: z.number(),
      reasoning: z.string(),
      status: z.enum(["optimized", "warning", "optimal"]),
    }),
  ),
  summary: z.object({
    totalProducts: z.number(),
    totalCostSavings: z.number(),
    averageWasteReduction: z.number(),
    totalCo2Reduction: z.number(),
  }),
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

    const { productIds } = await request.json()

    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json({ error: "Product IDs are required" }, { status: 400 })
    }

    // Get products from database
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds)
      .eq("user_id", user.id)

    if (productsError) {
      return NextResponse.json({ error: productsError.message }, { status: 500 })
    }

    if (!products || products.length === 0) {
      return NextResponse.json({ error: "No products found" }, { status: 404 })
    }

    // Prepare product data for AI analysis
    const productData = products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      dimensions: {
        length: product.dimensions_length || 0,
        width: product.dimensions_width || 0,
        height: product.dimensions_height || 0,
      },
      weight: product.weight || 0,
      material: product.material || "Unknown",
      quantity: product.quantity || 1,
      costPerUnit: product.cost_per_unit || 0,
    }))

    // Generate AI-powered optimization recommendations
    const { object: aiResult } = await generateObject({
      model: openai("gpt-4o"),
      schema: OptimizationSchema,
      prompt: `You are an expert packaging optimization AI. Analyze the following products and provide detailed optimization recommendations to reduce costs, minimize waste, and improve sustainability.

Products to analyze:
${JSON.stringify(productData, null, 2)}

For each product, consider:
1. Current packaging efficiency (volume utilization, material usage)
2. Optimal box dimensions to minimize void space
3. Sustainable material alternatives
4. Cost implications of changes
5. Environmental impact (CO2 reduction, waste reduction)
6. Confidence in recommendations based on data quality

Provide specific, actionable recommendations with realistic savings percentages. Consider:
- Dimension optimization: Reduce box size by 5-25% where possible
- Material optimization: Suggest eco-friendly alternatives
- Cost savings: Realistic 10-40% savings based on optimization
- Waste reduction: 15-50% reduction in packaging waste
- CO2 impact: Calculate based on material and size changes
- Confidence: 70-95% based on data completeness

Status should be:
- "optimized": Significant improvements possible (>15% savings)
- "warning": Limited improvements or concerns (5-15% savings)  
- "optimal": Already well-optimized (<5% potential savings)

Provide clear reasoning for each recommendation.`,
    })

    // Save optimizations to database
    const optimizationInserts = aiResult.recommendations.map((rec) => ({
      user_id: user.id,
      product_id: rec.productId,
      original_cost: productData.find((p) => p.id === rec.productId)?.costPerUnit || 0,
      optimized_cost:
        (productData.find((p) => p.id === rec.productId)?.costPerUnit || 0) * (1 - rec.costSavingsPercentage / 100),
      cost_savings:
        (productData.find((p) => p.id === rec.productId)?.costPerUnit || 0) * (rec.costSavingsPercentage / 100),
      waste_reduction_percentage: rec.wasteReductionPercentage,
      co2_reduction_kg: rec.co2ReductionKg,
      recommended_material: rec.recommendedMaterial,
      recommended_dimensions: rec.optimizedDimensions,
      confidence_score: rec.confidenceScore / 100,
      status: "completed",
    }))

    const { data: savedOptimizations, error: saveError } = await supabase
      .from("optimizations")
      .insert(optimizationInserts)
      .select()

    if (saveError) {
      console.error("Error saving optimizations:", saveError)
      // Continue even if save fails - return AI results
    }

    return NextResponse.json({
      success: true,
      recommendations: aiResult.recommendations,
      summary: aiResult.summary,
      optimizations: savedOptimizations,
    })
  } catch (error) {
    console.error("AI optimization error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate AI recommendations. Please try again.",
      },
      { status: 500 },
    )
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

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

    const { reportId, format } = await request.json()

    // Get report data
    const { data: report, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", reportId)
      .eq("user_id", user.id)
      .single()

    if (error || !report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    // Generate export content based on format
    let exportContent: string
    let contentType: string
    let filename: string

    switch (format) {
      case "pdf":
        // In a real implementation, you'd use a PDF library like puppeteer or jsPDF
        exportContent = generatePDFContent(report)
        contentType = "application/pdf"
        filename = `${report.name}.pdf`
        break
      case "csv":
        exportContent = generateCSVContent(report)
        contentType = "text/csv"
        filename = `${report.name}.csv`
        break
      case "json":
        exportContent = JSON.stringify(report.content, null, 2)
        contentType = "application/json"
        filename = `${report.name}.json`
        break
      default:
        return NextResponse.json({ error: "Unsupported format" }, { status: 400 })
    }

    // Return file as download
    return new NextResponse(exportContent, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}

function generatePDFContent(report: any): string {
  // Mock PDF content - in production, use a proper PDF library
  return `PDF Report: ${report.name}\n\nGenerated: ${new Date().toISOString()}\n\nContent: ${JSON.stringify(
    report.content,
    null,
    2,
  )}`
}

function generateCSVContent(report: any): string {
  const content = report.content
  let csv = "Metric,Value\n"
  csv += `Total Products,${content.keyMetrics?.totalProducts || 0}\n`
  csv += `Total Savings,$${content.keyMetrics?.totalSavings || 0}\n`
  csv += `Avg Waste Reduction,${content.keyMetrics?.avgWasteReduction || 0}%\n`
  csv += `CO2 Reduction,${content.keyMetrics?.co2Reduction || 0} kg\n`
  return csv
}

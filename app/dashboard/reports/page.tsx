"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { FileText, Download, Filter, Mail, Eye, Brain, Trash2, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface Report {
  id: string
  name: string
  type: "sustainability" | "optimization" | "cost-analysis" | "compliance"
  status: "completed" | "generating" | "failed"
  created_at: string
  file_size?: number
  download_count: number
  content?: any
}

const reportTemplates = [
  {
    id: "executive",
    name: "Executive Summary",
    description: "High-level overview for stakeholders",
    sections: ["Key Metrics", "Cost Savings", "Environmental Impact", "Strategic Recommendations"],
  },
  {
    id: "detailed",
    name: "Detailed Analysis",
    description: "Comprehensive technical report",
    sections: [
      "Product Analysis",
      "Optimization Results",
      "Material Breakdown",
      "Sustainability Metrics",
      "ROI Analysis",
      "Implementation Roadmap",
    ],
  },
  {
    id: "compliance",
    name: "Compliance Report",
    description: "Regulatory and certification compliance",
    sections: ["Regulatory Standards", "Certification Status", "Audit Trail", "Compliance Gaps", "Action Items"],
  },
  {
    id: "sustainability",
    name: "Sustainability Report",
    description: "Environmental impact and ESG metrics",
    sections: ["Carbon Footprint", "Waste Reduction", "Material Sourcing", "Circular Economy", "Sustainability Goals"],
  },
]

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState("executive")
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const [dateRange, setDateRange] = useState("last-month")
  const [reportName, setReportName] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadReports()
    // Set default sections for selected template
    const template = reportTemplates.find((t) => t.id === selectedTemplate)
    if (template) {
      setSelectedSections(template.sections)
    }
  }, [selectedTemplate])

  const loadReports = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/reports")
      const data = await response.json()

      if (response.ok) {
        setReports(data.reports || [])
      } else {
        setError(data.error || "Failed to load reports")
      }
    } catch (error) {
      console.error("Error loading reports:", error)
      setError("Failed to load reports")
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = async () => {
    if (!reportName.trim()) {
      setError("Please enter a report name")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType: selectedTemplate,
          dateRange,
          sections: selectedSections,
          reportName: reportName.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setGeneratedReport(data.report)
        setReportName("")
        loadReports() // Refresh reports list
      } else {
        setError(data.error || "Failed to generate report")
      }
    } catch (error) {
      console.error("Error generating report:", error)
      setError("Failed to generate report")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExportReport = async (reportId: string, format: string) => {
    try {
      const response = await fetch("/api/reports/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reportId, format }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `report.${format}`
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        const data = await response.json()
        setError(data.error || "Export failed")
      }
    } catch (error) {
      console.error("Export error:", error)
      setError("Export failed")
    }
  }

  const handleDeleteReport = async (reportId: string) => {
    try {
      const response = await fetch("/api/reports", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reportId }),
      })

      if (response.ok) {
        loadReports()
      } else {
        const data = await response.json()
        setError(data.error || "Delete failed")
      }
    } catch (error) {
      console.error("Delete error:", error)
      setError("Delete failed")
    }
  }

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-primary text-primary-foreground">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ready
          </Badge>
        )
      case "generating":
        return (
          <Badge variant="secondary">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Generating
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
    }
  }

  const getTypeBadge = (type: Report["type"]) => {
    const colors = {
      sustainability: "bg-chart-3 text-white",
      optimization: "bg-primary text-primary-foreground",
      "cost-analysis": "bg-accent text-accent-foreground",
      compliance: "bg-chart-2 text-white",
    }
    return <Badge className={colors[type]}>{type.replace("-", " ")}</Badge>
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">AI-Powered Reports</h1>
          <p className="text-muted-foreground">
            Generate comprehensive packaging optimization and sustainability reports with AI insights.
          </p>
        </div>

        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
                <Button onClick={() => setError(null)} variant="outline" size="sm" className="ml-auto bg-transparent">
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate">Generate Report</TabsTrigger>
            <TabsTrigger value="reports">My Reports</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            {/* AI Report Builder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Report Builder
                </CardTitle>
                <CardDescription>
                  Create intelligent reports with AI-generated insights and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="template">Report Template</Label>
                      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          {reportTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        {reportTemplates.find((t) => t.id === selectedTemplate)?.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateRange">Date Range</Label>
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="last-week">Last Week</SelectItem>
                          <SelectItem value="last-month">Last Month</SelectItem>
                          <SelectItem value="last-quarter">Last Quarter</SelectItem>
                          <SelectItem value="last-year">Last Year</SelectItem>
                          <SelectItem value="all-time">All Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reportName">Report Name</Label>
                      <Input
                        id="reportName"
                        placeholder="Enter report name"
                        value={reportName}
                        onChange={(e) => setReportName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Include Sections</Label>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {reportTemplates
                        .find((t) => t.id === selectedTemplate)
                        ?.sections.map((section) => (
                          <div key={section} className="flex items-center space-x-2">
                            <Checkbox
                              id={section}
                              checked={selectedSections.includes(section)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedSections([...selectedSections, section])
                                } else {
                                  setSelectedSections(selectedSections.filter((s) => s !== section))
                                }
                              }}
                            />
                            <Label htmlFor={section} className="text-sm font-normal">
                              {section}
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleGenerateReport}
                    disabled={isGenerating || !reportName.trim()}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600"
                  >
                    {isGenerating ? (
                      <>
                        <Brain className="h-4 w-4 mr-2 animate-pulse" />
                        AI Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Generate AI Report
                      </>
                    )}
                  </Button>
                  <Button variant="outline" disabled={!generatedReport}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {/* Available Reports */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Generated Reports</CardTitle>
                    <CardDescription>Download, share, or manage your AI-generated reports</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={loadReports}>
                    <Filter className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-muted rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{report.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              {getTypeBadge(report.type)}
                              {getStatusBadge(report.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Generated: {new Date(report.created_at).toLocaleDateString()} • {report.download_count}{" "}
                              downloads
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleExportReport(report.id, "pdf")}
                            disabled={report.status !== "completed"}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" disabled={report.status !== "completed"}>
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteReport(report.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No reports generated yet.</p>
                    <p className="text-sm">Create your first AI-powered report!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            {generatedReport ? (
              <Card>
                <CardHeader>
                  <CardTitle>{generatedReport.title}</CardTitle>
                  <CardDescription>AI-Generated Report Preview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose prose-sm max-w-none">
                    <h3>Executive Summary</h3>
                    <p>{generatedReport.executiveSummary}</p>

                    <h3>Key Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 not-prose">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">{generatedReport.keyMetrics.totalProducts}</div>
                        <div className="text-sm text-muted-foreground">Products Analyzed</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">${generatedReport.keyMetrics.totalSavings}</div>
                        <div className="text-sm text-muted-foreground">Total Savings</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">{generatedReport.keyMetrics.avgWasteReduction}%</div>
                        <div className="text-sm text-muted-foreground">Waste Reduction</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">{generatedReport.keyMetrics.co2Reduction} kg</div>
                        <div className="text-sm text-muted-foreground">CO₂ Reduction</div>
                      </div>
                    </div>

                    {generatedReport.sections?.map((section: any, index: number) => (
                      <div key={index}>
                        <h3>{section.title}</h3>
                        <p>{section.content}</p>
                        {section.insights?.length > 0 && (
                          <ul>
                            {section.insights.map((insight: string, i: number) => (
                              <li key={i}>{insight}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}

                    <h3>Recommendations</h3>
                    <ul>
                      {generatedReport.recommendations?.map((rec: string, index: number) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>

                    <h3>Conclusion</h3>
                    <p>{generatedReport.conclusion}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-muted-foreground">
                    <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No report to preview.</p>
                    <p className="text-sm">Generate a report to see the preview here.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

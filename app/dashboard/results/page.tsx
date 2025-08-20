"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Package, TrendingUp, DollarSign, Leaf, CheckCircle, AlertTriangle, Brain } from "lucide-react"

interface OptimizationResult {
  productId: string
  productName: string
  currentDimensions: {
    length: number
    width: number
    height: number
  }
  optimizedDimensions: {
    length: number
    width: number
    height: number
  }
  currentMaterial: string
  recommendedMaterial: string
  costSavingsPercentage: number
  wasteReductionPercentage: number
  co2ReductionKg: number
  confidenceScore: number
  reasoning: string
  status: "optimized" | "warning" | "optimal"
}

interface OptimizationSummary {
  totalProducts: number
  totalCostSavings: number
  averageWasteReduction: number
  totalCo2Reduction: number
}

export default function ResultsPage() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<OptimizationResult[]>([])
  const [summary, setSummary] = useState<OptimizationSummary | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()

      if (response.ok) {
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error("Error loading products:", error)
    }
  }

  const startOptimization = async () => {
    if (products.length === 0) {
      setError("No products found. Please upload product data first.")
      return
    }

    setIsOptimizing(true)
    setOptimizationProgress(0)
    setShowResults(false)
    setError(null)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setOptimizationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      const productIds = products.map((p) => p.id)

      const response = await fetch("/api/ai-optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productIds }),
      })

      const data = await response.json()

      clearInterval(progressInterval)
      setOptimizationProgress(100)

      if (response.ok) {
        setResults(data.recommendations || [])
        setSummary(data.summary || null)
        setTimeout(() => {
          setIsOptimizing(false)
          setShowResults(true)
        }, 500)
      } else {
        throw new Error(data.error || "Optimization failed")
      }
    } catch (error) {
      console.error("Optimization error:", error)
      setError(error instanceof Error ? error.message : "Optimization failed")
      setIsOptimizing(false)
    }
  }

  const chartData = results.map((result) => ({
    name: result.productName.substring(0, 10) + "...",
    current: 100, // Base cost
    optimized: 100 - result.costSavingsPercentage,
    savings: result.costSavingsPercentage,
  }))

  const materialData = results.reduce(
    (acc, result) => {
      const material = result.recommendedMaterial
      const existing = acc.find((item) => item.name === material)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({
          name: material,
          value: 1,
          color: ["#10b981", "#3b82f6", "#059669", "#06b6d4", "#8b5cf6"][acc.length % 5],
        })
      }
      return acc
    },
    [] as Array<{ name: string; value: number; color: string }>,
  )

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">AI Optimization Results</h1>
          <p className="text-muted-foreground">
            Advanced AI-powered packaging recommendations to reduce costs and environmental impact.
          </p>
        </div>

        {/* Optimization Trigger */}
        {!showResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                SmartPack AI Engine
              </CardTitle>
              <CardDescription>
                Run our advanced AI analysis on your product data to get intelligent packaging optimization
                recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-4 bg-destructive/10 border border-destructive/50 text-destructive rounded-lg">
                  {error}
                </div>
              )}

              {!isOptimizing ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {products.length} products ready for optimization
                    </span>
                    <Badge variant="outline">{products.length} Products</Badge>
                  </div>
                  <Button
                    onClick={startOptimization}
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-blue-600"
                    disabled={products.length === 0}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Start AI Optimization
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Brain className="h-6 w-6 text-primary animate-pulse" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">AI is analyzing your products...</p>
                      <p className="text-sm text-muted-foreground">
                        {optimizationProgress < 30 && "Processing product dimensions and materials..."}
                        {optimizationProgress >= 30 &&
                          optimizationProgress < 60 &&
                          "Calculating optimal packaging solutions..."}
                        {optimizationProgress >= 60 &&
                          optimizationProgress < 90 &&
                          "Evaluating sustainability options..."}
                        {optimizationProgress >= 90 && "Finalizing AI recommendations..."}
                      </p>
                    </div>
                  </div>
                  <Progress value={optimizationProgress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {showResults && summary && (
          <>
            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">${summary.totalCostSavings.toFixed(0)}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-primary">AI-calculated</span> optimization potential
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-chart-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Waste Reduction</CardTitle>
                  <Package className="h-4 w-4 text-chart-3" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{summary.averageWasteReduction.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-chart-3">AI-optimized</span> packaging efficiency
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-accent">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CO₂ Reduction</CardTitle>
                  <Leaf className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{summary.totalCo2Reduction.toFixed(1)} kg</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-accent">Environmental</span> impact reduction
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-chart-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products Analyzed</CardTitle>
                  <TrendingUp className="h-4 w-4 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{summary.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-chart-2">100%</span> AI analysis coverage
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Analysis */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="detailed">AI Recommendations</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cost Optimization Potential</CardTitle>
                      <CardDescription>AI-calculated savings by product</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="current" fill="#6b7280" name="Current Cost %" />
                          <Bar dataKey="optimized" fill="#10b981" name="Optimized Cost %" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended Materials</CardTitle>
                      <CardDescription>AI-suggested sustainable alternatives</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={materialData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {materialData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="detailed" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Optimization Recommendations</CardTitle>
                    <CardDescription>Detailed analysis and suggestions for each product</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Current → Optimized</TableHead>
                            <TableHead>Material Change</TableHead>
                            <TableHead>Savings</TableHead>
                            <TableHead>Waste Reduction</TableHead>
                            <TableHead>AI Confidence</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.map((result, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{result.productName}</TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="text-sm text-muted-foreground">
                                    {result.currentDimensions.length}×{result.currentDimensions.width}×
                                    {result.currentDimensions.height} cm
                                  </div>
                                  <div className="text-sm font-medium text-primary">
                                    → {result.optimizedDimensions.length}×{result.optimizedDimensions.width}×
                                    {result.optimizedDimensions.height} cm
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="text-sm text-muted-foreground">{result.currentMaterial}</div>
                                  <div className="text-sm font-medium text-accent">→ {result.recommendedMaterial}</div>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium text-primary">
                                {result.costSavingsPercentage.toFixed(1)}%
                              </TableCell>
                              <TableCell className="font-medium text-chart-3">
                                {result.wasteReductionPercentage.toFixed(1)}%
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={result.confidenceScore} className="w-16" />
                                  <span className="text-sm">{result.confidenceScore.toFixed(0)}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    result.status === "optimized"
                                      ? "default"
                                      : result.status === "warning"
                                        ? "secondary"
                                        : "outline"
                                  }
                                >
                                  {result.status === "optimized" && <CheckCircle className="h-3 w-3 mr-1" />}
                                  {result.status === "warning" && <AlertTriangle className="h-3 w-3 mr-1" />}
                                  {result.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <div className="grid gap-6">
                  {results.map((result, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-5 w-5 text-primary" />
                          {result.productName} - AI Analysis
                        </CardTitle>
                        <CardDescription>
                          Confidence: {result.confidenceScore.toFixed(0)}% | Savings:{" "}
                          {result.costSavingsPercentage.toFixed(1)}% | CO₂ Reduction: {result.co2ReductionKg.toFixed(1)}{" "}
                          kg
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed">{result.reasoning}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600">
                    <Package className="h-4 w-4 mr-2" />
                    Apply AI Recommendations
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Export AI Report
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowResults(false)
                      loadProducts()
                    }}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Run New AI Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  Upload,
  Leaf,
  FileText,
  DollarSign,
  Recycle,
  Target,
  Package,
  Brain,
  Camera,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
} from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalCostSavings: number
  avgWasteReduction: number
  totalCo2Reduction: number
  productCount: number
  optimizationCount: number
}

interface RecentActivity {
  id: string
  product_name: string
  cost_savings: number
  waste_reduction_percentage: number
  co2_reduction_kg: number
  created_at: string
  status: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock trend data for charts
  const trendData = [
    { month: "Jan", savings: 1200, waste: 15, co2: 45 },
    { month: "Feb", savings: 1800, waste: 22, co2: 67 },
    { month: "Mar", savings: 2400, waste: 28, co2: 89 },
    { month: "Apr", savings: 3100, waste: 35, co2: 112 },
    { month: "May", savings: 3800, waste: 42, co2: 134 },
    { month: "Jun", savings: 4500, waste: 48, co2: 156 },
  ]

  const categoryData = [
    { name: "Electronics", value: 35, color: "#10b981" },
    { name: "Clothing", value: 28, color: "#3b82f6" },
    { name: "Home Goods", value: 22, color: "#8b5cf6" },
    { name: "Fragile Items", value: 15, color: "#f59e0b" },
  ]

  const efficiencyData = [
    { category: "Cardboard", current: 65, optimized: 85 },
    { category: "Plastic", current: 45, optimized: 75 },
    { category: "Metal", current: 70, optimized: 90 },
    { category: "Glass", current: 55, optimized: 80 },
  ]

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load dashboard statistics
      const statsResponse = await fetch("/api/dashboard/stats")
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      }

      // Load recent optimizations
      const optimizationsResponse = await fetch("/api/optimizations?limit=5")
      if (optimizationsResponse.ok) {
        const optimizationsData = await optimizationsResponse.json()
        setRecentActivity(optimizationsData.optimizations || [])
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Loading your packaging optimization overview...</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">SmartPack AI Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's your real-time packaging optimization overview.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
              Live Data
            </Badge>
          </div>
        </div>

        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
                <Button onClick={loadDashboardData} variant="outline" size="sm" className="ml-auto bg-transparent">
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products Analyzed</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats?.productCount || 0}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowUpRight className="h-3 w-3 text-primary" />
                <span className="text-primary">+{stats?.optimizationCount || 0}</span> optimizations
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${(stats?.totalCostSavings || 0).toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowUpRight className="h-3 w-3 text-accent" />
                <span className="text-accent">+23.5%</span> vs last month
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-chart-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-chart-3/5 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Waste Reduction</CardTitle>
              <Recycle className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{(stats?.avgWasteReduction || 0).toFixed(1)}%</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowUpRight className="h-3 w-3 text-chart-3" />
                <span className="text-chart-3">+8.2%</span> improvement
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-chart-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-chart-2/5 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CO₂ Reduction</CardTitle>
              <Leaf className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{(stats?.totalCo2Reduction || 0).toFixed(1)} kg</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowUpRight className="h-3 w-3 text-chart-2" />
                <span className="text-chart-2">+15.3%</span> vs target
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/dashboard/upload">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 hover:border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl group-hover:from-emerald-500/20 group-hover:to-blue-500/20 transition-colors">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Upload Product Data</CardTitle>
                    <CardDescription>CSV files or camera capture</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600">
                    <Upload className="h-4 w-4 mr-2" />
                    Start Upload
                  </Button>
                  <Button variant="outline" size="icon">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/results">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 hover:border-accent/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
                    <Brain className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">AI Optimization</CardTitle>
                    <CardDescription>View intelligent recommendations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent group-hover:bg-accent/5">
                  <Brain className="h-4 w-4 mr-2" />
                  View AI Results
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/sustainability">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 hover:border-chart-2/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-chart-2/10 rounded-xl group-hover:bg-chart-2/20 transition-colors">
                    <Leaf className="h-6 w-6 text-chart-2" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Sustainability Report</CardTitle>
                    <CardDescription>Environmental impact analysis</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent group-hover:bg-chart-2/5">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Advanced Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Savings Trend</CardTitle>
                  <CardDescription>Cost savings and environmental impact over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="savings"
                        stackId="1"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.6}
                        name="Cost Savings ($)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Categories</CardTitle>
                  <CardDescription>Distribution of optimized products</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
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

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Track your optimization performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="savings"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Cost Savings ($)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="waste"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      name="Waste Reduction (%)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="co2"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      name="CO₂ Reduction (kg)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="efficiency" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Material Efficiency Comparison</CardTitle>
                <CardDescription>Current vs optimized packaging efficiency by material</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={efficiencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="current" fill="#6b7280" name="Current Efficiency %" />
                    <Bar dataKey="optimized" fill="#10b981" name="Optimized Efficiency %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Optimizations
                </CardTitle>
                <CardDescription>Your latest AI-powered packaging optimizations</CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg border hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">{item.product_name}</p>
                            <p className="text-sm text-muted-foreground">{formatTimeAgo(item.created_at)}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={item.status === "completed" ? "default" : "secondary"} className="text-xs">
                              {item.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                              {item.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-accent font-medium">${item.cost_savings.toFixed(0)} saved</span>
                            <span className="text-chart-3 font-medium">
                              {item.waste_reduction_percentage.toFixed(1)}% waste ↓
                            </span>
                            <span className="text-chart-2 font-medium">
                              {item.co2_reduction_kg.toFixed(1)} kg CO₂ ↓
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent optimizations found.</p>
                    <p className="text-sm">Upload product data to get started!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

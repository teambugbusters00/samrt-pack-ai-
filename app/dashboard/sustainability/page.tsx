"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"
import { Leaf, Recycle, TreePine, Droplets, Award, Target, TrendingUp, Globe } from "lucide-react"

const carbonFootprintData = [
  { month: "Jan", emissions: 450, saved: 120 },
  { month: "Feb", emissions: 420, saved: 180 },
  { month: "Mar", emissions: 380, saved: 240 },
  { month: "Apr", emissions: 340, saved: 290 },
  { month: "May", emissions: 310, saved: 340 },
  { month: "Jun", emissions: 280, saved: 390 },
]

const wasteReductionData = [
  { category: "Cardboard", reduced: 1250, color: "#10b981" },
  { category: "Plastic", reduced: 890, color: "#3b82f6" },
  { category: "Foam", reduced: 650, color: "#f59e0b" },
  { category: "Other", reduced: 420, color: "#8b5cf6" },
]

const sustainabilityGoals = [
  { name: "Carbon Neutral", progress: 68, target: "2025", color: "#10b981" },
  { name: "Zero Waste", progress: 45, target: "2026", color: "#3b82f6" },
  { name: "Renewable Materials", progress: 82, target: "2024", color: "#f59e0b" },
]

const impactMetrics = [
  {
    title: "Trees Saved",
    value: "2,847",
    change: "+15.3%",
    icon: TreePine,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    title: "Water Conserved",
    value: "45,230L",
    change: "+12.7%",
    icon: Droplets,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Waste Diverted",
    value: "3.2 tons",
    change: "+28.4%",
    icon: Recycle,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "CO₂ Offset",
    value: "1,850 kg",
    change: "+18.9%",
    icon: Leaf,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
]

const certifications = [
  { name: "Carbon Neutral Certified", status: "achieved", date: "2024" },
  { name: "FSC Certified", status: "achieved", date: "2023" },
  { name: "Cradle to Cradle", status: "in-progress", date: "2025" },
  { name: "B Corp Certification", status: "planned", date: "2026" },
]

export default function SustainabilityPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("6months")

  const totalCarbonSaved = carbonFootprintData.reduce((sum, data) => sum + data.saved, 0)
  const totalWasteReduced = wasteReductionData.reduce((sum, data) => sum + data.reduced, 0)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Sustainability Impact</h1>
          <p className="text-muted-foreground">
            Track your environmental impact and progress towards sustainability goals.
          </p>
        </div>

        {/* Impact Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {impactMetrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`h-4 w-4 ${metric.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className={metric.color}>{metric.change}</span> from last month
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="carbon">Carbon Footprint</TabsTrigger>
            <TabsTrigger value="waste">Waste Reduction</TabsTrigger>
            <TabsTrigger value="goals">Goals & Targets</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Environmental Impact Summary
                  </CardTitle>
                  <CardDescription>Your total environmental savings this year</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{totalCarbonSaved} kg</div>
                      <div className="text-sm text-muted-foreground">CO₂ Saved</div>
                    </div>
                    <div className="text-center p-4 bg-accent/5 rounded-lg">
                      <div className="text-2xl font-bold text-accent">{(totalWasteReduced / 1000).toFixed(1)} tons</div>
                      <div className="text-sm text-muted-foreground">Waste Reduced</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Equivalent to planting</span>
                      <span className="font-medium text-chart-3">84 trees</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cars off road for</span>
                      <span className="font-medium text-primary">45 days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Households powered for</span>
                      <span className="font-medium text-accent">12 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-chart-2" />
                    Sustainability Certifications
                  </CardTitle>
                  <CardDescription>Your progress towards environmental certifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{cert.name}</p>
                          <p className="text-sm text-muted-foreground">Target: {cert.date}</p>
                        </div>
                        <Badge
                          variant={
                            cert.status === "achieved"
                              ? "default"
                              : cert.status === "in-progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {cert.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="carbon" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Carbon Footprint Tracking</CardTitle>
                <CardDescription>Monthly CO₂ emissions and savings from packaging optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={carbonFootprintData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="emissions"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                      name="CO₂ Emissions (kg)"
                    />
                    <Area
                      type="monotone"
                      dataKey="saved"
                      stackId="2"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.8}
                      name="CO₂ Saved (kg)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Carbon Intensity</CardTitle>
                  <CardDescription>CO₂ emissions per package optimized</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Current Month</span>
                      <span className="text-2xl font-bold text-primary">1.2 kg</span>
                    </div>
                    <Progress value={75} className="w-full" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Target: 1.0 kg</span>
                      <span>25% to goal</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Offset Projects</CardTitle>
                  <CardDescription>Carbon offset initiatives you're supporting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Forest Restoration</p>
                        <p className="text-sm text-muted-foreground">Brazil Amazon</p>
                      </div>
                      <span className="text-sm font-medium text-primary">450 kg CO₂</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Renewable Energy</p>
                        <p className="text-sm text-muted-foreground">Wind Farm Project</p>
                      </div>
                      <span className="text-sm font-medium text-accent">320 kg CO₂</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="waste" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Waste Reduction by Material</CardTitle>
                  <CardDescription>Total waste diverted from landfills (kg)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={wasteReductionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="reduced"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {wasteReductionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Circular Economy Impact</CardTitle>
                  <CardDescription>Materials kept in circulation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Recycled Content</span>
                        <span className="text-sm font-bold">78%</span>
                      </div>
                      <Progress value={78} className="w-full" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Biodegradable Materials</span>
                        <span className="text-sm font-bold">65%</span>
                      </div>
                      <Progress value={65} className="w-full" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Reusable Packaging</span>
                        <span className="text-sm font-bold">42%</span>
                      </div>
                      <Progress value={42} className="w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Waste Stream Analysis</CardTitle>
                <CardDescription>Monthly waste reduction trends by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={wasteReductionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="reduced" fill="#10b981" name="Waste Reduced (kg)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Sustainability Goals Progress
                </CardTitle>
                <CardDescription>Track your progress towards key environmental targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {sustainabilityGoals.map((goal, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{goal.name}</p>
                          <p className="text-sm text-muted-foreground">Target: {goal.target}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold" style={{ color: goal.color }}>
                            {goal.progress}%
                          </p>
                          <p className="text-sm text-muted-foreground">Complete</p>
                        </div>
                      </div>
                      <Progress value={goal.progress} className="w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Milestones</CardTitle>
                  <CardDescription>Key sustainability targets for the next 12 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                      <div className="p-2 bg-primary rounded-full">
                        <Leaf className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">50% Renewable Materials</p>
                        <p className="text-sm text-muted-foreground">Q3 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-accent/5 rounded-lg">
                      <div className="p-2 bg-accent rounded-full">
                        <Recycle className="h-4 w-4 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Zero Waste to Landfill</p>
                        <p className="text-sm text-muted-foreground">Q4 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-chart-3/5 rounded-lg">
                      <div className="p-2 bg-chart-3 rounded-full">
                        <TreePine className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Carbon Negative Operations</p>
                        <p className="text-sm text-muted-foreground">Q1 2025</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impact Projections</CardTitle>
                  <CardDescription>Estimated environmental benefits by year-end</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">CO₂ Reduction</span>
                      <span className="text-lg font-bold text-primary">2,400 kg</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Waste Diverted</span>
                      <span className="text-lg font-bold text-accent">4.8 tons</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Trees Equivalent</span>
                      <span className="text-lg font-bold text-chart-3">108 trees</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1">
                <TrendingUp className="h-4 w-4 mr-2" />
                Generate Sustainability Report
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Award className="h-4 w-4 mr-2" />
                Apply for Certifications
              </Button>
              <Button variant="outline">
                <Target className="h-4 w-4 mr-2" />
                Set New Goals
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

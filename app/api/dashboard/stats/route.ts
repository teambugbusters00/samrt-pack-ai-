import { NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET() {
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

    // Get optimization statistics
    const { data: optimizations, error: optimizationsError } = await supabase
      .from("optimizations")
      .select("cost_savings, waste_reduction_percentage, co2_reduction_kg")
      .eq("user_id", user.id)
      .eq("status", "completed")

    if (optimizationsError) {
      return NextResponse.json({ error: optimizationsError.message }, { status: 500 })
    }

    // Get product count
    const { count: productCount, error: productCountError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    if (productCountError) {
      return NextResponse.json({ error: productCountError.message }, { status: 500 })
    }

    // Calculate totals
    const totalCostSavings = optimizations.reduce((sum, opt) => sum + (opt.cost_savings || 0), 0)
    const totalWasteReduction = optimizations.reduce((sum, opt) => sum + (opt.waste_reduction_percentage || 0), 0)
    const totalCo2Reduction = optimizations.reduce((sum, opt) => sum + (opt.co2_reduction_kg || 0), 0)

    // Calculate averages
    const avgWasteReduction = optimizations.length > 0 ? totalWasteReduction / optimizations.length : 0
    const optimizationCount = optimizations.length

    return NextResponse.json({
      stats: {
        totalCostSavings: Math.round(totalCostSavings * 100) / 100,
        avgWasteReduction: Math.round(avgWasteReduction * 100) / 100,
        totalCo2Reduction: Math.round(totalCo2Reduction * 100) / 100,
        productCount: productCount || 0,
        optimizationCount,
      },
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Get recent optimizations with product names
    const { data: optimizations, error } = await supabase
      .from("optimizations")
      .select(
        `
        *,
        products (
          name
        )
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Format the response
    const formattedOptimizations = optimizations.map((opt) => ({
      id: opt.id,
      product_name: opt.products?.name || "Unknown Product",
      cost_savings: opt.cost_savings || 0,
      waste_reduction_percentage: opt.waste_reduction_percentage || 0,
      co2_reduction_kg: opt.co2_reduction_kg || 0,
      created_at: opt.created_at,
      status: opt.status || "completed",
    }))

    return NextResponse.json({ optimizations: formattedOptimizations })
  } catch (error) {
    console.error("Error fetching optimizations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

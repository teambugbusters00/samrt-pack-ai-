import { type NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// AI optimization logic
function calculateOptimization(product: any) {
  const volume = (product.dimensions_length || 0) * (product.dimensions_width || 0) * (product.dimensions_height || 0)
  const weight = product.weight || 0
  const currentCost = product.cost_per_unit || 0

  // AI-based optimization calculations
  let materialSavings = 0
  let dimensionOptimization = 0
  let recommendedMaterial = product.material || "Cardboard"

  // Material optimization
  switch (product.material?.toLowerCase()) {
    case "plastic":
      materialSavings = 0.15 // 15% savings by switching to recycled plastic
      recommendedMaterial = "Recycled Plastic"
      break
    case "cardboard":
      materialSavings = 0.08 // 8% savings with optimized cardboard
      recommendedMaterial = "Optimized Cardboard"
      break
    case "metal":
      materialSavings = 0.12 // 12% savings with aluminum
      recommendedMaterial = "Recycled Aluminum"
      break
    default:
      materialSavings = 0.1 // 10% default savings
      recommendedMaterial = "Eco-Friendly Alternative"
  }

  // Dimension optimization (reduce by 5-15% based on volume efficiency)
  if (volume > 0) {
    const efficiency = Math.min(volume / (weight * 1000), 1) // volume to weight ratio
    dimensionOptimization = 0.05 + 0.1 * (1 - efficiency) // 5-15% reduction
  }

  const totalSavings = materialSavings + dimensionOptimization
  const optimizedCost = currentCost * (1 - totalSavings)
  const costSavings = currentCost - optimizedCost

  // Environmental impact calculations
  const wasteReduction = totalSavings * 100 // percentage
  const co2Reduction = volume * 0.001 * totalSavings // kg CO2 saved

  // Optimized dimensions
  const reductionFactor = 1 - dimensionOptimization
  const recommendedDimensions = {
    length: (product.dimensions_length || 0) * reductionFactor,
    width: (product.dimensions_width || 0) * reductionFactor,
    height: (product.dimensions_height || 0) * reductionFactor,
  }

  // Confidence score based on data quality
  let confidence = 0.7 // base confidence
  if (product.dimensions_length && product.dimensions_width && product.dimensions_height) confidence += 0.1
  if (product.weight) confidence += 0.1
  if (product.material) confidence += 0.1

  return {
    original_cost: currentCost,
    optimized_cost: optimizedCost,
    cost_savings: costSavings,
    waste_reduction_percentage: wasteReduction,
    co2_reduction_kg: co2Reduction,
    recommended_material: recommendedMaterial,
    recommended_dimensions: recommendedDimensions,
    confidence_score: Math.min(confidence, 1.0),
  }
}

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

    const optimizations = []

    // Process each product
    for (const product of products) {
      const optimization = calculateOptimization(product)

      // Save optimization to database
      const { data: savedOptimization, error: optimizationError } = await supabase
        .from("optimizations")
        .insert({
          user_id: user.id,
          product_id: product.id,
          ...optimization,
          status: "completed",
        })
        .select()
        .single()

      if (optimizationError) {
        console.error("Optimization save error:", optimizationError)
        continue
      }

      optimizations.push({
        ...savedOptimization,
        product_name: product.name,
        product_category: product.category,
      })
    }

    return NextResponse.json({ optimizations })
  } catch (error) {
    console.error("Optimization error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

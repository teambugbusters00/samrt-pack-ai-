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

    const formData = await request.formData()
    const file = formData.get("file") as File
    const uploadMethod = formData.get("uploadMethod") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Please upload CSV or Excel files." }, { status: 400 })
    }

    // Record upload in database
    const { data: upload, error } = await supabase
      .from("uploads")
      .insert({
        user_id: user.id,
        filename: file.name,
        file_type: file.type,
        file_size: file.size,
        upload_method: uploadMethod || "file",
        processed: false,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Process CSV file
    const text = await file.text()
    const lines = text.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

    const products = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",")
      if (values.length >= headers.length && values[0].trim()) {
        const product: any = { user_id: user.id }

        headers.forEach((header, index) => {
          const value = values[index]?.trim()
          if (value) {
            switch (header) {
              case "name":
              case "product name":
                product.name = value
                break
              case "category":
                product.category = value
                break
              case "length":
              case "dimensions_length":
                product.dimensions_length = Number.parseFloat(value) || 0
                break
              case "width":
              case "dimensions_width":
                product.dimensions_width = Number.parseFloat(value) || 0
                break
              case "height":
              case "dimensions_height":
                product.dimensions_height = Number.parseFloat(value) || 0
                break
              case "weight":
                product.weight = Number.parseFloat(value) || 0
                break
              case "material":
                product.material = value
                break
              case "quantity":
                product.quantity = Number.parseInt(value) || 1
                break
              case "cost":
              case "cost_per_unit":
                product.cost_per_unit = Number.parseFloat(value) || 0
                break
            }
          }
        })

        if (product.name) {
          products.push(product)
        }
      }
    }

    // Insert products into database
    if (products.length > 0) {
      const { data: insertedProducts, error: insertError } = await supabase.from("products").insert(products).select()

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }

      // Mark upload as processed
      await supabase.from("uploads").update({ processed: true }).eq("id", upload.id)

      return NextResponse.json({
        upload,
        products: insertedProducts,
        message: `Successfully processed ${insertedProducts.length} products`,
      })
    }

    return NextResponse.json({ error: "No valid products found in file" }, { status: 400 })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

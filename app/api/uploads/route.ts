import { type NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

function parseCSV(text: string): string[][] {
  const result: string[][] = []
  let current = ""
  let inQuotes = false
  let row: string[] = []

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const nextChar = text[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        i++ // Skip next quote
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      row.push(current.trim())
      current = ""
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (current || row.length > 0) {
        row.push(current.trim())
        if (row.some((cell) => cell.length > 0)) {
          result.push(row)
        }
        row = []
        current = ""
      }
    } else if (char !== "\r") {
      current += char
    }
  }

  if (current || row.length > 0) {
    row.push(current.trim())
    if (row.some((cell) => cell.length > 0)) {
      result.push(row)
    }
  }

  return result
}

const ImageAnalysisSchema = z.object({
  products: z.array(
    z.object({
      name: z.string().describe("Product name detected from the image"),
      estimatedWeight: z.number().describe("Estimated weight in kg"),
      estimatedLength: z.number().describe("Estimated length in cm"),
      estimatedWidth: z.number().describe("Estimated width in cm"),
      estimatedHeight: z.number().describe("Estimated height in cm"),
      material: z.string().describe("Detected packaging material"),
      confidence: z.number().min(0).max(1).describe("Confidence score for detection"),
    }),
  ),
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

    const formData = await request.formData()
    const file = formData.get("file") as File
    const uploadMethod = formData.get("uploadMethod") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (uploadMethod === "camera" && file.type.startsWith("image/")) {
      try {
        // Convert image to base64
        const arrayBuffer = await file.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString("base64")
        const imageUrl = `data:${file.type};base64,${base64}`

        // Use AI to analyze the image
        const { object } = await generateObject({
          model: openai("gpt-4o"),
          prompt: `Analyze this packaging image and extract product information. Look for:
          - Product names or labels
          - Estimated dimensions based on visual cues
          - Packaging materials (cardboard, plastic, metal, etc.)
          - Estimated weight based on size and material
          - Multiple products if visible
          
          Provide realistic estimates based on what you can see in the image.`,
          schema: ImageAnalysisSchema,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Analyze this packaging image for product data extraction." },
                { type: "image", image: imageUrl },
              ],
            },
          ],
        })

        // Record upload in database
        const { data: upload, error } = await supabase
          .from("uploads")
          .insert({
            user_id: user.id,
            filename: file.name,
            file_type: file.type,
            file_size: file.size,
            upload_method: "camera",
            processed: true,
          })
          .select()
          .single()

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Convert AI analysis to product format
        const products = object.products.map((product) => ({
          user_id: user.id,
          name: product.name,
          dimensions_length: product.estimatedLength,
          dimensions_width: product.estimatedWidth,
          dimensions_height: product.estimatedHeight,
          weight: product.estimatedWeight,
          material: product.material,
          quantity: 1,
          cost_per_unit: 0,
          category: "Camera Detected",
        }))

        // Insert products into database
        if (products.length > 0) {
          const { data: insertedProducts, error: insertError } = await supabase
            .from("products")
            .insert(products)
            .select()

          if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 })
          }

          return NextResponse.json({
            upload,
            products: insertedProducts,
            message: `Successfully analyzed image and detected ${insertedProducts.length} products`,
            aiAnalysis: object,
          })
        }

        return NextResponse.json({ error: "No products detected in image" }, { status: 400 })
      } catch (aiError) {
        console.error("AI analysis error:", aiError)
        return NextResponse.json({ error: "Failed to analyze image with AI" }, { status: 500 })
      }
    }

    // Validate file type for CSV/Excel
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

    const text = await file.text()
    const rows = parseCSV(text)

    if (rows.length < 2) {
      return NextResponse.json({ error: "CSV file must have at least a header row and one data row" }, { status: 400 })
    }

    const headers = rows[0].map((h) => h.toLowerCase().trim())
    const products = []

    for (let i = 1; i < rows.length; i++) {
      const values = rows[i]
      if (values.length >= headers.length && values[0]?.trim()) {
        const product: any = { user_id: user.id }

        headers.forEach((header, index) => {
          const value = values[index]?.trim()
          if (value) {
            switch (header) {
              case "name":
              case "product name":
              case "product":
                product.name = value
                break
              case "category":
                product.category = value
                break
              case "length":
              case "dimensions_length":
              case "l":
                product.dimensions_length = Number.parseFloat(value) || 0
                break
              case "width":
              case "dimensions_width":
              case "w":
                product.dimensions_width = Number.parseFloat(value) || 0
                break
              case "height":
              case "dimensions_height":
              case "h":
                product.dimensions_height = Number.parseFloat(value) || 0
                break
              case "weight":
              case "wt":
                product.weight = Number.parseFloat(value) || 0
                break
              case "material":
              case "packaging_material":
                product.material = value
                break
              case "quantity":
              case "qty":
                product.quantity = Number.parseInt(value) || 1
                break
              case "cost":
              case "cost_per_unit":
              case "price":
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

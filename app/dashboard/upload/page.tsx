"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Upload, FileText, CheckCircle, AlertCircle, X, Download, Camera, StopCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductData {
  name: string
  weight: number
  length: number
  width: number
  height: number
  material: string
  quantity: number
}

export default function UploadPage() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedData, setUploadedData] = useState<ProductData[]>([])
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")

  const [isCameraActive, setIsCameraActive] = useState(false)
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const parseCSV = (text: string): ProductData[] => {
    const lines = text.split("\n").filter((line) => line.trim())
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

    return lines
      .slice(1)
      .map((line) => {
        const values = line.split(",").map((v) => v.trim())
        return {
          name: values[headers.indexOf("name")] || values[headers.indexOf("product")] || "Unknown Product",
          weight: Number.parseFloat(values[headers.indexOf("weight")]) || 0,
          length: Number.parseFloat(values[headers.indexOf("length")]) || 0,
          width: Number.parseFloat(values[headers.indexOf("width")]) || 0,
          height: Number.parseFloat(values[headers.indexOf("height")]) || 0,
          material: values[headers.indexOf("material")] || "Unknown",
          quantity: Number.parseInt(values[headers.indexOf("quantity")]) || 1,
        }
      })
      .filter((item) => item.name !== "Unknown Product")
  }

  const processFile = async (file: File, uploadMethod = "file") => {
    setIsUploading(true)
    setUploadProgress(0)
    setUploadStatus("idle")

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("uploadMethod", uploadMethod)

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      setUploadProgress(100)

      setTimeout(() => {
        if (response.ok) {
          setUploadedData(result.products || [])
          setUploadStatus("success")
        } else {
          setUploadStatus("error")
        }
        setIsUploading(false)
      }, 500)
    } catch (error) {
      console.error("Upload error:", error)
      setUploadStatus("error")
      setIsUploading(false)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsCameraActive(true)
      }
    } catch (error) {
      console.error("Camera access error:", error)
      alert("Unable to access camera. Please ensure camera permissions are granted.")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsCameraActive(false)
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)

        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8)
        setCapturedImages((prev) => [...prev, imageDataUrl])
      }
    }
  }

  const processImages = async () => {
    if (capturedImages.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)
    setUploadStatus("idle")

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 15
        })
      }, 300)

      // Simulate AI analysis delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock extracted data from images
      const mockData: ProductData[] = capturedImages.map((_, index) => ({
        name: `Product ${index + 1} (Camera Detected)`,
        weight: Math.round((Math.random() * 5 + 0.5) * 100) / 100,
        length: Math.round((Math.random() * 30 + 10) * 100) / 100,
        width: Math.round((Math.random() * 25 + 8) * 100) / 100,
        height: Math.round((Math.random() * 20 + 5) * 100) / 100,
        material: ["Cardboard", "Plastic", "Metal", "Glass"][Math.floor(Math.random() * 4)],
        quantity: Math.floor(Math.random() * 5) + 1,
      }))

      setUploadProgress(100)

      setTimeout(() => {
        setUploadedData(mockData)
        setUploadStatus("success")
        setIsUploading(false)
        stopCamera()
        setCapturedImages([])
      }, 500)
    } catch (error) {
      console.error("Image processing error:", error)
      setUploadStatus("error")
      setIsUploading(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const csvFile = files.find((file) => file.type === "text/csv" || file.name.endsWith(".csv"))

    if (csvFile) {
      processFile(csvFile)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const downloadTemplate = () => {
    const template = `name,weight,length,width,height,material,quantity
Electronics Bundle A,2.5,30,20,15,Cardboard,1
Clothing Set B,1.2,25,18,8,Plastic,2
Home Goods C,3.8,35,25,20,Cardboard,1`

    const blob = new Blob([template], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "product-data-template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const resetUpload = () => {
    setUploadedData([])
    setUploadStatus("idle")
    setUploadProgress(0)
    setCapturedImages([])
    stopCamera()
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Upload Product Data</h1>
          <p className="text-muted-foreground">
            Upload your product information via CSV file or capture packaging with your camera for AI analysis.
          </p>
        </div>

        {/* Template Download */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              CSV Template
            </CardTitle>
            <CardDescription>Download our template to ensure your data is formatted correctly</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={downloadTemplate} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload Method</CardTitle>
            <CardDescription>
              Choose how you want to add your product data - upload a CSV file or use your camera to capture packaging.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="file" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="file" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  File Upload
                </TabsTrigger>
                <TabsTrigger value="camera" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Camera Capture
                </TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="mt-6">
                {!isUploading && uploadStatus === "idle" && (
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-12 text-center transition-colors",
                      isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Drop your CSV file here</h3>
                    <p className="text-muted-foreground mb-4">or click to browse your files</p>
                    <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" id="file-upload" />
                    <Button asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Select File
                      </label>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="camera" className="mt-6">
                {!isCameraActive && capturedImages.length === 0 && !isUploading && uploadStatus === "idle" && (
                  <div className="border-2 border-dashed rounded-lg p-12 text-center">
                    <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Capture Packaging with Camera</h3>
                    <p className="text-muted-foreground mb-4">
                      Use your device camera to capture product packaging for AI analysis
                    </p>
                    <Button onClick={startCamera} className="bg-gradient-to-r from-emerald-600 to-blue-600">
                      <Camera className="h-4 w-4 mr-2" />
                      Start Camera
                    </Button>
                  </div>
                )}

                {isCameraActive && (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden bg-black">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-64 object-cover" />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>

                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={captureImage}
                        size="lg"
                        className="bg-gradient-to-r from-emerald-600 to-blue-600"
                      >
                        <Camera className="h-5 w-5 mr-2" />
                        Capture Image
                      </Button>
                      <Button onClick={stopCamera} variant="outline" size="lg">
                        <StopCircle className="h-5 w-5 mr-2" />
                        Stop Camera
                      </Button>
                    </div>
                  </div>
                )}

                {capturedImages.length > 0 && !isUploading && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Captured Images ({capturedImages.length})</h4>
                      <Button onClick={() => setCapturedImages([])} variant="ghost" size="sm">
                        Clear All
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {capturedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Captured ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <Button
                            onClick={() => setCapturedImages((prev) => prev.filter((_, i) => i !== index))}
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Button onClick={processImages} className="w-full bg-gradient-to-r from-emerald-600 to-blue-600">
                      <Upload className="h-4 w-4 mr-2" />
                      Process Images with AI
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {isUploading && (
              <div className="space-y-4 mt-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {capturedImages.length > 0 ? "Processing images with AI..." : "Processing your file..."}
                    </p>
                    <Progress value={uploadProgress} className="mt-2" />
                  </div>
                </div>
              </div>
            )}

            {uploadStatus === "success" && (
              <div className="space-y-4 mt-6">
                <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Upload successful!</p>
                    <p className="text-sm text-muted-foreground">
                      {uploadedData.length} products processed and ready for optimization.
                    </p>
                  </div>
                  <Button onClick={resetUpload} variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {uploadStatus === "error" && (
              <div className="space-y-4 mt-6">
                <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Upload failed</p>
                    <p className="text-sm text-muted-foreground">Please check your file format and try again.</p>
                  </div>
                  <Button onClick={resetUpload} variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Preview */}
        {uploadedData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Data Preview</span>
                <Badge variant="secondary">{uploadedData.length} products</Badge>
              </CardTitle>
              <CardDescription>Review your uploaded data before proceeding to optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Weight (kg)</TableHead>
                      <TableHead>Dimensions (L×W×H cm)</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadedData.slice(0, 10).map((product, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.weight}</TableCell>
                        <TableCell>
                          {product.length}×{product.width}×{product.height}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.material}</Badge>
                        </TableCell>
                        <TableCell>{product.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {uploadedData.length > 10 && (
                <p className="text-sm text-muted-foreground mt-4">Showing first 10 of {uploadedData.length} products</p>
              )}

              <div className="flex gap-4 mt-6">
                <Button className="flex-1">Proceed to Optimization</Button>
                <Button variant="outline" onClick={resetUpload}>
                  Upload Different File
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

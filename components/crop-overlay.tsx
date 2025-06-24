"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface CropOverlayProps {
  layer: {
    id: string
    x: number
    y: number
    width: number
    height: number
  }
  zoom: number
  onCrop: (cropData: { x: number; y: number; width: number; height: number }) => void
  onCancel: () => void
}

export function CropOverlay({ layer, zoom, onCrop, onCancel }: CropOverlayProps) {
  const [cropArea, setCropArea] = useState({
    x: layer.x + 20,
    y: layer.y + 20,
    width: layer.width - 40,
    height: layer.height - 40,
  })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [initialCrop, setInitialCrop] = useState(cropArea)

  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = (e.clientX - dragStart.x) / zoom
        const deltaY = (e.clientY - dragStart.y) / zoom

        let newX = initialCrop.x + deltaX
        let newY = initialCrop.y + deltaY

        // Constrain to layer bounds
        newX = Math.max(layer.x, Math.min(newX, layer.x + layer.width - cropArea.width))
        newY = Math.max(layer.y, Math.min(newY, layer.y + layer.height - cropArea.height))

        setCropArea((prev) => ({ ...prev, x: newX, y: newY }))
      } else if (isResizing && resizeHandle) {
        const deltaX = (e.clientX - dragStart.x) / zoom
        const deltaY = (e.clientY - dragStart.y) / zoom

        const newCrop = { ...initialCrop }

        if (resizeHandle.includes("right")) {
          newCrop.width = Math.min(initialCrop.width + deltaX, layer.x + layer.width - newCrop.x)
        }
        if (resizeHandle.includes("left")) {
          const newWidth = initialCrop.width - deltaX
          const newX = initialCrop.x + deltaX
          if (newX >= layer.x && newWidth > 20) {
            newCrop.x = newX
            newCrop.width = newWidth
          }
        }
        if (resizeHandle.includes("bottom")) {
          newCrop.height = Math.min(initialCrop.height + deltaY, layer.y + layer.height - newCrop.y)
        }
        if (resizeHandle.includes("top")) {
          const newHeight = initialCrop.height - deltaY
          const newY = initialCrop.y + deltaY
          if (newY >= layer.y && newHeight > 20) {
            newCrop.y = newY
            newCrop.height = newHeight
          }
        }

        // Ensure minimum size
        newCrop.width = Math.max(20, newCrop.width)
        newCrop.height = Math.max(20, newCrop.height)

        setCropArea(newCrop)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
      setResizeHandle(null)
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, dragStart, initialCrop, layer, zoom, resizeHandle, cropArea.width, cropArea.height])

  const handleMouseDown = (e: React.MouseEvent, action: "drag" | "resize", handle?: string) => {
    e.preventDefault()
    e.stopPropagation()

    setDragStart({ x: e.clientX, y: e.clientY })
    setInitialCrop(cropArea)

    if (action === "drag") {
      setIsDragging(true)
    } else if (action === "resize" && handle) {
      setIsResizing(true)
      setResizeHandle(handle)
    }
  }

  const handleCrop = () => {
    // Convert crop area to relative coordinates within the layer
    const relativeCrop = {
      x: (cropArea.x - layer.x) / layer.width,
      y: (cropArea.y - layer.y) / layer.height,
      width: cropArea.width / layer.width,
      height: cropArea.height / layer.height,
    }
    onCrop(relativeCrop)
  }

  const resizeHandles = [
    { position: "top-left", cursor: "nw-resize" },
    { position: "top-right", cursor: "ne-resize" },
    { position: "bottom-left", cursor: "sw-resize" },
    { position: "bottom-right", cursor: "se-resize" },
    { position: "top", cursor: "n-resize" },
    { position: "right", cursor: "e-resize" },
    { position: "bottom", cursor: "s-resize" },
    { position: "left", cursor: "w-resize" },
  ]

  return (
    <>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      {/* Crop area */}
      <div
        ref={overlayRef}
        className="absolute border-2 border-white bg-transparent cursor-move"
        style={{
          left: `${cropArea.x}px`,
          top: `${cropArea.y}px`,
          width: `${cropArea.width}px`,
          height: `${cropArea.height}px`,
        }}
        onMouseDown={(e) => handleMouseDown(e, "drag")}
      >
        {/* Resize handles */}
        {resizeHandles.map((handle) => (
          <div
            key={handle.position}
            className={cn(
              "absolute w-3 h-3 bg-white border border-gray-400 rounded-sm",
              handle.position.includes("top") && "top-0 -translate-y-1/2",
              handle.position.includes("bottom") && "bottom-0 translate-y-1/2",
              handle.position.includes("left") && "left-0 -translate-x-1/2",
              handle.position.includes("right") && "right-0 translate-x-1/2",
              handle.position === "top" && "left-1/2 -translate-x-1/2",
              handle.position === "bottom" && "left-1/2 -translate-x-1/2",
              handle.position === "left" && "top-1/2 -translate-y-1/2",
              handle.position === "right" && "top-1/2 -translate-y-1/2",
            )}
            style={{ cursor: handle.cursor }}
            onMouseDown={(e) => handleMouseDown(e, "resize", handle.position)}
          />
        ))}

        {/* Crop info */}
        <div className="absolute -top-8 left-0 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {Math.round(cropArea.width)} × {Math.round(cropArea.height)}
        </div>
      </div>

      {/* Control buttons */}
      <div className="absolute top-4 right-4 flex gap-2 z-50">
        <Button
          size="sm"
          variant="outline"
          onClick={onCancel}
          className="bg-black/80 border-white/20 text-white hover:bg-red-500/20"
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <Button size="sm" onClick={handleCrop} className="bg-green-600 hover:bg-green-700 text-white">
          <Check className="h-4 w-4 mr-1" />
          Apply Crop
        </Button>
      </div>
    </>
  )
}

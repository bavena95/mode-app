"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Move, RotateCcw, Lock, VenetianMaskIcon as MaskIcon } from 'lucide-react'
import type { Layer } from "@/app/playground/page"
import { TextLayerRenderer } from "./text-layer-renderer"

interface DraggableResizableLayerProps {
  layer: Layer
  isSelected: boolean
  zoom: number
  onSelect: (id: string, multiSelect?: boolean) => void
  onUpdate: (id: string, updates: Partial<Layer>) => void
  onUpdateComplete: () => void
  canvasBounds: DOMRect | null
  snapToGrid?: boolean
  gridSize?: number
}

const MIN_WIDTH = 40
const MIN_HEIGHT = 40

export function DraggableResizableLayer({
  layer,
  isSelected,
  zoom,
  onSelect,
  onUpdate,
  onUpdateComplete,
  canvasBounds,
  snapToGrid = false,
  gridSize = 20,
}: DraggableResizableLayerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const layerRef = useRef<HTMLDivElement>(null)

  // Refs for drag/resize/rotate initial states
  const dragStartPos = useRef({ x: 0, y: 0 })
  const initialLayerPos = useRef({ x: 0, y: 0 })
  const initialLayerSize = useRef({ width: 0, height: 0 })
  const clickOffsetInLayer = useRef({ x: 0, y: 0 })

  // Refs for rotation
  const rotationPivot = useRef({ x: 0, y: 0 })
  const initialMouseAngleToPivot = useRef(0)
  const initialLayerRotation = useRef(0)

  const handleMouseDownDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent interaction with locked layers
    if (layer.locked) {
      return
    }

    e.preventDefault()
    e.stopPropagation()
    if (!isSelected) {
      onSelect(layer.id, e.ctrlKey || e.metaKey) // Pass multi-select modifier
    }
    setIsDragging(true)
    if (layerRef.current && canvasBounds) {
      clickOffsetInLayer.current = {
        x: (e.clientX - canvasBounds.left) / zoom - layer.x,
        y: (e.clientY - canvasBounds.top) / zoom - layer.y,
      }
    }
    document.body.style.cursor = "grabbing"
  }

  const handleMouseDownResize = (e: React.MouseEvent<HTMLDivElement>, handle: string) => {
    // Prevent interaction with locked layers
    if (layer.locked) {
      return
    }

    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    setResizeHandle(handle)
    dragStartPos.current = { x: e.clientX, y: e.clientY }
    initialLayerSize.current = { width: layer.width, height: layer.height }
    initialLayerPos.current = { x: layer.x, y: layer.y }
    document.body.style.cursor = getResizeCursor(handle)
  }

  const handleMouseDownRotate = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent interaction with locked layers
    if (layer.locked) {
      return
    }

    e.preventDefault()
    e.stopPropagation()
    if (!layerRef.current || !canvasBounds) return

    setIsRotating(true)

    const layerRect = layerRef.current.getBoundingClientRect()
    rotationPivot.current = {
      x: layerRect.left + layerRect.width / 2,
      y: layerRect.top + layerRect.height / 2,
    }

    initialMouseAngleToPivot.current = Math.atan2(
      e.clientY - rotationPivot.current.y,
      e.clientX - rotationPivot.current.x,
    )
    initialLayerRotation.current = (layer.rotation || 0) * (Math.PI / 180)

    document.body.style.cursor = "crosshair"
  }

  const getResizeCursor = (handle: string) => {
    switch (handle) {
      case "top-left":
        return "nwse-resize"
      case "top-right":
        return "nesw-resize"
      case "bottom-left":
        return "nesw-resize"
      case "bottom-right":
        return "nwse-resize"
      default:
        return "default"
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasBounds) return

      if (isDragging) {
        const mouseXInCanvas = (e.clientX - canvasBounds.left) / zoom
        const mouseYInCanvas = (e.clientY - canvasBounds.top) / zoom
        let newX = mouseXInCanvas - clickOffsetInLayer.current.x
        let newY = mouseYInCanvas - clickOffsetInLayer.current.y
        newX = Math.max(0, Math.min(newX, canvasBounds.width / zoom - layer.width))
        newY = Math.max(0, Math.min(newY, canvasBounds.height / zoom - layer.height))
        onUpdate(layer.id, { x: newX, y: newY })
      } else if (isResizing && resizeHandle) {
        const dx = (e.clientX - dragStartPos.current.x) / zoom
        const dy = (e.clientY - dragStartPos.current.y) / zoom
        let newWidth = initialLayerSize.current.width
        let newHeight = initialLayerSize.current.height
        let newX = initialLayerPos.current.x
        let newY = initialLayerPos.current.y

        if (resizeHandle.includes("right")) newWidth = initialLayerSize.current.width + dx
        if (resizeHandle.includes("left")) {
          newWidth = initialLayerSize.current.width - dx
          newX = initialLayerPos.current.x + dx
        }
        if (resizeHandle.includes("bottom")) newHeight = initialLayerSize.current.height + dy
        if (resizeHandle.includes("top")) {
          newHeight = initialLayerSize.current.height - dy
          newY = initialLayerPos.current.y + dy
        }

        if (newWidth < MIN_WIDTH) {
          if (resizeHandle.includes("left")) newX -= MIN_WIDTH - newWidth
          newWidth = MIN_WIDTH
        }
        if (newHeight < MIN_HEIGHT) {
          if (resizeHandle.includes("top")) newY -= MIN_HEIGHT - newHeight
          newHeight = MIN_HEIGHT
        }

        newX = Math.max(0, Math.min(newX, canvasBounds.width / zoom - newWidth))
        newY = Math.max(0, Math.min(newY, canvasBounds.height / zoom - newHeight))
        newWidth = Math.min(newWidth, canvasBounds.width / zoom - newX)
        newHeight = Math.min(newHeight, canvasBounds.height / zoom - newY)

        onUpdate(layer.id, { x: newX, y: newY, width: newWidth, height: newHeight })
      } else if (isRotating) {
        const currentMouseAngle = Math.atan2(e.clientY - rotationPivot.current.y, e.clientX - rotationPivot.current.x)
        const angleDelta = currentMouseAngle - initialMouseAngleToPivot.current
        const newRotationRad = initialLayerRotation.current + angleDelta
        let newRotationDeg = newRotationRad * (180 / Math.PI)
        newRotationDeg = newRotationDeg % 360
        onUpdate(layer.id, { rotation: newRotationDeg })
      }
    }

    const handleMouseUp = () => {
      if (isDragging || isResizing || isRotating) {
        onUpdateComplete()
      }
      setIsDragging(false)
      setIsResizing(false)
      setIsRotating(false)
      setResizeHandle(null)
      document.body.style.cursor = "default"
    }

    if (isDragging || isResizing || isRotating) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [
    isDragging,
    isResizing,
    isRotating,
    resizeHandle,
    onUpdate,
    onUpdateComplete,
    layer.id,
    layer.width,
    layer.height,
    canvasBounds,
    zoom,
  ])

  const resizeHandles = ["top-left", "top-right", "bottom-left", "bottom-right"]

  return (
    <div
      ref={layerRef}
      className={cn(
        "absolute p-2 rounded-md text-white text-xs flex items-center justify-center group",
        layer.color,
        isSelected ? "ring-2 ring-pink-500 shadow-2xl" : "border border-white/20",
        layer.locked ? "cursor-not-allowed opacity-75" : isDragging || isResizing ? "cursor-grabbing" : "cursor-grab",
        layer.isMask && "bg-transparent border-dashed border-purple-400/80" // Visual feedback for mask layer
      )}
      style={{
        left: `${layer.x}px`,
        top: `${layer.y}px`,
        width: `${layer.width}px`,
        height: `${layer.height}px`,
        zIndex: layer.zIndex,
        userSelect: "none",
        transform: `rotate(${layer.rotation || 0}deg)`,
        transformOrigin: "center center",
        opacity: layer.opacity,
        clipPath: layer.maskedBy ? `url(#mask-clip-${layer.maskedBy})` : "none", // Apply the clip-path
      }}
      onMouseDown={handleMouseDownDrag}
      onClick={(e) => {
        e.stopPropagation()
        if (!isSelected && !layer.locked) onSelect(layer.id, e.ctrlKey || e.metaKey)
      }}
    >
      {/* Show lock icon for locked layers */}
      {layer.locked ? (
        <Lock className="absolute top-1 right-1 h-3 w-3 text-orange-400 opacity-100" />
      ) : layer.isMask ? (
        <MaskIcon className="absolute top-1 right-1 h-3 w-3 text-purple-400 opacity-100" />
      ) : (
        <Move className="absolute top-1 right-1 h-3 w-3 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}

      {/* Replace the layer content display with enhanced text styling */}
      {layer.type === "text" ? (
        <TextLayerRenderer layer={layer} />
      ) : (
        <div className="w-full h-full flex items-center justify-center">{layer.name}</div>
      )}

      {/* Only show handles if selected and not locked */}
      {isSelected && !layer.locked && (
        <>
          {/* Resize Handles */}
          {resizeHandles.map((handle) => (
            <div
              key={handle}
              className={cn(
                "absolute w-3 h-3 bg-pink-500 border border-white rounded-full",
                `transform -translate-x-1/2 -translate-y-1/2`,
                handle.includes("top") ? "top-0" : "bottom-0",
                handle.includes("left") ? "left-0" : "right-0",
              )}
              style={{ cursor: getResizeCursor(handle) }}
              onMouseDown={(e) => handleMouseDownResize(e, handle)}
            />
          ))}
          {/* Rotation Handle */}
          <div
            className="absolute w-4 h-4 bg-purple-600 border border-white rounded-full flex items-center justify-center"
            style={{
              top: "-20px",
              left: "50%",
              transform: "translateX(-50%)",
              cursor: "alias",
            }}
            onMouseDown={handleMouseDownRotate}
            title="Rotate Layer"
          >
            <RotateCcw className="h-2.5 w-2.5 text-white" />
          </div>
        </>
      )}
    </div>
  )
}

"use client"

import { cn } from "@/lib/utils"

interface GridOverlayProps {
  width: number
  height: number
  gridSize: number
  showGrid: boolean
  gridColor?: string
  gridOpacity?: number
  className?: string
}

export function GridOverlay({
  width,
  height,
  gridSize,
  showGrid,
  gridColor = "#ffffff",
  gridOpacity = 0.1,
  className,
}: GridOverlayProps) {
  if (!showGrid || gridSize <= 0) return null

  // Calculate number of lines needed
  const verticalLines = Math.floor(width / gridSize)
  const horizontalLines = Math.floor(height / gridSize)

  return (
    <div
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <svg width={width} height={height} className="absolute inset-0" style={{ opacity: gridOpacity }}>
        <defs>
          <pattern id="grid-pattern" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
            <path d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} fill="none" stroke={gridColor} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>

      {/* Major grid lines every 5th line */}
      <svg width={width} height={height} className="absolute inset-0" style={{ opacity: gridOpacity * 2 }}>
        {/* Vertical major lines */}
        {Array.from({ length: Math.floor(verticalLines / 5) + 1 }, (_, i) => (
          <line
            key={`v-major-${i}`}
            x1={i * gridSize * 5}
            y1={0}
            x2={i * gridSize * 5}
            y2={height}
            stroke={gridColor}
            strokeWidth="1.5"
          />
        ))}

        {/* Horizontal major lines */}
        {Array.from({ length: Math.floor(horizontalLines / 5) + 1 }, (_, i) => (
          <line
            key={`h-major-${i}`}
            x1={0}
            y1={i * gridSize * 5}
            x2={width}
            y2={i * gridSize * 5}
            stroke={gridColor}
            strokeWidth="1.5"
          />
        ))}
      </svg>
    </div>
  )
}

GridOverlay.defaultProps = {
  gridColor: "#ffffff",
  gridOpacity: 0.1,
  className: "",
}

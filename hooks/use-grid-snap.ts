"use client"

import { useCallback } from "react"

interface UseGridSnapProps {
  gridSize: number
  snapToGrid: boolean
  snapThreshold?: number
}

interface Position {
  x: number
  y: number
}

interface Size {
  width: number
  height: number
}

interface SnapResult {
  x: number
  y: number
  snappedX: boolean
  snappedY: boolean
}

export function useGridSnap({ gridSize, snapToGrid, snapThreshold = 10 }: UseGridSnapProps) {
  const snapToGridPosition = useCallback(
    (position: Position): SnapResult => {
      if (!snapToGrid || gridSize <= 0) {
        return {
          x: position.x,
          y: position.y,
          snappedX: false,
          snappedY: false,
        }
      }

      const snappedX = Math.round(position.x / gridSize) * gridSize
      const snappedY = Math.round(position.y / gridSize) * gridSize

      const deltaX = Math.abs(position.x - snappedX)
      const deltaY = Math.abs(position.y - snappedY)

      return {
        x: deltaX <= snapThreshold ? snappedX : position.x,
        y: deltaY <= snapThreshold ? snappedY : position.y,
        snappedX: deltaX <= snapThreshold,
        snappedY: deltaY <= snapThreshold,
      }
    },
    [gridSize, snapToGrid, snapThreshold],
  )

  const snapLayerToGrid = useCallback(
    (layer: { x: number; y: number; width: number; height: number }) => {
      if (!snapToGrid || gridSize <= 0) {
        return layer
      }

      // Snap top-left corner
      const topLeft = snapToGridPosition({ x: layer.x, y: layer.y })

      // Also try snapping center
      const centerX = layer.x + layer.width / 2
      const centerY = layer.y + layer.height / 2
      const center = snapToGridPosition({ x: centerX, y: centerY })

      // Also try snapping bottom-right
      const bottomRightX = layer.x + layer.width
      const bottomRightY = layer.y + layer.height
      const bottomRight = snapToGridPosition({ x: bottomRightX, y: bottomRightY })

      // Choose the snap point with the smallest distance
      const topLeftDistance = Math.sqrt(Math.pow(topLeft.x - layer.x, 2) + Math.pow(topLeft.y - layer.y, 2))
      const centerDistance = Math.sqrt(Math.pow(center.x - centerX, 2) + Math.pow(center.y - centerY, 2))
      const bottomRightDistance = Math.sqrt(
        Math.pow(bottomRight.x - bottomRightX, 2) + Math.pow(bottomRight.y - bottomRightY, 2),
      )

      let finalX = layer.x
      let finalY = layer.y

      if (topLeftDistance <= centerDistance && topLeftDistance <= bottomRightDistance) {
        // Snap to top-left
        if (topLeft.snappedX) finalX = topLeft.x
        if (topLeft.snappedY) finalY = topLeft.y
      } else if (centerDistance <= bottomRightDistance) {
        // Snap to center
        if (center.snappedX) finalX = center.x - layer.width / 2
        if (center.snappedY) finalY = center.y - layer.height / 2
      } else {
        // Snap to bottom-right
        if (bottomRight.snappedX) finalX = bottomRight.x - layer.width
        if (bottomRight.snappedY) finalY = bottomRight.y - layer.height
      }

      return {
        ...layer,
        x: finalX,
        y: finalY,
      }
    },
    [gridSize, snapToGrid, snapToGridPosition],
  )

  const snapSizeToGrid = useCallback(
    (size: Size): Size => {
      if (!snapToGrid || gridSize <= 0) {
        return size
      }

      const snappedWidth = Math.round(size.width / gridSize) * gridSize
      const snappedHeight = Math.round(size.height / gridSize) * gridSize

      const deltaWidth = Math.abs(size.width - snappedWidth)
      const deltaHeight = Math.abs(size.height - snappedHeight)

      return {
        width: deltaWidth <= snapThreshold ? Math.max(snappedWidth, gridSize) : size.width,
        height: deltaHeight <= snapThreshold ? Math.max(snappedHeight, gridSize) : size.height,
      }
    },
    [gridSize, snapToGrid, snapThreshold],
  )

  return {
    snapToGridPosition,
    snapLayerToGrid,
    snapSizeToGrid,
  }
}

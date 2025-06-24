"use client"

import { useMemo } from "react"
import type { Layer, LayerHierarchy } from "@/types/layer-types"

export function useLayerHierarchy(layers: Layer[]) {
  const hierarchy = useMemo(() => {
    const layerMap = new Map<string, Layer>()
    const maskedLayerIds = new Set<string>()

    layers.forEach((layer) => {
      layerMap.set(layer.id, layer)
      if (layer.maskedBy) {
        maskedLayerIds.add(layer.id)
      }
    })

    const buildHierarchy = (layer: Layer, depth = 0): LayerHierarchy => {
      const children: LayerHierarchy[] = []

      if (layer.type === "group") {
        layer.children.forEach((childId) => {
          const childLayer = layerMap.get(childId)
          if (childLayer) {
            children.push(buildHierarchy(childLayer, depth + 1))
          }
        })
      } else if (layer.isMask) {
        // Find the layer that is masked by this one
        const contentLayer = layers.find((l) => l.maskedBy === layer.id)
        if (contentLayer) {
          children.push(buildHierarchy(contentLayer, depth + 1))
        }
      }

      return { layer, children, depth }
    }

    // Get root layers (layers without parentId and not being masked)
    const rootLayers = layers.filter((layer) => !layer.parentId && !layer.maskedBy)
    return rootLayers.map((layer) => buildHierarchy(layer))
  }, [layers])

  const flattenHierarchy = (hierarchies: LayerHierarchy[]): LayerHierarchy[] => {
    const result: LayerHierarchy[] = []

    hierarchies.forEach((hierarchy) => {
      result.push(hierarchy)
      if (hierarchy.layer.type === "group" && hierarchy.layer.expanded) {
        result.push(...flattenHierarchy(hierarchy.children))
      }
    })

    return result
  }

  const getLayerWithChildren = (layerId: string): string[] => {
    const layer = layers.find((l) => l.id === layerId)
    if (!layer) return [layerId]

    if (layer.type === "group") {
      const allChildren: string[] = [layerId]
      layer.children.forEach((childId) => {
        allChildren.push(...getLayerWithChildren(childId))
      })
      return allChildren
    }

    return [layerId]
  }

  const getGroupBounds = (groupId: string) => {
    const group = layers.find((l) => l.id === groupId && l.type === "group") as Layer & { type: "group" }
    if (!group) return null

    const childLayers = group.children.map((childId) => layers.find((l) => l.id === childId)).filter(Boolean) as Layer[]

    if (childLayers.length === 0) return null

    let minX = Number.POSITIVE_INFINITY
    let minY = Number.POSITIVE_INFINITY
    let maxX = Number.NEGATIVE_INFINITY
    let maxY = Number.NEGATIVE_INFINITY

    childLayers.forEach((child) => {
      minX = Math.min(minX, child.x)
      minY = Math.min(minY, child.y)
      maxX = Math.max(maxX, child.x + child.width)
      maxY = Math.max(maxY, child.y + child.height)
    })

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    }
  }

  return {
    hierarchy,
    flattenHierarchy,
    getLayerWithChildren,
    getGroupBounds,
  }
}

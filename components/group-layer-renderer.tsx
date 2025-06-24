"use client"

import type { Layer } from "@/types/layer-types"
import { cn } from "@/lib/utils"
import { Folder } from "lucide-react"

interface GroupLayerRendererProps {
  group: Layer & { type: "group" }
  children: Layer[]
  isSelected: boolean
  zoom: number
  onSelect: (id: string, multiSelect?: boolean) => void
  bounds: { x: number; y: number; width: number; height: number } | null
}

export function GroupLayerRenderer({ group, children, isSelected, zoom, onSelect, bounds }: GroupLayerRendererProps) {
  if (!bounds) return null

  return (
    <div
      className={cn(
        "absolute border-2 border-dashed rounded-lg pointer-events-none",
        isSelected ? "border-purple-500 bg-purple-500/10" : "border-slate-400/50 bg-slate-400/5",
        group.locked ? "opacity-50" : "",
      )}
      style={{
        left: `${bounds.x}px`,
        top: `${bounds.y}px`,
        width: `${bounds.width}px`,
        height: `${bounds.height}px`,
        zIndex: group.zIndex + 1000, // Ensure group outline is above children
        opacity: group.opacity,
      }}
    >
      {/* Group label */}
      <div
        className={cn(
          "absolute -top-6 left-0 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 pointer-events-auto cursor-pointer",
          isSelected ? "bg-purple-500 text-white" : "bg-slate-600 text-slate-200 hover:bg-slate-500",
        )}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(group.id, e.ctrlKey || e.metaKey)
        }}
      >
        <Folder className="h-3 w-3" />
        <span>{group.name}</span>
        <span className="text-xs opacity-70">({children.length})</span>
      </div>
    </div>
  )
}

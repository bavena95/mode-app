"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { LayerHierarchy } from "@/types/layer-types"
import { ChevronRight, ChevronDown, Folder, FolderOpen, Eye, EyeOff, Lock, Unlock, Trash2, GripVertical, ImageIcon as ImageIconTool, TextIcon, VenetianMaskIcon as MaskIcon, Link2Off } from 'lucide-react'

interface LayerHierarchyItemProps {
  hierarchy: LayerHierarchy
  isSelected: boolean
  onSelect: (id: string, multiSelect: boolean) => void
  onToggleVisibility: (id: string) => void
  onToggleLock: (id: string) => void
  onDelete: (id: string) => void
  onToggleExpanded: (id: string) => void
  onUngroup: (id: string) => void
  onReleaseMask: (id: string) => void // Add this prop
  draggingLayerId: string | null
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void
  onDragOver: (e: React.DragEvent<HTMLDivElement>, id: string) => void
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop: (e: React.DragEvent<HTMLDivElement>, targetId: string) => void
  onDragEnd: () => void
}

export function LayerHierarchyItem({
  hierarchy,
  isSelected,
  onSelect,
  onToggleVisibility,
  onToggleLock,
  onDelete,
  onToggleExpanded,
  onUngroup,
  onReleaseMask,
  draggingLayerId,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: LayerHierarchyItemProps) {
  const { layer, depth, children } = hierarchy
  const isGroup = layer.type === "group"
  const isMask = layer.isMask
  const isMasked = !!layer.maskedBy
  const hasChildren = (isGroup && layer.children.length > 0) || (isMask && children.length > 0)
  const isExpanded = (isGroup && layer.expanded) || isMask // Masks are always "expanded" to show content

  const getLayerIcon = () => {
    if (isMask) return <MaskIcon className="h-4 w-4 text-purple-400" />
    switch (layer.type) {
      case "group":
        return isExpanded ? (
          <FolderOpen className="h-4 w-4 text-purple-400" />
        ) : (
          <Folder className="h-4 w-4 text-purple-400" />
        )
      case "image":
        return <ImageIconTool className="h-4 w-4 text-sky-400" />
      case "text":
        return <TextIcon className="h-4 w-4 text-amber-400" />
      default:
        return null
    }
  }

  return (
    <div
      draggable={!layer.locked}
      onDragStart={(e) => onDragStart(e, layer.id)}
      onDragOver={(e) => onDragOver(e, layer.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, layer.id)}
      onDragEnd={onDragEnd}
      className={cn(
        "flex items-center gap-1 p-2 rounded-lg border transition-all group",
        isSelected ? "bg-purple-600/30 border-purple-500" : "bg-black/20 border-white/10 hover:bg-black/30",
        draggingLayerId === layer.id ? "opacity-50 ring-2 ring-pink-500" : "",
        layer.locked ? "opacity-75 cursor-not-allowed" : "cursor-grab",
      )}
      style={{ paddingLeft: `${8 + depth * 16}px` }}
      onClick={(e) => onSelect(layer.id, e.ctrlKey || e.metaKey)}
    >
      {/* Expand/Collapse Button */}
      <div className="w-4 flex justify-center">
        {hasChildren ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 text-slate-400 hover:text-white"
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpanded(layer.id)
            }}
          >
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </Button>
        ) : null}
      </div>

      {/* Drag Handle */}
      {!layer.locked && <GripVertical className="h-4 w-4 text-slate-500 group-hover:text-slate-300 shrink-0" />}
      {layer.locked && <Lock className="h-4 w-4 text-slate-500 shrink-0" />}

      {/* Layer Icon */}
      <div className="relative">
        {getLayerIcon()}
        {isMasked && (
          <MaskIcon className="absolute -bottom-1 -right-1 h-2.5 w-2.5 text-purple-400 bg-slate-800 rounded-full p-px" />
        )}
      </div>

      {/* Layer Name */}
      <span
        className={cn("text-sm truncate flex-1", layer.locked ? "text-slate-400" : "text-slate-200")}
        title={layer.name}
      >
        {layer.name}
        {isGroup && <span className="text-xs text-slate-400 ml-1">({layer.children.length})</span>}
      </span>

      {/* Action Buttons */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-slate-400 hover:text-white"
          onClick={(e) => {
            e.stopPropagation()
            onToggleVisibility(layer.id)
          }}
        >
          {layer.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3 text-slate-500" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-6 w-6 text-slate-400 hover:text-white",
            layer.locked ? "text-orange-400 hover:text-orange-300" : "",
          )}
          onClick={(e) => {
            e.stopPropagation()
            onToggleLock(layer.id)
          }}
          title={layer.locked ? "Unlock Layer" : "Lock Layer"}
        >
          {layer.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
        </Button>

        {isMask && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-slate-400 hover:text-blue-400"
            onClick={(e) => {
              e.stopPropagation()
              onReleaseMask(layer.id)
            }}
            title="Release Mask"
          >
            <Link2Off className="h-3 w-3" />
          </Button>
        )}

        {isGroup && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-slate-400 hover:text-blue-400"
            onClick={(e) => {
              e.stopPropagation()
              onUngroup(layer.id)
            }}
            title="Ungroup"
          >
            <FolderOpen className="h-3 w-3" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-6 w-6 text-slate-400 hover:text-red-500",
            layer.locked ? "opacity-50 cursor-not-allowed" : "",
          )}
          onClick={(e) => {
            e.stopPropagation()
            onDelete(layer.id)
          }}
          disabled={layer.locked}
          title={layer.locked ? "Cannot delete locked layer" : "Delete Layer"}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

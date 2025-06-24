"use client"

import { Button } from "@/components/ui/button"
import { Square, Circle, Triangle, Star, Heart, Hexagon } from "lucide-react"

interface ShapeSelectorProps {
  onShapeSelect: (shape: string) => void
  className?: string
}

const shapes = [
  { id: "rectangle", icon: <Square className="h-6 w-6" />, label: "Rectangle" },
  { id: "circle", icon: <Circle className="h-6 w-6" />, label: "Circle" },
  { id: "triangle", icon: <Triangle className="h-6 w-6" />, label: "Triangle" },
  { id: "star", icon: <Star className="h-6 w-6" />, label: "Star" },
  { id: "heart", icon: <Heart className="h-6 w-6" />, label: "Heart" },
  { id: "hexagon", icon: <Hexagon className="h-6 w-6" />, label: "Hexagon" },
]

export function ShapeSelector({ onShapeSelect, className }: ShapeSelectorProps) {
  return (
    <div className={`grid grid-cols-3 gap-2 p-4 ${className}`}>
      {shapes.map((shape) => (
        <Button
          key={shape.id}
          variant="outline"
          onClick={() => onShapeSelect(shape.id)}
          className="h-16 flex flex-col gap-1 bg-black/20 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
        >
          {shape.icon}
          <span className="text-xs">{shape.label}</span>
        </Button>
      ))}
    </div>
  )
}

ShapeSelector.defaultProps = {
  className: "",
}

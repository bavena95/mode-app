"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Grid3X3, Magnet, MonitorOffIcon as MagnetOff, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface GridControlsProps {
  showGrid: boolean
  onShowGridChange: (show: boolean) => void
  snapToGrid: boolean
  onSnapToGridChange: (snap: boolean) => void
  gridSize: number
  onGridSizeChange: (size: number) => void
  gridOpacity: number
  onGridOpacityChange: (opacity: number) => void
  className?: string
}

const GRID_PRESETS = [
  { name: "Fine", size: 5 },
  { name: "Small", size: 10 },
  { name: "Medium", size: 20 },
  { name: "Large", size: 40 },
  { name: "XL", size: 80 },
]

export function GridControls({
  showGrid,
  onShowGridChange,
  snapToGrid,
  onSnapToGridChange,
  gridSize,
  onGridSizeChange,
  gridOpacity,
  onGridOpacityChange,
  className,
}: GridControlsProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Grid3X3 className="h-4 w-4" />
          Grid Settings
        </Label>
      </div>

      {/* Grid Visibility */}
      <div className="flex items-center justify-between">
        <Label htmlFor="show-grid" className="text-sm text-slate-300">
          Show Grid
        </Label>
        <Switch
          id="show-grid"
          checked={showGrid}
          onCheckedChange={onShowGridChange}
          className="data-[state=checked]:bg-purple-600"
        />
      </div>

      {/* Snap to Grid */}
      <div className="flex items-center justify-between">
        <Label htmlFor="snap-grid" className="text-sm text-slate-300 flex items-center gap-2">
          {snapToGrid ? (
            <Magnet className="h-4 w-4 text-purple-400" />
          ) : (
            <MagnetOff className="h-4 w-4 text-slate-500" />
          )}
          Snap to Grid
        </Label>
        <Switch
          id="snap-grid"
          checked={snapToGrid}
          onCheckedChange={onSnapToGridChange}
          className="data-[state=checked]:bg-purple-600"
        />
      </div>

      <Separator className="bg-white/10" />

      {/* Grid Size */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="grid-size" className="text-sm text-slate-300">
            Grid Size
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="grid-size"
              type="number"
              value={gridSize}
              onChange={(e) => onGridSizeChange(Number.parseInt(e.target.value) || 20)}
              className="w-16 h-8 bg-black/20 border-white/10 text-xs text-center"
              min="5"
              max="200"
            />
            <span className="text-xs text-slate-400">px</span>
          </div>
        </div>

        {/* Grid Size Presets */}
        <div className="grid grid-cols-5 gap-1">
          {GRID_PRESETS.map((preset) => (
            <TooltipProvider key={preset.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={gridSize === preset.size ? "default" : "outline"}
                    size="sm"
                    onClick={() => onGridSizeChange(preset.size)}
                    className={cn(
                      "text-xs h-8 px-2",
                      gridSize === preset.size
                        ? "bg-purple-600 text-white border-purple-500"
                        : "bg-black/20 border-white/10 text-slate-300 hover:bg-white/10",
                    )}
                  >
                    {preset.name}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-slate-900/80 text-slate-200 border-slate-700">
                  <p>{preset.size}px</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>

      {/* Grid Opacity */}
      {showGrid && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-slate-300">Grid Opacity</Label>
            <span className="text-xs text-slate-400">{Math.round(gridOpacity * 100)}%</span>
          </div>
          <Slider
            value={[gridOpacity * 100]}
            onValueChange={([value]) => onGridOpacityChange(value / 100)}
            max={100}
            min={5}
            step={5}
            className="w-full"
          />
        </div>
      )}

      <Separator className="bg-white/10" />

      {/* Quick Actions */}
      <div className="space-y-2">
        <Label className="text-sm text-slate-300">Quick Actions</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onShowGridChange(true)
              onSnapToGridChange(true)
              onGridSizeChange(20)
              onGridOpacityChange(0.15)
            }}
            className="bg-black/20 border-white/10 text-slate-300 hover:bg-white/10 text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onShowGridChange(!showGrid)
              onSnapToGridChange(!snapToGrid)
            }}
            className="bg-black/20 border-white/10 text-slate-300 hover:bg-white/10 text-xs"
          >
            {showGrid ? "Hide All" : "Show All"}
          </Button>
        </div>
      </div>
    </div>
  )
}

GridControls.defaultProps = {
  className: "",
}

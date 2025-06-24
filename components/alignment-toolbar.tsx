"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignHorizontalSpaceAround,
  AlignVerticalSpaceAround,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AlignmentToolbarProps {
  selectedCount: number
  onAlign: (alignment: string) => void
  onDistribute: (distribution: string) => void
  className?: string
}

const alignmentTools = [
  {
    id: "align-left",
    icon: <AlignHorizontalJustifyStart className="h-4 w-4" />,
    label: "Align Left",
    minSelection: 2,
  },
  {
    id: "align-center-horizontal",
    icon: <AlignHorizontalJustifyCenter className="h-4 w-4" />,
    label: "Align Center Horizontal",
    minSelection: 2,
  },
  {
    id: "align-right",
    icon: <AlignHorizontalJustifyEnd className="h-4 w-4" />,
    label: "Align Right",
    minSelection: 2,
  },
  { isSeparator: true },
  {
    id: "align-top",
    icon: <AlignVerticalJustifyStart className="h-4 w-4" />,
    label: "Align Top",
    minSelection: 2,
  },
  {
    id: "align-center-vertical",
    icon: <AlignVerticalJustifyCenter className="h-4 w-4" />,
    label: "Align Center Vertical",
    minSelection: 2,
  },
  {
    id: "align-bottom",
    icon: <AlignVerticalJustifyEnd className="h-4 w-4" />,
    label: "Align Bottom",
    minSelection: 2,
  },
  { isSeparator: true },
  {
    id: "distribute-horizontal",
    icon: <AlignHorizontalSpaceAround className="h-4 w-4" />,
    label: "Distribute Horizontally",
    minSelection: 3,
  },
  {
    id: "distribute-vertical",
    icon: <AlignVerticalSpaceAround className="h-4 w-4" />,
    label: "Distribute Vertically",
    minSelection: 3,
  },
]

export function AlignmentToolbar({ selectedCount, onAlign, onDistribute, className }: AlignmentToolbarProps) {
  const handleAction = (toolId: string) => {
    if (toolId.startsWith("distribute-")) {
      onDistribute(toolId)
    } else {
      onAlign(toolId)
    }
  }

  return (
    <div className={cn("flex items-center gap-1 p-2 bg-slate-800/50 rounded-lg backdrop-blur-sm", className)}>
      <TooltipProvider delayDuration={100}>
        {alignmentTools.map((tool, index) =>
          tool.isSeparator ? (
            <Separator key={`sep-${index}`} orientation="vertical" className="h-6 bg-white/10 mx-1" />
          ) : (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 text-slate-300 hover:text-white hover:bg-white/10",
                    selectedCount < tool.minSelection ? "opacity-50 cursor-not-allowed" : "",
                  )}
                  onClick={() => handleAction(tool.id)}
                  disabled={selectedCount < tool.minSelection}
                >
                  {tool.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                sideOffset={8}
                className="bg-slate-900/80 text-slate-200 border-slate-700 backdrop-blur-md"
              >
                <p>{tool.label}</p>
                {selectedCount < tool.minSelection && (
                  <p className="text-xs text-slate-400 mt-1">Requires {tool.minSelection}+ selected layers</p>
                )}
              </TooltipContent>
            </Tooltip>
          ),
        )}
      </TooltipProvider>
    </div>
  )
}

AlignmentToolbar.defaultProps = {
  className: "",
}

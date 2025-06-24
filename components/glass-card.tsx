"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function GlassCard({ children, className, onClick }: GlassCardProps) {
  return (
    <Card
      className={cn(
        "bg-slate-800/30 backdrop-blur-lg border border-slate-700/50 shadow-xl hover:border-slate-600/70 transition-all duration-300",
        onClick ? "cursor-pointer" : "",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  )
}

GlassCard.defaultProps = {
  className: "",
  onClick: undefined,
}

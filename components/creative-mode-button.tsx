"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface CreativeModeButtonProps {
  href: string
  icon: React.ReactElement
  title: string
  description: string
  colorClass: string
  isActive?: boolean
}

export function CreativeModeButton({ href, icon, title, description, colorClass, isActive }: CreativeModeButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex-shrink-0 w-40 h-32 p-4 rounded-2xl transition-all duration-300 ease-in-out relative overflow-hidden group",
        "backdrop-blur-xl border",
        isActive
          ? "bg-white/20 border-white/30 shadow-lg"
          : `${colorClass} border-white/10 hover:border-white/20 hover:shadow-lg`,
      )}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <div
            className={cn(
              "p-2 rounded-lg w-fit mb-2 transition-colors",
              isActive ? "bg-white/30" : "bg-black/20 group-hover:bg-black/30",
            )}
          >
            {React.cloneElement(icon, { className: "h-5 w-5 text-white" })}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-white text-base">{title}</h3>
          <p className="text-xs text-white/70 line-clamp-2">{description}</p>
        </div>
      </div>
    </Link>
  )
}

CreativeModeButton.defaultProps = {
  isActive: false,
}

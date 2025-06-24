import type React from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  className?: string
  children?: React.ReactNode
}

export function PageHeader({ title, description, className, children }: PageHeaderProps) {
  return (
    <div className={cn("py-8 md:py-12", className)}>
      <div className="container max-w-screen-lg text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          {title}
        </h1>
        {description && <p className="mt-3 text-lg text-muted-foreground sm:text-xl">{description}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  )
}

PageHeader.defaultProps = {
  description: undefined,
  className: "",
  children: undefined,
}

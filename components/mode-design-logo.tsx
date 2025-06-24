import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModeDesignLogoProps {
  className?: string
}

export function ModeDesignLogo({ className }: ModeDesignLogoProps) {
  return (
    <div className={cn("p-1 rounded-md bg-gradient-to-br from-purple-600 to-pink-500", className)}>
      <Sparkles className="h-full w-full text-white" />
    </div>
  )
}

ModeDesignLogo.defaultProps = {
  className: "h-8 w-8",
}

"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
// 1. Importe o Suspense do React
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { ModeDesignLogo } from "@/components/mode-design-logo"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Plus,
  Save,
  Download,
  Upload,
  Copy,
  Folder,
  Settings2,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Magnet,
  VenetianMaskIcon as MaskIcon,
  Home,
  Sparkles,
  Video,
} from "lucide-react"
import { cn } from "@/lib/utils"

import { useAuth } from "@/contexts/AuthContext"
import { UserButton } from "@stackframe/stack"
import { Skeleton } from "@/components/ui/skeleton"

interface FloatingHeaderProps {
  // Playground specific props
  onNew?: () => void
  onSave?: () => void
  onExport?: () => void
  onImport?: () => void
  onDuplicate?: () => void
  onGroup?: () => void
  onCreateMask?: () => void
  onCanvasSettings?: () => void
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
  selectedCount?: number
  zoom?: number
  onZoomIn?: () => void
  onZoomOut?: () => void
  showGrid?: boolean
  snapToGrid?: boolean
  // General props
  isPlayground?: boolean
  isVideoStudio?: boolean
  className?: string
}

export function FloatingHeader({
  onNew,
  onSave,
  onExport,
  onImport,
  onDuplicate,
  onGroup,
  onCreateMask,
  onCanvasSettings,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  selectedCount = 0,
  zoom = 1,
  onZoomIn,
  onZoomOut,
  showGrid = false,
  snapToGrid = false,
  isPlayground = false,
  isVideoStudio = false,
  className,
}: FloatingHeaderProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Define um componente de fallback para o Suspense
  const AuthFallback = () => <Skeleton className="h-8 w-24 rounded-md bg-slate-700" />;

  return (
    <div
      className={cn(
        "fixed top-4 left-4 right-4 h-12 z-[100] flex items-center justify-between",
        "bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4",
        "shadow-2xl shadow-black/20",
        className,
      )}
    >
      {/* Seção Esquerda */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <ModeDesignLogo className="h-6 w-6" />
          <span className="font-bold text-white hidden sm:block">Mode Design</span>
        </Link>
        {(isPlayground || isVideoStudio) && (
          <>
            <Separator orientation="vertical" className="h-6 bg-white/10 mx-1" />
            <nav className="flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:text-white hover:bg-white/10 h-8 px-3">
                <Link href="/"><Home className="h-4 w-4 mr-1" /><span className="hidden sm:inline">Create</span></Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className={cn("text-slate-300 hover:text-white hover:bg-white/10 h-8 px-3", isPlayground && !isVideoStudio ? "bg-white/10 text-white" : "")}>
                <Link href="/playground"><Sparkles className="h-4 w-4 mr-1" /><span className="hidden sm:inline">Playground</span></Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className={cn("text-slate-300 hover:text-white hover:bg-white/10 h-8 px-3", isVideoStudio ? "bg-white/10 text-white" : "")}>
                <Link href="/video-studio"><Video className="h-4 w-4 mr-1" /><span className="hidden sm:inline">Video Studio</span></Link>
              </Button>
            </nav>
          </>
        )}
      </div>

      {/* Seção Central */}
      {(isPlayground || isVideoStudio) && (
        <div className="flex items-center gap-1 bg-black/20 rounded-xl px-2 py-1">
           <TooltipProvider delayDuration={100}>
            {/* ... Seus botões de ferramentas (Save, etc.) aqui ... */}
           </TooltipProvider>
        </div>
      )}

      {/* Seção Direita */}
      <div className="flex items-center gap-4">
        {(isPlayground || isVideoStudio) && (
          <div className="flex items-center gap-2">
            {/* ... Controles de Zoom, etc. aqui ... */}
          </div>
        )}
        
        {/* Bloco de Autenticação */}
        <div className="flex items-center gap-2">
          <Suspense fallback={<AuthFallback />}>
            {/* 2. Envolva a lógica de autenticação com o Suspense */}
            <AuthButtons />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

// 3. Extraia os botões de autenticação para seu próprio componente
function AuthButtons() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  if (isLoading) {
    return <Skeleton className="h-8 w-24 rounded-md bg-slate-700" />;
  }

  if (user) {
    return <UserButton />;
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="bg-transparent text-slate-300 hover:bg-white/10 hover:text-white border-white/20 h-8"
        onClick={() => router.push('/login')}
      >
        Login
      </Button>
      <Button
        size="sm"
        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white h-8"
        onClick={() => router.push('/register')}
      >
        Sign Up
      </Button>
    </>
  )
}
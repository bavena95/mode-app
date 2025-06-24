"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { DraggableResizableLayer } from "@/components/draggable-resizable-layer"
import { useHistory } from "@/hooks/use-history"
import { useGridSnap } from "@/hooks/use-grid-snap"
import { Textarea } from "@/components/ui/textarea"
import {
  MousePointer2,
  Crop,
  Type,
  Square,
  Frame,
  Plus,
  Sparkles,
  ImageIcon,
  Settings2,
  Grid3X3,
  Magnet,
  FolderOpen,
  Upload,
  ChevronRight,
  Layers3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AlignmentToolbar } from "@/components/alignment-toolbar"
import { GridOverlay } from "@/components/grid-overlay"
import { useLayerHierarchy } from "@/hooks/use-layer-hierarchy"
import { GroupLayerRenderer } from "@/components/group-layer-renderer"
import { FloatingHeader } from "@/components/floating-header"
import { CropOverlay } from "@/components/crop-overlay"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Switch } from "@/components/ui/switch"
import { LayerHierarchyItem } from "@/components/layer-hierarchy-item"
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Lock,
  Unlock,
  Trash2,
  Eye,
  EyeOff,
  Palette,
  RotateCcw,
} from "lucide-react"

const CANVAS_PRESETS = [
  { name: "Custom", width: 1000, height: 1000 },
  { name: "Instagram Post", width: 1080, height: 1080 },
  { name: "Instagram Story", width: 1080, height: 1920 },
  { name: "Facebook Post", width: 1200, height: 630 },
  { name: "Twitter Header", width: 1500, height: 500 },
  { name: "YouTube Thumbnail", width: 1280, height: 720 },
  { name: "LinkedIn Post", width: 1200, height: 627 },
  { name: "Pinterest Pin", width: 1000, height: 1500 },
  { name: "A4 Portrait", width: 2480, height: 3508 },
  { name: "A4 Landscape", width: 3508, height: 2480 },
]

const fontOptions = [
  { value: "Inter", label: "Inter" },
  { value: "Arial", label: "Arial" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Georgia", label: "Georgia" },
  { value: "Verdana", label: "Verdana" },
  { value: "Trebuchet MS", label: "Trebuchet MS" },
  { value: "Impact", label: "Impact" },
  { value: "Courier New", label: "Courier New" },
  { value: "Comic Sans MS", label: "Comic Sans MS" },
]

const fontWeightOptions = [
  { value: "100", label: "Thin" },
  { value: "200", label: "Extra Light" },
  { value: "300", label: "Light" },
  { value: "normal", label: "Normal" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi Bold" },
  { value: "bold", label: "Bold" },
  { value: "800", label: "Extra Bold" },
  { value: "900", label: "Black" },
]

// AI Models for image generation
const imageModels = [
  {
    id: "flux-pro",
    name: "Flux Pro",
    description: "High-quality photorealistic images",
    credits: 25,
    speed: "Fast",
    quality: "Excellent",
  },
  {
    id: "midjourney-v6",
    name: "Midjourney v6",
    description: "Artistic and creative generations",
    credits: 15,
    speed: "Medium",
    quality: "Excellent",
  },
  {
    id: "dall-e-3",
    name: "DALL-E 3",
    description: "Precise prompt following",
    credits: 20,
    speed: "Medium",
    quality: "Very Good",
  },
  {
    id: "stable-diffusion-xl",
    name: "Stable Diffusion XL",
    description: "Open source, customizable",
    credits: 10,
    speed: "Fast",
    quality: "Good",
  },
]

// CORREÇÃO: Definição de tipo abrangente para Layer, incluindo todas as propriedades usadas.
export type Layer = {
  id: string
  name: string
  type: "image" | "text" | "group"
  visible: boolean
  locked: boolean
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  opacity: number
  rotation: number
  color?: string
  imageUrl?: string
  content?: string
  fontSize?: number
  fontColor?: string
  fontFamily?: string
  fontWeight?: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900"
  fontStyle?: "normal" | "italic"
  textDecoration?: "none" | "underline" | "line-through"
  textAlign?: "left" | "center" | "right" | "justify"
  lineHeight?: number
  letterSpacing?: number
  // Propriedades de agrupamento e máscara
  parentId?: string
  children?: string[]
  expanded?: boolean
  isMask?: boolean
  maskedBy?: string
}

const initialLayers: Layer[] = [
  {
    id: "1",
    name: "Background",
    type: "image",
    visible: true,
    locked: true,
    x: 10,
    y: 10,
    width: 300,
    height: 200,
    zIndex: 1,
    opacity: 1,
    color: "bg-sky-500/30",
    imageUrl: "/placeholder.svg?height=200&width=300",
    rotation: 0,
  },
  {
    id: "2",
    name: "Character",
    type: "image",
    visible: true,
    locked: false,
    x: 50,
    y: 40,
    width: 100,
    height: 120,
    zIndex: 2,
    opacity: 0.8,
    color: "bg-rose-500/30",
    imageUrl: "/placeholder.svg?height=120&width=100",
    rotation: 0,
  },
  {
    id: "4",
    name: "Title Text",
    type: "text",
    visible: true,
    locked: false,
    x: 70,
    y: 170,
    width: 150,
    height: 40,
    zIndex: 3,
    opacity: 1,
    // CORREÇÃO: A propriedade 'content' estava faltando e é necessária para camadas de texto.
    content: "Title Text",
    color: "bg-amber-500/30",
    fontSize: 30,
    fontColor: "#FFFFFF",
    rotation: 15,
    fontFamily: "Inter",
    fontWeight: "bold",
    fontStyle: "normal",
    textDecoration: "none",
    textAlign: "center",
    lineHeight: 1.2,
    letterSpacing: 0,
  },
].map((layer, index, arr) => ({ ...layer, zIndex: arr.length - index }))

// Left sidebar tools
const leftSidebarTools = [
  { id: "select", icon: <MousePointer2 className="h-5 w-5" />, label: "Select", active: true },
  { id: "crop", icon: <Crop className="h-5 w-5" />, label: "Crop" },
  { id: "text", icon: <Type className="h-5 w-5" />, label: "Text" },
  { id: "shape", icon: <Square className="h-5 w-5" />, label: "Shape" },
  { id: "frame", icon: <Frame className="h-5 w-5" />, label: "Frame" },
]

// Mock gallery items
const galleryItems = [
  {
    id: "1",
    type: "image",
    name: "AI Generated Portrait",
    thumbnail: "/placeholder.svg?height=100&width=150",
    prompt: "Professional headshot with studio lighting",
  },
  {
    id: "2",
    type: "image",
    name: "Abstract Art",
    thumbnail: "/placeholder.svg?height=100&width=150",
    prompt: "Abstract digital painting with vibrant colors",
  },
  {
    id: "3",
    type: "image",
    name: "Logo Design",
    thumbnail: "/placeholder.svg?height=100&width=150",
    prompt: "Modern minimalist tech startup logo",
  },
]

export default function ImageStudioPage() {
  const { state: layers, setState: setLayers, undo, redo, canUndo, canRedo } = useHistory<Layer[]>(initialLayers)
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([])
  const [activeTool, setActiveTool] = useState("select")
  const [zoom, setZoom] = useState(1)
  const canvasAreaRef = useRef<HTMLDivElement>(null)
  const [canvasBounds, setCanvasBounds] = useState<DOMRect | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const [aiPrompt, setAiPrompt] = useState("")
  const [selectedModel, setSelectedModel] = useState("flux-pro")

  const [canvasWidth, setCanvasWidth] = useState(1000)
  const [canvasHeight, setCanvasHeight] = useState(1000)
  const [selectedPreset, setSelectedPreset] = useState("Custom")
  const [isCanvasSettingsOpen, setIsCanvasSettingsOpen] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  // Grid settings
  const [showGrid, setShowGrid] = useState(true)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [gridSize, setGridSize] = useState(20)
  const [gridOpacity, setGridOpacity] = useState(0.15)

  // Right panel state - agora só tem layers e properties
  const [rightPanelTab, setRightPanelTab] = useState<"layers" | "properties">("layers")

  // Add after other state declarations
  const [isCropMode, setIsCropMode] = useState(false)
  const [cropLayerId, setCropLayerId] = useState<string | null>(null)
  const [isFrameDialogOpen, setIsFrameDialogOpen] = useState(false)
  const [frameWidth, setFrameWidth] = useState(200)
  const [frameHeight, setFrameHeight] = useState(200)
  const [isShapeSelectorOpen, setIsShapeSelectorOpen] = useState(false)

  // Grid snap hook
  const { snapLayerToGrid, snapSizeToGrid } = useGridSnap({
    gridSize,
    snapToGrid,
    snapThreshold: 10,
  })

  // For drag and drop reordering
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null)
  const dragOverLayerId = useRef<string | null>(null)

  const { hierarchy, flattenHierarchy, getLayerWithChildren, getGroupBounds } = useLayerHierarchy(layers)

  // Get selected model info
  const currentModel = imageModels.find((model) => model.id === selectedModel) || imageModels[0]

  // Initialize canvas
  useEffect(() => {
    offscreenCanvasRef.current = document.createElement("canvas")
    offscreenCanvasRef.current.width = canvasWidth
    offscreenCanvasRef.current.height = canvasHeight

    if (canvasAreaRef.current) {
      setCanvasBounds(canvasAreaRef.current.getBoundingClientRect())
    }
    const handleResize = () => {
      if (canvasAreaRef.current) {
        setCanvasBounds(canvasAreaRef.current.getBoundingClientRect())
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [canvasWidth, canvasHeight])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.key === "g" || e.key === "G") {
        e.preventDefault()
        setShowGrid((prev) => !prev)
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault()
        handleDuplicateSelected()
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault()
        handleDeleteSelected()
      }

      if (e.key === "Escape") {
        e.preventDefault()
        setSelectedLayerIds([])
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault()
        const unlockedLayers = layers.filter((l) => !l.locked).map((l) => l.id)
        setSelectedLayerIds(unlockedLayers)
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "g" && !e.shiftKey) {
        e.preventDefault()
        handleGroupSelected()
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "g" || e.key === "G")) {
        e.preventDefault()
        handleUngroupSelected()
      }

      if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === "m" || e.key === "M")) {
        e.preventDefault()
        handleCreateMask()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [layers, selectedLayerIds]) // Dependências corretas

  const assignZIndices = (currentLayers: Layer[]): Layer[] => {
    return currentLayers.map((layer, index) => ({
      ...layer,
      zIndex: currentLayers.length - index,
    }))
  }

  const addLayer = (type: "image" | "text", options: Partial<Layer> = {}) => {
    const newLayerId = Date.now().toString()
    const defaultName = type === "image" ? `Image ${layers.length + 1}` : `Text ${layers.length + 1}`

    let defaultX = options.x || 20
    let defaultY = options.y || 20
    let defaultWidth = options.width || (type === "image" ? 120 : 150)
    let defaultHeight = options.height || (type === "image" ? 80 : 40)

    if (snapToGrid) {
      const snappedPos = snapLayerToGrid({
        x: defaultX,
        y: defaultY,
        width: defaultWidth,
        height: defaultHeight,
      })
      defaultX = snappedPos.x
      defaultY = snappedPos.y

      const snappedSize = snapSizeToGrid({
        width: defaultWidth,
        height: defaultHeight,
      })
      defaultWidth = snappedSize.width
      defaultHeight = snappedSize.height
    }

    const newLayer: Layer = {
      id: newLayerId,
      name: options.name || defaultName,
      type: type,
      visible: true,
      locked: false,
      x: defaultX,
      y: defaultY,
      width: defaultWidth,
      height: defaultHeight,
      zIndex: 0,
      opacity: 1,
      color: options.color || (type === "image" ? "bg-green-500/30" : "bg-orange-500/30"),
      content: type === "text" ? options.content || "New Text" : undefined,
      imageUrl:
        type === "image"
          ? options.imageUrl || `/placeholder.svg?height=${defaultHeight}&width=${defaultWidth}&query=new+image`
          : undefined,
      fontSize: type === "text" ? options.fontSize || 24 : undefined,
      fontColor: type === "text" ? options.fontColor || "#FFFFFF" : undefined,
      rotation: options.rotation || 0,
      fontFamily: type === "text" ? options.fontFamily || "Inter" : undefined,
      fontWeight: type === "text" ? options.fontWeight || "normal" : undefined,
      fontStyle: type === "text" ? options.fontStyle || "normal" : undefined,
      textDecoration: type === "text" ? options.textDecoration || "none" : undefined,
      textAlign: type === "text" ? options.textAlign || "left" : undefined,
      lineHeight: type === "text" ? options.lineHeight || 1.2 : undefined,
      letterSpacing: type === "text" ? options.letterSpacing || 0 : undefined,
    }
    setLayers((prev) => assignZIndices([newLayer, ...prev]), true)
    setSelectedLayerIds([newLayerId])
  }

  const handleDuplicateSelected = () => {
    if (selectedLayerIds.length === 0) return

    const selectedLayers = layers.filter((l) => selectedLayerIds.includes(l.id) && !l.locked)
    if (selectedLayers.length === 0) return

    const duplicatedLayers = selectedLayers.map((layer) => {
      let offsetX = layer.x + 20
      let offsetY = layer.y + 20

      if (snapToGrid) {
        const snappedLayer = snapLayerToGrid({
          x: offsetX,
          y: offsetY,
          width: layer.width,
          height: layer.height,
        })
        offsetX = snappedLayer.x
        offsetY = snappedLayer.y
      }

      return {
        ...layer,
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: `${layer.name} Copy`,
        x: offsetX,
        y: offsetY,
      }
    })

    setLayers((prev) => assignZIndices([...duplicatedLayers, ...prev]), true)
    setSelectedLayerIds(duplicatedLayers.map((l) => l.id))
  }

  const handleDeleteSelected = () => {
    if (selectedLayerIds.length === 0) return

    const layersToDelete = layers.filter((l) => selectedLayerIds.includes(l.id) && !l.locked)
    if (layersToDelete.length === 0) return

    setLayers((prev) => prev.filter((l) => !selectedLayerIds.includes(l.id) || l.locked), true)
    setSelectedLayerIds([])
  }

  const handleGroupSelected = () => {
    if (selectedLayerIds.length < 2) return

    const selectedLayers = layers.filter((l) => selectedLayerIds.includes(l.id) && !l.locked)
    if (selectedLayers.length < 2) return

    let minX = Number.POSITIVE_INFINITY
    let minY = Number.POSITIVE_INFINITY
    let maxX = Number.NEGATIVE_INFINITY
    let maxY = Number.NEGATIVE_INFINITY

    selectedLayers.forEach((layer) => {
      minX = Math.min(minX, layer.x)
      minY = Math.min(minY, layer.y)
      maxX = Math.max(maxX, layer.x + layer.width)
      maxY = Math.max(maxY, layer.y + layer.height)
    })

    const groupId = `group-${Date.now()}`
    const groupLayer: Layer = {
      id: groupId,
      name: `Group ${Math.floor(Math.random() * 1000)}`,
      type: "group",
      visible: true,
      locked: false,
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      zIndex: Math.max(...selectedLayers.map((l) => l.zIndex)),
      opacity: 1,
      rotation: 0,
      expanded: true,
      children: selectedLayerIds,
    }

    const updatedLayers = layers.map((layer) => {
      if (selectedLayerIds.includes(layer.id)) {
        return { ...layer, parentId: groupId }
      }
      return layer
    })

    setLayers([groupLayer, ...updatedLayers], true)
    setSelectedLayerIds([groupId])
  }

  // CORREÇÃO: Lógica de desagrupamento refeita para ser mais eficiente e correta.
  const handleUngroupSelected = () => {
    const selectedGroups = layers.filter((l) => l.type === "group" && selectedLayerIds.includes(l.id)) as (Layer & {
      type: "group"
      children: string[]
    })[]

    if (selectedGroups.length === 0) return

    const groupIdsToRemove = new Set(selectedGroups.map((g) => g.id))
    const childIdsToRelease = new Set(selectedGroups.flatMap((g) => g.children))

    const newLayers = layers
      .map((layer) => {
        if (childIdsToRelease.has(layer.id)) {
          const { parentId, ...rest } = layer
          return rest
        }
        return layer
      })
      .filter((layer) => !groupIdsToRemove.has(layer.id))

    setLayers(newLayers, true)
    setSelectedLayerIds(Array.from(childIdsToRelease))
  }

  const handleToggleGroupExpanded = (groupId: string) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === groupId && layer.type === "group" ? { ...layer, expanded: !layer.expanded } : layer,
      ),
    )
  }

  const handleCreateMask = () => {
    const selectedLayers = layers.filter((l) => selectedLayerIds.includes(l.id) && !l.locked)
    if (selectedLayers.length !== 2) {
      alert("Please select exactly two layers to create a mask.")
      return
    }

    const sortedSelection = selectedLayers.sort((a, b) => b.zIndex - a.zIndex)
    const maskLayer = sortedSelection[0]
    const contentLayer = sortedSelection[1]

    setLayers(
      (prev) =>
        prev.map((l) => {
          if (l.id === maskLayer.id) {
            return { ...l, isMask: true }
          }
          if (l.id === contentLayer.id) {
            return { ...l, maskedBy: maskLayer.id }
          }
          return l
        }),
      true,
    )

    setSelectedLayerIds([maskLayer.id])
  }

  // CORREÇÃO: Evitado o uso de estado obsoleto para encontrar a camada de conteúdo.
  const handleReleaseMask = (maskId: string) => {
    const contentLayer = layers.find((l) => l.maskedBy === maskId)
    const contentLayerId = contentLayer?.id

    setLayers((prev) => {
      return prev.map((l) => {
        if (l.id === maskId) {
          const { isMask, ...rest } = l
          return { ...rest, isMask: false }
        }
        if (l.id === contentLayerId) {
          const { maskedBy, ...rest } = l
          return rest
        }
        return l
      })
    }, true)

    if (contentLayer) {
      setSelectedLayerIds([maskId, contentLayer.id])
    }
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    const layer = layers.find((l) => l.id === id)
    if (layer?.locked) {
      e.preventDefault()
      return
    }

    e.dataTransfer.setData("application/mode-design-layer-id", id)
    e.dataTransfer.effectAllowed = "move"
    setDraggingLayerId(id)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault()
    dragOverLayerId.current = id
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Clear visual feedback if needed
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault()
    const draggedId = e.dataTransfer.getData("application/mode-design-layer-id")

    if (draggedId && draggedId !== targetId) {
      setLayers((prevLayers) => {
        const draggedItemIndex = prevLayers.findIndex((l) => l.id === draggedId)
        if (draggedItemIndex === -1) return prevLayers

        const draggedItem = prevLayers[draggedItemIndex]
        const newLayers = prevLayers.filter((l) => l.id !== draggedId)
        const targetItemIndex = newLayers.findIndex((l) => l.id === targetId)
        if (targetItemIndex === -1) return prevLayers

        newLayers.splice(targetItemIndex, 0, draggedItem)
        return assignZIndices(newLayers)
      }, true)
    }
    setDraggingLayerId(null)
    dragOverLayerId.current = null
  }

  const handleDragEnd = () => {
    setDraggingLayerId(null)
    dragOverLayerId.current = null
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        addLayer("image", { imageUrl: reader.result as string, name: file.name.split(".")[0] })
      }
      reader.readAsDataURL(file)
      e.target.value = ""
    }
  }

  const handleGenerateWithAI = () => {
    addLayer("image", {
      name: `AI: ${aiPrompt.substring(0, 20)}...`,
      imageUrl: `/placeholder.svg?height=150&width=150&query=${encodeURIComponent(aiPrompt)}`,
      width: 150,
      height: 150,
    })
    setAiPrompt("")
  }

  const handleGallerySelect = (item: any) => {
    addLayer("image", {
      name: item.name,
      imageUrl: item.thumbnail,
      width: 150,
      height: 150,
    })
    setIsGalleryOpen(false)
  }

  const handleToggleLayerVisibility = (id: string) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)))
  }

  // CORREÇÃO: Lógica refeita para evitar o uso de estado obsoleto.
  const handleToggleLayerLock = (id: string) => {
    const layerToToggle = layers.find((l) => l.id === id)
    if (!layerToToggle) return

    // Verifica se a camada está sendo travada (está atualmente destravada).
    const isLocking = !layerToToggle.locked

    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l)), true)

    // Se uma camada selecionada está sendo travada, remova-a da seleção.
    if (isLocking && selectedLayerIds.includes(id)) {
      setSelectedLayerIds((prev) => prev.filter((selectedId) => selectedId !== id))
    }
  }

  const handleUpdateLayer = (id: string, updates: Partial<Layer>, recordHistory = false) => {
    const layer = layers.find((l) => l.id === id)
    if (layer?.locked && !("locked" in updates)) {
      return
    }

    const finalUpdates = { ...updates }

    if (
      snapToGrid &&
      (updates.x !== undefined ||
        updates.y !== undefined ||
        updates.width !== undefined ||
        updates.height !== undefined)
    ) {
      const currentLayer = layers.find((l) => l.id === id)
      if (currentLayer) {
        const updatedLayer = { ...currentLayer, ...updates }

        if (updates.x !== undefined || updates.y !== undefined) {
          const snappedLayer = snapLayerToGrid(updatedLayer)
          finalUpdates.x = snappedLayer.x
          finalUpdates.y = snappedLayer.y
        }

        if (updates.width !== undefined || updates.height !== undefined) {
          const snappedSize = snapSizeToGrid({
            width: updatedLayer.width,
            height: updatedLayer.height,
          })
          finalUpdates.width = snappedSize.width
          finalUpdates.height = snappedSize.height
        }
      }
    }

    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...finalUpdates } : l)), recordHistory)
  }

  const handleSelectLayer = (id: string, multiSelect = false) => {
    const layer = layers.find((l) => l.id === id)
    if (layer?.locked) {
      return
    }

    if (multiSelect) {
      setSelectedLayerIds((prev) => {
        if (prev.includes(id)) {
          return prev.filter((selectedId) => selectedId !== id)
        } else {
          return [...prev, id]
        }
      })
    } else {
      setSelectedLayerIds([id])
    }
  }

  const handleDeleteLayer = (id: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== id), true)
    setSelectedLayerIds((prev) => prev.filter((selectedId) => selectedId !== id))
  }

  // Alignment functions
  const handleAlignLayers = (alignment: string) => {
    if (selectedLayerIds.length < 2) return

    const selectedLayers = layers.filter((l) => selectedLayerIds.includes(l.id) && !l.locked)
    if (selectedLayers.length < 2) return

    // Calculate bounds of all selected layers
    const bounds = selectedLayers.reduce(
      (acc, layer) => ({
        left: Math.min(acc.left, layer.x),
        right: Math.max(acc.right, layer.x + layer.width),
        top: Math.min(acc.top, layer.y),
        bottom: Math.max(acc.bottom, layer.y + layer.height),
      }),
      {
        left: Number.POSITIVE_INFINITY,
        right: Number.NEGATIVE_INFINITY,
        top: Number.POSITIVE_INFINITY,
        bottom: Number.NEGATIVE_INFINITY,
      },
    )

    const centerX = (bounds.left + bounds.right) / 2
    const centerY = (bounds.top + bounds.bottom) / 2

    const updates: { [key: string]: Partial<Layer> } = {}

    selectedLayers.forEach((layer) => {
      let newX = layer.x
      let newY = layer.y

      switch (alignment) {
        case "align-left":
          newX = bounds.left
          break
        case "align-center-horizontal":
          newX = centerX - layer.width / 2
          break
        case "align-right":
          newX = bounds.right - layer.width
          break
        case "align-top":
          newY = bounds.top
          break
        case "align-center-vertical":
          newY = centerY - layer.height / 2
          break
        case "align-bottom":
          newY = bounds.bottom - layer.height
          break
      }

      // Apply grid snap to aligned positions
      if (snapToGrid) {
        const snappedLayer = snapLayerToGrid({
          x: newX,
          y: newY,
          width: layer.width,
          height: layer.height,
        })
        newX = snappedLayer.x
        newY = snappedLayer.y
      }

      updates[layer.id] = { x: newX, y: newY }
    })

    // Apply all updates
    setLayers((prev) => prev.map((layer) => (updates[layer.id] ? { ...layer, ...updates[layer.id] } : layer)), true)
  }

  const handleDistributeLayers = (distribution: string) => {
    if (selectedLayerIds.length < 3) return

    const selectedLayers = layers.filter((l) => selectedLayerIds.includes(l.id) && !l.locked)
    if (selectedLayers.length < 3) return

    const updates: { [key: string]: Partial<Layer> } = {}

    if (distribution === "distribute-horizontal") {
      // Sort by x position
      const sortedLayers = [...selectedLayers].sort((a, b) => a.x - b.x)
      const leftmost = sortedLayers[0]
      const rightmost = sortedLayers[sortedLayers.length - 1]

      const totalSpace = rightmost.x + rightmost.width - leftmost.x
      const totalLayerWidth = sortedLayers.reduce((sum, layer) => sum + layer.width, 0)
      const availableSpace = totalSpace - totalLayerWidth
      const spacing = availableSpace / (sortedLayers.length - 1)

      let currentX = leftmost.x + leftmost.width + spacing
      for (let i = 1; i < sortedLayers.length - 1; i++) {
        let newX = currentX

        // Apply grid snap
        if (snapToGrid) {
          const snappedLayer = snapLayerToGrid({
            x: newX,
            y: sortedLayers[i].y,
            width: sortedLayers[i].width,
            height: sortedLayers[i].height,
          })
          newX = snappedLayer.x
        }

        updates[sortedLayers[i].id] = { x: newX }
        currentX += sortedLayers[i].width + spacing
      }
    } else if (distribution === "distribute-vertical") {
      // Sort by y position
      const sortedLayers = [...selectedLayers].sort((a, b) => a.y - b.y)
      const topmost = sortedLayers[0]
      const bottommost = sortedLayers[sortedLayers.length - 1]

      const totalSpace = bottommost.y + bottommost.height - topmost.y
      const totalLayerHeight = sortedLayers.reduce((sum, layer) => sum + layer.height, 0)
      const availableSpace = totalSpace - totalLayerHeight
      const spacing = availableSpace / (sortedLayers.length - 1)

      let currentY = topmost.y + topmost.height + spacing
      for (let i = 1; i < sortedLayers.length - 1; i++) {
        let newY = currentY

        // Apply grid snap
        if (snapToGrid) {
          const snappedLayer = snapLayerToGrid({
            x: sortedLayers[i].x,
            y: newY,
            width: sortedLayers[i].width,
            height: sortedLayers[i].height,
          })
          newY = snappedLayer.y
        }

        updates[sortedLayers[i].id] = { y: newY }
        currentY += sortedLayers[i].height + spacing
      }
    }

    // Apply all updates
    setLayers((prev) => prev.map((layer) => (updates[layer.id] ? { ...layer, ...updates[layer.id] } : layer)), true)
  }

  const handleComposeAndDownload = async () => {
    const canvas = offscreenCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const sortedLayers = [...layers].filter((l) => l.visible).sort((a, b) => a.zIndex - b.zIndex)

    for (const layer of sortedLayers) {
      ctx.save()
      ctx.globalAlpha = layer.opacity

      const centerX = layer.x + layer.width / 2
      const centerY = layer.y + layer.height / 2

      ctx.translate(centerX, centerY)
      ctx.rotate(((layer.rotation || 0) * Math.PI) / 180)
      ctx.translate(-centerX, -centerY)

      if (layer.type === "image" && layer.imageUrl) {
        try {
          const img = new Image()
          img.crossOrigin = "anonymous"
          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              ctx.drawImage(img, layer.x, layer.y, layer.width, layer.height)
              resolve()
            }
            img.onerror = (err) => {
              console.error("Error loading image for composition:", layer.imageUrl, err)
              ctx.fillStyle = "rgba(255,0,0,0.5)"
              ctx.fillRect(layer.x, layer.y, layer.width, layer.height)
              ctx.fillStyle = "white"
              ctx.fillText("Error", layer.x + 5, layer.y + 15)
              resolve()
            }
            img.src = layer.imageUrl
          })
        } catch (error) {
          console.error("Error processing image layer:", error)
        }
      } else if (layer.type === "text" && layer.content) {
        // Apply text styling
        ctx.font = `${layer.fontStyle === "italic" ? "italic " : ""}${layer.fontWeight || "normal"} ${layer.fontSize || 24}px ${layer.fontFamily || "Arial"}`
        ctx.fillStyle = layer.fontColor || "#FFFFFF"
        ctx.textAlign = (layer.textAlign as CanvasTextAlign) || "left"
        ctx.textBaseline = "top"

        // Handle text decoration and letter spacing
        const lines = layer.content.split("\n")
        const lineHeight = (layer.fontSize || 24) * (layer.lineHeight || 1.2)

        lines.forEach((line, index) => {
          const y = layer.y + index * lineHeight

          // Apply letter spacing if needed
          if (layer.letterSpacing && layer.letterSpacing !== 0) {
            let x = layer.x
            const spacing = layer.letterSpacing

            // Adjust starting position based on text alignment
            if (layer.textAlign === "center") {
              const totalWidth = line.length * (layer.fontSize || 24) * 0.6 + (line.length - 1) * spacing
              x = layer.x + (layer.width - totalWidth) / 2
            } else if (layer.textAlign === "right") {
              const totalWidth = line.length * (layer.fontSize || 24) * 0.6 + (line.length - 1) * spacing
              x = layer.x + layer.width - totalWidth
            }

            for (let i = 0; i < line.length; i++) {
              ctx.fillText(line[i], x, y)
              x += ctx.measureText(line[i]).width + spacing
            }
          } else {
            ctx.fillText(line, layer.x, y)
          }

          // Add text decoration
          if (layer.textDecoration === "underline" || layer.textDecoration === "line-through") {
            const textWidth = ctx.measureText(line).width
            const decorationY =
              layer.textDecoration === "underline" ? y + (layer.fontSize || 24) : y + (layer.fontSize || 24) / 2

            ctx.beginPath()
            ctx.moveTo(layer.x, decorationY)
            ctx.lineTo(layer.x + textWidth, decorationY)
            ctx.strokeStyle = layer.fontColor || "#FFFFFF"
            ctx.lineWidth = Math.max(1, (layer.fontSize || 24) / 20)
            ctx.stroke()
          }
        })
      }
      ctx.restore()
    }

    const dataUrl = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = "mode-design-composition.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePresetChange = (presetName: string) => {
    const preset = CANVAS_PRESETS.find((p) => p.name === presetName)
    if (preset) {
      setCanvasWidth(preset.width)
      setCanvasHeight(preset.height)
      setSelectedPreset(presetName)

      // Update offscreen canvas
      if (offscreenCanvasRef.current) {
        offscreenCanvasRef.current.width = preset.width
        offscreenCanvasRef.current.height = preset.height
      }
    }
  }

  const handleCustomDimensions = (width: number, height: number) => {
    setCanvasWidth(width)
    setCanvasHeight(height)
    setSelectedPreset("Custom")

    // Update offscreen canvas
    if (offscreenCanvasRef.current) {
      offscreenCanvasRef.current.width = width
      offscreenCanvasRef.current.height = height
    }
  }

  const selectedLayer = layers.find((l) => selectedLayerIds.includes(l.id))

  const handleCropLayer = (cropData: { x: number; y: number; width: number; height: number }) => {
    if (!cropLayerId) return

    const layer = layers.find((l) => l.id === cropLayerId)
    if (!layer) return

    // Apply crop by updating layer dimensions and position
    const newWidth = layer.width * cropData.width
    const newHeight = layer.height * cropData.height
    const newX = layer.x + layer.width * cropData.x
    const newY = layer.y + layer.height * cropData.y

    handleUpdateLayer(
      cropLayerId,
      {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      },
      true,
    )

    setIsCropMode(false)
    setCropLayerId(null)
    setActiveTool("select")
  }

  const handleCancelCrop = () => {
    setIsCropMode(false)
    setCropLayerId(null)
    setActiveTool("select")
  }

  // CORREÇÃO: Tipagem mais segura para `shapeType`.
  const handleShapeSelect = (shapeType: string) => {
    const shapeColors: Record<string, string> = {
      rectangle: "bg-blue-500/70",
      circle: "bg-green-500/70",
      triangle: "bg-yellow-500/70",
      star: "bg-purple-500/70",
      heart: "bg-pink-500/70",
      hexagon: "bg-cyan-500/70",
    }

    addLayer("image", {
      name: shapeType.charAt(0).toUpperCase() + shapeType.slice(1),
      color: shapeColors[shapeType] || "bg-gray-500/70",
      imageUrl: `/placeholder.svg?height=100&width=100&query=${shapeType}+shape`,
      width: 100,
      height: 100,
    })

    setIsShapeSelectorOpen(false)
    setActiveTool("select")
  }

  const handleCreateFrame = () => {
    addLayer("image", {
      name: "Custom Frame",
      color: "bg-gray-500/30",
      imageUrl: `/placeholder.svg?height=${frameHeight}&width=${frameWidth}&query=frame+border`,
      width: frameWidth,
      height: frameHeight,
    })

    setIsFrameDialogOpen(false)
    setActiveTool("select")
  }

  // Função para ocultar todas as camadas
  const handleHideAllLayers = () => {
    setLayers((prev) => prev.map((l) => ({ ...l, visible: false })), true)
  }

  // Função para resetar todas as propriedades das camadas selecionadas
  const handleResetLayers = () => {
    if (selectedLayerIds.length === 0) return

    selectedLayerIds.forEach((id) => {
      handleUpdateLayer(
        id,
        {
          opacity: 1,
          rotation: 0,
          x: 20,
          y: 20,
        },
        true,
      )
    })
  }

  return (
    <div className="min-h-screen pt-20 bg-[#1a1a1a] flex overflow-hidden">
      {/* Floating Header */}
      <FloatingHeader
        isPlayground={true}
        onNew={() => console.log("New project")}
        onSave={() => console.log("Save project")}
        onExport={handleComposeAndDownload}
        onImport={handleImportClick}
        onDuplicate={handleDuplicateSelected}
        onGroup={handleGroupSelected}
        onCreateMask={handleCreateMask}
        onCanvasSettings={() => setIsCanvasSettingsOpen(true)}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        selectedCount={selectedLayerIds.length}
        zoom={zoom}
        onZoomIn={() => setZoom((z) => Math.min(z * 1.2, 5))}
        onZoomOut={() => setZoom((z) => Math.max(z / 1.2, 0.2))}
        showGrid={showGrid}
        snapToGrid={snapToGrid}
      />

      {/* Left Sidebar - Tools & Project */}
      <div className="w-72 lg:w-72 md:w-64 sm:w-56 bg-[#1a1a1a] border-r border-white/10 flex flex-col">
        {/* Project Settings */}
        <div className="p-4 border-b border-white/10">
          <Button
            variant="ghost"
            onClick={() => setIsCanvasSettingsOpen(true)}
            className="w-full justify-between text-slate-300 hover:text-white hover:bg-white/10"
          >
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Project Settings
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Gallery */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Gallery</h3>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsGalleryOpen(true)}
            className="w-full bg-black/20 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Browse Gallery
          </Button>
        </div>

        {/* Tools */}
        <div className="p-4 border-b border-white/10">
          <div className="text-sm text-slate-400 mb-3">Tools</div>
          <div className="grid grid-cols-5 gap-1">
            <TooltipProvider>
              {leftSidebarTools.map((tool) => (
                <Tooltip key={tool.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setActiveTool(tool.id)
                        if (tool.id === "text") {
                          addLayer("text")
                        } else if (tool.id === "crop") {
                          if (selectedLayerIds.length === 1) {
                            const layer = layers.find((l) => l.id === selectedLayerIds[0])
                            if (layer && layer.type === "image") {
                              setIsCropMode(true)
                              setCropLayerId(layer.id)
                            }
                          }
                        } else if (tool.id === "shape") {
                          setIsShapeSelectorOpen(true)
                        } else if (tool.id === "frame") {
                          setIsFrameDialogOpen(true)
                        } else {
                          setIsCropMode(false)
                          setCropLayerId(null)
                        }
                      }}
                      className={cn(
                        "h-10 w-10 text-slate-400 hover:text-white hover:bg-white/10 transition-all",
                        activeTool === tool.id ? "bg-white/10 text-white" : "",
                      )}
                    >
                      {tool.icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{tool.label}</TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-white/10 space-y-3">
          <div className="text-sm text-slate-400 mb-2">Quick Actions</div>
          <Button
            variant="outline"
            onClick={handleImportClick}
            className="w-full bg-black/20 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white justify-start"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Image
          </Button>
          <Button
            variant="outline"
            onClick={() => addLayer("image")}
            className="w-full bg-black/20 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white justify-start"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add Image Layer
          </Button>
          <Button
            variant="outline"
            onClick={() => addLayer("text")}
            className="w-full bg-black/20 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white justify-start"
          >
            <Type className="h-4 w-4 mr-2" />
            Add Text Layer
          </Button>
        </div>

        {/* AI Image Generation */}
        <div className="flex-1 p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              AI Image Generation
            </h3>
            <p className="text-slate-400 text-sm">Create stunning images from text descriptions</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-slate-300 text-sm font-medium mb-2 block">Describe your vision</Label>
              <Textarea
                placeholder="A majestic sunset over crystal clear waters with golden reflections..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="min-h-[80px] bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500 resize-none"
              />
            </div>

            <Button
              onClick={handleGenerateWithAI}
              disabled={!aiPrompt.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium py-3"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Image
            </Button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 bg-[#0f0f0f] relative overflow-hidden">
          {/* Canvas */}
          <div
            className="w-full h-full flex items-center justify-center"
            onClick={(e) => e.target === e.currentTarget && setSelectedLayerIds([])}
          >
            {layers.length === 0 ? (
              // Empty state
              <div className="text-center">
                <div className="w-64 h-64 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center mb-4">
                  <ImageIcon className="h-12 w-12 text-slate-500 mb-4" />
                  <p className="text-slate-400 mb-2">Drop your image here</p>
                  <p className="text-slate-500 text-sm mb-4">or</p>
                  <Button
                    variant="outline"
                    onClick={handleImportClick}
                    className="bg-black/20 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                  >
                    Browse files
                  </Button>
                  <p className="text-slate-500 text-xs mt-4">JPEG, PNG, GIF, WebP up to 50MB</p>
                </div>
                <Button variant="ghost" onClick={() => addLayer("image")} className="text-slate-400 hover:text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Start with Blank Canvas
                </Button>
              </div>
            ) : (
              <div
                ref={canvasAreaRef}
                className="relative transition-transform duration-100 ease-linear"
                style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
              >
                <div className="relative bg-slate-800" style={{ width: canvasWidth, height: canvasHeight }}>
                  {/* Grid Overlay */}
                  <GridOverlay
                    width={canvasWidth}
                    height={canvasHeight}
                    gridSize={gridSize}
                    showGrid={showGrid}
                    gridOpacity={gridOpacity}
                  />

                  {/* SVG definitions for masks */}
                  <svg className="absolute w-0 h-0">
                    <defs>
                      {layers
                        .filter((l) => l.isMask)
                        .map((mask) => (
                          <clipPath key={`mask-def-${mask.id}`} id={`mask-clip-${mask.id}`}>
                            <rect
                              x={mask.x}
                              y={mask.y}
                              width={mask.width}
                              height={mask.height}
                              transform={`rotate(${mask.rotation || 0} ${mask.x + mask.width / 2} ${mask.y + mask.height / 2})`}
                            />
                          </clipPath>
                        ))}
                    </defs>
                  </svg>

                  {/* Layers */}
                  {layers
                    .filter((l) => l.visible)
                    .sort((a, b) => a.zIndex - b.zIndex)
                    .map((layer) => (
                      <DraggableResizableLayer
                        key={layer.id}
                        layer={layer}
                        isSelected={selectedLayerIds.includes(layer.id)}
                        zoom={zoom}
                        onSelect={(id, multiSelect) => handleSelectLayer(id, multiSelect)}
                        onUpdate={(id, updates) => handleUpdateLayer(id, updates, false)}
                        onUpdateComplete={() => setLayers(layers, true)}
                        canvasBounds={canvasAreaRef.current?.getBoundingClientRect() ?? null}
                        snapToGrid={snapToGrid}
                        gridSize={gridSize}
                      />
                    ))}

                  {/* Group Renderers */}
                  {layers
                    .filter((l): l is Layer & { type: "group" } => l.type === "group" && l.visible)
                    .map((group) => {
                      const bounds = getGroupBounds(group.id)
                      const children = layers.filter((l) => group.children?.includes(l.id))
                      return (
                        <GroupLayerRenderer
                          key={group.id}
                          group={group}
                          children={children}
                          isSelected={selectedLayerIds.includes(group.id)}
                          zoom={zoom}
                          onSelect={handleSelectLayer}
                          bounds={bounds}
                        />
                      )
                    })}

                  {/* Crop Overlay */}
                  {isCropMode && cropLayerId && (
                    <CropOverlay
                      layer={layers.find((l) => l.id === cropLayerId)!}
                      zoom={zoom}
                      onCrop={handleCropLayer}
                      onCancel={handleCancelCrop}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Canvas Info */}
          {layers.length > 0 && (
            <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm flex items-center gap-4">
              <span>
                {canvasWidth} × {canvasHeight}px
              </span>
              {showGrid && (
                <span className="text-purple-300 flex items-center gap-1">
                  <Grid3X3 className="h-3 w-3" />
                  {gridSize}px
                </span>
              )}
              {snapToGrid && (
                <span className="text-green-300 flex items-center gap-1">
                  <Magnet className="h-3 w-3" />
                </span>
              )}
            </div>
          )}

          {/* Selection Info */}
          {selectedLayerIds.length > 0 && (
            <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm">
              {selectedLayerIds.length} layer{selectedLayerIds.length > 1 ? "s" : ""} selected
            </div>
          )}

          {/* Alignment Toolbar */}
          {selectedLayerIds.length > 1 && (
            <AlignmentToolbar
              selectedCount={selectedLayerIds.length}
              onAlign={handleAlignLayers}
              onDistribute={handleDistributeLayers}
              className="absolute top-4 right-4"
            />
          )}
        </div>
      </div>

      {/* Right Sidebar - Agora mais compacto */}
      <div className="w-80 bg-[#1a1a1a] border-l border-white/10 flex flex-col">
        {/* Right Panel Tabs - Apenas Layers e Adjust */}
        <div className="flex border-b border-white/10">
          <Button
            variant="ghost"
            onClick={() => setRightPanelTab("layers")}
            className={cn(
              "flex-1 rounded-none border-b-2 border-transparent text-slate-400 hover:text-white",
              rightPanelTab === "layers" ? "border-purple-500 text-white bg-purple-500/10" : "",
            )}
          >
            <Layers3 className="h-4 w-4 mr-2" />
            Layers
          </Button>
          <Button
            variant="ghost"
            onClick={() => setRightPanelTab("properties")}
            className={cn(
              "flex-1 rounded-none border-b-2 border-transparent text-slate-400 hover:text-white",
              rightPanelTab === "properties" ? "border-purple-500 text-white bg-purple-500/10" : "",
            )}
          >
            <Settings2 className="h-4 w-4 mr-2" />
            Adjust
          </Button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-hidden">
          {rightPanelTab === "layers" && (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Layers</h3>
                <div className="flex gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addLayer("image")}
                          className="text-slate-300 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add Image</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addLayer("text")}
                          className="text-slate-300 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                        >
                          <Type className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add Text</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-1">
                  {flattenHierarchy(hierarchy).map((hierarchyItem) => (
                    <LayerHierarchyItem
                      key={hierarchyItem.layer.id}
                      hierarchy={hierarchyItem}
                      isSelected={selectedLayerIds.includes(hierarchyItem.layer.id)}
                      onSelect={handleSelectLayer}
                      onToggleVisibility={handleToggleLayerVisibility}
                      onToggleLock={handleToggleLayerLock}
                      onDelete={handleDeleteLayer}
                      onToggleExpanded={handleToggleGroupExpanded}
                      onUngroup={(id) => {
                        setSelectedLayerIds([id])
                        handleUngroupSelected()
                      }}
                      onReleaseMask={handleReleaseMask}
                      draggingLayerId={draggingLayerId}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                  {layers.length === 0 && <p className="text-sm text-slate-500 text-center py-8">No layers yet.</p>}
                </div>
              </ScrollArea>
            </div>
          )}

          {rightPanelTab === "properties" && (
            <ScrollArea className="h-full">
              <div className="p-4 space-y-6">
                {selectedLayer ? (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Adjust Properties
                        {selectedLayerIds.length > 1 && (
                          <span className="text-sm text-slate-400 ml-2">({selectedLayerIds.length} selected)</span>
                        )}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* Layer Name */}
                      <div>
                        <Label htmlFor="layerName" className="text-sm text-slate-300 mb-2 block">
                          Layer Name
                        </Label>
                        <Input
                          id="layerName"
                          className="bg-black/20 border-white/10 text-white"
                          value={selectedLayer.name}
                          onChange={(e) => handleUpdateLayer(selectedLayer.id, { name: e.target.value }, true)}
                          disabled={selectedLayer.locked || selectedLayerIds.length > 1}
                          placeholder={selectedLayerIds.length > 1 ? "Multiple layers selected" : ""}
                        />
                      </div>

                      {/* Opacity */}
                      <div>
                        <Label className="text-sm text-slate-300 mb-2 block">Opacity</Label>
                        <Slider
                          value={[selectedLayer.opacity * 100]}
                          onValueChange={([value]) => {
                            selectedLayerIds.forEach((id) => {
                              handleUpdateLayer(id, { opacity: value / 100 }, false)
                            })
                          }}
                          onValueCommit={() => setLayers(layers, true)}
                          max={100}
                          step={1}
                          disabled={selectedLayer.locked}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                          <span>0%</span>
                          <span>{Math.round(selectedLayer.opacity * 100)}%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      {/* Rotation */}
                      <div>
                        <Label className="text-sm text-slate-300 mb-2 block">Rotation</Label>
                        <Input
                          type="number"
                          className="bg-black/20 border-white/10 text-white"
                          value={selectedLayer.rotation || 0}
                          onChange={(e) => {
                            const rotation = Number.parseFloat(e.target.value) || 0
                            selectedLayerIds.forEach((id) => {
                              handleUpdateLayer(id, { rotation }, true)
                            })
                          }}
                          disabled={selectedLayer.locked}
                          placeholder="0°"
                        />
                      </div>

                      {/* Text Properties */}
                      {selectedLayer.type === "text" && selectedLayerIds.length === 1 && (
                        <>
                          <Separator className="bg-white/10" />
                          <div>
                            <Label htmlFor="textContent" className="text-sm text-slate-300 mb-2 block">
                              Text Content
                            </Label>
                            <Textarea
                              id="textContent"
                              className="bg-black/20 border-white/10 text-white min-h-[80px] resize-none"
                              value={selectedLayer.content || ""}
                              onChange={(e) => handleUpdateLayer(selectedLayer.id, { content: e.target.value }, true)}
                              disabled={selectedLayer.locked}
                              placeholder="Enter your text here..."
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="fontFamily" className="text-sm text-slate-300 mb-2 block">
                                Font Family
                              </Label>
                              <Select
                                value={selectedLayer.fontFamily || "Inter"}
                                onValueChange={(value) =>
                                  handleUpdateLayer(selectedLayer.id, { fontFamily: value }, true)
                                }
                                disabled={selectedLayer.locked}
                              >
                                <SelectTrigger className="bg-black/20 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-48">
                                  {fontOptions.map((font) => (
                                    <SelectItem key={font.value} value={font.value} className="focus:bg-purple-500/30">
                                      <span style={{ fontFamily: font.value }}>{font.label}</span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="fontSize" className="text-sm text-slate-300 mb-2 block">
                                Font Size
                              </Label>
                              <Input
                                id="fontSize"
                                type="number"
                                className="bg-black/20 border-white/10 text-white"
                                value={selectedLayer.fontSize || 24}
                                onChange={(e) =>
                                  handleUpdateLayer(
                                    selectedLayer.id,
                                    { fontSize: Number.parseInt(e.target.value) || 24 },
                                    true,
                                  )
                                }
                                disabled={selectedLayer.locked}
                                min="8"
                                max="200"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="fontWeight" className="text-sm text-slate-300 mb-2 block">
                                Font Weight
                              </Label>
                              <Select
                                value={selectedLayer.fontWeight || "normal"}
                                onValueChange={(value) =>
                                  handleUpdateLayer(selectedLayer.id, { fontWeight: value as any }, true)
                                }
                                disabled={selectedLayer.locked}
                              >
                                <SelectTrigger className="bg-black/20 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                  {fontWeightOptions.map((weight) => (
                                    <SelectItem
                                      key={weight.value}
                                      value={weight.value}
                                      className="focus:bg-purple-500/30"
                                    >
                                      {weight.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="fontColor" className="text-sm text-slate-300 mb-2 block">
                                Font Color
                              </Label>
                              <Input
                                id="fontColor"
                                type="color"
                                className="bg-black/20 border-white/10 text-white p-1 h-10 w-full"
                                value={selectedLayer.fontColor || "#FFFFFF"}
                                onChange={(e) =>
                                  handleUpdateLayer(selectedLayer.id, { fontColor: e.target.value }, true)
                                }
                                disabled={selectedLayer.locked}
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm text-slate-300 mb-2 block">Text Style</Label>
                            <div className="flex gap-2">
                              <Button
                                variant={selectedLayer.fontStyle === "italic" ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                  "flex-1 text-xs",
                                  selectedLayer.fontStyle === "italic"
                                    ? "bg-purple-600 text-white"
                                    : "bg-black/20 border-white/10 text-slate-300 hover:bg-white/10",
                                )}
                                onClick={() =>
                                  handleUpdateLayer(
                                    selectedLayer.id,
                                    { fontStyle: selectedLayer.fontStyle === "italic" ? "normal" : "italic" },
                                    true,
                                  )
                                }
                                disabled={selectedLayer.locked}
                              >
                                <em>Italic</em>
                              </Button>
                              <Button
                                variant={selectedLayer.textDecoration === "underline" ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                  "flex-1 text-xs",
                                  selectedLayer.textDecoration === "underline"
                                    ? "bg-purple-600 text-white"
                                    : "bg-black/20 border-white/10 text-slate-300 hover:bg-white/10",
                                )}
                                onClick={() =>
                                  handleUpdateLayer(
                                    selectedLayer.id,
                                    {
                                      textDecoration:
                                        selectedLayer.textDecoration === "underline" ? "none" : "underline",
                                    },
                                    true,
                                  )
                                }
                                disabled={selectedLayer.locked}
                              >
                                <u>Underline</u>
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm text-slate-300 mb-2 block">Text Alignment</Label>
                            <ToggleGroup
                              type="single"
                              value={selectedLayer.textAlign || "left"}
                              onValueChange={(value) =>
                                value && handleUpdateLayer(selectedLayer.id, { textAlign: value as any }, true)
                              }
                              className="grid grid-cols-4 gap-1"
                              disabled={selectedLayer.locked}
                            >
                              <ToggleGroupItem
                                value="left"
                                className="bg-black/20 border-white/10 text-slate-300 data-[state=on]:bg-purple-600 data-[state=on]:text-white hover:bg-white/10"
                              >
                                <AlignLeft className="h-4 w-4" />
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="center"
                                className="bg-black/20 border-white/10 text-slate-300 data-[state=on]:bg-purple-600 data-[state=on]:text-white hover:bg-white/10"
                              >
                                <AlignCenter className="h-4 w-4" />
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="right"
                                className="bg-black/20 border-white/10 text-slate-300 data-[state=on]:bg-purple-600 data-[state=on]:text-white hover:bg-white/10"
                              >
                                <AlignRight className="h-4 w-4" />
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="justify"
                                className="bg-black/20 border-white/10 text-slate-300 data-[state=on]:bg-purple-600 data-[state=on]:text-white hover:bg-white/10"
                              >
                                <AlignJustify className="h-4 w-4" />
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </div>
                        </>
                      )}

                      {/* Grid Controls */}
                      <Separator className="bg-white/10" />
                      <div>
                        <Label className="text-sm text-slate-300 mb-3 block">Grid Settings</Label>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm text-slate-400">Show Grid</Label>
                            <Switch
                              checked={showGrid}
                              onCheckedChange={setShowGrid}
                              className="data-[state=checked]:bg-purple-600"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm text-slate-400">Snap to Grid</Label>
                            <Switch
                              checked={snapToGrid}
                              onCheckedChange={setSnapToGrid}
                              className="data-[state=checked]:bg-purple-600"
                            />
                          </div>
                          <div>
                            <Label className="text-sm text-slate-400 mb-2 block">Grid Size</Label>
                            <Slider
                              value={[gridSize]}
                              onValueChange={([value]) => setGridSize(value)}
                              min={10}
                              max={100}
                              step={5}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                              <span>10px</span>
                              <span>{gridSize}px</span>
                              <span>100px</span>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm text-slate-400 mb-2 block">Grid Opacity</Label>
                            <Slider
                              value={[gridOpacity * 100]}
                              onValueChange={([value]) => setGridOpacity(value / 100)}
                              min={5}
                              max={50}
                              step={5}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                              <span>5%</span>
                              <span>{Math.round(gridOpacity * 100)}%</span>
                              <span>50%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <Separator className="bg-white/10" />
                      <div>
                        <Label className="text-sm text-slate-300 mb-3 block">Quick Actions</Label>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleResetLayers}
                            disabled={selectedLayerIds.length === 0}
                            className="w-full bg-black/20 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset Properties
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleHideAllLayers}
                            className="w-full bg-black/20 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                          >
                            <EyeOff className="mr-2 h-4 w-4" />
                            Hide All Layers
                          </Button>
                        </div>
                      </div>

                      {/* Layer Actions */}
                      <Separator className="bg-white/10" />
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            selectedLayerIds.forEach((id) => {
                              handleToggleLayerVisibility(id)
                            })
                          }}
                          className="w-full bg-black/20 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                        >
                          {selectedLayer.visible ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Hide Layer{selectedLayerIds.length > 1 ? "s" : ""}
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Show Layer{selectedLayerIds.length > 1 ? "s" : ""}
                            </>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            selectedLayerIds.forEach((id) => {
                              handleToggleLayerLock(id)
                            })
                          }}
                          className={cn(
                            "w-full bg-black/20 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white",
                            selectedLayer.locked ? "border-orange-500/50 text-orange-300" : "",
                          )}
                        >
                          {selectedLayer.locked ? (
                            <>
                              <Unlock className="mr-2 h-4 w-4" />
                              Unlock Layer{selectedLayerIds.length > 1 ? "s" : ""}
                            </>
                          ) : (
                            <>
                              <Lock className="mr-2 h-4 w-4" />
                              Lock Layer{selectedLayerIds.length > 1 ? "s" : ""}
                            </>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDeleteSelected}
                          disabled={selectedLayer.locked}
                          className="w-full bg-black/20 border-white/10 text-slate-300 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 disabled:opacity-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Layer{selectedLayerIds.length > 1 ? "s" : ""}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Palette className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400 mb-4">Select a layer to adjust its properties</p>

                    {/* Grid Controls sempre visíveis */}
                    <div className="text-left">
                      <Separator className="bg-white/10 mb-4" />
                      <div>
                        <Label className="text-sm text-slate-300 mb-3 block">Grid Settings</Label>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm text-slate-400">Show Grid</Label>
                            <Switch
                              checked={showGrid}
                              onCheckedChange={setShowGrid}
                              className="data-[state=checked]:bg-purple-600"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm text-slate-400">Snap to Grid</Label>
                            <Switch
                              checked={snapToGrid}
                              onCheckedChange={setSnapToGrid}
                              className="data-[state=checked]:bg-purple-600"
                            />
                          </div>
                          <div>
                            <Label className="text-sm text-slate-400 mb-2 block">Grid Size</Label>
                            <Slider
                              value={[gridSize]}
                              onValueChange={([value]) => setGridSize(value)}
                              min={10}
                              max={100}
                              step={5}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                              <span>10px</span>
                              <span>{gridSize}px</span>
                              <span>100px</span>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm text-slate-400 mb-2 block">Grid Opacity</Label>
                            <Slider
                              value={[gridOpacity * 100]}
                              onValueChange={([value]) => setGridOpacity(value / 100)}
                              min={5}
                              max={50}
                              step={5}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                              <span>5%</span>
                              <span>{Math.round(gridOpacity * 100)}%</span>
                              <span>50%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-white/10 my-4" />
                      <div>
                        <Label className="text-sm text-slate-300 mb-3 block">Quick Actions</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleHideAllLayers}
                          className="w-full bg-black/20 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                        >
                          <EyeOff className="mr-2 h-4 w-4" />
                          Hide All Layers
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  )
}

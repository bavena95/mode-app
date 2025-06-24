"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Upload,
  Video,
  ImageIcon,
  Mic,
  Music,
  Wand2,
  Sparkles,
  FolderOpen,
  Plus,
  Trash2,
  Copy,
  Scissors,
  Settings,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronRight,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FloatingHeader } from "@/components/floating-header"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

// Types for video editing
interface TimelineItem {
  id: string
  type: "video" | "audio" | "voiceover" | "music"
  name: string
  duration: number
  startTime: number
  endTime: number
  url?: string
  volume: number
  visible: boolean
  locked: boolean
  color: string
}

interface Project {
  id: string
  name: string
  duration: number
  fps: number
  resolution: { width: number; height: number }
  items: TimelineItem[]
}

const initialProject: Project = {
  id: "project-1",
  name: "Untitled Project",
  duration: 30,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  items: [
    {
      id: "video-1",
      type: "video",
      name: "Main Video",
      duration: 15,
      startTime: 0,
      endTime: 15,
      url: "/placeholder.svg?height=200&width=300",
      volume: 100,
      visible: true,
      locked: false,
      color: "bg-blue-500",
    },
    {
      id: "audio-1",
      type: "music",
      name: "Background Music",
      duration: 30,
      startTime: 0,
      endTime: 30,
      volume: 60,
      visible: true,
      locked: false,
      color: "bg-green-500",
    },
  ],
}

const resolutionPresets = [
  { name: "HD (1280x720)", width: 1280, height: 720 },
  { name: "Full HD (1920x1080)", width: 1920, height: 1080 },
  { name: "4K (3840x2160)", width: 3840, height: 2160 },
  { name: "Instagram Story (1080x1920)", width: 1080, height: 1920 },
  { name: "Instagram Post (1080x1080)", width: 1080, height: 1080 },
  { name: "YouTube Shorts (1080x1920)", width: 1080, height: 1920 },
]

export default function VideoStudioPage() {
  const [project, setProject] = useState<Project>(initialProject)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [zoom, setZoom] = useState(1)
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)

  // Modals
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [isProjectSettingsOpen, setIsProjectSettingsOpen] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  // Generation states
  const [generateType, setGenerateType] = useState<"video" | "voiceover" | "music">("video")
  const [generatePrompt, setGeneratePrompt] = useState("")
  const [generateAudio, setGenerateAudio] = useState(true)
  const [selectedModel, setSelectedModel] = useState("veo-3")

  // File inputs
  const videoInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  // Timeline
  const timelineRef = useRef<HTMLDivElement>(null)
  const playheadRef = useRef<HTMLDivElement>(null)

  // Mock gallery items
  const galleryItems = [
    {
      id: "1",
      type: "video",
      name: "AI Generated Landscape",
      thumbnail: "/placeholder.svg?height=100&width=150",
      duration: 10,
    },
    {
      id: "2",
      type: "video",
      name: "Product Demo",
      thumbnail: "/placeholder.svg?height=100&width=150",
      duration: 8,
    },
    {
      id: "3",
      type: "video",
      name: "Abstract Animation",
      thumbnail: "/placeholder.svg?height=100&width=150",
      duration: 12,
    },
  ]

  // Timeline calculations
  const timelineWidth = 800
  const pixelsPerSecond = (timelineWidth * zoom) / project.duration
  const playheadPosition = (currentTime / project.duration) * timelineWidth

  // Playback controls
  const handlePlay = () => {
    if (currentTime >= project.duration) {
      setCurrentTime(0)
    }
    setIsPlaying(!isPlaying)
  }

  const handleStop = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const handleSeek = (time: number) => {
    const newTime = Math.max(0, Math.min(time, project.duration))
    setCurrentTime(newTime)
    if (isPlaying) {
      setIsPlaying(false)
    }
  }

  // File imports
  const handleVideoImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const newItem: TimelineItem = {
        id: `video-${Date.now()}`,
        type: "video",
        name: file.name,
        duration: 10, // Would be detected from actual file
        startTime: currentTime,
        endTime: currentTime + 10,
        url: URL.createObjectURL(file),
        volume: 100,
        visible: true,
        locked: false,
        color: "bg-blue-500",
      }
      setProject((prev) => ({
        ...prev,
        items: [...prev.items, newItem],
      }))
      e.target.value = ""
    }
  }

  const handleAudioImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const newItem: TimelineItem = {
        id: `audio-${Date.now()}`,
        type: "music",
        name: file.name,
        duration: 15, // Would be detected from actual file
        startTime: currentTime,
        endTime: currentTime + 15,
        url: URL.createObjectURL(file),
        volume: 80,
        visible: true,
        locked: false,
        color: "bg-green-500",
      }
      setProject((prev) => ({
        ...prev,
        items: [...prev.items, newItem],
      }))
      e.target.value = ""
    }
  }

  // AI Generation
  const handleGenerate = async () => {
    // Show loading state
    const loadingItem: TimelineItem = {
      id: `${generateType}-loading-${Date.now()}`,
      type: generateType,
      name: `Generating ${generateType}...`,
      duration: generateType === "video" ? 10 : 15,
      startTime: currentTime,
      endTime: currentTime + (generateType === "video" ? 10 : 15),
      url: `/placeholder.svg?height=200&width=300&query=loading`,
      volume: generateType === "video" ? 100 : 80,
      visible: true,
      locked: true,
      color: "bg-yellow-500",
    }

    setProject((prev) => ({
      ...prev,
      items: [...prev.items, loadingItem],
    }))

    // Simulate AI generation delay
    setTimeout(() => {
      const finalItem: TimelineItem = {
        ...loadingItem,
        id: `${generateType}-${Date.now()}`,
        name: `AI ${generateType}: ${generatePrompt.substring(0, 20)}...`,
        url: `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(generatePrompt)}`,
        locked: false,
        color:
          generateType === "video" ? "bg-purple-500" : generateType === "voiceover" ? "bg-orange-500" : "bg-green-500",
      }

      setProject((prev) => ({
        ...prev,
        items: prev.items.map((item) => (item.id === loadingItem.id ? finalItem : item)),
      }))
    }, 3000)

    setIsGenerateModalOpen(false)
    setGeneratePrompt("")
  }

  // Gallery selection
  const handleGallerySelect = (item: any) => {
    const newItem: TimelineItem = {
      id: `gallery-${Date.now()}`,
      type: "video",
      name: item.name,
      duration: item.duration,
      startTime: currentTime,
      endTime: currentTime + item.duration,
      url: item.thumbnail,
      volume: 100,
      visible: true,
      locked: false,
      color: "bg-cyan-500",
    }

    setProject((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }))

    setIsGalleryOpen(false)
  }

  // Item management
  const handleDeleteItem = (id: string) => {
    setProject((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }))
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id))
  }

  const handleToggleItemVisibility = (id: string) => {
    setProject((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item)),
    }))
  }

  const handleToggleItemLock = (id: string) => {
    setProject((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, locked: !item.locked } : item)),
    }))
  }

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const frames = Math.floor((seconds % 1) * project.fps)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${frames.toString().padStart(2, "0")}`
  }

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const time = ((e.clientX - rect.left) / timelineWidth) * project.duration
    handleSeek(time)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          const newTime = prevTime + 0.1
          if (newTime >= project.duration) {
            setIsPlaying(false)
            return project.duration
          }
          return newTime
        })
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, project.duration])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key) {
        case " ":
          e.preventDefault()
          handlePlay()
          break
        case "Delete":
        case "Backspace":
          if (selectedItems.length > 0) {
            selectedItems.forEach(handleDeleteItem)
          }
          break
        case "Escape":
          setSelectedItems([])
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isPlaying, selectedItems])

  return (
    <div className="min-h-screen pt-20 bg-[#1a1a1a] flex overflow-hidden">
      {/* Floating Header */}
      <FloatingHeader
        isPlayground={true}
        onNew={() => console.log("New video project")}
        onSave={() => console.log("Save video project")}
        onExport={() => console.log("Export video")}
        onImport={() => videoInputRef.current?.click()}
        onDuplicate={() => console.log("Duplicate")}
        onGroup={() => console.log("Group")}
        onCreateMask={() => console.log("Create mask")}
        onCanvasSettings={() => setIsProjectSettingsOpen(true)}
        onUndo={() => console.log("Undo")}
        onRedo={() => console.log("Redo")}
        canUndo={false}
        canRedo={false}
        selectedCount={selectedItems.length}
        zoom={zoom}
        onZoomIn={() => setZoom((z) => Math.min(z * 1.2, 3))}
        onZoomOut={() => setZoom((z) => Math.max(z / 1.2, 0.5))}
        showGrid={false}
        snapToGrid={false}
      />

      {/* Left Sidebar */}
      <div className="w-80 bg-[#1a1a1a] border-r border-white/10 flex flex-col">
        {/* Project Settings */}
        <div className="p-4 border-b border-white/10">
          <Button
            variant="ghost"
            onClick={() => setIsProjectSettingsOpen(true)}
            className="w-full justify-between text-slate-300 hover:text-white hover:bg-white/10"
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Project Settings
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Gallery */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium">Gallery</h3>
              <Select defaultValue="video">
                <SelectTrigger className="w-24 h-8 bg-black/20 border-white/10 text-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                </SelectContent>
              </Select>
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

          {/* Quick Actions */}
          <div className="p-4 space-y-3">
            <div className="text-sm text-slate-400 mb-2">Quick Actions</div>
            <Button
              variant="outline"
              onClick={() => videoInputRef.current?.click()}
              className="w-full bg-black/20 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white justify-start"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Video
            </Button>
            <Button
              variant="outline"
              onClick={() => audioInputRef.current?.click()}
              className="w-full bg-black/20 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white justify-start"
            >
              <Music className="h-4 w-4 mr-2" />
              Import Audio
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsGenerateModalOpen(true)}
              className="w-full bg-gradient-to-r from-purple-600/20 to-pink-500/20 border-purple-500/30 text-purple-300 hover:from-purple-600/30 hover:to-pink-500/30 justify-start"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate with AI
            </Button>
          </div>

          {/* Timeline Items */}
          <div className="flex-1 p-4">
            <div className="text-sm text-slate-400 mb-3">Timeline Items</div>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {project.items.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all",
                      selectedItems.includes(item.id)
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-white/10 bg-black/20 hover:bg-white/5",
                    )}
                    onClick={() => {
                      setSelectedItems((prev) =>
                        prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id],
                      )
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {item.type === "video" && <Video className="h-4 w-4 text-blue-400" />}
                        {item.type === "audio" && <Music className="h-4 w-4 text-green-400" />}
                        {item.type === "voiceover" && <Mic className="h-4 w-4 text-orange-400" />}
                        {item.type === "music" && <Music className="h-4 w-4 text-green-400" />}
                        <span className="text-white text-sm font-medium truncate">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleItemVisibility(item.id)
                          }}
                          className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                        >
                          {item.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleItemLock(item.id)
                          }}
                          className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                        >
                          {item.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{formatTime(item.duration)}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Video Preview */}
        <div className="flex-1 bg-[#0f0f0f] flex items-center justify-center p-8">
          <div className="relative">
            <div
              className="border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center bg-black/20"
              style={{
                width: Math.min(800, project.resolution.width / 2),
                height: Math.min(450, project.resolution.height / 2),
              }}
            >
              {project.items.find((item) => item.type === "video") ? (
                <div className="text-center">
                  <Video className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">Video Preview</p>
                  <p className="text-slate-500 text-sm">
                    {project.resolution.width} × {project.resolution.height}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <Plus className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">Add video to timeline</p>
                  <p className="text-slate-500 text-sm">Import, generate, or select from gallery</p>
                </div>
              )}
            </div>

            {/* Playhead indicator */}
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {formatTime(currentTime)}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[#1a1a1a] border-t border-white/10 p-4">
          <div className="flex items-center justify-between mb-4">
            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSeek(currentTime - 5)}
                className="text-slate-300 hover:text-white hover:bg-white/10"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlay}
                className="text-slate-300 hover:text-white hover:bg-white/10"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStop}
                className="text-slate-300 hover:text-white hover:bg-white/10"
              >
                <Square className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSeek(currentTime + 5)}
                className="text-slate-300 hover:text-white hover:bg-white/10"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Time Display */}
            <div className="text-slate-300 font-mono text-sm">
              {formatTime(currentTime)} / {formatTime(project.duration)}
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className="text-slate-300 hover:text-white hover:bg-white/10"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={([value]) => {
                  setVolume(value)
                  setIsMuted(value === 0)

                  // Apply volume to selected items
                  if (selectedItems.length > 0) {
                    setProject((prev) => ({
                      ...prev,
                      items: prev.items.map((item) =>
                        selectedItems.includes(item.id) ? { ...item, volume: value } : item,
                      ),
                    }))
                  }
                }}
                max={100}
                step={1}
                className="w-20"
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {/* Time Ruler */}
            <div className="relative">
              <div
                ref={timelineRef}
                className="h-8 bg-black/20 rounded border border-white/10 cursor-pointer relative overflow-hidden"
                style={{ width: timelineWidth }}
                onClick={handleTimelineClick}
              >
                {/* Time markers */}
                {Array.from({ length: Math.ceil(project.duration / 5) + 1 }, (_, i) => i * 5).map((time) => (
                  <div
                    key={time}
                    className="absolute top-0 bottom-0 border-l border-white/20"
                    style={{ left: (time / project.duration) * timelineWidth }}
                  >
                    <span className="absolute -top-5 -translate-x-1/2 text-xs text-slate-400">{time}s</span>
                  </div>
                ))}

                {/* Playhead */}
                <div
                  ref={playheadRef}
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                  style={{ left: playheadPosition }}
                >
                  <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
                </div>
              </div>
            </div>

            {/* Timeline Tracks */}
            <div className="space-y-2">
              {["video", "audio", "voiceover", "music"].map((trackType) => {
                const trackItems = project.items.filter((item) => item.type === trackType)
                return (
                  <div key={trackType} className="flex items-center gap-2">
                    <div className="w-20 text-xs text-slate-400 capitalize">{trackType}</div>
                    <div
                      className="flex-1 h-12 bg-black/20 rounded border border-white/10 relative"
                      style={{ width: timelineWidth }}
                    >
                      {trackItems.map((item) => (
                        <div
                          key={item.id}
                          className={cn(
                            "absolute top-1 bottom-1 rounded border-2 cursor-move transition-all group",
                            item.color,
                            selectedItems.includes(item.id)
                              ? "border-white"
                              : "border-transparent hover:border-white/50",
                            !item.visible && "opacity-50",
                          )}
                          style={{
                            left: (item.startTime / project.duration) * timelineWidth,
                            width: ((item.endTime - item.startTime) / project.duration) * timelineWidth,
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedItems([item.id])
                          }}
                          onMouseDown={(e) => {
                            if (item.locked) return

                            const startX = e.clientX
                            const startTime = item.startTime
                            const duration = item.endTime - item.startTime

                            const handleMouseMove = (e: MouseEvent) => {
                              const deltaX = e.clientX - startX
                              const deltaTime = (deltaX / timelineWidth) * project.duration
                              const newStartTime = Math.max(
                                0,
                                Math.min(startTime + deltaTime, project.duration - duration),
                              )

                              setProject((prev) => ({
                                ...prev,
                                items: prev.items.map((i) =>
                                  i.id === item.id
                                    ? { ...i, startTime: newStartTime, endTime: newStartTime + duration }
                                    : i,
                                ),
                              }))
                            }

                            const handleMouseUp = () => {
                              document.removeEventListener("mousemove", handleMouseMove)
                              document.removeEventListener("mouseup", handleMouseUp)
                            }

                            document.addEventListener("mousemove", handleMouseMove)
                            document.addEventListener("mouseup", handleMouseUp)
                          }}
                        >
                          <div className="p-1 text-xs text-white truncate font-medium">{item.name}</div>
                          {/* Resize handles */}
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize opacity-0 group-hover:opacity-100" />
                          <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize opacity-0 group-hover:opacity-100" />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Timeline Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-slate-300 text-sm">Zoom:</Label>
                <Slider
                  value={[zoom]}
                  onValueChange={([value]) => setZoom(value)}
                  min={0.5}
                  max={3}
                  step={0.1}
                  className="w-20"
                />
                <span className="text-slate-400 text-xs">{Math.round(zoom * 100)}%</span>
              </div>

              <div className="flex items-center gap-2">
                {selectedItems.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log("Copy")}
                      className="bg-black/20 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log("Cut")}
                      className="bg-black/20 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                    >
                      <Scissors className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        selectedItems.forEach(handleDeleteItem)
                      }}
                      className="bg-black/20 border-white/10 text-slate-300 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Generate Media */}
      <div className="w-80 bg-[#1a1a1a] border-l border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Generate Media</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsGenerateModalOpen(false)}
              className="text-slate-400 hover:text-white h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Generation Type Tabs */}
          <div className="grid grid-cols-4 gap-1 mb-4">
            {[
              { type: "video", icon: Video, label: "Video" },
              { type: "image", icon: ImageIcon, label: "Image" },
              { type: "voiceover", icon: Mic, label: "Voiceover" },
              { type: "music", icon: Music, label: "Music" },
            ].map(({ type, icon: Icon, label }) => (
              <Button
                key={type}
                variant={generateType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setGenerateType(type as any)}
                className={cn(
                  "flex flex-col items-center gap-1 h-16 text-xs",
                  generateType === type
                    ? "bg-purple-600 text-white"
                    : "bg-black/20 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>

          {/* Model Selection */}
          <div className="mb-4">
            <Label className="text-slate-300 text-sm mb-2 block">Using</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="bg-black/20 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="veo-3">Veo 3</SelectItem>
                <SelectItem value="runway-gen3">Runway Gen-3</SelectItem>
                <SelectItem value="pika-labs">Pika Labs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Prompt Input */}
          <div className="mb-4">
            <Textarea
              placeholder="Imagine..."
              value={generatePrompt}
              onChange={(e) => setGeneratePrompt(e.target.value)}
              className="min-h-[120px] bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500 resize-none"
            />
            <Button variant="ghost" size="sm" className="absolute top-2 right-2 text-purple-400 hover:text-purple-300">
              <Wand2 className="h-4 w-4 mr-1" />
              Enhance Prompt
            </Button>
          </div>

          {/* Generate Audio Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <Label className="text-slate-300 text-sm">Generate Audio</Label>
              <p className="text-xs text-slate-400">
                Enable audio generation for your video. Disabling saves 33% credits.
              </p>
            </div>
            <Switch checked={generateAudio} onCheckedChange={setGenerateAudio} />
          </div>

          {/* Credits Info */}
          <div className="bg-black/20 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Badge variant="outline" className="text-xs">
                💎 121 credits • {selectedModel}
              </Badge>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!generatePrompt.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium py-3"
          >
            Generate
          </Button>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input type="file" ref={videoInputRef} onChange={handleVideoImport} className="hidden" accept="video/*" />
      <input type="file" ref={audioInputRef} onChange={handleAudioImport} className="hidden" accept="audio/*" />

      {/* Project Settings Modal */}
      <Dialog open={isProjectSettingsOpen} onOpenChange={setIsProjectSettingsOpen}>
        <DialogContent className="sm:max-w-[500px] bg-slate-800/80 backdrop-blur-xl border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Settings className="h-6 w-6 text-purple-400" />
              Project Settings
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Configure your video project settings and export options.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div>
              <Label htmlFor="project-name" className="text-slate-300 mb-2 block">
                Project Name
              </Label>
              <Input
                id="project-name"
                value={project.name}
                onChange={(e) => setProject((prev) => ({ ...prev, name: e.target.value }))}
                className="bg-slate-700/50 border-slate-600 focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project-duration" className="text-slate-300 mb-1 block">
                  Duration (seconds)
                </Label>
                <Input
                  id="project-duration"
                  type="number"
                  value={project.duration}
                  onChange={(e) =>
                    setProject((prev) => ({
                      ...prev,
                      duration: Number.parseInt(e.target.value) || 30,
                    }))
                  }
                  className="bg-slate-700/50 border-slate-600 focus:border-purple-500"
                  min="1"
                  max="300"
                />
              </div>
              <div>
                <Label htmlFor="project-fps" className="text-slate-300 mb-1 block">
                  Frame Rate (FPS)
                </Label>
                <Select
                  value={project.fps.toString()}
                  onValueChange={(value) => setProject((prev) => ({ ...prev, fps: Number.parseInt(value) }))}
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 focus:ring-purple-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="24">24 FPS</SelectItem>
                    <SelectItem value="30">30 FPS</SelectItem>
                    <SelectItem value="60">60 FPS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="resolution-preset" className="text-slate-300 mb-2 block">
                Resolution
              </Label>
              <Select
                value={`${project.resolution.width}x${project.resolution.height}`}
                onValueChange={(value) => {
                  const preset = resolutionPresets.find((p) => `${p.width}x${p.height}` === value)
                  if (preset) {
                    setProject((prev) => ({
                      ...prev,
                      resolution: { width: preset.width, height: preset.height },
                    }))
                  }
                }}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 focus:ring-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-64">
                  {resolutionPresets.map((preset) => (
                    <SelectItem
                      key={`${preset.width}x${preset.height}`}
                      value={`${preset.width}x${preset.height}`}
                      className="focus:bg-purple-500/30"
                    >
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-slate-300 hover:bg-slate-700/50 hover:text-white">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="sm:max-w-[600px] bg-slate-800/80 backdrop-blur-xl border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <FolderOpen className="h-6 w-6 text-cyan-400" />
              Mode Design Gallery
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Select videos from your Mode Design gallery to add to the timeline.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-slate-600 rounded-lg p-3 cursor-pointer hover:border-cyan-500 transition-colors"
                  onClick={() => handleGallerySelect(item)}
                >
                  <img
                    src={item.thumbnail || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-20 object-cover rounded mb-2"
                  />
                  <h4 className="text-sm font-medium text-white truncate">{item.name}</h4>
                  <p className="text-xs text-slate-400">{item.duration}s</p>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-slate-300 hover:bg-slate-700/50 hover:text-white">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

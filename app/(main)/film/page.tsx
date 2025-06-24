import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { GlassCard } from "@/components/glass-card"
import { ScissorsIcon, Music2, PlusSquare, Upload, Settings2, Mic2, Text, Clapperboard } from "lucide-react"

// Mock data for timeline clips
const mockClips = [
  { id: "1", name: "Intro Scene", duration: 5, type: "video", color: "bg-purple-500/70" },
  { id: "2", name: "Product Shot", duration: 3, type: "image", color: "bg-sky-500/70" },
  { id: "3", name: "Voiceover Segment", duration: 7, type: "audio", color: "bg-teal-500/70" },
  { id: "4", name: "Outro Animation", duration: 4, type: "video", color: "bg-rose-500/70" },
]

export default function FilmPage() {
  return (
    <>
      <PageHeader
        title="AI Film Studio"
        description="Generate and edit videos with text, images, voice, and music. Effortlessly."
      />
      <div className="container max-w-screen-2xl mx-auto pb-12 px-4 pt-4">
        <div className="flex flex-col gap-4 h-[calc(100vh-200px)]">
          {/* Top Bar: Preview & Main Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Video Preview */}
            <div className="flex-1 bg-slate-800/20 rounded-lg border border-slate-700/50 flex items-center justify-center aspect-video relative">
              <Image
                src="/placeholder.svg?height=360&width=640"
                alt="Video preview"
                fill
                className="object-contain opacity-50"
              />
              <p className="z-10 text-2xl text-muted-foreground">Video Preview</p>
            </div>

            {/* Tools & Assets Panel */}
            <GlassCard className="w-full md:w-80 p-0 flex flex-col">
              <div className="p-4 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-foreground">Tools & Assets</h3>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                  {[
                    { icon: <Clapperboard />, label: "Text-to-Video", action: () => {} },
                    { icon: <Upload />, label: "Upload Media", action: () => {} },
                    { icon: <Mic2 />, label: "Add Voiceover (TTS)", action: () => {} },
                    { icon: <Music2 />, label: "Add Music", action: () => {} },
                    { icon: <Text />, label: "Add Text Overlay", action: () => {} },
                  ].map((tool) => (
                    <Button
                      key={tool.label}
                      variant="outline"
                      className="w-full justify-start gap-2 bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:text-slate-100"
                    >
                      {tool.icon} {tool.label}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-slate-700/50">
                <Button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white">Generate Video</Button>
              </div>
            </GlassCard>
          </div>

          {/* Timeline Editor */}
          <GlassCard className="p-4 h-48 md:h-64 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-foreground">Timeline</h3>
              <div className="flex gap-2">
                <TooltipProvider>
                  {[
                    { icon: <PlusSquare />, label: "Add Track" },
                    { icon: <ScissorsIcon />, label: "Split Clip" },
                    { icon: <Settings2 />, label: "Track Settings" },
                  ].map((tool) => (
                    <Tooltip key={tool.label}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground hover:bg-slate-700/50"
                        >
                          {tool.icon}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-slate-800 text-slate-200 border-slate-700">
                        <p>{tool.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            </div>
            <ScrollArea className="flex-1 bg-slate-800/20 p-2 rounded border border-slate-700/50">
              <div className="h-full flex flex-col gap-1">
                {/* Mock tracks and clips */}
                <div className="h-12 bg-slate-700/30 rounded flex items-center px-2 text-sm text-muted-foreground">
                  Video Track 1
                </div>
                <div className="relative h-12 flex items-center gap-px">
                  {mockClips
                    .filter((c) => c.type === "video" || c.type === "image")
                    .map((clip) => (
                      <div
                        key={clip.id}
                        style={{ width: `${clip.duration * 15}%` }}
                        className={`h-10 rounded ${clip.color} flex items-center justify-center text-xs text-white/80 p-1 overflow-hidden cursor-pointer hover:opacity-80`}
                      >
                        {clip.name}
                      </div>
                    ))}
                </div>
                <div className="h-12 bg-slate-700/30 rounded flex items-center px-2 text-sm text-muted-foreground mt-1">
                  Audio Track 1
                </div>
                <div className="relative h-12 flex items-center gap-px">
                  {mockClips
                    .filter((c) => c.type === "audio")
                    .map((clip) => (
                      <div
                        key={clip.id}
                        style={{ width: `${clip.duration * 15}%` }}
                        className={`h-10 rounded ${clip.color} flex items-center justify-center text-xs text-white/80 p-1 overflow-hidden cursor-pointer hover:opacity-80`}
                      >
                        {clip.name}
                      </div>
                    ))}
                </div>
              </div>
            </ScrollArea>
          </GlassCard>
        </div>
      </div>
    </>
  )
}

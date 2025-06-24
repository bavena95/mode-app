import Image from "next/image"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { GlassCard } from "@/components/glass-card"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, Filter, ArrowRight } from "lucide-react"

interface ArtistCreation {
  id: string
  title: string
  imageUrl: string
  artistName: string
  artistAvatarUrl: string
  likes: number
  promptSnippet: string
}

const creations: ArtistCreation[] = [
  {
    id: "1",
    title: "Cosmic Dreamscape",
    imageUrl: "/placeholder.svg?height=400&width=400",
    artistName: "ArtifyAI",
    artistAvatarUrl: "/placeholder.svg?height=40&width=40",
    likes: 1200,
    promptSnippet: "A surreal landscape of floating islands under a nebula sky, hyperrealistic, octane render...",
  },
  {
    id: "2",
    title: "Neon Samurai",
    imageUrl: "/placeholder.svg?height=400&width=400",
    artistName: "PixelSorcerer",
    artistAvatarUrl: "/placeholder.svg?height=40&width=40",
    likes: 980,
    promptSnippet: "Cyberpunk samurai warrior, glowing katana, rain-soaked city street, cinematic lighting...",
  },
  {
    id: "3",
    title: "Enchanted Forest Glade",
    imageUrl: "/placeholder.svg?height=400&width=400",
    artistName: "MysticVisions",
    artistAvatarUrl: "/placeholder.svg?height=40&width=40",
    likes: 1500,
    promptSnippet: "A hidden glade in an ancient forest, magical creatures, volumetric lighting, fantasy art...",
  },
  {
    id: "4",
    title: "Steampunk Metropolis",
    imageUrl: "/placeholder.svg?height=400&width=400",
    artistName: "Cogsworth",
    artistAvatarUrl: "/placeholder.svg?height=40&width=40",
    likes: 850,
    promptSnippet: "Intricate steampunk city with airships and clockwork mechanisms, detailed illustration...",
  },
]

export default function ArtistPage() {
  return (
    <>
      <PageHeader
        title="Explore Artist Creations"
        description="Discover inspiring AI art from talented creators. Use their work as a reference and support the community."
      >
        <div className="mt-6 flex flex-col sm:flex-row gap-2 items-center justify-center max-w-lg mx-auto">
          <Input
            type="search"
            placeholder="Search by style, keyword, or artist..."
            className="flex-1 bg-slate-800/50 border-slate-700 placeholder:text-slate-500 focus:border-purple-500"
          />
          <Button
            variant="outline"
            className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/70 hover:text-slate-100"
          >
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>
      </PageHeader>

      <div className="container max-w-screen-xl pb-12 pt-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {creations.map((creation) => (
            <GlassCard key={creation.id} className="overflow-hidden group">
              <div className="relative w-full aspect-square">
                <Image
                  src={creation.imageUrl || "/placeholder.svg"}
                  alt={creation.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-xs text-slate-300 line-clamp-2">{creation.promptSnippet}</p>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-purple-400 transition-colors">
                  {creation.title}
                </h3>
                <Link
                  href={`/artist/${creation.artistName.toLowerCase()}`}
                  className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground group"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={creation.artistAvatarUrl || "/placeholder.svg"} alt={creation.artistName} />
                    <AvatarFallback>{creation.artistName.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                  <span>{creation.artistName}</span>
                </Link>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <button className="flex items-center space-x-1 hover:text-pink-500 transition-colors">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">{creation.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-sky-500 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                  </button>
                  <button className="hover:text-green-500 transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-purple-600/30 hover:border-purple-500 hover:text-purple-300"
                >
                  Use Reference <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardFooter>
            </GlassCard>
          ))}
        </div>
      </div>
    </>
  )
}

"use client"

import React from "react"

import type { ReactElement } from "react"
import { useState } from "react"
import { GlareCard } from "@/components/ui/glare-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sparkles,
  ImageIcon,
  Film,
  Brush,
  Users,
  Building,
  Heart,
  Music,
  BookOpen,
  TrendingUp,
  Star,
  Play,
  ArrowLeft,
  CreditCard,
  Mail,
  MessageSquare,
  Wand2,
  Settings2,
  Palette,
  Type,
  Layout,
  Download,
  RefreshCw,
  Copy,
  Eye,
  Zap,
  Clock,
  Grid3X3,
} from "lucide-react"

interface CreativeCategory {
  id: string
  title: string
  description: string
  icon: ReactElement
  gradient: string
  tags: string[]
  trending?: boolean
  new?: boolean
  subcategories: SubCategory[]
}

interface SubCategory {
  id: string
  title: string
  description: string
  icon: ReactElement
  examples: string[]
  popular?: boolean
}

interface GeneratedResult {
  id: string
  url: string
  prompt: string
  style: string
  timestamp: Date
  category?: string
  subcategory?: string
  type: "image" | "video"
}

interface HistoryItem {
  id: string
  url: string
  prompt: string
  style: string
  timestamp: Date
  category?: string
  subcategory?: string
  type: "image" | "video"
}

const imageCategories: CreativeCategory[] = [
  {
    id: "business",
    title: "Business",
    description: "Professional corporate designs and branding",
    icon: <Building />,
    gradient: "from-blue-500 to-indigo-600",
    tags: ["corporate", "professional", "branding"],
    trending: true,
    subcategories: [
      {
        id: "logos",
        title: "Logo Design",
        description: "Professional logos and brand marks",
        icon: <Sparkles />,
        examples: [
          "Modern minimalist tech startup logo with geometric shapes",
          "Elegant restaurant logo with vintage typography",
          "Professional medical clinic logo with clean design",
        ],
        popular: true,
      },
      {
        id: "business-cards",
        title: "Business Cards",
        description: "Professional business card designs",
        icon: <CreditCard />,
        examples: [
          "Executive business card with gold foil accents",
          "Creative agency card with bold typography",
          "Medical practice card with clean layout",
        ],
      },
      {
        id: "email-signature",
        title: "Email Signatures",
        description: "Professional email signature designs",
        icon: <Mail />,
        examples: [
          "Corporate email signature with company branding",
          "Personal brand signature with social links",
          "Agency signature with portfolio showcase",
        ],
      },
    ],
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Promotional and advertising materials",
    icon: <TrendingUp />,
    gradient: "from-green-500 to-emerald-600",
    tags: ["advertising", "promotion", "campaigns"],
    new: true,
    subcategories: [
      {
        id: "social-posts",
        title: "Social Media Posts",
        description: "Engaging social media content",
        icon: <MessageSquare />,
        examples: [
          "Instagram story template with product showcase",
          "Facebook ad with compelling call-to-action",
          "LinkedIn post with professional insights",
        ],
        popular: true,
      },
      {
        id: "banners",
        title: "Web Banners",
        description: "Digital advertising banners",
        icon: <Layout />,
        examples: [
          "Google Ads banner for e-commerce sale",
          "Website header with hero message",
          "Display ad for mobile app promotion",
        ],
      },
    ],
  },
  {
    id: "personal",
    title: "Personal",
    description: "Personal projects and creative expression",
    icon: <Heart />,
    gradient: "from-pink-500 to-rose-600",
    tags: ["personal", "creative", "lifestyle"],
    subcategories: [
      {
        id: "portraits",
        title: "Portraits",
        description: "Personal and artistic portraits",
        icon: <Users />,
        examples: [
          "Professional headshot with studio lighting",
          "Artistic portrait with creative background",
          "Family photo with natural setting",
        ],
        popular: true,
      },
      {
        id: "art",
        title: "Digital Art",
        description: "Creative artistic expressions",
        icon: <Brush />,
        examples: [
          "Abstract digital painting with vibrant colors",
          "Fantasy landscape with magical elements",
          "Modern art piece with geometric patterns",
        ],
      },
    ],
  },
]

const videoCategories: CreativeCategory[] = [
  {
    id: "social-video",
    title: "Social Media",
    description: "Short-form content for social platforms",
    icon: <Sparkles />,
    gradient: "from-purple-500 to-pink-600",
    tags: ["social", "short-form", "viral"],
    trending: true,
    subcategories: [
      {
        id: "reels",
        title: "Instagram Reels",
        description: "Vertical short videos for Instagram",
        icon: <Play />,
        examples: [
          "Product showcase reel with dynamic transitions",
          "Behind the scenes content with music",
          "Tutorial reel with step-by-step guide",
        ],
        popular: true,
      },
      {
        id: "tiktok",
        title: "TikTok Videos",
        description: "Creative TikTok content",
        icon: <Music />,
        examples: [
          "Dance video with trending music",
          "Comedy skit with popular format",
          "Educational content with engaging visuals",
        ],
      },
    ],
  },
  {
    id: "business-video",
    title: "Business",
    description: "Professional corporate video content",
    icon: <Building />,
    gradient: "from-blue-500 to-indigo-600",
    tags: ["corporate", "professional", "marketing"],
    subcategories: [
      {
        id: "explainer",
        title: "Explainer Videos",
        description: "Educational and how-to content",
        icon: <BookOpen />,
        examples: [
          "Product demo with animated graphics",
          "Service explanation with clear narration",
          "Process walkthrough with visual aids",
        ],
        popular: true,
      },
    ],
  },
]

// Mock generated results
const mockResults: GeneratedResult[] = [
  {
    id: "1",
    url: "/placeholder.svg?height=400&width=400",
    prompt: "Modern minimalist tech startup logo with geometric shapes",
    style: "professional",
    timestamp: new Date(),
    category: "Business",
    subcategory: "Logo Design",
    type: "image",
  },
  {
    id: "2",
    url: "/placeholder.svg?height=400&width=400",
    prompt: "Elegant restaurant logo with vintage typography",
    style: "creative",
    timestamp: new Date(),
    category: "Business",
    subcategory: "Logo Design",
    type: "image",
  },
  {
    id: "3",
    url: "/placeholder.svg?height=400&width=400",
    prompt: "Professional medical clinic logo with clean design",
    style: "minimal",
    timestamp: new Date(),
    category: "Business",
    subcategory: "Logo Design",
    type: "image",
  },
]

// Mock history data
const mockHistory: HistoryItem[] = [
  {
    id: "h1",
    url: "/placeholder.svg?height=300&width=300",
    prompt: "Abstract digital painting with vibrant colors",
    style: "artistic",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    category: "Personal",
    subcategory: "Digital Art",
    type: "image",
  },
  {
    id: "h2",
    url: "/placeholder.svg?height=300&width=300",
    prompt: "Executive business card with gold foil accents",
    style: "professional",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    category: "Business",
    subcategory: "Business Cards",
    type: "image",
  },
  {
    id: "h3",
    url: "/placeholder.svg?height=300&width=300",
    prompt: "Instagram story template with product showcase",
    style: "creative",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    category: "Marketing",
    subcategory: "Social Media Posts",
    type: "image",
  },
  {
    id: "h4",
    url: "/placeholder.svg?height=300&width=300",
    prompt: "Professional headshot with studio lighting",
    style: "professional",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    category: "Personal",
    subcategory: "Portraits",
    type: "image",
  },
]

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState("image")
  const [viewMode, setViewMode] = useState<"all" | "favorites" | "recent">("all")
  const [selectedCategory, setSelectedCategory] = useState<CreativeCategory | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubCategory | null>(null)
  const [showRefineModal, setShowRefineModal] = useState(false)
  const [showFreeCreateModal, setShowFreeCreateModal] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["business", "personal"]))
  const [history, setHistory] = useState<HistoryItem[]>(mockHistory)

  const currentCategories = activeTab === "image" ? imageCategories : videoCategories

  const filteredCategories =
    viewMode === "favorites" ? currentCategories.filter((category) => favorites.has(category.id)) : currentCategories

  const handleCategorySelect = (category: CreativeCategory) => {
    setSelectedCategory(category)
    setSelectedSubcategory(null)
  }

  const handleSubcategorySelect = (subcategory: SubCategory) => {
    setSelectedSubcategory(subcategory)
    setShowRefineModal(true)
  }

  const handleBack = () => {
    if (selectedSubcategory) {
      setSelectedSubcategory(null)
      setShowRefineModal(false)
    } else if (selectedCategory) {
      setSelectedCategory(null)
    }
  }

  const handleFreeCreate = () => {
    setShowFreeCreateModal(true)
  }

  const toggleFavorite = (categoryId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(categoryId)) {
        newFavorites.delete(categoryId)
      } else {
        newFavorites.add(categoryId)
      }
      return newFavorites
    })
  }

  const addToHistory = (result: GeneratedResult) => {
    const historyItem: HistoryItem = {
      ...result,
      timestamp: new Date(),
    }
    setHistory((prev) => [historyItem, ...prev.slice(0, 19)]) // Keep only last 20 items
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-20">
      <div className="container max-w-screen-2xl mx-auto py-8 space-y-8">
        {/* Header Section */}
        {!selectedCategory && (
          <>
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-white">
                Create with{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Transform your ideas into stunning visuals with our AI-powered creation tools
              </p>
            </div>
          </>
        )}

        {/* Navigation Breadcrumb */}
        {selectedCategory && (
          <div className="flex items-center gap-2 text-slate-400">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-slate-400 hover:text-white hover:bg-slate-800/50 p-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <span>/</span>
            <span className="text-white">{selectedCategory.title}</span>
            {selectedSubcategory && (
              <>
                <span>/</span>
                <span className="text-purple-400">{selectedSubcategory.title}</span>
              </>
            )}
          </div>
        )}

        {/* Main Content */}
        {!selectedCategory ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            {/* Tab Navigation */}
            <div className="flex justify-center">
              <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1">
                <TabsTrigger
                  value="image"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300 px-8 py-3"
                >
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Images
                </TabsTrigger>
                <TabsTrigger
                  value="video"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300 px-8 py-3"
                >
                  <Film className="h-5 w-5 mr-2" />
                  Videos
                </TabsTrigger>
              </TabsList>
            </div>

            {/* View Mode Tabs */}
            <div className="flex justify-center">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-1">
                <Button
                  variant={viewMode === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("all")}
                  className={viewMode === "all" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  All Categories
                </Button>
                <Button
                  variant={viewMode === "favorites" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("favorites")}
                  className={viewMode === "favorites" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Favorites ({favorites.size})
                </Button>
                <Button
                  variant={viewMode === "recent" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("recent")}
                  className={viewMode === "recent" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Recent ({history.length})
                </Button>
              </div>
            </div>

            {/* Categories Grid */}
            <TabsContent value="image" className="space-y-6">
              {viewMode === "recent" ? (
                <RecentCreations history={history} formatTimeAgo={formatTimeAgo} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {/* Free Create Card - Only show in "all" mode */}
                  {viewMode === "all" && (
                    <GlareCard
                      className="group cursor-pointer transition-all duration-300 hover:scale-105 relative overflow-hidden border-slate-700/50"
                      onClick={handleFreeCreate}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-10 group-hover:opacity-20 transition-opacity" />

                      <div className="relative space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-20">
                            <Zap className="h-6 w-6 text-white" />
                          </div>
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Free Create
                          </Badge>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                            Free Create
                          </h3>
                          <p className="text-sm text-slate-400 line-clamp-2">
                            Create anything you want without categories - unlimited creativity
                          </p>
                        </div>

                        {/* Features */}
                        <div className="text-xs text-slate-500">No limits, no categories needed</div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          <Badge
                            variant="secondary"
                            className="text-xs bg-slate-800/50 text-slate-300 border-slate-600/50"
                          >
                            unlimited
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-slate-800/50 text-slate-300 border-slate-600/50"
                          >
                            creative
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-slate-800/50 text-slate-300 border-slate-600/50"
                          >
                            flexible
                          </Badge>
                        </div>

                        {/* CTA */}
                        <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Start Creating
                        </Button>
                      </div>
                    </GlareCard>
                  )}

                  {/* Category Cards */}
                  {filteredCategories.map((category) => (
                    <GlareCard
                      key={category.id}
                      className="group cursor-pointer transition-all duration-300 hover:scale-105 relative overflow-hidden border-slate-700/50"
                      onClick={() => handleCategorySelect(category)}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}
                      />

                      <div className="relative space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${category.gradient} bg-opacity-20`}>
                            {React.cloneElement(category.icon, { className: "h-6 w-6 text-white" })}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(category.id)
                              }}
                              className="p-1 h-8 w-8 hover:bg-slate-700/50"
                            >
                              <Heart
                                className={`h-4 w-4 transition-colors ${
                                  favorites.has(category.id)
                                    ? "fill-red-500 text-red-500"
                                    : "text-slate-400 hover:text-red-400"
                                }`}
                              />
                            </Button>
                            {category.trending && (
                              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                            {category.new && (
                              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                New
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                            {category.title}
                          </h3>
                          <p className="text-sm text-slate-400 line-clamp-2">{category.description}</p>
                        </div>

                        {/* Subcategories count */}
                        <div className="text-xs text-slate-500">
                          {category.subcategories.length} subcategories available
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {category.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs bg-slate-800/50 text-slate-300 border-slate-600/50"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* CTA */}
                        <Button
                          className={`w-full bg-gradient-to-r ${category.gradient} text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCategorySelect(category)
                          }}
                        >
                          Explore {category.subcategories.length} Options
                        </Button>
                      </div>
                    </GlareCard>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="video" className="space-y-6">
              {viewMode === "recent" ? (
                <RecentCreations
                  history={history.filter((item) => item.type === "video")}
                  formatTimeAgo={formatTimeAgo}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Free Create Card for Video - Only show in "all" mode */}
                  {viewMode === "all" && (
                    <GlareCard
                      className="group cursor-pointer transition-all duration-300 hover:scale-105 relative overflow-hidden border-slate-700/50"
                      onClick={handleFreeCreate}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-10 group-hover:opacity-20 transition-opacity" />

                      <div className="relative space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-20">
                            <Zap className="h-6 w-6 text-white" />
                          </div>
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Free Create
                          </Badge>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                            Free Create
                          </h3>
                          <p className="text-sm text-slate-400 line-clamp-2">
                            Create any video you want without categories - unlimited creativity
                          </p>
                        </div>

                        {/* Features */}
                        <div className="text-xs text-slate-500">No limits, no categories needed</div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          <Badge
                            variant="secondary"
                            className="text-xs bg-slate-800/50 text-slate-300 border-slate-600/50"
                          >
                            unlimited
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-slate-800/50 text-slate-300 border-slate-600/50"
                          >
                            creative
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-slate-800/50 text-slate-300 border-slate-600/50"
                          >
                            flexible
                          </Badge>
                        </div>

                        {/* CTA */}
                        <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Start Creating
                        </Button>
                      </div>
                    </GlareCard>
                  )}

                  {/* Category Cards */}
                  {filteredCategories.map((category) => (
                    <GlareCard
                      key={category.id}
                      className="group cursor-pointer transition-all duration-300 hover:scale-105 relative overflow-hidden border-slate-700/50"
                      onClick={() => handleCategorySelect(category)}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}
                      />

                      <div className="relative space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${category.gradient} bg-opacity-20`}>
                            {React.cloneElement(category.icon, { className: "h-6 w-6 text-white" })}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(category.id)
                              }}
                              className="p-1 h-8 w-8 hover:bg-slate-700/50"
                            >
                              <Heart
                                className={`h-4 w-4 transition-colors ${
                                  favorites.has(category.id)
                                    ? "fill-red-500 text-red-500"
                                    : "text-slate-400 hover:text-red-400"
                                }`}
                              />
                            </Button>
                            {category.trending && (
                              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                            {category.new && (
                              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                New
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                            {category.title}
                          </h3>
                          <p className="text-sm text-slate-400 line-clamp-2">{category.description}</p>
                        </div>

                        {/* Subcategories count */}
                        <div className="text-xs text-slate-500">
                          {category.subcategories.length} subcategories available
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {category.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs bg-slate-800/50 text-slate-300 border-slate-600/50"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* CTA */}
                        <Button
                          className={`w-full bg-gradient-to-r ${category.gradient} text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCategorySelect(category)
                          }}
                        >
                          Explore {category.subcategories.length} Options
                        </Button>
                      </div>
                    </GlareCard>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          /* Subcategories View */
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div
                className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${selectedCategory.gradient} bg-opacity-20`}
              >
                {React.cloneElement(selectedCategory.icon, { className: "h-8 w-8 text-white" })}
              </div>
              <h1 className="text-3xl font-bold text-white">{selectedCategory.title}</h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">{selectedCategory.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCategory.subcategories.map((subcategory) => (
                <GlareCard
                  key={subcategory.id}
                  className="group cursor-pointer transition-all duration-300 hover:scale-105 relative overflow-hidden border-slate-700/50"
                  onClick={() => handleSubcategorySelect(subcategory)}
                >
                  <div className="relative space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-xl bg-slate-800/50">
                        {React.cloneElement(subcategory.icon, { className: "h-6 w-6 text-white" })}
                      </div>
                      {subcategory.popular && (
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {subcategory.title}
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-2">{subcategory.description}</p>
                    </div>

                    {/* Examples */}
                    <div className="space-y-2">
                      <div className="text-xs text-slate-500 font-medium">Popular examples:</div>
                      <div className="space-y-1">
                        {subcategory.examples.slice(0, 2).map((example, index) => (
                          <div key={index} className="text-xs text-slate-400 flex items-center gap-2">
                            <div className="w-1 h-1 bg-purple-400 rounded-full" />
                            {example}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <Button
                      className={`w-full bg-gradient-to-r ${selectedCategory.gradient} text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSubcategorySelect(subcategory)
                      }}
                    >
                      Create Now
                    </Button>
                  </div>
                </GlareCard>
              ))}
            </div>
          </div>
        )}

        {/* Free Create Modal */}
        {showFreeCreateModal && (
          <FreeCreateModal
            type={activeTab as "image" | "video"}
            onClose={() => setShowFreeCreateModal(false)}
            onGenerate={addToHistory}
          />
        )}

        {/* Refine Modal */}
        {showRefineModal && selectedSubcategory && selectedCategory && (
          <RefineModal
            category={selectedCategory}
            subcategory={selectedSubcategory}
            type={activeTab as "image" | "video"}
            onClose={() => {
              setShowRefineModal(false)
              setSelectedSubcategory(null)
            }}
            onGenerate={addToHistory}
          />
        )}
      </div>
    </div>
  )
}

// Recent Creations Component
function RecentCreations({
  history,
  formatTimeAgo,
}: {
  history: HistoryItem[]
  formatTimeAgo: (date: Date) => string
}) {
  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-600/50 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Clock className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-white font-medium mb-2">No recent creations</h3>
          <p className="text-slate-400 text-sm">Your recent AI generations will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Recent Creations</h2>
        <Badge variant="secondary" className="bg-slate-800/50 text-slate-300">
          {history.length} items
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {history.map((item) => (
          <GlareCard
            key={item.id}
            className="group cursor-pointer transition-all duration-300 hover:scale-105 relative overflow-hidden border-slate-700/50"
          >
            <div className="relative space-y-4">
              {/* Image */}
              <div className="aspect-square rounded-lg overflow-hidden bg-slate-800/50">
                <img
                  src={item.url || "/placeholder.svg"}
                  alt={item.prompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs bg-slate-800/50 text-slate-300">
                    {item.type}
                  </Badge>
                  <span className="text-xs text-slate-500">{formatTimeAgo(item.timestamp)}</span>
                </div>

                <p className="text-sm text-slate-300 line-clamp-2">{item.prompt}</p>

                {item.category && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{item.category}</span>
                    {item.subcategory && (
                      <>
                        <span>•</span>
                        <span>{item.subcategory}</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-1 flex-1">
                  <Copy className="h-4 w-4 mr-1" />
                  Recreate
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-1">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-1">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </GlareCard>
        ))}
      </div>
    </div>
  )
}

// Free Create Modal Component
function FreeCreateModal({
  type,
  onClose,
  onGenerate,
}: {
  type: "image" | "video"
  onClose: () => void
  onGenerate: (result: GeneratedResult) => void
}) {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("realistic")
  const [creativity, setCreativity] = useState([75])
  const [aspectRatio, setAspectRatio] = useState("square")
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState<GeneratedResult[]>([])

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const newResult: GeneratedResult = {
      id: Date.now().toString(),
      url: `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(prompt)}`,
      prompt,
      style,
      timestamp: new Date(),
      type,
    }

    setResults((prev) => [newResult, ...prev])
    onGenerate(newResult) // Add to history
    setIsGenerating(false)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Left Panel - Controls */}
          <div className="p-8 space-y-6 overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-slate-400 hover:text-white hover:bg-slate-800/50"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Free Create</Badge>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Wand2 className="h-6 w-6 text-purple-400" />
                  Create {type === "image" ? "Image" : "Video"}
                </h2>
                <p className="text-slate-400">Describe anything you want to create - no categories needed!</p>
              </div>
            </div>

            {/* Prompt Input */}
            <div className="space-y-3">
              <Label className="text-white font-medium">Describe your vision</Label>
              <Textarea
                placeholder="Describe anything you want to create... e.g., 'A futuristic cityscape at sunset with flying cars'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-purple-500 resize-none"
              />
            </div>

            {/* Style Selection */}
            <div className="space-y-3">
              <Label className="text-white font-medium">Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="artistic">Artistic</SelectItem>
                  <SelectItem value="cartoon">Cartoon</SelectItem>
                  <SelectItem value="abstract">Abstract</SelectItem>
                  <SelectItem value="vintage">Vintage</SelectItem>
                  <SelectItem value="futuristic">Futuristic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Aspect Ratio */}
            {type === "image" && (
              <div className="space-y-3">
                <Label className="text-white font-medium">Aspect Ratio</Label>
                <ToggleGroup
                  type="single"
                  value={aspectRatio}
                  onValueChange={setAspectRatio}
                  className="grid grid-cols-3 gap-2"
                >
                  <ToggleGroupItem
                    value="square"
                    className="bg-slate-800/50 border-slate-700/50 text-slate-300 data-[state=on]:bg-purple-600 data-[state=on]:text-white"
                  >
                    Square
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="landscape"
                    className="bg-slate-800/50 border-slate-700/50 text-slate-300 data-[state=on]:bg-purple-600 data-[state=on]:text-white"
                  >
                    Landscape
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="portrait"
                    className="bg-slate-800/50 border-slate-700/50 text-slate-300 data-[state=on]:bg-purple-600 data-[state=on]:text-white"
                  >
                    Portrait
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            )}

            {/* Creativity Slider */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-white font-medium">Creativity</Label>
                <span className="text-purple-400 text-sm">{creativity[0]}%</span>
              </div>
              <Slider value={creativity} onValueChange={setCreativity} max={100} step={1} className="w-full" />
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium py-3 text-lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5 mr-2" />
                  Generate {type === "image" ? "Image" : "Video"}
                </>
              )}
            </Button>
          </div>

          {/* Right Panel - Results */}
          <div className="bg-slate-800/30 border-l border-slate-700/50 p-8 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Results</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {results.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-600/50 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <ImageIcon className="h-8 w-8 text-slate-400" />
                    </div>
                    <h4 className="text-white font-medium mb-2">Your creations will appear here</h4>
                    <p className="text-slate-400 text-sm">
                      {prompt ? "Ready to generate!" : "Enter a description to get started"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((result) => (
                    <div key={result.id} className="bg-slate-700/30 rounded-lg p-4 space-y-3">
                      <img
                        src={result.url || "/placeholder.svg"}
                        alt={result.prompt}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <div className="space-y-2">
                        <p className="text-sm text-slate-300 line-clamp-2">{result.prompt}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {result.style}
                          </Badge>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-1">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-1">
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-1">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Refine Modal Component
function RefineModal({
  category,
  subcategory,
  type,
  onClose,
  onGenerate,
}: {
  category: CreativeCategory
  subcategory: SubCategory
  type: "image" | "video"
  onClose: () => void
  onGenerate: (result: GeneratedResult) => void
}) {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("professional")
  const [creativity, setCreativity] = useState([75])
  const [aspectRatio, setAspectRatio] = useState("square")
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState<GeneratedResult[]>(mockResults)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const newResult: GeneratedResult = {
      id: Date.now().toString(),
      url: `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(prompt)}`,
      prompt,
      style,
      timestamp: new Date(),
      category: category.title,
      subcategory: subcategory.title,
      type,
    }

    setResults((prev) => [newResult, ...prev])
    onGenerate(newResult) // Add to history
    setIsGenerating(false)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Left Panel - Controls */}
          <div className="p-8 space-y-6 overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-slate-400 hover:text-white hover:bg-slate-800/50"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Badge className={`bg-gradient-to-r ${category.gradient} text-white`}>{category.title}</Badge>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  {React.cloneElement(subcategory.icon, { className: "h-6 w-6 text-purple-400" })}
                  {subcategory.title}
                </h2>
                <p className="text-slate-400">{subcategory.description}</p>
              </div>
            </div>

            {/* Prompt Input */}
            <div className="space-y-3">
              <Label className="text-white font-medium">Describe your vision</Label>
              <Textarea
                placeholder={`Describe your ${subcategory.title.toLowerCase()}... e.g., "${subcategory.examples[0]}"`}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-purple-500 resize-none"
              />
            </div>

            {/* Quick Examples */}
            <div className="space-y-3">
              <Label className="text-white font-medium">Quick examples</Label>
              <div className="grid grid-cols-1 gap-2">
                {subcategory.examples.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setPrompt(example)}
                    className="justify-start text-left bg-slate-800/30 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div className="space-y-3">
              <Label className="text-white font-medium">Style</Label>
              <ToggleGroup type="single" value={style} onValueChange={setStyle} className="grid grid-cols-2 gap-2">
                <ToggleGroupItem
                  value="professional"
                  className="bg-slate-800/50 border-slate-700/50 text-slate-300 data-[state=on]:bg-purple-600 data-[state=on]:text-white"
                >
                  Professional
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="creative"
                  className="bg-slate-800/50 border-slate-700/50 text-slate-300 data-[state=on]:bg-purple-600 data-[state=on]:text-white"
                >
                  Creative
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="minimal"
                  className="bg-slate-800/50 border-slate-700/50 text-slate-300 data-[state=on]:bg-purple-600 data-[state=on]:text-white"
                >
                  Minimal
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="bold"
                  className="bg-slate-800/50 border-slate-700/50 text-slate-300 data-[state=on]:bg-purple-600 data-[state=on]:text-white"
                >
                  Bold
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Aspect Ratio */}
            {type === "image" && (
              <div className="space-y-3">
                <Label className="text-white font-medium">Aspect Ratio</Label>
                <ToggleGroup
                  type="single"
                  value={aspectRatio}
                  onValueChange={setAspectRatio}
                  className="grid grid-cols-3 gap-2"
                >
                  <ToggleGroupItem
                    value="square"
                    className="bg-slate-800/50 border-slate-700/50 text-slate-300 data-[state=on]:bg-purple-600 data-[state=on]:text-white"
                  >
                    Square
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="landscape"
                    className="bg-slate-800/50 border-slate-700/50 text-slate-300 data-[state=on]:bg-purple-600 data-[state=on]:text-white"
                  >
                    Landscape
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="portrait"
                    className="bg-slate-800/50 border-slate-700/50 text-slate-300 data-[state=on]:bg-purple-600 data-[state=on]:text-white"
                  >
                    Portrait
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            )}

            {/* Creativity Slider */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-white font-medium">Creativity</Label>
                <span className="text-purple-400 text-sm">{creativity[0]}%</span>
              </div>
              <Slider value={creativity} onValueChange={setCreativity} max={100} step={1} className="w-full" />
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className={`w-full bg-gradient-to-r ${category.gradient} text-white font-medium py-3 text-lg`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5 mr-2" />
                  Generate {subcategory.title}
                </>
              )}
            </Button>
          </div>

          {/* Right Panel - Results */}
          <div className="bg-slate-800/30 border-l border-slate-700/50 p-8 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Generated Results</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                {results.map((result) => (
                  <div key={result.id} className="bg-slate-700/30 rounded-lg p-4 space-y-3">
                    <img
                      src={result.url || "/placeholder.svg"}
                      alt={result.prompt}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div className="space-y-2">
                      <p className="text-sm text-slate-300 line-clamp-2">{result.prompt}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {result.style}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-1">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-1">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-1">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 space-y-3">
              <Label className="text-white font-medium">Quick Actions</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50"
                >
                  <Palette className="h-4 w-4 mr-1" />
                  Colors
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50"
                >
                  <Type className="h-4 w-4 mr-1" />
                  Fonts
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

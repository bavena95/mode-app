"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Wand2 } from "lucide-react"
import { ModeDesignLogo } from "@/components/mode-design-logo"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header da Homepage */}
      <header className="fixed top-4 left-4 right-4 z-50">
        <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between rounded-2xl bg-slate-900/80 p-4 backdrop-blur-xl border border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <ModeDesignLogo className="h-6 w-6" />
            <span className="font-bold text-white">Mode Design</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="text-slate-300 hover:text-white">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
              <Link href="/register">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Seção Principal (Hero) */}
      <main className="flex-1 flex items-center justify-center">
        <div className="container max-w-screen-md text-center py-24">
          <div className="inline-block rounded-full bg-purple-500/10 px-4 py-2 mb-6 border border-purple-500/20">
            <p className="text-sm text-purple-300 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Creative Suite</span>
            </p>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent mb-6">
            Transform Your Ideas into Visual Masterpieces
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            From professional logos to stunning videos, our AI tools empower you to create anything you can imagine. Effortlessly.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-lg h-14 px-8">
              <Link href="/create">
                Start Creating
                <Wand2 className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-slate-300 border-white/20 bg-white/5 hover:bg-white/10 hover:text-white h-14 px-8 text-lg">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

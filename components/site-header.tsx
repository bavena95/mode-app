"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeDesignLogo } from "@/components/mode-design-logo"
import { LayoutGrid, FilmIcon, Users2, UserCircle2, ImageIcon, Video } from "lucide-react"

export function SiteHeader() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Create", icon: <LayoutGrid className="h-4 w-4" /> },
    { href: "/image-studio", label: "Image Studio", icon: <ImageIcon className="h-4 w-4" /> },
    { href: "/video-studio", label: "Video Studio", icon: <Video className="h-4 w-4" /> },
    { href: "/film", label: "Film", icon: <FilmIcon className="h-4 w-4" /> },
    { href: "/artist", label: "Artists", icon: <Users2 className="h-4 w-4" /> },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <ModeDesignLogo className="h-6 w-6" />
          <span className="font-bold sm:inline-block">Mode Design</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-2 sm:space-x-4">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={`text-sm font-medium px-2 sm:px-3 ${
                pathname === item.href
                  ? "text-purple-400 bg-purple-500/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Link href={item.href}>
                <span className="sm:hidden">{item.icon}</span>
                <span className="hidden sm:inline-block">{item.label}</span>
              </Link>
            </Button>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            Login
          </Button>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
            Sign Up
          </Button>
          <Button variant="ghost" size="icon" className="sm:hidden">
            <UserCircle2 className="h-5 w-5" />
            <span className="sr-only">User Menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

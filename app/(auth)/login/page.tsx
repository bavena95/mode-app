"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
// 1. Importe os componentes da biblioteca
import { CredentialSignIn, OAuthButton, OAuthButtonGroup } from "@stackframe/stack"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { GlassCard } from "@/components/glass-card"
import { ModeDesignLogo } from "@/components/mode-design-logo"
import { Mail, Lock, Github, Chrome, ArrowRight, Sparkles } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* ... Background Effects ... */}
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <ModeDesignLogo className="h-12 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-slate-400">Sign in to continue your creative journey</p>
        </div>

        <GlassCard className="p-8">
          {/* 2. Substitua <form> por <CredentialSignIn> */}
          <CredentialSignIn
            onSuccess={() => router.push('/')}
            onError={(error) => alert(error.message)}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input name="email" type="email" placeholder="Enter your email" required className="pl-10 bg-black/20 border-white/10 text-white"/>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input name="password" type="password" placeholder="Enter your password" required className="pl-10 bg-black/20 border-white/10 text-white"/>
                </div>
              </div>
              <div className="flex justify-end">
                <Link href="/auth/forgot-password" className="text-sm text-purple-400 hover:text-purple-300">
                  Forgot your password?
                </Link>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                <ArrowRight className="h-4 w-4 mr-2" />
                Sign in
              </Button>
            </div>
          </CredentialSignIn>

          <div className="flex items-center gap-4 my-6">
            <Separator className="flex-1 bg-white/10" />
            <span className="text-slate-400 text-sm">or continue with</span>
            <Separator className="flex-1 bg-white/10" />
          </div>

          {/* 3. Use OAuthButtonGroup e OAuthButton para login social */}
          <OAuthButtonGroup
            onSuccess={() => router.push('/')}
            onError={(error) => alert(error.message)}
            className="grid grid-cols-2 gap-3"
          >
            <OAuthButton provider="google" className="bg-black/20 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white">
              <Chrome className="h-4 w-4 mr-2" />
              Google
            </OAuthButton>
            <OAuthButton provider="github" className="bg-black/20 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white">
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </OAuthButton>
          </OAuthButtonGroup>

          <div className="text-center mt-6 pt-6 border-t border-white/10">
            <p className="text-slate-400 text-sm">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-purple-400 hover:text-purple-300">
                Sign up for free
              </Link>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
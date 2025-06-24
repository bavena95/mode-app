"use client"

import React from "react"
import { StackProvider } from "@stackframe/stack"
import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/components/theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  // A documentação confirma que o nome da prop é 'publishableKey'.
  const publishableKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return <div>Error: Stack Auth public key not configured. Check your .env.local file.</div>
  }

  return (
    <StackProvider publishableKey={publishableKey}>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </AuthProvider>
    </StackProvider>
  )
}
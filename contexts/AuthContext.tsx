"use client"

import React, { createContext, useContext, ReactNode } from "react"
// 1. IMPORTAÇÃO CORRETA: O hook correto é 'useUser'.
//    Removemos a tentativa de importar 'useSession'.
import { useUser, type User } from "@stackframe/stack" 

// Ajustamos o tipo para refletir a realidade dos dados da SDK.
// O token não é exposto diretamente pelo useUser, então vamos removê-lo por enquanto
// para focar em fazer o estado do usuário funcionar.
interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // 2. Chame o hook correto: 'useUser'.
  const { user, isLoading } = useUser();

  // 3. Crie o valor do contexto de forma segura.
  const value: AuthContextType = {
    user: user,
    isLoading: isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}

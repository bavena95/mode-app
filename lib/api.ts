import {
  ImageGenerationRequest,
  VideoGenerationRequest,
} from "@/backend/app/schemas/generation"
import {
  ProjectCreate,
  ProjectUpdate,
} from "@/backend/app/routers/projects"

// Define a URL base da sua API backend.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface FetchOptions extends RequestInit {
  body?: any
}

/**
 * Função wrapper para o fetch, que agora aceita um token como argumento.
 */
async function apiFetch<T>(
  endpoint: string,
  token: string | null, // <-- MUDANÇA: token é passado como argumento
  options: FetchOptions = {}
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  if (options.body) {
    options.body = JSON.stringify(options.body)
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage =
      errorData.detail || `Erro na API: ${response.status} ${response.statusText}`
    throw new Error(errorMessage)
  }
  
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return (await response.json()) as T
  }
  return {} as T
}

// Funções de conveniência refatoradas para aceitar o token.
export const api = {
  get: <T>(endpoint: string, token: string | null, options?: FetchOptions) =>
    apiFetch<T>(endpoint, token, { method: "GET", ...options }),

  post: <T>(endpoint: string, body: any, token: string | null, options?: FetchOptions) =>
    apiFetch<T>(endpoint, token, { method: "POST", body, ...options }),

  put: <T>(endpoint: string, body: any, token: string | null, options?: FetchOptions) =>
    apiFetch<T>(endpoint, token, { method: "PUT", body, ...options }),
    
  del: <T>(endpoint: string, token: string | null, options?: FetchOptions) =>
    apiFetch<T>(endpoint, token, { method: "DELETE", ...options }),

  // Funções específicas também recebem o token.
  auth: {
    getMe: (token: string | null) => api.get("/auth/me", token),
    sync: (token: string | null) => api.post("/auth/sync", {}, token),
  },
  images: {
    generate: (data: any, token: string | null) =>
      api.post("/images/generate", data, token),
    getStatus: (generationId: number, token: string | null) =>
      api.get(`/images/generations/${generationId}/status`, token),
    list: (token: string | null) => api.get("/images/generations", token),
  },
  // ... e assim por diante para 'videos' e 'projects' ...
  projects: {
    create: (data: any, token: string | null) => api.post("/projects/", data, token),
    update: (projectId: number, data: any, token: string | null) =>
      api.put(`/projects/${projectId}`, data, token),
    get: (projectId: number, token: string | null) => api.get(`/projects/${projectId}`, token),
    list: (token: string | null) => api.get("/projects/", token),
    delete: (projectId: number, token: string | null) => api.del(`/projects/${projectId}`, token),
  },
}
Passo 4: Usando a Nova Estrutura nos Componentes
Agora, em qualquer componente que precise de autenticação, você usará o hook useAuth para pegar o token e passá-lo para a função da API.

Exemplo de atualização em app/image-studio/page.tsx:

TypeScript

// Em app/image-studio/page.tsx
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext" // 1. Importe o useAuth

// ... dentro do seu componente ...
const { toast } = useToast()
const { token } = useAuth() // 2. Obtenha o token do contexto

const handleGenerateWithAI = async () => {
  if (!aiPrompt.trim()) return
  
  if (!token) { // 3. Verifique se o usuário está logado
      toast({
          title: "Acesso Negado",
          description: "Você precisa fazer login para gerar imagens.",
          variant: "destructive",
      });
      return;
  }

  // Mude o estado para "loading" aqui

  try {
    const generationData = {
      prompt: aiPrompt,
      // ...
    }
    // 4. Passe o token para a função da API
    const response = await api.images.generate(generationData, token) 
    
    toast({
      title: "Sucesso!",
      description: "Sua imagem está sendo gerada.",
    })
    
    // Inicie o polling aqui...
  } catch (error) {
    toast({
      title: "Erro",
      description: (error as Error).message,
      variant: "destructive",
    })
  } finally {
    // Mude o estado de volta para "não loading"
  }
}
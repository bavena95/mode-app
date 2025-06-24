import { Skeleton } from '@/components/ui/skeleton'

// Este componente será mostrado enquanto os dados do usuário são carregados
export default function MainLoading() {
  return (
    <div className="p-8">
      <Skeleton className="h-12 w-1/2 mb-4" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}
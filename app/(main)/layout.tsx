import { FloatingHeader } from "@/components/floating-header"

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <FloatingHeader />
      <main className="flex-1 pt-16">{children}</main>
    </div>
  )
}

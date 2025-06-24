import type React from "react";
import { Providers } from "@/app/providers"; // 1. Importe o componente de provedores

// Este componente de layout será aplicado a todas as páginas
// dentro da pasta (auth), como /login e /register.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 2. Envolva as páginas de autenticação com os Provedores.
    //    Isso garante que o <StackProvider> esteja disponível.
    <Providers>
      <main className="flex min-h-screen items-center justify-center p-4">
        {children}
      </main>
    </Providers>
  );
}

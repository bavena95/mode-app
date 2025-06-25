import type React from "react";

// Este componente de layout será aplicado a todas as páginas
// dentro da pasta (auth), como /login e /register.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      {children}
    </main>
  );
}

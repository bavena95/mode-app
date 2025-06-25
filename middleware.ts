import { StackServerApp } from '@stackframe/stack';
import { NextRequest, NextResponse } from 'next/server';

// 1. Crie uma instância do StackServerApp, que usaremos para verificar a sessão.
//    Ele lerá as variáveis de ambiente (STACK_SECRET_KEY, etc.) automaticamente.
const stack = new StackServerApp({});

// 2. Defina a função de middleware assíncrona, que o Next.js espera.
export async function middleware(request: NextRequest) {
  // Obtém o caminho da URL da requisição (ex: '/create', '/playground')
  const { pathname } = request.nextUrl;

  console.log('Middleware executado para:', pathname);

  // 3. Lista de rotas que você quer proteger.
  const protectedRoutes = [
    '/create',
    '/image-studio',
    '/video-studio',
    '/playground',
    '/film',
    '/artist',
  ];

  // Rotas de autenticação (não devem ser protegidas)
  const authRoutes = ['/login', '/register', '/forgot-password'];

  // Se estiver numa rota de auth, permita o acesso
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    console.log('Rota de auth, permitindo acesso:', pathname);
    return NextResponse.next();
  }

  // Verifica se a rota atual é uma das rotas protegidas.
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Se não for uma rota protegida, permita o acesso sem verificar o login.
  if (!isProtectedRoute) {
    console.log('Rota não protegida, permitindo acesso:', pathname);
    return NextResponse.next();
  }

  console.log('Rota protegida, verificando usuário:', pathname);

  try {
    // 4. Se for uma rota protegida, use a instância do app para buscar o usuário.
    //    A função .getUser(request) verifica o cookie da sessão.
    const user = await stack.getUser(request);
    console.log('Usuário encontrado:', !!user);

    // 5. Se não houver usuário, redirecione para a página de login.
    if (!user) {
      console.log('Usuário não encontrado, redirecionando para login');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect_url', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 6. Se houver um usuário, permita o acesso à rota protegida.
    console.log('Usuário autenticado, permitindo acesso:', pathname);
    return NextResponse.next();
  } catch (error) {
    console.error('Erro no middleware:', error);
    // Em caso de erro, redirecione para login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

// 7. O config.matcher agora define TODAS as rotas que o middleware deve observar.
//    A lógica DENTRO da função middleware decidirá o que fazer.
export const config = {
  matcher: [
    /*
     * Combine todas as rotas, exceto as que começam com:
     * - api (rotas de API do nosso backend FastAPI)
     * - _next/static (arquivos estáticos)
     * - _next/image (imagens otimizadas)
     * - favicon.ico (ícone do site)
     * - handler (rotas internas da SDK)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|handler).*)',
  ],
};

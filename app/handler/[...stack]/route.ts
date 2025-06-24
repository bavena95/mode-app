import { StackServerApp } from '@stackframe/stack';

// 1. Crie a instância do app do servidor.
//    Ele lerá as variáveis de ambiente (STACK_SECRET_KEY, NEXT_PUBLIC_STACK_PUBLISHABLE_KEY)
//    automaticamente para se configurar.
const stack = new StackServerApp({});

// 2. Exporte os manipuladores GET e POST a partir da propriedade .handlers da instância.
//    Esta é a forma correta de criar os endpoints da API para a SDK.
export const { GET, POST } = stack.handlers;

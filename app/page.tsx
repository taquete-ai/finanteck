import { redirect } from 'next/navigation'

/**
 * Página raiz (/). Redireciona imediatamente para /login.
 * O middleware valida a autenticação e redireciona para /dashboard se o usuário estiver logado.
 * Esta abordagem evita travamento causado por chamadas assíncronas ao Supabase.
 */
export default function Home() {
  redirect('/login')
}
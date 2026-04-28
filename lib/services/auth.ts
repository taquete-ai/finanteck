import { createClient } from '@/lib/supabase/client'
import type { User } from '@/types'

/**
 * Realiza login com email e senha.
 * Retorna o usuário autenticado ou lança um erro com mensagem amigável.
 */
export async function signIn(email: string, password: string): Promise<User> {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('E-mail ou senha incorretos.')
    }
    if (error.message.includes('Email not confirmed')) {
      throw new Error('Confirme seu e-mail antes de entrar.')
    }
    throw new Error('Erro ao entrar. Tente novamente.')
  }

  if (!data.user) throw new Error('Usuário não encontrado.')

  return {
    id: data.user.id,
    email: data.user.email ?? '',
  }
}

/**
 * Realiza logout e encerra a sessão.
 */
export async function signOut(): Promise<void> {
  const supabase = createClient()
  await supabase.auth.signOut()
}

/**
 * Retorna o usuário da sessão atual (client-side).
 * Retorna null se não houver sessão.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  return {
    id: user.id,
    email: user.email ?? '',
  }
}

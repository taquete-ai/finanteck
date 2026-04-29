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
    throw new Error('Erro ao entrar. Tente novamente.')
  }

  if (!data.user) throw new Error('Usuário não encontrado.')

  return {
    id: data.user.id,
    email: data.user.email ?? '',
  }
}

/**
 * Realiza cadastro com email e senha.
 * Retorna o usuário criado ou lança um erro com mensagem amigável.
 */
export async function signUp(email: string, password: string): Promise<User> {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    if (error.message.includes('already registered')) {
      throw new Error('Este e-mail já está cadastrado.')
    }
    if (error.message.includes('invalid email')) {
      throw new Error('E-mail inválido.')
    }
    if (error.message.includes('password')) {
      throw new Error('Senha muito fraca. Use pelo menos 8 caracteres.')
    }
    throw new Error('Erro ao criar conta. Tente novamente.')
  }

  if (!data.user) throw new Error('Erro ao criar conta.')

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

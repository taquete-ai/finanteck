import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Redireciona baseado no status de autenticação
  if (user) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}
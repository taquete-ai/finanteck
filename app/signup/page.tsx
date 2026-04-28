'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { signUp } from '@/lib/services/auth'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; general?: string }>({})

  function validate(): boolean {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {}
    if (!email) newErrors.email = 'E-mail é obrigatório.'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'E-mail inválido.'
    if (!password) newErrors.password = 'Senha é obrigatória.'
    else if (password.length < 6) newErrors.password = 'Mínimo de 6 caracteres.'
    if (!confirmPassword) newErrors.confirmPassword = 'Confirme a senha.'
    else if (password !== confirmPassword) newErrors.confirmPassword = 'As senhas não correspondem.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setErrors({})

    try {
      await signUp(email, password)
      // Redireciona para dashboard (usuário será autenticado automaticamente)
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : 'Erro ao criar conta.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-green-600">Finan</span>
            <span className="text-gray-800">Teck</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Gestão financeira pessoal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Criar conta
          </h2>

          {errors.general && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="new-password"
            />

            <Input
              label="Confirmar Senha"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              className="mt-2"
            >
              Criar conta
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

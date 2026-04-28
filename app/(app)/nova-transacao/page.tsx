'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { createTransaction } from '@/lib/services/transactions'
import {
  type TransactionType,
  type Category,
  CATEGORY_LABELS,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '@/types'

interface FormState {
  amount: string
  type: TransactionType
  category: Category
  description: string
  date: string
}

interface FormErrors {
  amount?: string
  description?: string
  date?: string
}

const today = new Date().toISOString().split('T')[0]

export default function NovaTransacaoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [serverError, setServerError] = useState('')

  const [form, setForm] = useState<FormState>({
    amount: '',
    type: 'despesa',
    category: 'alimentacao',
    description: '',
    date: today,
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const categories = form.type === 'receita' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  function handleTypeChange(type: TransactionType) {
    const defaultCategory =
      type === 'receita' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]
    setForm((prev) => ({ ...prev, type, category: defaultCategory }))
  }

  function validate(): boolean {
    const newErrors: FormErrors = {}
    const amount = parseFloat(form.amount.replace(',', '.'))
    if (!form.amount) newErrors.amount = 'Valor é obrigatório.'
    else if (isNaN(amount) || amount <= 0) newErrors.amount = 'Insira um valor válido maior que zero.'
    if (!form.description.trim()) newErrors.description = 'Descrição é obrigatória.'
    if (!form.date) newErrors.date = 'Data é obrigatória.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate() || loading || saved) return

    setLoading(true)
    setServerError('')

    try {
      await createTransaction({
        type: form.type,
        category: form.category,
        description: form.description.trim(),
        amount: parseFloat(form.amount.replace(',', '.')),
        date: form.date,
      })
      setSaved(true)
      setTimeout(() => router.push('/historico'), 900)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nova Transação</h1>
        <p className="text-sm text-gray-500">Registre uma receita ou despesa</p>
      </div>

      <Card>
        {saved && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            Transação salva com sucesso! Redirecionando...
          </div>
        )}

        {serverError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {/* Type toggle */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Tipo
            </label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              {(['despesa', 'receita'] as TransactionType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeChange(type)}
                  className={[
                    'flex-1 py-2 text-sm font-medium capitalize transition-colors',
                    form.type === type
                      ? type === 'receita'
                        ? 'bg-green-600 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50',
                  ].join(' ')}
                >
                  {type === 'receita' ? 'Receita' : 'Despesa'}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <Input
            label="Valor (R$)"
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={form.amount}
            onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
            error={errors.amount}
          />

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Categoria</label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value as Category }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <Input
            label="Descrição"
            type="text"
            placeholder="Ex: Almoço no restaurante"
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            error={errors.description}
          />

          {/* Date */}
          <Input
            label="Data"
            type="date"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            error={errors.date}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" fullWidth loading={loading} disabled={saved}>
              {saved ? 'Salvo!' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

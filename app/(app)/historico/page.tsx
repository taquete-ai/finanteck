'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { getTransactions, formatCurrency, formatDate } from '@/lib/services/transactions'
import {
  type Category,
  type TransactionType,
  type Transaction,
  CATEGORY_LABELS,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '@/types'

const ALL_CATEGORIES: Category[] = Array.from(
  new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])
)

export default function HistoricoPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')

  const [filterCategory, setFilterCategory] = useState<Category | 'todas'>('todas')
  const [filterType, setFilterType] = useState<TransactionType | 'todas'>('todas')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')

  const loadTransactions = useCallback(async () => {
    setLoading(true)
    setFetchError('')
    try {
      const data = await getTransactions({
        type: filterType === 'todas' ? 'all' : filterType,
        category: filterCategory === 'todas' ? 'all' : filterCategory,
        dateFrom: filterDateFrom || undefined,
        dateTo: filterDateTo || undefined,
      })
      setTransactions(data)
    } catch {
      setFetchError('Erro ao carregar transações. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [filterType, filterCategory, filterDateFrom, filterDateTo])

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  function clearFilters() {
    setFilterCategory('todas')
    setFilterType('todas')
    setFilterDateFrom('')
    setFilterDateTo('')
  }

  const hasFilters =
    filterCategory !== 'todas' ||
    filterType !== 'todas' ||
    filterDateFrom !== '' ||
    filterDateTo !== ''

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Histórico</h1>
          <p className="text-sm text-gray-500">
            {loading
              ? 'Carregando...'
              : `${transactions.length} transaç${transactions.length !== 1 ? 'ões' : 'ão'} encontrada${transactions.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link href="/nova-transacao">
          <Button size="md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card title="Filtros" className="mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Type */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Tipo</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TransactionType | 'todas')}
              className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
            >
              <option value="todas">Todos</option>
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Categoria</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as Category | 'todas')}
              className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
            >
              <option value="todas">Todas</option>
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>

          {/* Date from */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">De</label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
            />
          </div>

          {/* Date to */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Até</label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
            />
          </div>
        </div>

        {hasFilters && (
          <div className="mt-3 flex justify-end">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Limpar filtros
            </Button>
          </div>
        )}
      </Card>

      {fetchError && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center justify-between">
          <span>{fetchError}</span>
          <button onClick={loadTransactions} className="ml-4 underline text-red-600 hover:text-red-800">
            Tentar novamente
          </button>
        </div>
      )}

      {/* Transaction list */}
      <Card noPadding>
        {loading ? (
          <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-sm">Carregando transações...</span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center">
            <svg
              className="w-12 h-12 text-gray-300 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-sm text-gray-400">
              {hasFilters ? 'Nenhuma transação encontrada com estes filtros.' : 'Nenhuma transação registrada ainda.'}
            </p>
            {!hasFilters && (
              <Link href="/nova-transacao" className="inline-block mt-3">
                <Button size="sm">Registrar primeira transação</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {transactions.map((t, i) => (
              <div
                key={t.id}
                className={[
                  'flex items-center justify-between px-5 py-4',
                  i === 0 ? 'rounded-t-xl' : '',
                  i === transactions.length - 1 ? 'rounded-b-xl' : '',
                ].join(' ')}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={[
                      'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
                      t.type === 'receita' ? 'bg-green-100' : 'bg-red-100',
                    ].join(' ')}
                  >
                    {t.type === 'receita' ? (
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {t.description}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">
                        {CATEGORY_LABELS[t.category as Category]}
                      </span>
                      <span className="text-gray-200">·</span>
                      <span className="text-xs text-gray-400">{formatDate(t.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                  <span
                    className={[
                      'text-sm font-semibold',
                      t.type === 'receita' ? 'text-green-600' : 'text-red-500',
                    ].join(' ')}
                  >
                    {t.type === 'receita' ? '+' : '-'} {formatCurrency(t.amount)}
                  </span>
                  <span
                    className={[
                      'hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-medium',
                      t.type === 'receita'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600',
                    ].join(' ')}
                  >
                    {t.type === 'receita' ? 'Receita' : 'Despesa'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

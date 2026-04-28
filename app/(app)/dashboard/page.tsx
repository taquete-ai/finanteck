import Link from 'next/link'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { createClient } from '@/lib/supabase/server'
import { getDashboardSummary, formatCurrency, formatDate } from '@/lib/services/transactions'
import { CATEGORY_LABELS, UI_TYPE_MAP, type Category } from '@/types'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let summary = { balance: 0, totalIncome: 0, totalExpenses: 0, recentTransactions: [] as Awaited<ReturnType<typeof getDashboardSummary>>['recentTransactions'] }
  let fetchError = ''

  try {
    summary = await getDashboardSummary()
  } catch {
    fetchError = 'Não foi possível carregar os dados. Tente novamente.'
  }

  const { balance, totalIncome, totalExpenses, recentTransactions } = summary

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Olá, {user?.email?.split('@')[0]} · Resumo financeiro
          </p>
        </div>
        <Link href="/nova-transacao">
          <Button size="md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Registrar transação
          </Button>
        </Link>
      </div>

      {fetchError && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {fetchError}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Balance */}
        <div className={`rounded-xl p-5 text-white ${balance >= 0 ? 'bg-green-600' : 'bg-red-500'}`}>
          <p className="text-sm font-medium opacity-80">Saldo Total</p>
          <p className="mt-1 text-2xl font-bold">{formatCurrency(balance)}</p>
          <p className="mt-1 text-xs opacity-70">Receitas − Despesas</p>
        </div>

        {/* Income */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Receitas</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
        </Card>

        {/* Expenses */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Despesas</p>
              <p className="text-xl font-bold text-red-500">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card title="Últimas transações">
        {recentTransactions.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-400 text-sm">Nenhuma transação registrada ainda.</p>
            <Link href="/nova-transacao" className="inline-block mt-3">
              <Button size="sm">Registrar primeira transação</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {recentTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div
                      className={[
                        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
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
                    <div>
                      <p className="text-sm font-medium text-gray-800">{t.description}</p>
                      <p className="text-xs text-gray-400">
                        {CATEGORY_LABELS[t.category as Category]} · {formatDate(t.date)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={[
                      'text-sm font-semibold',
                      t.type === 'receita' ? 'text-green-600' : 'text-red-500',
                    ].join(' ')}
                  >
                    {t.type === 'receita' ? '+' : '-'} {formatCurrency(t.amount)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link href="/historico">
                <Button variant="ghost" size="sm" fullWidth>
                  Ver todas as transações →
                </Button>
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

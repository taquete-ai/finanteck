import { createClient } from '@/lib/supabase/client'
import {
  DB_TYPE_MAP,
  UI_TYPE_MAP,
  type Transaction,
  type TransactionInput,
  type TransactionFilters,
  type DashboardSummary,
  type Category,
  type TransactionType,
} from '@/types'

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Converte uma linha do Supabase para o tipo Transaction da UI */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Transaction {
  return {
    id: row.id,
    user_id: row.user_id,
    type: UI_TYPE_MAP[row.type] as TransactionType,
    category: row.category as Category,
    description: row.description,
    amount: Number(row.amount),
    date: row.date,
    created_at: row.created_at,
  }
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

/**
 * Busca todas as transações do usuário logado.
 * Aplica filtros opcionais de tipo, categoria e intervalo de datas.
 */
export async function getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
  const supabase = createClient()

  // Obtém o usuário autenticado
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado.')

  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (filters?.type && filters.type !== 'all') {
    query = query.eq('type', DB_TYPE_MAP[filters.type])
  }

  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category', filters.category)
  }

  if (filters?.dateFrom) {
    query = query.gte('date', filters.dateFrom)
  }

  if (filters?.dateTo) {
    query = query.lte('date', filters.dateTo)
  }

  const { data, error } = await query

  if (error) throw new Error('Erro ao buscar transações.')

  return (data ?? []).map(mapRow)
}

/**
 * Cria uma nova transação para o usuário logado.
 */
export async function createTransaction(input: TransactionInput): Promise<Transaction> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado.')

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      type: DB_TYPE_MAP[input.type],
      category: input.category,
      description: input.description,
      amount: input.amount,
      date: input.date,
    })
    .select()
    .single()

  if (error) throw new Error('Erro ao salvar transação.')

  return mapRow(data)
}

/**
 * Remove uma transação pelo id.
 */
export async function deleteTransaction(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)

  if (error) throw new Error('Erro ao excluir transação.')
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

/**
 * Retorna resumo financeiro do usuário: saldo, receitas, despesas e últimas transações.
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const transactions = await getTransactions()

  const totalIncome = transactions
    .filter((t) => t.type === 'receita')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === 'despesa')
    .reduce((sum, t) => sum + t.amount, 0)

  return {
    balance: totalIncome - totalExpenses,
    totalIncome,
    totalExpenses,
    recentTransactions: transactions.slice(0, 5),
  }
}

// ─── Utilitários de formatação ───────────────────────────────────────────────

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

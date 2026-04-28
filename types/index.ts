// Tipos de transação — mantidos em português para compatibilidade com a UI
export type TransactionType = 'receita' | 'despesa'

export type Category =
  | 'alimentacao'
  | 'transporte'
  | 'moradia'
  | 'saude'
  | 'lazer'
  | 'educacao'
  | 'salario'
  | 'freelance'
  | 'investimento'
  | 'outros'

// Mapeamento para o banco (Supabase): income / expense
export const DB_TYPE_MAP: Record<TransactionType, string> = {
  receita: 'income',
  despesa: 'expense',
}

export const UI_TYPE_MAP: Record<string, TransactionType> = {
  income: 'receita',
  expense: 'despesa',
}

// Transação conforme salva no Supabase
export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  category: Category
  description: string
  amount: number
  date: string          // ISO "YYYY-MM-DD"
  created_at: string
}

// Payload para criação (sem id, user_id e created_at — gerados pelo DB)
export interface TransactionInput {
  type: TransactionType
  category: Category
  description: string
  amount: number
  date: string
}

// Usuário autenticado
export interface User {
  id: string
  email: string
}

// Resumo para o Dashboard
export interface DashboardSummary {
  balance: number
  totalIncome: number
  totalExpenses: number
  recentTransactions: Transaction[]
}

// Filtros para o Histórico
export interface TransactionFilters {
  type?: TransactionType | 'all'
  category?: Category | 'all'
  dateFrom?: string
  dateTo?: string
}

export const CATEGORY_LABELS: Record<Category, string> = {
  alimentacao: 'Alimentação',
  transporte: 'Transporte',
  moradia: 'Moradia',
  saude: 'Saúde',
  lazer: 'Lazer',
  educacao: 'Educação',
  salario: 'Salário',
  freelance: 'Freelance',
  investimento: 'Investimento',
  outros: 'Outros',
}

export const EXPENSE_CATEGORIES: Category[] = [
  'alimentacao',
  'transporte',
  'moradia',
  'saude',
  'lazer',
  'educacao',
  'outros',
]

export const INCOME_CATEGORIES: Category[] = [
  'salario',
  'freelance',
  'investimento',
  'outros',
]

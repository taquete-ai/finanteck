import { Transaction } from '@/types'

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'receita',
    amount: 5500.00,
    category: 'salario',
    description: 'Salário mensal',
    date: '2026-04-01',
  },
  {
    id: '2',
    type: 'receita',
    amount: 1200.00,
    category: 'freelance',
    description: 'Projeto de design',
    date: '2026-04-05',
  },
  {
    id: '3',
    type: 'despesa',
    amount: 1800.00,
    category: 'moradia',
    description: 'Aluguel',
    date: '2026-04-05',
  },
  {
    id: '4',
    type: 'despesa',
    amount: 350.00,
    category: 'alimentacao',
    description: 'Supermercado',
    date: '2026-04-07',
  },
  {
    id: '5',
    type: 'despesa',
    amount: 120.00,
    category: 'transporte',
    description: 'Combustível',
    date: '2026-04-08',
  },
  {
    id: '6',
    type: 'despesa',
    amount: 89.90,
    category: 'lazer',
    description: 'Streaming e assinaturas',
    date: '2026-04-10',
  },
  {
    id: '7',
    type: 'receita',
    amount: 400.00,
    category: 'investimento',
    description: 'Rendimento CDB',
    date: '2026-04-12',
  },
  {
    id: '8',
    type: 'despesa',
    amount: 200.00,
    category: 'saude',
    description: 'Consulta médica',
    date: '2026-04-13',
  },
  {
    id: '9',
    type: 'despesa',
    amount: 150.00,
    category: 'educacao',
    description: 'Curso online',
    date: '2026-04-14',
  },
  {
    id: '10',
    type: 'despesa',
    amount: 75.50,
    category: 'alimentacao',
    description: 'Restaurante',
    date: '2026-04-15',
  },
]

export function getTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'receita')
    .reduce((sum, t) => sum + t.amount, 0)
}

export function getTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'despesa')
    .reduce((sum, t) => sum + t.amount, 0)
}

export function getBalance(transactions: Transaction[]): number {
  return getTotalIncome(transactions) - getTotalExpenses(transactions)
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}

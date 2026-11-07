
import type { Budget, Category, Transaction } from './types'

export const MONTH = '2026-11'
export const START_BALANCE = 18200

export const fmt = (n: number) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })

export const EXPENSE_CATS: Category[] = [
  'Housing', 'Food', 'Transport', 'Shopping',
  'Entertainment', 'Health', 'Utilities'
]

export const INCOME_CATS: Category[] = [
  'Salary', 'Freelance', 'Investments'
]

export const COLORS: Record<Category, string> = {
  Housing: '#6366f1',
  Food: '#22d3ee',
  Transport: '#f59e0b',
  Shopping: '#ec4899',
  Entertainment: '#a78bfa',
  Health: '#34d399',
  Utilities: '#60a5fa',
  Salary: '#10b981',
  Freelance: '#14b8a6',
  Investments: '#84cc16',
}

export const seedTx: Transaction[] = [
  { id: '1', date: '2026-11-01', description: 'Acme Corp Payroll', category: 'Salary', amount: 6200, type: 'income' },
  { id: '2', date: '2026-11-01', description: 'Rent – Maple Apartments', category: 'Housing', amount: 1850, type: 'expense' },
  { id: '3', date: '2026-11-02', description: 'Whole Foods Market', category: 'Food', amount: 142.8, type: 'expense' },
  { id: '4', date: '2026-11-02', description: 'Uber Rides', category: 'Transport', amount: 38.5, type: 'expense' },
  { id: '5', date: '2026-11-03', description: 'Netflix & Spotify', category: 'Entertainment', amount: 28.98, type: 'expense' },
  { id: '6', date: '2026-11-03', description: 'Design Project – Northwind', category: 'Freelance', amount: 850, type: 'income' },
  { id: '7', date: '2026-11-04', description: 'Amazon Order', category: 'Shopping', amount: 214.3, type: 'expense' },
  { id: '8', date: '2026-11-04', description: 'City Electric & Water', category: 'Utilities', amount: 132.4, type: 'expense' },
  { id: '9', date: '2026-11-05', description: 'CVS Pharmacy', category: 'Health', amount: 46.2, type: 'expense' },
  { id: '10', date: '2026-11-05', description: 'Chipotle & Coffee', category: 'Food', amount: 64.75, type: 'expense' },
  { id: '11', date: '2026-11-05', description: 'Shell Gas Station', category: 'Transport', amount: 58.1, type: 'expense' },
  { id: '12', date: '2026-11-06', description: 'Concert Tickets', category: 'Entertainment', amount: 185, type: 'expense' },
  { id: '13', date: '2026-10-28', description: 'Dividend Payout', category: 'Investments', amount: 312.4, type: 'income' },
  { id: '14', date: '2026-10-25', description: 'Zara', category: 'Shopping', amount: 129.9, type: 'expense' },
  { id: '15', date: '2026-10-20', description: 'Trader Joe\'s', category: 'Food', amount: 96.3, type: 'expense' },
  { id: '16', date: '2026-10-15', description: 'Gym Membership', category: 'Health', amount: 59, type: 'expense' },
]

export const seedBudgets: Budget[] = [
  { category: 'Housing', limit: 1900 },
  { category: 'Food', limit: 500 },
  { category: 'Transport', limit: 200 },
  { category: 'Shopping', limit: 250 },
  { category: 'Entertainment', limit: 150 },
  { category: 'Health', limit: 150 },
  { category: 'Utilities', limit: 200 },
]

export const history = [
  { month: 'Jun', income: 6400, expenses: 3950 },
  { month: 'Jul', income: 6900, expenses: 4210 },
  { month: 'Aug', income: 6200, expenses: 3780 },
  { month: 'Sep', income: 7350, expenses: 4400 },
  { month: 'Oct', income: 6512, expenses: 3890 },
]

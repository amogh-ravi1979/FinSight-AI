
import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Budget, Transaction } from './types'
import { seedBudgets, seedTx, MONTH, START_BALANCE } from './data'

type StoreContextType = {
  transactions: Transaction[]
  budgets: Budget[]
  income: number
  expenses: number
  savings: number
  savingsRate: number
  balance: number
  spent: Record<string, number>
  trend: { month: string; income: number; expenses: number }[]
  addTx: (tx: Transaction) => void
  removeTx: (id: string) => void
  setLimit: (category: string, limit: number) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(seedTx)
  const [budgets, setBudgets] = useState<Budget[]>(seedBudgets)

  const value = useMemo(() => {
    const monthly = transactions.filter(t => t.date.startsWith(MONTH))

    const income = monthly
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const expenses = monthly
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const savings = income - expenses
    const spent: Record<string, number> = {}

    monthly
      .filter(t => t.type === 'expense')
      .forEach(t => {
        spent[t.category] = (spent[t.category] || 0) + t.amount
      })

    return {
      transactions,
      budgets,
      income,
      expenses,
      savings,
      savingsRate: income ? (savings / income) * 100 : 0,
      balance: START_BALANCE + savings,
      spent,
      trend: [
        { month: 'Jun', income: 6400, expenses: 3950 },
        { month: 'Jul', income: 6900, expenses: 4210 },
        { month: 'Aug', income: 6200, expenses: 3780 },
        { month: 'Sep', income: 7350, expenses: 4400 },
        { month: 'Oct', income: 6512, expenses: 3890 },
        { month: 'Nov', income, expenses },
      ],
      addTx: (tx: Transaction) =>
        setTransactions(prev => [tx, ...prev]),
      removeTx: (id: string) =>
        setTransactions(prev => prev.filter(t => t.id !== id)),
      setLimit: (category: string, limit: number) =>
        setBudgets(prev =>
          prev.map(b => b.category === category ? { ...b, limit } : b)
        ),
    }
  }, [transactions, budgets])

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used inside StoreProvider')
  }
  return context
}

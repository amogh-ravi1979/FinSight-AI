
import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'
import {
  ArrowDownLeft, ArrowUpRight, PiggyBank, Wallet
} from 'lucide-react'
import { useStore } from '../store'
import { COLORS, fmt } from '../data'
import { Card, PageHeader, tooltipStyle } from '../components/ui'
import type { Category } from '../types'

export default function Dashboard({
  go
}: {
  go: (p: 'transactions' | 'advisor') => void
}) {
  const s = useStore()
  const pie = Object.entries(s.spent).map(
    ([name, value]) => ({ name, value: Math.round(value) })
  )

  const cards = [
    { label: 'Total Balance', value: s.balance, icon: Wallet, tone: 'from-cyan-400/20', note: 'Across all accounts' },
    { label: 'Income (Nov)', value: s.income, icon: ArrowDownLeft, tone: 'from-emerald-400/20', note: 'This month' },
    { label: 'Expenses (Nov)', value: s.expenses, icon: ArrowUpRight, tone: 'from-rose-400/20', note: 'This month' },
    { label: 'Savings', value: s.savings, icon: PiggyBank, tone: 'from-violet-400/20', note: `${s.savingsRate.toFixed(1)}% savings rate` },
  ]

  return (
    <>
      <PageHeader
        title="Welcome back, Alex 👋"
        sub="Here's your financial snapshot for November 2026."
        action={
          <button
            onClick={() => go('advisor')}
            className="rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-900"
          >
            Ask AI Advisor
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(c => (
          <Card key={c.label} className={`bg-gradient-to-br ${c.tone} to-transparent`}>
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-sm">{c.label}</span>
              <c.icon size={18} />
            </div>
            <p className="mt-3 text-3xl font-bold">{fmt(c.value)}</p>
            <p className="mt-1 text-xs text-slate-400">{c.note}</p>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <h2 className="mb-4 font-semibold">Income vs Expenses</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={s.trend}>
                <defs>
                  <linearGradient id="gi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => fmt(v)} />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fill="url(#gi)" />
                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} fill="url(#ge)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="mb-2 font-semibold">Spending by Category</h2>
          <div className="h-52">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pie} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="none">
                  {pie.map(p => (
                    <Cell key={p.name} fill={COLORS[p.name as Category]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} formatter={(v: number) => fmt(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-300">
            {pie.map(p => (
              <span key={p.name} className="flex items-center gap-2">
                <i className="h-2 w-2 rounded-full" style={{ background: COLORS[p.name as Category] }} />
                {p.name} · {fmt(p.value)}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Recent Transactions</h2>
          <button onClick={() => go('transactions')} className="text-sm text-emerald-300 hover:underline">
            View all
          </button>
        </div>
        <ul className="divide-y divide-white/5">
          {s.transactions.slice(0, 5).map(t => (
            <li key={t.id} className="flex items-center justify-between py-3 text-sm">
              <div className="flex items-center gap-3">
                <i className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[t.category] }} />
                <div>
                  <p className="font-medium">{t.description}</p>
                  <p className="text-xs text-slate-500">{t.category} · {t.date}</p>
                </div>
              </div>
              <span className={t.type === 'income' ? 'text-emerald-400' : 'text-slate-200'}>
                {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}


import { useMemo, useState } from 'react'
import { Plus, Search, Trash2 } from 'lucide-react'
import { useStore } from '../store'
import { COLORS, EXPENSE_CATS, INCOME_CATS, fmt } from '../data'
import { Card, PageHeader, inputCls } from '../components/ui'
import type { Category } from '../types'

export default function Transactions() {
  const { transactions, addTx, removeTx } = useStore()
  const [q, setQ] = useState('')
  const [type, setType] = useState<'all' | 'income' | 'expense'>('all')
  const [cat, setCat] = useState('all')
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: 'Food' as Category,
    date: '2026-11-06',
  })

  const list = useMemo(() =>
    transactions
      .filter(t =>
        (type === 'all' || t.type === type) &&
        (cat === 'all' || t.category === cat) &&
        t.description.toLowerCase().includes(q.toLowerCase())
      )
      .sort((a, b) => b.date.localeCompare(a.date)),
    [transactions, q, type, cat]
  )

  const submit = () => {
    const amount = parseFloat(form.amount)
    if (!form.description.trim() || !(amount > 0)) return

    addTx({
      ...form,
      description: form.description.trim(),
      amount,
    })

    setForm({ ...form, description: '', amount: '' })
    setOpen(false)
  }

  const cats = form.type === 'income' ? INCOME_CATS : EXPENSE_CATS

  return (
    <>
      <PageHeader
        title="Transactions"
        sub={`${list.length} transactions`}
        action={
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-900"
          >
            <Plus size={16} /> Add
          </button>
        }
      />

      {open && (
        <Card className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <input
            className={`${inputCls} lg:col-span-2`}
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          <input
            className={inputCls}
            type="number"
            min="0"
            placeholder="Amount"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
          />

          <select
            className={inputCls}
            value={form.type}
            onChange={e => {
              const t = e.target.value as 'income' | 'expense'
              setForm({
                ...form,
                type: t,
                category: t === 'income' ? 'Salary' : 'Food',
              })
            }}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <select
            className={inputCls}
            value={form.category}
            onChange={e => setForm({
              ...form,
              category: e.target.value as Category,
            })}
          >
            {cats.map(c => <option key={c} className="bg-slate-900">{c}</option>)}
          </select>

          <input
            className={inputCls}
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
          />

          <button
            onClick={submit}
            className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 sm:col-span-2 lg:col-span-6"
          >
            Save transaction
          </button>
        </Card>
      )}

      <Card>
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="relative min-w-48 flex-1">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-500" />
            <input
              className={`${inputCls} w-full pl-9`}
              placeholder="Search…"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>

          <select
            className={inputCls}
            value={type}
            onChange={e => setType(e.target.value as typeof type)}
          >
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            className={inputCls}
            value={cat}
            onChange={e => setCat(e.target.value)}
          >
            <option value="all">All categories</option>
            {[...EXPENSE_CATS, ...INCOME_CATS].map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <ul className="divide-y divide-white/5">
          {list.map(t => (
            <li key={t.id} className="flex items-center justify-between gap-3 py-3 text-sm">
              <div className="flex min-w-0 items-center gap-3">
                <i
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: COLORS[t.category] }}
                />
                <div className="min-w-0">
                  <p className="truncate font-medium">{t.description}</p>
                  <p className="text-xs text-slate-500">{t.category} · {t.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={t.type === 'income' ? 'text-emerald-400' : ''}>
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                </span>
                <button
                  onClick={() => removeTx(t.id)}
                  aria-label="Delete"
                  className="text-slate-500 hover:text-rose-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}

          {!list.length && (
            <li className="py-10 text-center text-slate-500">
              No transactions match your filters.
            </li>
          )}
        </ul>
      </Card>
    </>
  )
}

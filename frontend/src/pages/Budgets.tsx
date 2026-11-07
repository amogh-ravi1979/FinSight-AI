
import { useStore } from '../store'
import { COLORS, fmt } from '../data'
import { Card, PageHeader, inputCls } from '../components/ui'

export default function Budgets() {
  const { budgets, spent, setLimit } = useStore()

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0)
  const totalSpent = budgets.reduce(
    (s, b) => s + (spent[b.category] || 0), 0
  )

  return (
    <>
      <PageHeader
        title="Budgets"
        sub={`${fmt(totalSpent)} of ${fmt(totalLimit)} used this month`}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {budgets.map(b => {
          const used = spent[b.category] || 0
          const pct = Math.min((used / b.limit) * 100, 100)
          const over = used > b.limit
          const warn = !over && used / b.limit > 0.8

          return (
            <Card key={b.category}>
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2 font-semibold">
                  <i
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: COLORS[b.category] }}
                  />
                  {b.category}
                </span>

                <span className={`rounded-full px-2.5 py-0.5 text-xs ${
                  over
                    ? 'bg-rose-500/20 text-rose-300'
                    : warn
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {over ? 'Over budget' : warn ? 'Near limit' : 'On track'}
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all ${
                    over ? 'bg-rose-500' : warn ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  {fmt(used)} spent
                </span>

                <label className="flex items-center gap-2 text-slate-400">
                  Limit $
                  <input
                    type="number"
                    min="0"
                    className={`${inputCls} w-24 py-1`}
                    value={b.limit}
                    onChange={e =>
                      setLimit(
                        b.category,
                        Math.max(0, Number(e.target.value))
                      )
                    }
                  />
                </label>
              </div>
            </Card>
          )
        })}
      </div>
    </>
  )
}

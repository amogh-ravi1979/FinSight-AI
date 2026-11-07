import { useState } from 'react'
import { LayoutDashboard, ArrowLeftRight, PiggyBank, Sparkles, TrendingUp } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Advisor from './pages/Advisor'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'budgets', label: 'Budgets', icon: PiggyBank },
  { id: 'advisor', label: 'AI Advisor', icon: Sparkles },
] as const
type Page = (typeof NAV)[number]['id']

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,#13203f_0%,#070b16_55%)]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-white/10 bg-black/20 p-5 backdrop-blur md:flex">
        <div className="mb-10 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500">
            <TrendingUp size={20} className="text-slate-900" />
          </div>
          <span className="text-lg font-bold tracking-tight">FinSight <span className="text-emerald-400">AI</span></span>
        </div>
        <nav className="space-y-1">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                page === n.id ? 'bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <n.icon size={18} /> {n.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-400">
          <p className="mb-1 font-semibold text-white">Alex Morgan</p>
          Premium plan · Demo data
        </div>
      </aside>

      <main className="px-4 pb-28 pt-6 md:ml-64 md:px-8 md:pb-10">
        <div className="mx-auto max-w-6xl">
          {page === 'dashboard' && <Dashboard go={setPage} />}
          {page === 'transactions' && <Transactions />}
          {page === 'budgets' && <Budgets />}
          {page === 'advisor' && <Advisor />}
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-white/10 bg-[#0a0f1e]/95 backdrop-blur md:hidden">
        {NAV.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)}
            className={`flex flex-col items-center gap-1 py-3 text-[11px] ${page === n.id ? 'text-emerald-300' : 'text-slate-500'}`}>
            <n.icon size={20} /> {n.label.replace('AI ', '')}
          </button>
        ))}
      </nav>
    </div>
  )
}
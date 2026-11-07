import { useEffect, useRef, useState } from 'react'
import { Bot, Send, User } from 'lucide-react'
import { useStore } from '../store'
import { fmt } from '../data'
import { Card, PageHeader, inputCls } from '../components/ui'

interface Msg { role: 'user' | 'ai'; text: string }
const SUGGESTIONS = ['Where am I overspending?', 'How are my savings?', 'What is my biggest expense?', 'Any investing tips?']

export default function Advisor() {
  const s = useStore()
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'ai', text: "Hi Alex! I'm your FinSight advisor. Ask me about your spending, budgets or savings." },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => {
  end.current?.scrollIntoView({ behavior: 'smooth' })
}, [msgs, typing])

  const answer = (q: string): string => {
    const l = q.toLowerCase()
    const top = Object.entries(s.spent).sort((a, b) => b[1] - a[1])
    const over = s.budgets.filter(b => (s.spent[b.category] || 0) > b.limit)
    if (/over|budget|limit/.test(l))
      return over.length
        ? `You're over budget in ${over.map(b => `${b.category} (${fmt(s.spent[b.category])} vs ${fmt(b.limit)})`).join(', ')}. Consider pausing discretionary spending there for the rest of the month.`
        : 'Great news: every category is within budget right now. Keep an eye on categories above 80% of their limit.'
    if (/sav/.test(l))
      return `You've saved ${fmt(s.savings)} this month, a ${s.savingsRate.toFixed(1)}% savings rate. ${s.savingsRate >= 20 ? "That beats the 20% rule of thumb. Consider moving the surplus into a high-yield account." : 'Aim for 20%: trimming about ' + fmt(Math.max(0, s.income * 0.2 - s.savings)) + ' of spending would get you there.'}`
    if (/spend|expens|biggest|top|most/.test(l))
      return top.length ? `Your biggest expense is ${top[0][0]} at ${fmt(top[0][1])}, followed by ${top[1]?.[0] ?? 'n/a'} at ${fmt(top[1]?.[1] ?? 0)}. Total spending is ${fmt(s.expenses)} against ${fmt(s.income)} income.` : 'No expenses recorded yet this month.'
    if (/invest|stock|etf/.test(l))
      return `With ${fmt(s.balance)} on hand, keep 3–6 months of expenses (about ${fmt(s.expenses * 4.5)}) as an emergency fund, then consider low-cost index funds for long-term growth. This is general information, not financial advice.`
    return "I can help with budgets, savings, spending breakdowns and investing basics. Try one of the suggestions below!"
  }

  const send = (text: string) => {
    if (!text.trim() || typing) return
    setMsgs(m => [...m, { role: 'user', text }])
    setInput(''); setTyping(true)
    setTimeout(() => { setMsgs(m => [...m, { role: 'ai', text: answer(text) }]); setTyping(false) }, 900)
  }

  return (
    <>
      <PageHeader title="AI Advisor" sub="Personalised insights based on your live data." />
      <Card className="flex h-[65vh] flex-col p-0">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${m.role === 'ai' ? 'bg-emerald-400/20 text-emerald-300' : 'bg-white/10'}`}>
                {m.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <p className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === 'ai' ? 'bg-white/5' : 'bg-emerald-400 text-slate-900'}`}>{m.text}</p>
            </div>
          ))}
          {typing && <p className="text-sm text-slate-500">Advisor is thinking…</p>}
          <div ref={end} />
        </div>
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map(x => (
              <button key={x} onClick={() => send(x)} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 hover:border-emerald-400/50 hover:text-emerald-300">{x}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <input className={`${inputCls} flex-1`} placeholder="Ask about your finances…" value={input}
              onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)} />
            <button onClick={() => send(input)} aria-label="Send" className="grid w-11 place-items-center rounded-xl bg-emerald-400 text-slate-900"><Send size={18} /></button>
          </div>
        </div>
      </Card>
    </>
  )
}
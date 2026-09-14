'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bot, Loader2, Send, Sparkles } from 'lucide-react'

type ChatMessage = { id?: string; body: string; senderUserId?: string; mine?: boolean }

export default function ChatPage() {
  const router = useRouter()
  const [matchId, setMatchId] = useState('')
  const [profile, setProfile] = useState<{ displayName: string; role: string; city: string; avatarUrl: string } | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [replying, setReplying] = useState(false)

  async function loadChat(id: string) {
    const response = await fetch(`/api/messages?match=${id}`)
    if (!response.ok) { setError('Không thể tải cuộc trò chuyện.'); return }
    const data = await response.json() as { messages: ChatMessage[] }
    setMessages(data.messages.map((item) => ({ ...item, mine: item.senderUserId !== 'seed-minh-anh' })))
  }

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('match') || ''
    setMatchId(id)
    if (!id) {
      fetch('/api/mock-chat', { method: 'POST' }).then(async (response) => {
        if (!response.ok) throw new Error()
        const data = await response.json() as { matchId: string; profile: typeof profile }
        setMatchId(data.matchId); setProfile(data.profile); window.history.replaceState(null, '', `/chat?match=${data.matchId}`); await loadChat(data.matchId)
      }).catch(() => setError('Hãy tạo mock users trước tại trang Khám phá.')).finally(() => setLoading(false))
    } else {
      Promise.all([loadChat(id), fetch('/api/mock-chat').then((response) => response.ok ? response.json() : null).then((data) => data?.profile && setProfile(data.profile))]).finally(() => setLoading(false))
    }
  }, [])

  async function send(event: FormEvent) {
    event.preventDefault()
    if (!body.trim() || !matchId || replying) return
    const text = body.trim(); setBody(''); setError('')
    const response = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ matchId, body: text }) })
    if (!response.ok) { setError('Tin nhắn chưa được gửi.'); return }
    await loadChat(matchId)
  }

  async function askAI() {
    if (!matchId || replying) return
    setReplying(true); setError('')
    const response = await fetch('/api/mock-chat/reply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ matchId }) })
    if (!response.ok) setError('Chưa thể nhận phản hồi AI.')
    else await loadChat(matchId)
    setReplying(false)
  }

  return <main className="min-h-screen bg-[#f8f6f3] px-4 py-6 text-[#2e2622] sm:px-8 sm:py-10"><section className="mx-auto grid min-h-[760px] max-w-6xl overflow-hidden rounded-[2rem] border border-[#eadfd8] bg-white shadow-xl shadow-[#6f2430]/10 lg:grid-cols-[300px_1fr]">
    <aside className="hidden border-r border-[#eadfd8] bg-[#fffaf7] p-5 lg:block"><button onClick={() => router.push('/matches')} className="mb-8 flex items-center gap-2 text-sm font-semibold text-[#9f1d35]"><ArrowLeft className="size-4" /> Kết nối</button><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b37f78]">Tin nhắn</p><div className="mt-5 rounded-2xl bg-white p-3 ring-1 ring-[#eadfd8]"><div className="flex items-center gap-3"><img src={profile?.avatarUrl || 'https://i.pravatar.cc/100?u=minh-anh'} alt="" className="size-12 rounded-full object-cover" /><div><p className="font-semibold">{profile?.displayName || 'Minh Anh'}</p><p className="text-xs text-[#927b70]">Đang tìm hiểu</p></div><span className="ml-auto size-2 rounded-full bg-emerald-500" /></div></div></aside>
    <div className="flex min-h-[760px] flex-col"><header className="flex items-center gap-3 border-b border-[#eadfd8] px-5 py-4 sm:px-7"><button onClick={() => router.push('/matches')} className="lg:hidden" aria-label="Quay lại"><ArrowLeft className="size-5 text-[#9f1d35]" /></button><img src={profile?.avatarUrl || 'https://i.pravatar.cc/100?u=minh-anh'} alt="" className="size-11 rounded-full object-cover" /><div><h1 className="font-serif text-2xl">{profile?.displayName || 'Minh Anh'}</h1><p className="text-xs text-[#927b70]">{profile?.role || 'Chuyên viên tín dụng'} · {profile?.city || 'Hà Nội'}</p></div><span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-700"><span className="size-2 rounded-full bg-emerald-500" /> Online</span></header>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-[linear-gradient(180deg,#fff,#fffaf7)] p-5 sm:p-8">{loading && <Loader2 className="mx-auto animate-spin text-[#9f1d35]" />}{!loading && !messages.length && <div className="m-auto text-center"><p className="font-serif text-2xl">Một lời chào thật tự nhiên</p><p className="mt-2 text-sm text-[#927b70]">Hãy bắt đầu cuộc trò chuyện của hai bạn.</p></div>}{messages.map((message, index) => <div key={message.id || index} className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.mine ? 'self-end rounded-br-md bg-[#9f1d35] text-white' : 'rounded-bl-md bg-[#f3e8e2] text-[#392b27]'}`}>{message.body}</div>)}{error && <p className="text-center text-sm text-red-700">{error}</p>}</div>
      <div className="border-t border-[#eadfd8] bg-white p-4 sm:px-7"><button type="button" onClick={askAI} disabled={replying || !matchId} className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e4c9c1] px-3 py-1.5 text-xs font-semibold text-[#9f1d35] disabled:opacity-50"><Sparkles className="size-3.5" /> {replying ? 'Đang trả lời...' : 'Nhờ AI trả lời mock user'}</button><form onSubmit={send} className="flex gap-3"><input value={body} onChange={(event) => setBody(event.target.value)} placeholder="Viết một lời chào..." className="min-w-0 flex-1 rounded-xl border border-[#eadfd8] bg-[#fffaf7] px-4 py-3 text-sm outline-none focus:border-[#9f1d35]" /><button className="rounded-xl bg-[#9f1d35] px-4 text-white transition hover:bg-[#84162b]" aria-label="Gửi"><Send className="size-4" /></button></form></div>
    </div></section></main>
}

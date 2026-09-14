'use client'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send } from 'lucide-react'

export default function ChatPage() {
  const router = useRouter()
  const [matchId, setMatchId] = useState('')
  const [body, setBody] = useState('')
  const [messages, setMessages] = useState<{ body: string; mine: boolean }[]>([])
  const [error, setError] = useState('')
  useEffect(() => { setMatchId(new URLSearchParams(window.location.search).get('match') || '') }, [])
  async function send(event: FormEvent) { event.preventDefault(); if (!body.trim() || !matchId) return; const text = body.trim(); const response = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ matchId, body: text }) }); if (!response.ok) return setError('Bạn cần chọn một cuộc trò chuyện hợp lệ.'); setMessages((current) => [...current, { body: text, mine: true }]); setBody('') }
  return <main className="min-h-screen bg-[#faf8f6] px-5 py-10 text-[#29231f]"><section className="mx-auto flex min-h-[680px] max-w-3xl flex-col rounded-3xl bg-white shadow-sm ring-1 ring-[#eadfd8]"><header className="flex items-center gap-4 border-b border-[#eadfd8] p-5"><button onClick={() => router.push('/matches')} aria-label="Quay lại"><ArrowLeft className="size-5 text-[#9f1d35]" /></button><div><h1 className="font-serif text-2xl">Tin nhắn</h1><p className="text-sm text-[#806e64]">Một cuộc trò chuyện mới</p></div></header><div className="flex flex-1 flex-col justify-end gap-3 p-5">{!messages.length && <p className="text-center text-sm text-[#9f8a7d]">Hãy bắt đầu bằng một lời chào chân thành.</p>}{messages.map((message, index) => <div key={index} className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${message.mine ? 'self-end bg-[#9f1d35] text-white' : 'bg-[#f4e8e1]'}`}>{message.body}</div>)}{error && <p className="text-sm text-red-700">{error}</p>}</div><form onSubmit={send} className="flex gap-3 border-t border-[#eadfd8] p-4"><input value={body} onChange={(event) => setBody(event.target.value)} placeholder="Viết một lời chào..." className="min-w-0 flex-1 rounded-xl border border-[#eadfd8] px-4 py-3 outline-none focus:border-[#9f1d35]" /><button className="rounded-xl bg-[#9f1d35] px-4 text-white" aria-label="Gửi"><Send className="size-4" /></button></form></section></main>
}

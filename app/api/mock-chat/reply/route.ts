import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { matches, messages, profiles } from '@/lib/db/schema'
import { and, eq, or } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (process.env.NODE_ENV === 'production') return NextResponse.json({ error: 'AI mock reply disabled' }, { status: 403 })
  const { matchId } = await request.json() as { matchId?: string }
  if (!matchId) return NextResponse.json({ error: 'Missing match' }, { status: 400 })
  const [match] = await db.select().from(matches).where(and(eq(matches.id, matchId), or(eq(matches.userAId, session.user.id), eq(matches.userBId, session.user.id))))
  if (!match) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const mockUserId = match.userAId === session.user.id ? match.userBId : match.userAId
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, mockUserId))
  const recent = await db.select().from(messages).where(eq(messages.matchId, matchId))
  const lastMessage = recent.at(-1)?.body || 'Chào bạn'
  let reply = 'Nghe thú vị đó. Mình cũng rất thích những cuộc trò chuyện tự nhiên như thế này.'
  if (process.env.OLLAMA_BASE_URL) {
    try {
      const response = await fetch(`${process.env.OLLAMA_BASE_URL}/api/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: process.env.OLLAMA_MODEL || 'qwen2.5:3b', prompt: `Bạn là ${profile?.displayName || 'một người bạn'} đang nhắn tin hẹn hò lịch sự bằng tiếng Việt. Trả lời ngắn, tự nhiên, ấm áp cho tin nhắn: "${lastMessage}". Chỉ trả về câu trả lời.`, stream: false }), signal: AbortSignal.timeout(5000) })
      if (response.ok) reply = (await response.json() as { response?: string }).response?.trim() || reply
    } catch {}
  }
  const [message] = await db.insert(messages).values({ id: randomUUID(), matchId, senderUserId: mockUserId, body: reply.slice(0, 2000) }).returning()
  return NextResponse.json({ message, provider: process.env.OLLAMA_BASE_URL ? 'ollama' : 'fallback' })
}

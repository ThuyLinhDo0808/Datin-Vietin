import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { matches, messages, profiles } from '@/lib/db/schema'
import { and, eq, or } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (process.env.NODE_ENV === 'production') return NextResponse.json({ error: 'Mock chat disabled' }, { status: 403 })

  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, 'seed-minh-anh'))
  if (!profile) return NextResponse.json({ error: 'Hãy tạo mock users trước.' }, { status: 404 })
  const [existing] = await db.select().from(matches).where(or(and(eq(matches.userAId, session.user.id), eq(matches.userBId, profile.userId)), and(eq(matches.userAId, profile.userId), eq(matches.userBId, session.user.id))))
  const match = existing ?? (await db.insert(matches).values({ id: randomUUID(), userAId: session.user.id, userBId: profile.userId }).returning())[0]
  const currentMessages = await db.select().from(messages).where(eq(messages.matchId, match.id))
  if (!currentMessages.length) await db.insert(messages).values([{ id: randomUUID(), matchId: match.id, senderUserId: profile.userId, body: 'Chào bạn, vui quá vì chúng ta đã kết nối. Hôm nay của bạn thế nào?' }, { id: randomUUID(), matchId: match.id, senderUserId: profile.userId, body: 'Mình thấy bạn cũng thích cà phê và du lịch — đây là hai chủ đề mình có thể nói cả ngày.' }])
  return NextResponse.json({ ok: true, matchId: match.id, profile })
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, 'seed-minh-anh'))
  if (!profile) return NextResponse.json({ error: 'Mock user chưa tồn tại.' }, { status: 404 })
  return NextResponse.json({ profile })
}

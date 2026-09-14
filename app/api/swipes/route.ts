import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { matches, profiles, swipes } from '@/lib/db/schema'
import { and, eq, or } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { targetProfileId, direction } = await request.json() as { targetProfileId?: string; direction?: string }
  if (!targetProfileId || !['like', 'pass'].includes(direction || '')) return NextResponse.json({ error: 'Invalid swipe' }, { status: 400 })
  const [target] = await db.select().from(profiles).where(eq(profiles.id, targetProfileId))
  if (!target || target.userId === session.user.id) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  await db.insert(swipes).values({ id: randomUUID(), swiperUserId: session.user.id, targetProfileId, direction: direction! }).onConflictDoUpdate({ target: [swipes.swiperUserId, swipes.targetProfileId], set: { direction: direction! } })
  let matched = false
  if (direction === 'like') {
    const [mine] = await db.select().from(profiles).where(eq(profiles.userId, session.user.id))
    const [reciprocal] = mine ? await db.select().from(swipes).where(and(eq(swipes.swiperUserId, target.userId), eq(swipes.targetProfileId, mine.id), eq(swipes.direction, 'like'))) : []
    if (reciprocal) { const [a, b] = [session.user.id, target.userId].sort(); await db.insert(matches).values({ id: randomUUID(), userAId: a, userBId: b }).onConflictDoNothing(); matched = true }
  }
  return NextResponse.json({ ok: true, matched })
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await db.select().from(matches).where(or(eq(matches.userAId, session.user.id), eq(matches.userBId, session.user.id)))
  return NextResponse.json({ matches: rows })
}

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { matches, messages } from '@/lib/db/schema'
import { and, eq, or } from 'drizzle-orm'
import { randomUUID } from 'crypto'

async function currentUser() { const session = await auth.api.getSession({ headers: await headers() }); return session?.user?.id }
export async function GET(request: Request) { const userId = await currentUser(); if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); const matchId = new URL(request.url).searchParams.get('match'); if (!matchId) return NextResponse.json({ messages: [] }); const [match] = await db.select().from(matches).where(and(eq(matches.id, matchId), or(eq(matches.userAId, userId), eq(matches.userBId, userId)))); if (!match) return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); return NextResponse.json({ messages: await db.select().from(messages).where(eq(messages.matchId, matchId)) }) }
export async function POST(request: Request) { const userId = await currentUser(); if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); const { matchId, body } = await request.json() as { matchId?: string; body?: string }; if (!matchId || !body?.trim()) return NextResponse.json({ error: 'Invalid message' }, { status: 400 }); const [match] = await db.select().from(matches).where(and(eq(matches.id, matchId), or(eq(matches.userAId, userId), eq(matches.userBId, userId)))); if (!match) return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); const [message] = await db.insert(messages).values({ id: randomUUID(), matchId, senderUserId: userId, body: body.trim().slice(0, 2000) }).returning(); return NextResponse.json({ message }) }

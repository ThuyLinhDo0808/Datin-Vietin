import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { preferences, profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export async function POST(request: Request) { const session = await auth.api.getSession({ headers: await headers() }); if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); const form = await request.formData(); const interests = JSON.parse(String(form.get('interests') || '[]')); const profile = { userId: session.user.id, displayName: String(form.get('displayName') || session.user.name), age: Number(form.get('age')), city: String(form.get('city') || ''), role: String(form.get('role') || ''), bio: String(form.get('bio') || ''), interests, avatarUrl: session.user.image || '' }; const existing = await db.select({ id: profiles.id }).from(profiles).where(eq(profiles.userId, session.user.id)); if (existing[0]) await db.update(profiles).set({ ...profile, updatedAt: new Date() }).where(eq(profiles.userId, session.user.id)); else await db.insert(profiles).values({ id: randomUUID(), ...profile }); const pref = { userId: session.user.id, minAge: Number(form.get('minAge') || 25), maxAge: Number(form.get('maxAge') || 35), interests, cities: [profile.city], relationshipGoal: 'relationship' }; const existingPref = await db.select({ id: preferences.id }).from(preferences).where(eq(preferences.userId, session.user.id)); if (existingPref[0]) await db.update(preferences).set({ ...pref, updatedAt: new Date() }).where(eq(preferences.userId, session.user.id)); else await db.insert(preferences).values({ id: randomUUID(), ...pref }); return NextResponse.json({ ok: true }) }

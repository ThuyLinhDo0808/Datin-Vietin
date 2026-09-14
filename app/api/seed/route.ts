import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { preferences, profiles } from '@/lib/db/schema'
import { randomUUID } from 'crypto'
import { eq } from 'drizzle-orm'

const people = [
  ['Minh Anh', 28, 'Hà Nội', 'Chuyên viên tín dụng', 'Thích những buổi cà phê chậm và các chuyến đi ngắn cuối tuần.', ['Cà phê', 'Du lịch', 'Sách']],
  ['Hoàng Nam', 31, 'Hà Nội', 'Kỹ sư dữ liệu', 'Tò mò, yêu công nghệ và luôn tìm một quán ăn mới.', ['Ẩm thực', 'Chạy bộ', 'Âm nhạc']],
  ['Lan Chi', 26, 'TP. Hồ Chí Minh', 'Chuyên viên khách hàng', 'Tin rằng những cuộc trò chuyện hay bắt đầu từ sự chân thành.', ['Yoga', 'Nhiếp ảnh', 'Du lịch']],
  ['Tuấn Minh', 29, 'Đà Nẵng', 'Quản lý chi nhánh', 'Cuối tuần thường chạy bộ rồi nấu một bữa thật ngon.', ['Chạy bộ', 'Ẩm thực', 'Cà phê']],
  ['Thảo Nguyên', 30, 'Hà Nội', 'Chuyên viên pháp chế', 'Yêu sách, những góc phố yên tĩnh và người biết lắng nghe.', ['Sách', 'Nhiếp ảnh', 'Âm nhạc']],
]

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (process.env.NODE_ENV === 'production') return NextResponse.json({ error: 'Seed disabled' }, { status: 403 })
  let created = 0
  for (const [displayName, age, city, role, bio, interests] of people) {
    const userId = `seed-${String(displayName).toLowerCase().replaceAll(' ', '-')}`
    const [exists] = await db.select({ id: profiles.id }).from(profiles).where(eq(profiles.userId, userId))
    if (exists) continue
    await db.insert(profiles).values({ id: userId, userId, displayName: String(displayName), age: Number(age), city: String(city), role: String(role), bio: String(bio), interests: interests as string[], avatarUrl: `https://i.pravatar.cc/600?u=${userId}` })
    await db.insert(preferences).values({ id: randomUUID(), userId, minAge: 25, maxAge: 35, cities: [String(city)], interests: interests as string[] })
    created++
  }
  return NextResponse.json({ ok: true, created })
}

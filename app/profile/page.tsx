'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const interestOptions = ['Cà phê', 'Du lịch', 'Sách', 'Chạy bộ', 'Ẩm thực', 'Âm nhạc', 'Yoga', 'Nhiếp ảnh']

export default function ProfilePage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])
  const [profile, setProfile] = useState<Record<string, string | number>>({})
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/profile').then(async (response) => {
      if (response.status === 401) return router.replace('/sign-in')
      const data = await response.json()
      if (!data.profile) return router.replace('/onboarding')
      setProfile(data.profile)
      setSelected(data.profile.interests || [])
    }).catch(() => setError('Không thể tải hồ sơ.'))
  }, [router])

  function update(name: string, value: string) { setProfile((current) => ({ ...current, [name]: value })) }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError('')
    const form = new FormData(event.currentTarget)
    form.set('interests', JSON.stringify(selected))
    const response = await fetch('/api/profile', { method: 'POST', body: form })
    setSaving(false)
    if (!response.ok) return setError('Không thể lưu hồ sơ. Vui lòng thử lại.')
    router.push('/')
  }

  return <main className="min-h-screen bg-[#faf8f6] px-5 py-10"><section className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-xl shadow-[#552c2012] ring-1 ring-[#eadfd8]"><button type="button" onClick={() => router.push('/')} className="mb-6 text-sm font-semibold text-[#9f1d35]">← Quay lại khám phá</button><p className="text-sm font-semibold text-[#9f1d35]">Hồ sơ cá nhân</p><h1 className="mt-2 font-serif text-4xl text-[#392b27]">Cập nhật thông tin của bạn</h1><p className="mt-2 text-sm text-[#9f8a7d]">Hồ sơ này giúp hệ thống tìm những kết nối phù hợp hơn.</p><form onSubmit={submit} className="mt-8 flex flex-col gap-5"><div className="grid gap-4 sm:grid-cols-2">{[['displayName','Tên hiển thị'],['age','Tuổi'],['city','Thành phố'],['role','Đơn vị / vị trí công việc']].map(([name, placeholder]) => <input key={name} name={name} required={name !== 'role'} type={name === 'age' ? 'number' : 'text'} value={profile[name] ?? ''} onChange={(event) => update(name, event.target.value)} placeholder={placeholder} className="rounded-xl border border-[#eadfd8] px-4 py-3 outline-none focus:border-[#9f1d35]" />)}</div><textarea name="bio" value={profile.bio ?? ''} onChange={(event) => update('bio', event.target.value)} placeholder="Một vài điều về bạn..." rows={4} className="rounded-xl border border-[#eadfd8] px-4 py-3 outline-none focus:border-[#9f1d35]" /><div><p className="mb-3 text-sm font-semibold">Sở thích</p><div className="flex flex-wrap gap-2">{interestOptions.map((interest) => <button type="button" key={interest} onClick={() => setSelected((current) => current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest])} className={`rounded-full border px-4 py-2 text-sm ${selected.includes(interest) ? 'border-[#9f1d35] bg-[#9f1d35] text-white' : 'border-[#eadfd8] text-[#806e64]'}`}>{interest}</button>)}</div></div>{error && <p className="text-sm text-red-700">{error}</p>}<button disabled={saving} className="rounded-xl bg-[#9f1d35] px-5 py-3 font-semibold text-white disabled:opacity-60">{saving ? 'Đang lưu...' : 'Lưu hồ sơ'}</button></form></section></main>
}

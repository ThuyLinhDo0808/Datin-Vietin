'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'

export default function SignInPage() {
  const router = useRouter(); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent) { event.preventDefault(); setLoading(true); setError(''); if (!email.toLowerCase().endsWith('@vietinbank.vn')) { setError('Vui lòng dùng email Vietinbank (@vietinbank.vn).'); setLoading(false); return } const result = await authClient.signIn.email({ email, password }); if (result.error) setError('Email hoặc mật khẩu chưa chính xác.'); else { router.push('/'); router.refresh() }; setLoading(false) }
  return <AuthFrame title="Chào mừng trở lại" subtitle="Đăng nhập để tiếp tục hành trình kết nối của bạn."><form onSubmit={submit} className="flex flex-col gap-4"><input required type="email" placeholder="email@vietinbank.vn" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border border-[#eadfd8] bg-white px-4 py-3 outline-none focus:border-[#9f1d35]" /><input required type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl border border-[#eadfd8] bg-white px-4 py-3 outline-none focus:border-[#9f1d35]" />{error && <p className="text-sm text-[#9f1d35]">{error}</p>}<button disabled={loading} className="rounded-xl bg-[#9f1d35] py-3 font-semibold text-white disabled:opacity-60">{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button><p className="text-center text-sm text-[#806e64]">Chưa có tài khoản? <Link className="font-semibold text-[#9f1d35]" href="/sign-up">Đăng ký</Link></p></form></AuthFrame>
}

function AuthFrame({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) { return <main className="flex min-h-screen items-center justify-center bg-transparent px-5"><section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-[#552c2012] ring-1 ring-[#eadfd8]"><div className="mb-8 text-center"><div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#9f1d35] text-xl text-white">♥</div><h1 className="font-serif text-3xl text-[#392b27]">{title}</h1><p className="mt-2 text-sm text-[#9f8a7d]">{subtitle}</p></div>{children}</section></main> }

'use client'

import { useMemo, useState } from 'react'
import {
  Bell,
  Check,
  ChevronDown,
  Heart,
  Info,
  MessageCircle,
  MoreHorizontal,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'

type Profile = {
  id: number
  name: string
  role: string
  location: string
  age: number
  image: string
  tags: string[]
  intro: string
  match: number
}

const profiles: Profile[] = [
  { id: 1, name: 'Minh Anh', role: 'Chuyên viên Khối Khách hàng Doanh nghiệp', location: 'Hà Nội', age: 27, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=85', tags: ['Cà phê sáng', 'Du lịch', 'Sách'], intro: 'Thích những cuộc trò chuyện có chiều sâu và một ngày cuối tuần thật chậm.', match: 96 },
  { id: 2, name: 'Hoàng Nam', role: 'Chuyên viên Trung tâm Công nghệ', location: 'Hà Nội', age: 29, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85', tags: ['Chạy bộ', 'Nhiếp ảnh', 'Ẩm thực'], intro: 'Luôn sẵn sàng cho một cung đường mới hoặc một quán ăn chưa thử.', match: 91 },
  { id: 3, name: 'Thùy Linh', role: 'Phó phòng Vận hành', location: 'TP. Hồ Chí Minh', age: 28, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85', tags: ['Yoga', 'Âm nhạc', 'Biển'], intro: 'Tìm một người cùng xây những điều nhỏ xinh mỗi ngày.', match: 88 },
]

const matches = [
  { name: 'Lan Phương', message: 'Cuối tuần này bạn có hay đi cà phê không?', time: '10:42', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
  { name: 'Minh Anh', message: 'Rất vui vì chúng ta đã kết nối.', time: 'Hôm qua', image: profiles[0].image },
]

export default function Page() {
  const [activeTab, setActiveTab] = useState('Khám phá')
  const [index, setIndex] = useState(0)
  const [liked, setLiked] = useState<number[]>([])
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const [sentMessages, setSentMessages] = useState<string[]>([])
  const current = profiles[index % profiles.length]
  const visibleProfiles = useMemo(() => profiles.filter((profile) => `${profile.name} ${profile.role} ${profile.location} ${profile.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase())), [search])

  function swipe(isLike: boolean) {
    if (isLike) setLiked((items) => [...items, current.id])
    setIndex((value) => value + 1)
  }

  function sendMessage() {
    if (!message.trim()) return
    setSentMessages((items) => [...items, message.trim()])
    setMessage('')
  }

  return (
    <main className="min-h-screen bg-[#faf8f6] text-[#29231f]">
      <header className="sticky top-0 z-20 border-b border-[#e9e1da] bg-[#faf8f6]/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-10">
          <button className="flex items-center gap-3" onClick={() => setActiveTab('Khám phá')}>
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#9f1d35] text-white shadow-sm"><Heart className="size-5 fill-current" /></div>
            <div className="text-left"><div className="text-xl font-semibold tracking-tight text-[#8f1930]">Datin Vietin</div><div className="text-[11px] uppercase tracking-[0.2em] text-[#9f8a7d]">Vì một Vietin không cô đơn</div></div>
          </button>
          <nav className="hidden items-center gap-8 text-sm font-medium text-[#806e64] md:flex">
            {['Khám phá', 'Kết nối', 'Trò chuyện'].map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`relative py-7 transition ${activeTab === tab ? 'text-[#9f1d35]' : 'hover:text-[#9f1d35]'}`}>{tab}{tab === 'Trò chuyện' && <span className="ml-2 rounded-full bg-[#f2dce1] px-1.5 py-0.5 text-[10px] text-[#9f1d35]">2</span>}{activeTab === tab && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#9f1d35]" />}</button>)}
          </nav>
          <div className="flex items-center gap-3"><button aria-label="Thông báo" className="rounded-full p-2.5 text-[#806e64] hover:bg-[#f0e8e2]"><Bell className="size-5" /></button><div className="flex items-center gap-2 border-l border-[#e9e1da] pl-3"><img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=120&q=80" alt="Ảnh đại diện của Ngọc" className="size-9 rounded-full object-cover" /><div className="hidden text-sm md:block"><div className="font-semibold">Ngọc Trần</div><div className="text-xs text-[#9f8a7d]">Khối Vận hành</div></div><ChevronDown className="size-4 text-[#9f8a7d]" /></div></div>
        </div>
      </header>

      {activeTab === 'Trò chuyện' ? <ChatView message={message} setMessage={setMessage} sendMessage={sendMessage} sentMessages={sentMessages} /> : <div className="mx-auto grid max-w-7xl gap-10 px-5 py-9 lg:grid-cols-[240px_1fr_300px] lg:px-10">
        <aside className="hidden lg:block"><Sidebar activeTab={activeTab} setActiveTab={setActiveTab} /></aside>
        <section className="mx-auto w-full max-w-[620px]">
          <div className="mb-7 flex items-end justify-between"><div><div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#9f1d35]"><Sparkles className="size-4" />Gợi ý dành riêng cho bạn</div><h1 className="font-serif text-4xl tracking-tight text-[#392b27]">Tìm một người đồng điệu</h1><p className="mt-2 text-sm text-[#9f8a7d]">Dựa trên sở thích và điều bạn đang tìm kiếm.</p></div><div className="rounded-full bg-white px-3 py-1.5 text-xs text-[#9f8a7d] ring-1 ring-[#e9e1da]"><span className="font-semibold text-[#9f1d35]">{Math.min(index + 1, profiles.length)}</span> / {profiles.length} gợi ý</div></div>
          <div className="relative overflow-hidden rounded-[28px] bg-white shadow-[0_20px_60px_-28px_rgba(85,44,32,0.35)] ring-1 ring-[#eadfd8]"><div className="relative aspect-[0.88] overflow-hidden"><img src={current.image} alt={`Ảnh của ${current.name}`} className="size-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" /><div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#9f1d35]"><Sparkles className="size-3.5" />Phù hợp {current.match}%</div><div className="absolute inset-x-6 bottom-6 text-white"><div className="flex items-baseline gap-2"><h2 className="font-serif text-4xl">{current.name}</h2><span className="text-xl font-light">{current.age}</span></div><p className="mt-1 text-sm text-white/85">{current.role} · {current.location}</p><p className="mt-4 max-w-md text-sm leading-6 text-white/90">{current.intro}</p><div className="mt-4 flex flex-wrap gap-2">{current.tags.map((tag) => <span key={tag} className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs backdrop-blur">{tag}</span>)}</div></div></div><div className="flex items-center justify-center gap-5 px-6 py-5"><button onClick={() => swipe(false)} aria-label="Bỏ qua" className="flex size-14 items-center justify-center rounded-full border border-[#eadfd8] text-[#806e64] transition hover:-translate-y-1 hover:border-[#9f1d35] hover:text-[#9f1d35]"><X className="size-6" /></button><button onClick={() => swipe(true)} aria-label="Thích" className="flex size-[68px] items-center justify-center rounded-full bg-[#9f1d35] text-white shadow-lg shadow-[#9f1d35]/20 transition hover:-translate-y-1 hover:bg-[#85162b]"><Heart className="size-7 fill-current" /></button><button aria-label="Xem thông tin" className="flex size-14 items-center justify-center rounded-full border border-[#eadfd8] text-[#806e64] transition hover:-translate-y-1 hover:border-[#9f1d35] hover:text-[#9f1d35]"><Info className="size-6" /></button></div></div>
          <div className="mt-7 flex items-center justify-center gap-2 text-xs text-[#9f8a7d]"><ShieldCheck className="size-4 text-[#9f1d35]" />Mọi kết nối đều riêng tư và được xác thực nội bộ</div>
        </section>
        <aside className="hidden lg:block"><div className="mb-5 flex items-center justify-between"><h2 className="font-serif text-2xl">Kết nối gần đây</h2><button onClick={() => setActiveTab('Kết nối')} className="text-xs font-semibold text-[#9f1d35]">Xem tất cả</button></div><div className="flex flex-col gap-3">{visibleProfiles.slice(0, 3).map((profile) => <div key={profile.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-[#ede3dd]"><img src={profile.image} alt={`Ảnh ${profile.name}`} className="size-12 rounded-xl object-cover" /><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{profile.name}</div><div className="truncate text-xs text-[#9f8a7d]">{profile.role}</div></div><MessageCircle className="size-4 text-[#9f1d35]" /></div>)}</div><div className="mt-8 rounded-2xl bg-[#fffaf5] p-5 ring-1 ring-[#eadfd8]"><div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Sparkles className="size-4 text-[#c58f47]" />Trợ lý Datin AI</div><p className="text-sm leading-6 text-[#806e64]">Bạn có thể thêm sở thích để mình tìm được những kết nối phù hợp hơn.</p><div className="mt-4 flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 ring-1 ring-[#eadfd8]"><Search className="size-4 text-[#b09c90]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm theo sở thích..." className="w-full bg-transparent text-xs outline-none placeholder:text-[#b09c90]" /></div></div><div className="mt-8 border-t border-[#e9e1da] pt-5"><div className="text-xs leading-5 text-[#b09c90]">Slogan<br /><span className="font-serif text-sm italic text-[#806e64]">Đầu tư đúng chỗ, yêu thương đúng người.</span></div></div></aside>
      </div>}
    </main>
  )
}

function Sidebar({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  return <><div className="mb-7"><div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#b09c90]">Không gian của bạn</div><div className="flex flex-col gap-1">{[['Khám phá', Sparkles], ['Kết nối', Heart], ['Trò chuyện', MessageCircle]].map(([label, Icon]) => <button key={label as string} onClick={() => setActiveTab(label as string)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium ${activeTab === label ? 'bg-[#f3e4e4] text-[#9f1d35]' : 'text-[#806e64] hover:bg-[#f1ebe7]'}`}><Icon className="size-[18px]" />{label as string}{label === 'Trò chuyện' && <span className="ml-auto rounded-full bg-[#9f1d35] px-2 py-0.5 text-[10px] text-white">2</span>}</button>)}</div></div><div className="border-t border-[#e9e1da] pt-7"><div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#b09c90]">Tiêu chí tìm kiếm</div><div className="flex flex-wrap gap-2"><span className="rounded-full bg-white px-3 py-1.5 text-xs text-[#806e64] ring-1 ring-[#e9e1da]">Hà Nội</span><span className="rounded-full bg-white px-3 py-1.5 text-xs text-[#806e64] ring-1 ring-[#e9e1da]">25–32 tuổi</span></div><button className="mt-4 text-xs font-semibold text-[#9f1d35] underline underline-offset-4">Chỉnh sửa tiêu chí</button></div><div className="mt-10 rounded-2xl bg-[#f1e5dc] p-4"><ShieldCheck className="mb-3 size-5 text-[#9f1d35]" /><div className="text-sm font-semibold">Không gian riêng tư</div><p className="mt-1 text-xs leading-5 text-[#806e64]">Chỉ đồng nghiệp Vietinbank đã xác thực mới có thể tham gia.</p></div></>
}

function ChatView({ message, setMessage, sendMessage, sentMessages }: { message: string; setMessage: (value: string) => void; sendMessage: () => void; sentMessages: string[] }) {
  return <div className="mx-auto grid max-w-7xl gap-8 px-5 py-9 lg:grid-cols-[280px_1fr] lg:px-10"><section className="rounded-3xl bg-white p-5 ring-1 ring-[#eadfd8]"><div className="mb-5 flex items-center justify-between"><h1 className="font-serif text-3xl">Trò chuyện</h1><button aria-label="Tùy chọn"><MoreHorizontal className="size-5 text-[#9f8a7d]" /></button></div><div className="mb-4 flex items-center gap-2 rounded-xl bg-[#faf8f6] px-3 py-2 text-xs text-[#9f8a7d]"><Search className="size-4" /><span>Tìm cuộc trò chuyện</span></div><div className="flex flex-col gap-2">{matches.map((match, itemIndex) => <button key={match.name} className={`flex items-center gap-3 rounded-2xl p-3 text-left ${itemIndex === 0 ? 'bg-[#f8eef0]' : 'hover:bg-[#faf8f6]'}`}><img src={match.image} alt={`Ảnh ${match.name}`} className="size-11 rounded-full object-cover" /><div className="min-w-0 flex-1"><div className="flex justify-between text-sm font-semibold"><span>{match.name}</span><span className="text-[10px] font-normal text-[#b09c90]">{match.time}</span></div><p className="truncate text-xs text-[#9f8a7d]">{match.message}</p></div>{itemIndex === 0 && <span className="size-2 rounded-full bg-[#9f1d35]" />}</button>)}</div></section><section className="flex min-h-[540px] flex-col rounded-3xl bg-white ring-1 ring-[#eadfd8]"><div className="flex items-center justify-between border-b border-[#eee5df] px-6 py-5"><div className="flex items-center gap-3"><img src={matches[0].image} alt="Ảnh Lan Phương" className="size-11 rounded-full object-cover" /><div><div className="font-semibold">Lan Phương</div><div className="flex items-center gap-1 text-xs text-[#9f8a7d]"><span className="size-1.5 rounded-full bg-emerald-500" />Đang hoạt động</div></div></div><button aria-label="Thông tin cuộc trò chuyện"><Info className="size-5 text-[#9f8a7d]" /></button></div><div className="flex flex-1 flex-col justify-end gap-3 p-6"><div className="flex justify-center"><span className="rounded-full bg-[#faf8f6] px-3 py-1 text-[10px] text-[#b09c90]">Hôm nay</span></div><div className="max-w-[75%] self-start rounded-2xl rounded-bl-md bg-[#f4ece7] px-4 py-3 text-sm leading-6 text-[#493a34]">Cuối tuần này bạn có hay đi cà phê không?</div>{sentMessages.map((item) => <div key={item} className="max-w-[75%] self-end rounded-2xl rounded-br-md bg-[#9f1d35] px-4 py-3 text-sm leading-6 text-white">{item}</div>)}<div className="mt-3 flex gap-3 rounded-2xl bg-[#faf8f6] p-2"><input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) sendMessage() }} placeholder="Viết một lời chào..." className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-[#b09c90]" /><button onClick={sendMessage} aria-label="Gửi tin nhắn" className="flex size-10 items-center justify-center rounded-xl bg-[#9f1d35] text-white"><Send className="size-4" /></button></div></div></section></div>
}

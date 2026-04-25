import { useState } from 'react'
import { useAuthStore } from '../shared/store/authStore'
import { useLogout } from '../domain/auth/hooks'
import LeftPanel from '../domain/trip/components/LeftPanel'

export default function MainPage() {
  const nickname = useAuthStore((s) => s.nickname)
  const { logout } = useLogout()
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-navy text-white px-5 py-3 flex items-center justify-between shadow z-10 shrink-0">
        <h1 className="text-lg font-bold">Pinner</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-200 hidden sm:block">{nickname}</span>
          <button onClick={logout} className="text-sm text-sky hover:underline">
            로그아웃
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Left Panel — desktop: always visible, mobile: slide overlay */}
        <aside
          className={`
            bg-white border-r border-gray-200 overflow-hidden shrink-0 transition-all duration-300
            hidden md:flex md:flex-col md:w-80
          `}
        >
          <LeftPanel />
        </aside>

        {/* Mobile slide panel */}
        {isPanelOpen && (
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setIsPanelOpen(false)}
          >
            <div className="absolute inset-0 bg-black/40" />
            <aside
              className="absolute bottom-0 left-0 right-0 h-[70vh] bg-white rounded-t-2xl shadow-xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="text-sm font-semibold text-navy">내 여행</span>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <LeftPanel />
              </div>
            </aside>
          </div>
        )}

        {/* Map Area */}
        <main className="flex-1 bg-gray-100 flex items-center justify-center relative">
          <p className="text-gray-400 text-sm">지도 영역 (Step 7에서 구현)</p>

          {/* Mobile panel toggle button */}
          <button
            className="md:hidden absolute bottom-6 left-4 bg-navy text-white px-4 py-2.5 rounded-full shadow-lg text-sm font-semibold"
            onClick={() => setIsPanelOpen(true)}
          >
            내 여행 목록
          </button>
        </main>
      </div>
    </div>
  )
}

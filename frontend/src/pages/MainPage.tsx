import { useState } from 'react'
import { useAuthStore } from '../shared/store/authStore'
import { useAdminUpgrade, useLogout } from '../domain/auth/hooks'
import LeftPanel from '../domain/trip/components/LeftPanel'
import { MapArea } from '../domain/map/components'
import { PhotoPanel } from '../domain/photo/components'

export default function MainPage() {
  const nickname = useAuthStore((s) => s.nickname)
  const email = useAuthStore((s) => s.email)
  const isDemo = useAuthStore((s) => s.isDemo)
  const { logout } = useLogout()
  const { upgrade, isLoading: isAdminLoading } = useAdminUpgrade()
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminError, setAdminError] = useState<string | null>(null)

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdminError(null)
    const err = await upgrade(email!, adminPassword)
    if (err) {
      setAdminError(err)
    } else {
      setShowAdminModal(false)
      setAdminPassword('')
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-navy text-white px-5 py-3 flex items-center justify-between shadow z-10 shrink-0">
        <h1 className="text-lg font-bold">Pinner</h1>
        <div className="flex items-center gap-4">
          {isDemo && (
            <span className="hidden sm:inline-block text-xs bg-yellow-400 text-yellow-900 font-semibold px-2 py-0.5 rounded-full">
              체험 중
            </span>
          )}
          <span className="text-sm text-gray-200 hidden sm:block">{nickname}</span>
          {isDemo && (
            <button
              onClick={() => setShowAdminModal(true)}
              className="text-sm text-yellow-300 hover:underline"
            >
              관리
            </button>
          )}
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
        <main className="flex-1 relative overflow-hidden">
          <MapArea />
          <PhotoPanel />

          {/* Mobile panel toggle button */}
          <button
            className="md:hidden absolute bottom-6 left-4 bg-navy text-white px-4 py-2.5 rounded-full shadow-lg text-sm font-semibold z-10"
            onClick={() => setIsPanelOpen(true)}
          >
            내 여행 목록
          </button>
        </main>
      </div>

      {/* 관리자 모달 (데모 계정 전용) */}
      {showAdminModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => { setShowAdminModal(false); setAdminPassword(''); setAdminError(null) }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xs mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-bold text-navy mb-1">관리자 로그인</h2>
            <p className="text-xs text-gray-500 mb-4">비밀번호를 입력하면 모든 기능을 사용할 수 있습니다.</p>
            <form onSubmit={handleAdminLogin} className="space-y-3">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="비밀번호"
                autoFocus
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              {adminError && <p className="text-red-500 text-xs">{adminError}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowAdminModal(false); setAdminPassword(''); setAdminError(null) }}
                  className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isAdminLoading}
                  className="flex-1 bg-navy text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-900 disabled:opacity-50 transition-colors"
                >
                  {isAdminLoading ? '확인 중...' : '확인'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

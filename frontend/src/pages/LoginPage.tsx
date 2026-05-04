import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDemoLogin, useLogin } from '../domain/auth/hooks'

const DEMO_ENABLED = import.meta.env.VITE_DEMO_ENABLED === 'true'

export default function LoginPage() {
  const { login, isLoading, error } = useLogin()
  const { demoLogin, isLoading: isDemoLoading, error: demoError } = useDemoLogin()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(form)
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy">Pinner</h1>
          <p className="text-gray-500 mt-2 text-sm">여행의 모든 순간을 기록하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="비밀번호를 입력하세요"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {demoError && <p className="text-red-500 text-sm">{demoError}</p>}

          <button
            type="submit"
            disabled={isLoading || isDemoLoading}
            className="w-full bg-navy text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-900 disabled:opacity-50 transition-colors"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {DEMO_ENABLED && (
          <>
            <div className="flex items-center gap-3 mt-5">
              <div className="flex-1 border-t border-gray-200" />
              <span className="text-xs text-gray-400">또는</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>
            <button
              onClick={demoLogin}
              disabled={isDemoLoading || isLoading}
              className="w-full mt-3 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              {isDemoLoading ? '체험 준비 중...' : '데모 계정으로 체험하기'}
            </button>
          </>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          계정이 없으신가요?{' '}
          <Link to="/register" className="text-sky font-semibold hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}

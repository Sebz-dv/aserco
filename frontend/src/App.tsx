import { useEffect, useState } from 'react'
import { HomePage } from './pages/HomePage'
import { AuthPage, type AuthMode } from './pages/AuthPage'
import { SplashLoader } from './components/organisms/SplashLoader'
import { LandingSkeleton } from './components/organisms/LandingSkeleton'
import type { AuthUser } from './lib/api'

function getInitialTheme() {
  const saved = localStorage.getItem('aserco-theme')
  if (saved === 'dark') return true
  if (saved === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem('aserco-user')
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export default function App() {
  const [dark, setDark] = useState(getInitialTheme)
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [view, setView] = useState<'home' | 'auth'>('home')
  const [user, setUser] = useState<AuthUser | null>(readStoredUser)
  const [loading, setLoading] = useState(true)
  const [landingReady, setLandingReady] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1200)
    document.body.style.overflow = 'hidden'

    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (!loading) {
      const showSkeleton = window.setTimeout(() => setLandingReady(true), 200)
      return () => window.clearTimeout(showSkeleton)
    }
  }, [loading])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('aserco-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    if (loading) return

    const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!revealElements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -10% 0px',
      },
    )

    revealElements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [loading, landingReady, view])

  useEffect(() => {
    if (!loading) {
      document.body.style.overflow = ''
    }
  }, [loading])

  const handleAuthSuccess = (authUser: AuthUser, token: string) => {
    localStorage.setItem('aserco-token', token)
    localStorage.setItem('aserco-user', JSON.stringify(authUser))
    setUser(authUser)
    setView('home')
  }

  const handleLogout = () => {
    localStorage.removeItem('aserco-token')
    localStorage.removeItem('aserco-user')
    setUser(null)
  }

  if (loading) {
    return <SplashLoader visible={loading} />
  }

  if (!landingReady && view === 'home') {
    return <LandingSkeleton />
  }

  if (view === 'auth') {
    return (
      <AuthPage
        mode={authMode}
        onSwitchMode={setAuthMode}
        onBackHome={() => setView('home')}
        onAuthSuccess={handleAuthSuccess}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f7f2] text-[#22264b] antialiased transition-colors duration-300 dark:bg-[#050b17] dark:text-white">
      <HomePage
        dark={dark}
        user={user}
        onToggleTheme={() => setDark(value => !value)}
        onLogout={handleLogout}
        onOpenLogin={() => {
          setAuthMode('login')
          setView('auth')
        }}
        onOpenRegister={() => {
          setAuthMode('register')
          setView('auth')
        }}
      />
    </div>
  )
}

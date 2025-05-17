'use client'
import { useRouter } from 'next/router'
import { useAuth } from '../../hooks/useAuth'
import { NavbarButton } from './ui/resizable-navbar'
import { LogIn, LogOut } from 'lucide-react'

export interface AuthControlsProps {
  className?: string
}

export function AuthControls({ className = '' }: AuthControlsProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.push('/')
  }

  const baseStyles =
    'flex items-center space-x-2 px-4 py-2 rounded-md transition hover:opacity-90'

  if (user) {
    return (
      <NavbarButton
        as="button"
        onClick={handleLogout}
        variant="secondary"
        className={`${baseStyles} ${className} btn btn-secondary`}
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </NavbarButton>
    )
  }

  return (
    <NavbarButton
      as="button"
      onClick={() => router.push('/login')}
      variant="primary"
      className={`${baseStyles} ${className} btn btn-primary`}
    >
      <LogIn className="w-5 h-5" />
      <span>Login</span>
    </NavbarButton>
  )
}
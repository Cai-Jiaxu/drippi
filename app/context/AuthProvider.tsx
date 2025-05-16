// src/context/AuthProvider.tsx
import React, { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { getCsrfToken } from '../src/lib/csrf'

export interface User {
  username: string
}

export interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  signup: (username: string, password: string, gender: string) => Promise<void>
  logout: () => Promise<void>
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Initial “who am I?” check to establish session and CSRF cookie
    fetch('/api/auth/me/', { credentials: 'include' })
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(data => setUser({ username: data.username }))
      .catch(() => setUser(null))
  }, [])

  async function login(username: string, password: string) {
    const res = await fetch('/api/auth/login/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken(),
      },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) throw new Error('Invalid credentials')
    const data = await res.json()
    setUser({ username: data.username })
  }

  async function signup(username: string, password: string, gender: string) {
    const res = await fetch('/api/auth/register/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken(),
      },
      body: JSON.stringify({ username, password, gender }),
    })
    if (!res.ok) throw new Error('Signup failed')
    const data = await res.json()
    setUser({ username: data.username })
  }

  async function logout() {
    await fetch('/api/auth/logout/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRFToken': getCsrfToken(),
      },
    })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// components/ui/Header.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Menu, ShoppingCart, Sun, Moon } from 'lucide-react'
import { AuthMenu } from '@/components/AuthMenu'
import { useDebounce } from '../../../hooks/useDebounce'

interface HeaderProps {
  toggleSidebar: () => void
}

export function Header({ toggleSidebar }: HeaderProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Flag to know user actually typed
  const didSearch = useRef(false)

  // Wait for theme to mount (avoid SSR mismatch)
  useEffect(() => {
    setMounted(true)
  }, [])

  // --- Search term state, initialized from URL ---
  const [term, setTerm] = useState(() => {
    const q = typeof router.query.search === 'string' ? router.query.search : ''
    return q
  })

  useDebounce(term, 500, () => {
    if (!didSearch.current) return
    router.push({
      pathname: '/listings',
      query: term ? { search: term } : {},
    })
  })

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 bg-[var(--background)] border-b-2 border-[var(--border)] flex items-center px-4">
      {/* Hamburger */}
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle sidebar"
        className="mr-3"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Logo */}
      <Link href="/" className="text-2xl font-semibold mr-6">
        DripDaddy
      </Link>

      {/* Search Input */}
      <div className="flex-1">
        <Input
          placeholder="Search outfits..."
          value={term}
          onChange={(e) => {
            didSearch.current = true
            setTerm(e.target.value)
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2 ml-6">
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          aria-label="Cart"
          onClick={() => router.push('/cart')}
        >
          <ShoppingCart className="h-5 w-5" />
        </Button>

        {/* Auth menu dropdown */}
        <AuthMenu />
      </div>
    </header>
  )
}

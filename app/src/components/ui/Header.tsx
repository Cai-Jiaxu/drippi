'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Menu,
  ShoppingCart,
  Sun,
  Moon,
} from 'lucide-react'
import { AuthControls } from '@/components/AuthControls'

interface HeaderProps {
  toggleSidebar: () => void
}

export function Header({ toggleSidebar }: HeaderProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
//   const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

//   const isDark = resolvedTheme === 'dim'
//   const toggleTheme = () => setTheme(isDark ? 'nord' : 'dim')

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      router.push(`/listings?search=${encodeURIComponent((e.target as HTMLInputElement).value)}`)
    }
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 bg-background border-b flex items-center px-4">
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

      {/* Search */}
      <div className="flex-1">
        <Input
          placeholder="Search outfits..."
          onKeyDown={handleSearch}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2 ml-6">
        {mounted && (
        <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setTheme(theme === 'dark' ? 'light' : 'dark')
            }
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
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

        <AuthControls />
      </div>
    </header>
  )
}

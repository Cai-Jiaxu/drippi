'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Sun, Moon } from 'lucide-react'
import { AuthControls } from '@/components/AuthControls'

export function Header() {
  const router = useRouter()
  
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])



  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const q = (e.target as HTMLInputElement).value
      router.push(`/listings?search=${encodeURIComponent(q)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="flex items-center h-16">
        {/* Search: takes up all space except controls */}
        <div className="flex-1 px-4">
          <Input
            placeholder="Search outfits..."
            onKeyDown={handleSearch}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2 pr-4">
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

          <Button variant="ghost" size="icon" aria-label="Cart" onClick={() => router.push('/cart')}>
            <ShoppingCart className="h-5 w-5" />
          </Button>

          <AuthControls />
        </div>
      </div>
    </header>
  )
}

'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'
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
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const didSearch = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [term, setTerm] = useState(() => {
    const q = typeof router.query.search === 'string' ? router.query.search : ''
    return q
  })

  // Debounced search handler
  useDebounce(term, 500, () => {
    if (!didSearch.current) return

    // If search term is cleared, remove the query param
    if (term === '') {
      router.replace('/listings', undefined, { shallow: true })  // Keep the current path but without the search query
    } else {
      // Otherwise, update the URL query with the search term
      router.push({
        pathname: '/listings',
        query: { search: term },
      })
    }
    if (pathname === '/listings') {
      router.push({
        pathname: '/listings',
        query: term ? { search: term } : {},
      })
    }
  })

  // When clearing search or navigating away from listings, remove the search query from URL
  const clearSearchAndRedirect = () => {
    setTerm('')  // Clear the search term state
    router.replace('/listings', undefined, { shallow: true })  // Update the URL without search query
  }

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

      {/* Search Input — only show on /listings */}
      <div className="flex-1">
        {pathname === '/listings' && (
          <Input
            placeholder="Search outfits..."
            value={term}
            onChange={(e) => {
              didSearch.current = true
              setTerm(e.target.value)
            }}
          />
        )}
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

        <AuthMenu />
      </div>
    </header>
  )
}

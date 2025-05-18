'use client'

import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Sun, Moon } from 'lucide-react'
import { AuthControls } from '@/components/AuthControls'

export function Navbar() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const navLinks = [
    { name: 'Listings', href: '/listings' },
    { name: 'Upload',   href: '/upload'   },
    { name: 'Dashboard', href: '/dashboard' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        <Link href="/" className="text-2xl font-semibold">
          DripDaddy
        </Link>

        
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} passHref>
              <Button
                variant="ghost"
                size="sm"
                className={
                  router.pathname === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }
              >
                {link.name}
              </Button>
            </Link>
          ))}
        </nav>

        
        <div className="flex items-center space-x-2">
          
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

          
          <Link href="/cart" passHref>
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>

          
          <AuthControls />
        </div>
      </div>
    </header>
  )
}

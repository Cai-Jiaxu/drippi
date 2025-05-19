'use client'

import React from 'react'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import {
  Home,
  Upload,
  LayoutDashboard,
  ShoppingCart,
  User,
  X,
} from 'lucide-react'
import Link from 'next/link'

interface SidebarProps {
  onLinkClick?: () => void
}

export function Sidebar({ onLinkClick }: SidebarProps) {
  const router = useRouter()
  const links = [
    { name: 'Listings', href: '/listings', icon: Home },
    { name: 'Upload', href: '/upload', icon: Upload },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Cart', href: '/cart', icon: ShoppingCart },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Close button */}
      <div className="flex justify-end mb-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close sidebar"
          onClick={onLinkClick}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Logo */}
      <div className="mb-6 px-2">
        <Link href="/" onClick={onLinkClick} className="text-2xl font-semibold">
          DripDaddy
        </Link>
      </div>

      {/* Links */}
      <nav className="flex-1 space-y-2">
        {links.map(({ name, href, icon: Icon }) => (
          <Button
            key={href}
            variant={router.pathname === href ? 'secondary' : 'ghost'}
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              router.push(href)
              onLinkClick?.()
            }}
          >
            <Icon className="mr-2 h-4 w-4" />
            {name}
          </Button>
        ))}
      </nav>
    </div>
  )
}

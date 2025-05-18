'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import {
  Home,
  Upload,
  LayoutDashboard,
  ShoppingCart,
  User,
} from 'lucide-react'

export function Sidebar() {
  const router = useRouter()
  const links = [
    { name: 'Listings', href: '/listings', icon: Home },
    { name: 'Upload', href: '/upload', icon: Upload },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Cart', href: '/cart', icon: ShoppingCart },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  return (
    <nav className="flex flex-col">
      {/* Logo */}
      <div className="mb-6 px-2">
        <Link href="/" className="text-2xl font-semibold">
          DripDaddy
        </Link>
      </div>

      {/* Links */}
      <div className="space-y-2">
        {links.map(({ name, href, icon: Icon }) => (
          <Button
            key={href}
            variant={router.pathname === href ? 'secondary' : 'ghost'}
            size="sm"
            className="w-full justify-start"
            onClick={() => router.push(href)}
          >
            <Icon className="mr-2 h-4 w-4" />
            {name}
          </Button>
        ))}
      </div>
    </nav>
  )
}

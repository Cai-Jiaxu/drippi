'use client'

import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Home,
  Upload,
  LayoutDashboard,
  ShoppingCart,
  User,
} from 'lucide-react'

interface SidebarProps {
  onLinkClick?: () => void
}

export function Sidebar({ onLinkClick }: SidebarProps) {
  const router = useRouter()
  const links = [
    { name: 'Listings',  href: '/listings',  icon: Home },
    { name: 'Upload',    href: '/upload',    icon: Upload },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Cart',      href: '/cart',      icon: ShoppingCart },
    { name: 'Profile',   href: '/profile',   icon: User },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Logo area aligned with header height */}
      <div className="flex items-center h-12 px-2">
        <Link
          href="/"
          onClick={onLinkClick}
          className="text-2xl font-semibold leading-none"
        >
          DripDaddy
        </Link>
      </div>

      {/* Decorative divider */}
      <hr className="border-t border-base-content/20 mb-4 mx-2" />

      {/* Navigation links */}
      <nav className="flex-1 space-y-2 px-2">
        {links.map(({ name, href, icon: Icon }) => {
          const isActive = router.pathname === href
          return (
            <Button
              key={href}
              variant={isActive ? 'secondary' : 'ghost'}
              size="sm"
              className={`
                w-full justify-start transition
                hover:bg-base-300
                ${isActive ? 'border-l-4 border-primary' : ''}
              `}
              onClick={() => {
                router.push(href)
                onLinkClick?.()
              }}
            >
              <Icon className="mr-2 h-2 w-4" />
              {name}
            </Button>
          )
        })}
      </nav>
    </div>
  )
}

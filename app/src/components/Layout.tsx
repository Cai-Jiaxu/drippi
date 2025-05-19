'use client'

import React, { useState, useEffect } from 'react'
import { Header } from '@/components/ui/Header'
import { Sidebar } from '@/components/ui/NewSidebar'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
  }, [sidebarOpen])

  const toggleSidebar = () => setSidebarOpen((v) => !v)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Sidebar overlay */}
      <aside
        className={`
          fixed inset-0 left-0 z-50 w-64 p-4 transform transition-transform duration-200
          bg-base-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar onLinkClick={closeSidebar} />
      </aside>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={closeSidebar}
        />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto pt-16">
        {children}
      </main>
    </div>
  )
}

'use client'

import React from 'react'
import { Header } from '@/components/ui/Header'
import { Sidebar } from '@/components/ui/NewSidebar'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex overflow-hidden">
    
      <aside className="hidden md:block w-48 border-r bg-background p-4">
        <Sidebar />
      </aside>

  
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

'use client'

import { useRouter } from 'next/router'
import { Navbar, NavBody, NavItems } from '../src/components/ui/resizable-navbar'
import { AuthControls } from '../src/components/AuthControls'

export default function Home() {
  const router = useRouter()

  const navLinks = [
    { name: 'Home', link: '/' },
    { name: 'Listings', link: '/listings' },
    { name: 'Upload', link: '/upload' },
  ]

  const handleGetStarted = () => {
    router.push('/listings')
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Navbar className="sticky top-0 z-50 bg-base-100 shadow-md">
        <NavBody className="max-w-7xl mx-auto px-4 py-2 flex items-center">
          <div className="w-8" />
          <NavItems
            items={navLinks}
            className="space-x-8 text-base-content hover:text-primary transition"
          />
          <div className="ml-auto">
            <AuthControls className="text-sm font-medium" />
          </div>
        </NavBody>
      </Navbar>

      <main className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <h1 className="text-5xl font-extrabold mb-4">DripDaddy</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-xl">
          Peer-to-peer outfit rental and sharing made easy. Browse, rent, and
          refresh your wardrobe without the commitment of purchase.
        </p>
        <button
          onClick={handleGetStarted}
          className="px-6 py-3 rounded-full btn btn-primary font-semibold transition"
        >
          Get Started
        </button>
      </main>
    </div>
  )
}

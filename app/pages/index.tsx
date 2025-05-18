'use client'

import { useRouter } from 'next/router'
import { Navbar } from '@/components/ui/Navbar'

export default function Home() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/listings')
  }

  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">
         DripDaddy
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
          Peer-to-peer outfit rental and sharing made easy. Browse, rent,
          and refresh your wardrobe without the commitment of purchase.
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

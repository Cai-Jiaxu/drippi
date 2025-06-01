// pages/index.tsx
'use client'

import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'

export default function Home() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/listings')
  }

  return (
    <div className="max-w-xl mx-auto py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">DripDaddy</h1>
      <p className="text-lg text-[var(--muted-foreground)] mb-8">
        Peer-to-peer outfit rental and sharing made easy. Browse, rent,
        and refresh your wardrobe without the commitment of purchase.
      </p>
      <Button
        onClick={handleGetStarted}
        variant="outline"
        size="lg"
        className="px-6 py-3 rounded-full font-semibold transition"
      >
        Get Started
      </Button>
    </div>
  )
}

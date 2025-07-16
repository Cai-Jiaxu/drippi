'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useUser, useAuth } from '@clerk/nextjs'

interface OutfitImage {
  id: number
  image_url: string
}

interface Outfit {
  id: number
  title: string
  description: string
  size: string
  price_per_day: number
  category: number
  images: OutfitImage[]
}

interface Rental {
  id: number
  outfit: number
  outfit_details: Outfit
  renter: any
  start_date: string
  end_date: string
  status: string
}

const categoryMap: Record<number, string> = {
  1: 'Dress',
  2: 'Top',
  3: 'Pants',
  4: 'Skirt',
  5: 'Jacket',
  6: 'Coat',
  7: 'Sweater',
  8: 'Shorts',
  9: 'Activewear',
  10: 'Footwear',
  11: 'Others',
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'renter' | 'lister'>('renter')
  const [rentals, setRentals] = useState<Rental[]>([])
  const [listings, setListings] = useState<Outfit[]>([])
  const [renterFilter, setRenterFilter] = useState<'all' | 'approved' | 'requested' | 'cancelled'>('all')
  const { user } = useUser()
  const { getToken } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken()
      const API_BASE = process.env.NEXT_PUBLIC_API_URL

      if (activeTab === 'renter') {
        const res = await fetch(`${API_BASE}/api/my-rentals/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setRentals(data)
        }
      } else {
        const res = await fetch(`${API_BASE}/api/my-listings/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setListings(data)
        }
      }
    }

    fetchData()
  }, [activeTab])

  const handleCancelRental = async (rentalId: number) => {
    const token = await getToken()
    const API_BASE = process.env.NEXT_PUBLIC_API_URL

    const res = await fetch(`${API_BASE}/api/cancel-rental/${rentalId}/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (res.ok) {
      setRentals((prev) => prev.filter((r) => r.id !== rentalId))
    } else {
      alert('Failed to cancel rental.')
    }
  }

  const getValidImageUrl = (url?: string): string => {
    if (!url) return '/images/placeholder.jpg'
    return url.startsWith('http://') || url.startsWith('https://') ? url : '/images/placeholder.jpg'
  }

  const filteredRentals = rentals.filter((rental) => {
    if (renterFilter === 'all') return true
    return rental.status.toLowerCase() === renterFilter
  })

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-purple-400">Dashboard</h1>

      <div className="flex justify-center gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded border ${activeTab === 'lister' ? 'bg-purple-600' : 'bg-gray-800'}`}
          onClick={() => setActiveTab('lister')}
        >
          I'm a Lister
        </button>
        <button
          className={`px-4 py-2 rounded border ${activeTab === 'renter' ? 'bg-purple-600' : 'bg-gray-800'}`}
          onClick={() => setActiveTab('renter')}
        >
          I'm a Renter
        </button>
      </div>

      {activeTab === 'renter' && (
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {['all', 'approved', 'requested', 'cancelled'].map((filter) => (
            <button
              key={filter}
              onClick={() => setRenterFilter(filter as any)}
              className={`px-3 py-1 rounded text-sm border ${
                renterFilter === filter ? 'bg-purple-600' : 'bg-gray-700'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {activeTab === 'lister' &&
          listings.map((listing) => (
            <div key={listing.id} className="bg-gray-800 p-4 rounded-lg shadow">
              <div className="relative w-full h-48 mb-4 rounded overflow-hidden">
                <Image
                  src={getValidImageUrl(listing.images?.[0]?.image_url)}
                  alt={listing.title}
                  fill
                  className="object-cover object-center"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">{listing.title}</h3>
              <p className="text-sm text-gray-300 mb-1">Category: {categoryMap[listing.category]}</p>
              <p className="text-sm text-gray-300 mb-1">Size: {listing.size}</p>
              <p className="text-sm text-gray-300 mb-1">Price: ${listing.price_per_day}/day</p>
              <p className="text-sm text-gray-400">{listing.description}</p>
            </div>
          ))}

        {activeTab === 'renter' &&
          filteredRentals.map((rental) => (
            <div key={rental.id} className="bg-gray-800 p-4 rounded-lg shadow relative">
              <div className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-purple-700">
                {rental.status.toUpperCase()}
              </div>
              <div className="relative w-full h-48 mb-4 rounded overflow-hidden">
                <Image
                  src={getValidImageUrl(rental.outfit_details.images?.[0]?.image_url)}
                  alt={rental.outfit_details.title}
                  fill
                  className="object-cover object-center"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">{rental.outfit_details.title}</h3>
              <p className="text-sm text-gray-300 mb-1">Category: {categoryMap[rental.outfit_details.category]}</p>
              <p className="text-sm text-gray-300 mb-1">Size: {rental.outfit_details.size}</p>
              <p className="text-sm text-gray-300 mb-1">Price: ${rental.outfit_details.price_per_day}/day</p>
              <p className="text-sm text-gray-400">
                {rental.start_date} ➜ {rental.end_date}
              </p>
              <button
                onClick={() => handleCancelRental(rental.id)}
                className="mt-3 px-4 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Cancel Rental
              </button>
            </div>
          ))}
      </div>
    </div>
  )
}

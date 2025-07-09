// pages/listings.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

interface Listing {
  id: number
  title: string
  description: string
  size: string
  price_per_day: number
  category: number // changed to number since it's always an ID here
  images: string[] // URLs directly from Django API
}

// ✅ Category ID ➔ Name mapping
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

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL
        const res = await fetch(`${API_BASE}/api/outfits/`, {
          credentials: 'include',
        })
        if (!res.ok) throw new Error('Failed to fetch listings.')
        const data = await res.json()
        setListings(data)
      } catch (err) {
        console.error('Error fetching listings:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-purple-700 dark:text-purple-400">
        Browse Outfits
      </h1>

      {loading ? (
        <p className="text-center">Loading listings…</p>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {listings.map(listing => (
            <div
              key={listing.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl cursor-pointer transition"
              onClick={() => setSelectedListing(listing)}
            >
              <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
                <Image
                  src={listing.images?.[0] || '/images/placeholder.jpg'}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                  {listing.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Custom Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold mb-4 text-purple-700 dark:text-purple-400">
              {selectedListing.title}
            </h2>

            <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
              <Image
                src={selectedListing.images?.[0] || '/images/placeholder.jpg'}
                alt={selectedListing.title}
                fill
                className="object-cover"
              />
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-2">
              {selectedListing.description}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-1">
              <strong>Size:</strong> {selectedListing.size}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-1">
              <strong>Price per day:</strong> ${selectedListing.price_per_day}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong>Category:</strong>{' '}
              {categoryMap[selectedListing.category] || 'Unknown'}
            </p>

            <button
              onClick={() => setSelectedListing(null)}
              className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

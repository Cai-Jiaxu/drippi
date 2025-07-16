'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@clerk/nextjs'

interface Listing {
  id: number
  title: string
  description: string
  size: string
  price_per_day: number
  category: number
  images: { id: number; image_url: string }[]
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

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [rentalSuccess, setRentalSuccess] = useState(false)
  const { getToken } = useAuth()

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

  const getValidImageUrl = (url?: string): string => {
    if (!url) return '/images/placeholder.jpg'
    return url.startsWith('http://') || url.startsWith('https://')
      ? url
      : '/images/placeholder.jpg'
  }

  const handleRent = async () => {
    if (!selectedListing || !startDate || !endDate) return

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL
      const clerkToken = await getToken()

      const res = await fetch(`${API_BASE}/api/rentals/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${clerkToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          outfit: selectedListing.id,
          start_date: startDate,
          end_date: endDate,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        console.error('Rent failed:', text)
        throw new Error('Failed to rent outfit')
      }

      setRentalSuccess(true)
      setSelectedListing(null)
      setStartDate('')
      setEndDate('')
    } catch (err) {
      console.error('Error during rent:', err)
      alert('Failed to rent outfit. Try again.')
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-purple-700 dark:text-purple-400">
        Browse Outfits
      </h1>

      {loading ? (
        <p className="text-center">Loading listings…</p>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl cursor-pointer transition"
              onClick={() => setSelectedListing(listing)}
            >
              <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
                <Image
                  src={getValidImageUrl(listing.images?.[0]?.image_url)}
                  alt={listing.title}
                  fill
                  className="object-cover object-center"
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

      {/* Listing Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6">
            <button
              onClick={() => setSelectedListing(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl"
              aria-label="Close"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-4 text-purple-700 dark:text-purple-400 text-center">
              {selectedListing.title}
            </h2>

            <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
              <Image
                src={getValidImageUrl(selectedListing.images?.[0]?.image_url)}
                alt={selectedListing.title}
                fill
                className="object-contain object-center"
              />
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-2">{selectedListing.description}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-1">
              <strong>Size:</strong> {selectedListing.size}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-1">
              <strong>Price per day:</strong> ${selectedListing.price_per_day}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              <strong>Category:</strong> {categoryMap[selectedListing.category] || 'Unknown'}
            </p>

            <div className="mb-4">
              <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">
                Start Date
              </label>
              <input
                type="date"
                className="w-full rounded px-3 py-2 text-black"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">
                End Date
              </label>
              <input
                type="date"
                className="w-full rounded px-3 py-2 text-black"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleRent}
                className="w-full sm:w-auto px-6 sm:px-10 py-2 sm:py-3 text-base sm:text-lg bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition"
              >
                RENT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rental Success Modal */}
      {rentalSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
              Rental Successful!
            </h2>
            <p className="text-gray-800 dark:text-gray-200 mb-6">
              Your outfit rental has been confirmed.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setRentalSuccess(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-700 transition"
              >
                Continue Browsing
              </button>
              <button
                onClick={() => (window.location.href = '/dashboard?tab=renter')}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              >
                Go to My Rentals
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@clerk/nextjs'

interface Listing {
  id: number
  title: string
  description: string
  size: string
  price_per_day: number | string
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [rentalSuccess, setRentalSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
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
    return url.startsWith('http://') || url.startsWith('https://') ? url : '/images/placeholder.jpg'
  }

  const calculateTotalPrice = () => {
    if (!selectedListing || !startDate || !endDate) return 0
    const price = Number(selectedListing.price_per_day)
    const days =
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24) + 1
    return days > 0 ? price * days : 0
  }

  const handleRent = async () => {
    if (!selectedListing || !startDate || !endDate) return
    if (startDate > endDate) {
      alert('End date cannot be before start date.')
      return
    }

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
      setSelectedImageIndex(0)
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
              onClick={() => {
                setSelectedListing(listing)
                setSelectedImageIndex(0)
              }}
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

      {/* Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => {
                setSelectedListing(null)
                setSelectedImageIndex(0)
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 dark:hover:text-red-400 text-2xl"
              aria-label="Close"
            >
              &times;
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Image + Arrows + Thumbnails */}
              <div className="flex flex-col space-y-4 relative">
                <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <Image
                    src={getValidImageUrl(selectedListing.images[selectedImageIndex]?.image_url)}
                    alt={selectedListing.title}
                    fill
                    className="object-contain object-center"
                  />
                  {selectedImageIndex > 0 && (
                    <button
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-1 hover:bg-black"
                      onClick={() => setSelectedImageIndex(selectedImageIndex - 1)}
                    >
                      &#8592;
                    </button>
                  )}
                  {selectedImageIndex < selectedListing.images.length - 1 && (
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-1 hover:bg-black"
                      onClick={() => setSelectedImageIndex(selectedImageIndex + 1)}
                    >
                      &#8594;
                    </button>
                  )}
                </div>

                <div className="flex space-x-2 overflow-x-auto">
                  {selectedListing.images.map((img, idx) => (
                    <div
                      key={img.id}
                      className={`relative w-20 h-20 rounded overflow-hidden border-2 ${
                        idx === selectedImageIndex
                          ? 'border-purple-500'
                          : 'border-gray-300 dark:border-gray-600'
                      } cursor-pointer hover:opacity-80`}
                      onClick={() => setSelectedImageIndex(idx)}
                    >
                      <Image
                        src={getValidImageUrl(img.image_url)}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Info + Form */}
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1 text-purple-700 dark:text-purple-400">
                    {selectedListing.title}
                  </h2>
                  <p className="text-sm italic text-gray-600 dark:text-gray-300 mb-4">
                    {selectedListing.description}
                  </p>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>
                      <strong>Size:</strong> {selectedListing.size}
                    </li>
                    <li>
                      <strong>Price per day:</strong> $
                      {Number(selectedListing.price_per_day).toFixed(2)}
                    </li>
                    <li>
                      <strong>Category:</strong> {categoryMap[selectedListing.category] || 'Unknown'}
                    </li>
                  </ul>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">Start Date</label>
                    <input
                      type="date"
                      className="w-full rounded px-3 py-2 text-black"
                      value={startDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        setStartDate(e.target.value)
                        if (endDate && e.target.value > endDate) {
                          setEndDate('')
                        }
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">End Date</label>
                    <input
                      type="date"
                      className="w-full rounded px-3 py-2 text-black"
                      value={endDate}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>

                  {/* Total Price */}
                  {startDate && endDate && (
                    <div className="text-md font-semibold text-gray-800 dark:text-gray-200 text-center">
                      Total Price: ${calculateTotalPrice().toFixed(2)}
                    </div>
                  )}

                  <button
                    onClick={handleRent}
                    className="w-full py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg text-lg font-semibold shadow"
                  >
                    Rent Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rental Success Modal */}
      {rentalSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
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

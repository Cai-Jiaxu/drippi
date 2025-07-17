'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useUser, useAuth } from '@clerk/nextjs'  // Use useUser hook to get the full user object

interface Listing {
  id: number
  title: string
  description: string
  size: string
  price_per_day: number | string
  category: number
  images: { id: number; image_url: string }[]
  owner: {
    id: number
    username: string
  }
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
  const [rentalRequestStatus, setRentalRequestStatus] = useState('') // New state for rental status message
  const { user } = useUser()  // Use useUser hook to get the full user object
  const router = useRouter()
  const { search } = router.query
  const { getToken } = useAuth()

  const [filteredListings, setFilteredListings] = useState<Listing[]>([])

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL
        const res = await fetch(`${API_BASE}/api/outfits/`, {
          credentials: 'include',
        })
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

  // Filter listings based on the search term
  useEffect(() => {
    if (search && typeof search === 'string') {
      const searchTerm = search.toLowerCase()
      const matchedListings = listings.filter((listing) =>
        listing.title.toLowerCase().includes(searchTerm)
      )
      setFilteredListings(matchedListings)
    } else {
      setFilteredListings(listings)
    }
  }, [search, listings])

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

      setRentalRequestStatus('Rental request sent! Pending approval.') // Show the message
      setRentalSuccess(true)
      setSelectedListing(null)
      setStartDate('')
      setEndDate('')
      setSelectedImageIndex(0)

      // Hide the message after 5 seconds
      setTimeout(() => {
        setRentalRequestStatus('')
      }, 3500)

    } catch (err) {
      console.error('Error during rent:', err)
      alert('Failed to rent outfit. Try again.')
    }
  }

  // Check if the current user is the owner of the listing
  const isOwner =
    user && selectedListing
      ? String(user.id) === String(selectedListing.owner.username)
      : false

  // Handlers for image navigation
  const handlePrevImage = () => {
  if (selectedListing && selectedListing.images) {
    setSelectedImageIndex((prevIndex) => (selectedListing.images.length === 0 ? 0 : (prevIndex === 0 ? selectedListing.images.length - 1 : prevIndex - 1)))
    } 
  }

  const handleNextImage = () => {
    if (selectedListing && selectedListing.images) {
      setSelectedImageIndex((prevIndex) => (selectedListing.images.length === 0 ? 0 : (prevIndex === selectedListing.images.length - 1 ? 0 : prevIndex + 1)))
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-purple-700 dark:text-purple-400">
        Browse Outfits
      </h1>

      {loading ? (
        <p className="text-center">Loading listings…</p>
      ) : filteredListings.length > 0 ? (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl cursor-pointer transition"
              onClick={() => setSelectedListing(listing)} // Open the modal on click
            >
              <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
                <img
                  src={getValidImageUrl(listing.images?.[0]?.image_url)}
                  alt={listing.title}
                  className="object-cover object-center w-full h-full"
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
      ) : (
        <div className="text-center text-lg text-gray-700 dark:text-gray-300">
          <p>No matching listings</p>
          <p>Be the first one to list it?</p>
        </div>
      )}

      {/* Rental request status */}
      {rentalRequestStatus && (
        <div className="fixed bottom-0 left-0 right-0 bg-green-600 text-white text-center py-2 z-50">
          {rentalRequestStatus}
        </div>
      )}

      {/* Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setSelectedListing(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 dark:hover:text-red-400 text-2xl"
              aria-label="Close"
            >
              &times;
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Image + Arrows + Thumbnails */}
              <div className="flex flex-col space-y-4 relative">
                {/* Image Carousel */}
                <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <Image
                    src={getValidImageUrl(selectedListing.images[selectedImageIndex]?.image_url)}
                    alt={selectedListing.title}
                    fill
                    className="object-contain object-center"
                  />
                </div>

                {/* Navigation Arrows */}
                <div className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 cursor-pointer text-white" onClick={handlePrevImage}>
                  <span className="text-3xl">←</span>
                </div>
                <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 cursor-pointer text-white" onClick={handleNextImage}>
                  <span className="text-3xl">→</span>
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
                      <strong>Price per day:</strong> $ {Number(selectedListing.price_per_day).toFixed(2)}
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

                  {/* Rent Now Button */}
                  <button
                    onClick={handleRent}
                    disabled={isOwner} // Ensuring a boolean is passed
                    className={`w-full py-3 text-white ${isOwner ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} rounded-lg text-lg font-semibold shadow`}
                  >
                    {isOwner ? 'You cannot rent your own outfit' : 'Rent Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

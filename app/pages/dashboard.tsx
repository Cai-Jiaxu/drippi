'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { X } from 'lucide-react'

function formatRenter(renter?: { first_name?: string; last_name?: string; email?: string }) {
  if (!renter) return 'N/A'
  const fullName = `${renter.first_name ?? ''} ${renter.last_name ?? ''}`.trim()
  const email = renter.email ?? 'no email'
  return `${fullName} (${email})`
}

interface OutfitImage {
  id: number
  image_url: string
}

interface Profile {
  gender: string
  telegram_handle?: string
  phone_number?: string
}

interface UserInfo {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  profile?: Profile
}

interface Rental {
  id: number
  outfit: number
  outfit_details: Outfit
  renter: UserInfo
  start_date: string
  end_date: string
  status: string
}

interface Outfit {
  id: number
  title: string
  description: string
  size: string
  price_per_day: number
  category: number
  images: OutfitImage[]
  rentals?: Rental[]
}

const categoryMap: Record<number, string> = {
  1: 'Dress', 2: 'Top', 3: 'Pants', 4: 'Skirt', 5: 'Jacket',
  6: 'Coat', 7: 'Sweater', 8: 'Shorts', 9: 'Activewear', 10: 'Footwear', 11: 'Others'
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'requested':
    case 'pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

function calculateTotalPrice(start: string, end: string, pricePerDay: number): number {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  return diffDays * pricePerDay
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'renter' | 'lister'>('renter')
  const [rentals, setRentals] = useState<Rental[]>([])
  const [listings, setListings] = useState<Outfit[]>([])
  const [selectedListing, setSelectedListing] = useState<Outfit | null>(null)
  const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null)
  const { getToken } = useAuth()
  const API_BASE = process.env.NEXT_PUBLIC_API_URL

  const getValidImageUrl = (url?: string): string => {
    if (!url) return '/images/placeholder.jpg'
    return url.startsWith('http://') || url.startsWith('https://') ? url : '/images/placeholder.jpg'
  }

  const fetchListings = useCallback(async () => {
    const token = await getToken()
    const res = await fetch(`${API_BASE}/api/my-listings/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      const data = await res.json()
      setListings(data)
    }
  }, [API_BASE, getToken])

  
  const fetchRentals = useCallback(async () => {
    const token = await getToken()
    const res = await fetch(`${API_BASE}/api/my-rentals/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      const data = await res.json()
      const filtered = data.filter((rental: Rental) => rental.status.toLowerCase() !== 'cancelled')
      setRentals(filtered)
    }
  }, [API_BASE, getToken])

  useEffect(() => {
    if (activeTab === 'renter') {
      fetchRentals()
    } else {
      fetchListings()
    }
  }, [activeTab, fetchRentals, fetchListings])

  const handleCancelRental = async (rentalId: number) => {
    const token = await getToken()
    const res = await fetch(`${API_BASE}/api/cancel-rental/${rentalId}/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      setRentals(prev => prev.filter(r => r.id !== rentalId))
    } else {
      alert('Failed to cancel rental.')
    }
  }

  const handleApproveRental = async (rentalId: number) => {
    const token = await getToken()
    await fetch(`${API_BASE}/api/approve-rental/${rentalId}/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    await fetchListings()
    setSelectedListing(prev =>
      prev
        ? {
            ...prev,
            rentals: prev.rentals?.map(r =>
              r.id === rentalId ? { ...r, status: 'approved' } : r
            )
          }
        : null
    )
  }

  const handleRejectRental = async (rentalId: number) => {
    const token = await getToken()
    await fetch(`${API_BASE}/api/reject-rental/${rentalId}/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    await fetchListings()
    setSelectedListing(prev =>
      prev
        ? {
            ...prev,
            rentals: prev.rentals?.map(r =>
              r.id === rentalId ? { ...r, status: 'rejected' } : r
            )
          }
        : null
    )
  }

  const handleDeleteListing = async (listingId: number) => {
    const token = await getToken()
    const res = await fetch(`${API_BASE}/api/delete-listing/${listingId}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (res.ok) {
      setListings((prev) => prev.filter((listing) => listing.id !== listingId))
      if (selectedListing?.id === listingId) setSelectedListing(null)
    } else {
      alert('Failed to delete listing.')
    }
  }
  

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-purple-600 dark:text-purple-400">Dashboard</h1>

        <div className="flex justify-center gap-4 mb-8">
          <button
            className={`px-4 py-2 rounded-lg border transition-colors ${
              activeTab === 'lister'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('lister')}
          >
            Your Listings
          </button>
          <button
            className={`px-4 py-2 rounded-lg border transition-colors ${
              activeTab === 'renter'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('renter')}
          >
            Your Rentals
          </button>
        </div>

        {/* LISTINGS TAB */}
        {activeTab === 'lister' && (
          <>
            {listings.length === 0 ? (
              <div className="text-center">
                <p>No listings found.</p>
                <Link href="/upload" className="text-purple-600 underline">Click here to list your first outfit.</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {listings.map(listing => (
                  <div
                    key={listing.id}
                    onClick={() => setSelectedListing(listing)}
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-md cursor-pointer"
                  >
                    <div className="relative aspect-square w-full mb-2 rounded-lg overflow-hidden">
                      <Image
                        src={getValidImageUrl(listing.images?.[0]?.image_url)}
                        alt={listing.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-md font-semibold">{listing.title}</h3>
                    <p className="text-sm text-gray-500">{categoryMap[listing.category]}</p>
                  </div>
                ))}
              </div>
            )}

            {/* LISTING MODAL */}
              {selectedListing && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
                  <div className="bg-white dark:bg-gray-900 p-6 w-full max-w-2xl rounded-lg relative max-h-[90vh] overflow-y-auto shadow-xl">
                    <button
                      className="absolute top-4 right-4 text-gray-500"
                      onClick={() => setSelectedListing(null)}
                    >
                      <X />
                    </button>
                    <h2 className="text-xl font-bold mb-4">{selectedListing.title}</h2>

                    {selectedListing.rentals?.length === 0 ? (
                      <p className="text-gray-500">No rental requests.</p>
                    ) : (
                      selectedListing.rentals?.map((r) => (
                        <div key={r.id} className="border-t pt-4 mt-4 space-y-1">
                          <p>
                            <strong>Renter:</strong> {formatRenter(r.renter)}
                          </p>
                          {/* Added profile info below */}
                          <p>
                            <strong>Gender:</strong> {r.renter.profile?.gender ?? 'N/A'}
                          </p>
                          <p>
                            <strong>Telegram:</strong> {r.renter.profile?.telegram_handle ? `@${r.renter.profile.telegram_handle}` : 'N/A'}
                          </p>
                          <p>
                            <strong>Phone:</strong> {r.renter.profile?.phone_number ?? 'N/A'}
                          </p>

                          <p>
                            <strong>Period:</strong> {r.start_date} ➜ {r.end_date}
                          </p>
                          <p>
                            <strong>Total Price:</strong> $
                            {calculateTotalPrice(
                              r.start_date,
                              r.end_date,
                              selectedListing.price_per_day
                            )}
                          </p>
                          <p>
                            <strong>Status:</strong>{' '}
                            <span
                              className={`px-2 py-1 text-xs rounded ${getStatusColor(
                                r.status
                              )}`}
                            >
                              {r.status.toUpperCase()}
                            </span>
                          </p>

                          {r.status === 'requested' && (
                            <div className="flex gap-3 mt-2">
                              <button
                                onClick={() => handleApproveRental(r.id)}
                                className="px-3 py-1 text-sm bg-green-600 text-white rounded"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectRental(r.id)}
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}

                    <button
                      onClick={() => handleDeleteListing(selectedListing.id)}
                      className="mt-6 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    >
                      Delete Listing
                    </button>
                  </div>
                </div>
              )}

          </>
        )}

        {/* RENTER TAB */}
        {activeTab === 'renter' && (
          <>
            {rentals.length === 0 ? (
              <div className="text-center">
                <p>No rentals found.</p>
                <Link href="/listings" className="text-purple-600 underline">Click here to rent an outfit.</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {rentals.map(rental => (
                  <div key={rental.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                    <div className="relative aspect-square w-full mb-2 rounded-lg overflow-hidden">
                      <Image
                        src={getValidImageUrl(rental.outfit_details.images?.[0]?.image_url)}
                        alt={rental.outfit_details.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-md font-semibold">{rental.outfit_details.title}</h3>
                    <p className="text-sm text-gray-500 mb-1">{rental.start_date} ➜ {rental.end_date}</p>
                    <p className="text-sm font-medium">Total: ${calculateTotalPrice(rental.start_date, rental.end_date, rental.outfit_details.price_per_day)}</p>
                    <span className={`px-2 py-1 mt-1 inline-block text-xs rounded ${getStatusColor(rental.status)}`}>{rental.status.toUpperCase()}</span>

                    {confirmCancelId === rental.id ? (
                      <div className="mt-2 space-y-2">
                        <p className="text-sm">Confirm cancel?</p>
                        <div className="flex gap-2">
                          <button onClick={() => handleCancelRental(rental.id)} className="flex-1 px-3 py-1 bg-red-600 text-white rounded">Yes</button>
                          <button onClick={() => setConfirmCancelId(null)} className="flex-1 px-3 py-1 bg-gray-400 text-white rounded">No</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmCancelId(rental.id)} className="mt-3 w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        Cancel Rental
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@clerk/nextjs'

function formatRenter(renter?: { first_name?: string; last_name?: string; email?: string }) {
  if (!renter) return 'N/A';
  const fullName = `${renter.first_name ?? ''} ${renter.last_name ?? ''}`.trim();
  const email = renter.email ?? 'no email';
  return `${fullName} (${email})`;
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
  profile?: Profile // optional because it might be null
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

interface Rental {
  id: number
  outfit: number
  outfit_details: Outfit
  renter: UserInfo
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

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'requested':
    case 'pending':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'renter' | 'lister'>('renter')
  const [rentals, setRentals] = useState<Rental[]>([])
  const [listings, setListings] = useState<Outfit[]>([])
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
  }, [activeTab, getToken])

  const getValidImageUrl = (url?: string): string => {
    if (!url) return '/images/placeholder.jpg'
    return url.startsWith('http://') || url.startsWith('https://') ? url : '/images/placeholder.jpg'
  }

  const handleCancelRental = async (rentalId: number) => {
    const token = await getToken()
    const API_BASE = process.env.NEXT_PUBLIC_API_URL

    const res = await fetch(`${API_BASE}/api/cancel-rental/${rentalId}/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.ok) {
      setRentals((prev) => prev.filter((r) => r.id !== rentalId))
    } else {
      alert('Failed to cancel rental.')
    }
  }

  const handleApproveRental = async (rentalId: number) => {
    const token = await getToken()
    const API_BASE = process.env.NEXT_PUBLIC_API_URL

    const res = await fetch(`${API_BASE}/api/approve-rental/${rentalId}/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.ok) {
      // Refresh listings after approval
      const listingsRes = await fetch(`${API_BASE}/api/my-listings/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (listingsRes.ok) {
        const updatedListings = await listingsRes.json()
        setListings(updatedListings)
      }
    } else {
      alert('Failed to approve rental.')
    }
  }

  const handleRejectRental = async (rentalId: number) => {
    const token = await getToken()
    const API_BASE = process.env.NEXT_PUBLIC_API_URL

    const res = await fetch(`${API_BASE}/api/reject-rental/${rentalId}/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.ok) {
      // Refresh listings after rejection
      const listingsRes = await fetch(`${API_BASE}/api/my-listings/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (listingsRes.ok) {
        const updatedListings = await listingsRes.json()
        setListings(updatedListings)
      }
    } else {
      alert('Failed to reject rental.')
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeTab === 'renter' &&
            rentals.map((rental) => (
              <div key={rental.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
                <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={getValidImageUrl(rental.outfit_details.images?.[0]?.image_url)}
                    alt={rental.outfit_details.title}
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2 line-clamp-1">{rental.outfit_details.title}</h3>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Category</span>
                    <span>{categoryMap[rental.outfit_details.category]}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Size</span>
                    <span>{rental.outfit_details.size}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Price</span>
                    <span>${rental.outfit_details.price_per_day}/day</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {rental.start_date} ➜ {rental.end_date}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(rental.status)}`}>
                    {rental.status.toUpperCase()}
                  </span>
                </div>

                <button
                  onClick={() => handleCancelRental(rental.id)}
                  className="w-full mt-2 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Cancel Rental
                </button>
              </div>
            ))}

          {activeTab === 'lister' &&
            listings.map((listing) => (
              <div key={listing.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
                <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={getValidImageUrl(listing.images?.[0]?.image_url)}
                    alt={listing.title}
                    fill
                    className="object-cover object-center"
                  />
                </div>
                
                <h3 className="text-lg font-semibold mb-2 line-clamp-1">{listing.title}</h3>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Category</span>
                    <span>{categoryMap[listing.category]}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Size</span>
                    <span>{listing.size}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Price</span>
                    <span>${listing.price_per_day}/day</span>
                  </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{listing.description}</p>

                {listing.rentals && listing.rentals.length > 0 && (
                  <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-3">
                    <p className="text-purple-600 dark:text-purple-400 font-semibold mb-2">Rental Requests:</p>
                    <div className="space-y-3">
                      {listing.rentals.map((rental) => (
                        <div key={rental.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <div className="mb-2">
                            <p className="text-sm font-medium">Renter:</p>
                            <p className="text-sm">{formatRenter(rental.renter)}</p>
                          </div>
                          
                          <div className="mb-2">
                            <p className="text-sm font-medium">Period:</p>
                            <p className="text-sm">{rental.start_date} to {rental.end_date}</p>
                          </div>
                          
                          <div className="mb-2 flex justify-between items-center">
                            <p className="text-sm font-medium">Status:</p>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(rental.status)}`}>
                              {rental.status.toUpperCase()}
                            </span>
                          </div>

                          {rental.renter.profile && (
                            <div className="space-y-1 text-sm">
                              {rental.renter.profile.gender && (
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-400">Gender</span>
                                  <span>{rental.renter.profile.gender}</span>
                                </div>
                              )}
                              {rental.renter.profile.telegram_handle && (
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-400">Telegram</span>
                                  <span>{rental.renter.profile.telegram_handle}</span>
                                </div>
                              )}
                              {rental.renter.profile.phone_number && (
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-400">Phone</span>
                                  <span>{rental.renter.profile.phone_number}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {rental.status === 'requested' && (
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => handleApproveRental(rental.id)}
                                className="flex-1 px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectRental(rental.id)}
                                className="flex-1 px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
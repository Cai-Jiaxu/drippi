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

interface UserInfo {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  telegram_handle?: string
  phone_number?: string
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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'renter' | 'lister'>('renter')
  const [rentals, setRentals] = useState<Rental[]>([])
  const [listings, setListings] = useState<Outfit[]>([])
  //const { user } = useUser()
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
    console.log('APPROVING RENTAL:', rentalId, 'API_BASE:', API_BASE)

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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-purple-400">Dashboard</h1>

      <div className="flex justify-center gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded border ${activeTab === 'lister' ? 'bg-purple-600' : 'bg-gray-800'}`}
          onClick={() => setActiveTab('lister')}
        >
          Your Listings
        </button>
        <button
          className={`px-4 py-2 rounded border ${activeTab === 'renter' ? 'bg-purple-600' : 'bg-gray-800'}`}
          onClick={() => setActiveTab('renter')}
        >
          Your Rentals
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {activeTab === 'renter' &&
          rentals.map((rental) => (
            <div key={rental.id} className="bg-gray-800 p-4 rounded-lg shadow">
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
              <p className="text-sm mb-1">
                <span className="font-semibold text-yellow-400">Status:</span>{' '}
                <span className="uppercase">{rental.status}</span>
              </p>
              <p className="text-sm text-gray-400">
                {rental.start_date} ➜ {rental.end_date}
              </p>
              <button
                onClick={() => handleCancelRental(rental.id)}
                className="mt-2 px-4 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Cancel Rental
              </button>
            </div>
          ))}

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
              <p className="text-sm text-gray-400 mb-2">{listing.description}</p>

              {listing.rentals && listing.rentals.length > 0 && (
                <div className="mt-2 border-t border-gray-600 pt-2 text-sm">
                  <p className="text-purple-400 font-semibold mb-1">Rental Requests:</p>
                  {listing.rentals.map((rental) => (
                    <div key={rental.id} className="mb-2 bg-gray-700 p-2 rounded">
                      <p>
                        Renter: <span className="text-white">{formatRenter(rental.renter)}</span>
                      </p>
                      <p>
                        Period: {rental.start_date} to {rental.end_date}
                      </p>
                      <p>
                        Status:{' '}
                        <span className="text-yellow-300 uppercase font-bold">{rental.status}</span>
                      </p>

                      {/* Conditionally show telegram handle */}
                      {rental.renter.telegram_handle && (
                        <p>
                          Telegram: <span className="text-white">{rental.renter.telegram_handle}</span>
                        </p>
                      )}

                      {/* Conditionally show phone number */}
                      {rental.renter.phone_number && (
                        <p>
                          Phone: <span className="text-white">{rental.renter.phone_number}</span>
                        </p>
                      )}

                      {rental.status === 'requested' && (
                        <button
                          onClick={() => handleApproveRental(rental.id)}
                          className="mt-1 px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          ))}
      </div>
    </div>
  )
}

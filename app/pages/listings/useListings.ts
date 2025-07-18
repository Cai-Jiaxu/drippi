import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@clerk/nextjs'
import { Listing, Rental } from './types'

export const useListings = () => {
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [userRentals, setUserRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()
  const router = useRouter()
  const { search } = router.query

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

    const fetchUserRentals = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL
        const token = await getToken()
        const res = await fetch(`${API_BASE}/api/my-rentals/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        setUserRentals(data)
      } catch (err) {
        console.error('Error fetching user rentals:', err)
      }
    }

    fetchListings()
    fetchUserRentals()
  }, [getToken])

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

  return {
    listings,
    filteredListings,
    userRentals,
    loading,
  }
}
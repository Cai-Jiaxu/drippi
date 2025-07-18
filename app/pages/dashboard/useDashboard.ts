// useDashboard.ts
import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Rental, Outfit, TabType } from './types'
import { ApiService } from './api'

export const useDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('renter')
  const [rentals, setRentals] = useState<Rental[]>([])
  const [listings, setListings] = useState<Outfit[]>([])
  const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { getToken, isLoaded, userId, isSignedIn } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
  
      if (!isLoaded || !userId || !isSignedIn) {
        console.log('Clerk not ready:', { isLoaded, userId, isSignedIn })
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const apiService = new ApiService(async () => {
          const freshToken = await getToken()
          if (!freshToken) {
            throw new Error('No authentication token available')
          }
          return freshToken
        })
        
        if (activeTab === 'renter') {
          const data = await apiService.fetchMyRentals()
          setRentals(data)
        } else {
          console.log('Fetching listings...')
          const data = await apiService.fetchMyListings()
          setListings(data)
        }
      } catch (error: any) {
        console.error('Failed to fetch data:', error)
        setError(error.message || 'Failed to fetch data')

        if (error.status === 403) {
          console.error('403 Forbidden - Token validation failed')
          setError('Permission denied. Please try signing out and signing in again.')
        } else if (error.status === 401) {
          console.error('401 Unauthorized - Token expired or invalid')
          setError('Session expired. Please sign in again.')
        } else if (error.responseBody) {
          console.error('Server error details:', error.responseBody)
          setError(`Server error: ${error.responseBody}`)
        } else {
          setError('Failed to load data. Please try again.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    const timeoutId = setTimeout(() => {
      fetchData()
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [activeTab, getToken, isLoaded, userId, isSignedIn])

  const handleCancelRental = async (rentalId: number) => {
    if (!isLoaded || !userId) return

    try {
      const apiService = new ApiService(async () => {
        const token = await getToken()
        if (!token) {
          throw new Error('No authentication token available')
        }
        return token
      })
      
      await apiService.cancelRental(rentalId)
      setRentals((prev) => prev.filter((r) => r.id !== rentalId))
      setConfirmCancelId(null)
    } catch (error: any) {
      console.error('Failed to cancel rental:', error)
      
      if (error.status === 403) {
        alert('Permission denied. Please try signing out and signing in again.')
      } else if (error.status === 401) {
        alert('Session expired. Please sign in again.')
      } else {
        alert('Failed to cancel rental.')
      }
    }
  }

  const handleApproveRental = async (rentalId: number) => {
    if (!isLoaded || !userId) return

    try {
      const apiService = new ApiService(async () => {
        const token = await getToken()
        if (!token) {
          throw new Error('No authentication token available')
        }
        return token
      })
      
      await apiService.approveRental(rentalId)
      const updatedListings = await apiService.fetchMyListings()
      setListings(updatedListings)
    } catch (error: any) {
      console.error('Failed to approve rental:', error)
      
      if (error.status === 403) {
        alert('Permission denied. Please try signing out and signing in again.')
      } else if (error.status === 401) {
        alert('Session expired. Please sign in again.')
      } else {
        alert('Failed to approve rental.')
      }
    }
  }

  const handleRejectRental = async (rentalId: number) => {
    if (!isLoaded || !userId) return

    try {
      const apiService = new ApiService(async () => {
        const token = await getToken()
        if (!token) {
          throw new Error('No authentication token available')
        }
        return token
      })
      
      await apiService.rejectRental(rentalId)
      const updatedListings = await apiService.fetchMyListings()
      setListings(updatedListings)
    } catch (error: any) {
      console.error('Failed to reject rental:', error)
      
      if (error.status === 403) {
        alert('Permission denied. Please try signing out and signing in again.')
      } else if (error.status === 401) {
        alert('Session expired. Please sign in again.')
      } else {
        alert('Failed to reject rental.')
      }
    }
  }

  const handleDeleteListing = async (listingId: number) => {
    if (!isLoaded || !userId) return

    try {
      const apiService = new ApiService(async () => {
        const token = await getToken()
        if (!token) {
          throw new Error('No authentication token available')
        }
        return token
      })
      
      await apiService.deleteListing(listingId)
      setListings((prev) => prev.filter((l) => l.id !== listingId))
    } catch (error: any) {
      console.error('Failed to delete listing:', error)
      
      if (error.status === 403) {
        alert('Permission denied. You may not have permission to delete this listing, or your session has expired. Please try signing out and signing in again.')
      } else if (error.status === 401) {
        alert('Session expired. Please sign in again.')
      } else if (error.status === 404) {
        alert('Listing not found. It may have already been deleted.')
        setListings((prev) => prev.filter((l) => l.id !== listingId))
      } else {
        alert('Failed to delete listing. Please try again.')
      }
    }
  }

  return {
    activeTab,
    setActiveTab,
    rentals,
    listings,
    confirmCancelId,
    setConfirmCancelId,
    handleCancelRental,
    handleApproveRental,
    handleRejectRental,
    handleDeleteListing,
    isLoaded,
    userId,
    isLoading,
    error,
  }
}
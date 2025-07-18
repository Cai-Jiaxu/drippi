//useRental.ts

import { useState } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { Listing, Rental } from '../../types/listings'

export const useRental = (userRentals: Rental[]) => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [rentalRequestStatus, setRentalRequestStatus] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const { getToken } = useAuth()
  const { user } = useUser()

  const calculateTotalPrice = (listing: Listing) => {
    if (!listing || !startDate || !endDate) return 0
    const price = Number(listing.price_per_day)
    const days =
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24) + 1
    return days > 0 ? price * days : 0
  }

  const handleRent = async (listing: Listing, onSuccess: () => void) => {
    if (!listing || !startDate || !endDate) return
    if (startDate > endDate) {
      setInfoMessage('End date cannot be before start date.')
      return
    }

    const alreadyRented = userRentals.some(
      (r) =>
        r.outfit &&
        r.outfit.id === listing.id &&
        (r.status === 'requested' || r.status === 'approved')
    )

    if (alreadyRented) {
      setInfoMessage('You have already requested or rented this outfit.')
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
          outfit: listing.id,
          start_date: startDate,
          end_date: endDate,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setInfoMessage(data.detail || 'Failed to rent outfit.')
        return
      }

      setRentalRequestStatus('Rental request sent! Pending approval.')
      setStartDate('')
      setEndDate('')
      setInfoMessage('')
      onSuccess()

      setTimeout(() => {
        setRentalRequestStatus('')
      }, 3500)
    } catch (err) {
      console.error('Error during rent:', err)
      setInfoMessage('Failed to rent outfit. Try again.')
    }
  }

  const isOwner = (listing: Listing) => {
    return user && listing ? String(user.id) === String(listing.owner.username) : false
  }

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    rentalRequestStatus,
    infoMessage,
    setInfoMessage,
    calculateTotalPrice,
    handleRent,
    isOwner,
  }
}

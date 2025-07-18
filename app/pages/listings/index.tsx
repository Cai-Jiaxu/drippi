'use client'

import React, { useState } from 'react'
import { useListings } from './useListings'
import { useRental } from './useRental'
import { ListingCard } from './ListingCard'
import { ListingModal } from './ListingModal'
import { Listing } from './types'

export default function ListingsPage() {
  const { filteredListings, userRentals, loading } = useListings()
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  
  const {
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
  } = useRental(userRentals)

  const handleListingClick = (listing: Listing) => {
    setSelectedListing(listing)
    setInfoMessage('')
  }

  const handleCloseModal = () => {
    setSelectedListing(null)
    setStartDate('')
    setEndDate('')
    setInfoMessage('')
  }

  const handleRentSuccess = () => {
    setSelectedListing(null)
    setStartDate('')
    setEndDate('')
  }

  const onRent = () => {
    if (selectedListing) {
      handleRent(selectedListing, handleRentSuccess)
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
            <ListingCard
              key={listing.id}
              listing={listing}
              onClick={() => handleListingClick(listing)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-lg text-gray-700 dark:text-gray-300">
          <p>No matching listings</p>
          <p>Be the first one to list it?</p>
        </div>
      )}

      {rentalRequestStatus && (
        <div className="fixed bottom-0 left-0 right-0 bg-green-600 text-white text-center py-2 z-50">
          {rentalRequestStatus}
        </div>
      )}

      {selectedListing && (
        <ListingModal
          listing={selectedListing}
          onClose={handleCloseModal}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onRent={onRent}
          isOwner={isOwner(selectedListing)}
          totalPrice={calculateTotalPrice(selectedListing)}
          infoMessage={infoMessage}
        />
      )}
    </div>
  )
}
//index.tsx 

'use client'

import React from 'react'
import { useDashboard } from '../src/hooks/useDashboard'
import { TabSelector } from '../src/components/dashboard/TabSelector'
import { RentalCard } from '../src/components/dashboard/RentalCard'
import { ListingCard } from '../src/components/dashboard/ListingCard'

export default function Dashboard() {
  const {
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
  } = useDashboard()

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Show message if user is not authenticated
  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Please sign in to access your dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-purple-600 dark:text-purple-400">
          Dashboard
        </h1>

        <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeTab === 'renter' &&
            rentals.map((rental) => (
              <RentalCard
                key={rental.id}
                rental={rental}
                confirmCancelId={confirmCancelId}
                onCancelClick={setConfirmCancelId}
                onConfirmCancel={handleCancelRental}
                onCancelConfirm={() => setConfirmCancelId(null)}
              />
            ))}

          {activeTab === 'lister' &&
            listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onApproveRental={handleApproveRental}
                onRejectRental={handleRejectRental}
                onDeleteListing={handleDeleteListing}
              />
            ))}
        </div>

        {/* Show empty state */}
        {activeTab === 'renter' && rentals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">You have no rentals yet.</p>
          </div>
        )}

        {activeTab === 'lister' && listings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">You have no listings yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
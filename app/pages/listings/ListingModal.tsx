import React, { useState } from 'react'
import { Listing } from './types'
import { categoryMap } from './categories'
import { ImageGallery } from './ImageGallery'
import { RentalForm } from './RentalForm'

interface ListingModalProps {
  listing: Listing
  onClose: () => void
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onRent: () => void
  isOwner: boolean
  totalPrice: number
  infoMessage: string
}

export const ListingModal: React.FC<ListingModalProps> = ({
  listing,
  onClose,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onRent,
  isOwner,
  totalPrice,
  infoMessage,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const handlePrevious = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? listing.images.length - 1 : prev - 1
    )
  }

  const handleNext = () => {
    setSelectedImageIndex((prev) =>
      prev === listing.images.length - 1 ? 0 : prev + 1
    )
  }

  const handleEndDateChange = (date: string) => {
    onEndDateChange(date)
  }

  const handleStartDateChange = (date: string) => {
    onStartDateChange(date)
    if (endDate && date > endDate) {
      onEndDateChange('')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 dark:hover:text-red-400 text-2xl"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ImageGallery
            images={listing.images}
            currentIndex={selectedImageIndex}
            onPrevious={handlePrevious}
            onNext={handleNext}
            title={listing.title}
          />

          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1 text-purple-700 dark:text-purple-400">
                {listing.title}
              </h2>
              <p className="text-sm italic text-gray-600 dark:text-gray-300 mb-4">
                {listing.description}
              </p>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>
                  <strong>Size:</strong> {listing.size}
                </li>
                <li>
                  <strong>Price per day:</strong> ${Number(listing.price_per_day).toFixed(2)}
                </li>
                <li>
                  <strong>Category:</strong> {categoryMap[listing.category] || 'Unknown'}
                </li>
              </ul>
            </div>

            <RentalForm
              listing={listing}
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              onRent={onRent}
              isOwner={isOwner}
              totalPrice={totalPrice}
              infoMessage={infoMessage}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
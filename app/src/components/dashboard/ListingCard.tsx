import React, { useState } from 'react'
import Image from 'next/image'
import { Outfit } from '../../types/dashboard'
import { categoryMap, getValidImageUrl } from '../../utils/dashboard'
import { RentalRequest } from './RentalRequest'
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

interface ListingCardProps {
  listing: Outfit
  onApproveRental: (rentalId: number) => void
  onRejectRental: (rentalId: number) => void
  onDeleteListing: (listingId: number) => void
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onApproveRental,
  onRejectRental,
  onDeleteListing,
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  
  const hasMultiplePhotos = listing.images && listing.images.length > 1
  const currentImage = listing.images?.[currentPhotoIndex]

  const nextPhoto = () => {
    if (listing.images && listing.images.length > 1) {
      setCurrentPhotoIndex((prev) => 
        prev === listing.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevPhoto = () => {
    if (listing.images && listing.images.length > 1) {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? listing.images.length - 1 : prev - 1
      )
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
      {/* Photo Section with Navigation */}
      <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden group">
        {currentImage ? (
          <Image
            src={getValidImageUrl(currentImage.image_url)}
            alt={listing.title}
            fill
            className="object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">No photo</span>
          </div>
        )}
        
        {/* Navigation Arrows */}
        {hasMultiplePhotos && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white opacity-0 group-hover:opacity-100"
              aria-label="Previous photo"
            >
              <ChevronLeft size={16} />
            </button>
            
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white opacity-0 group-hover:opacity-100"
              aria-label="Next photo"
            >
              <ChevronRight size={16} />
            </button>
            
            {/* Photo indicators */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {listing.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhotoIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentPhotoIndex
                      ? 'bg-white'
                      : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                  aria-label={`Go to photo ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <h3 className="text-lg font-semibold mb-2 line-clamp-1">
        {listing.title}
      </h3>

      <div className="space-y-2 mb-3 text-sm">
        <div className="flex justify-between">
          <span>Category</span>
          <span>{categoryMap[listing.category]}</span>
        </div>
        <div className="flex justify-between">
          <span>Size</span>
          <span>{listing.size}</span>
        </div>
        <div className="flex justify-between">
          <span>Price</span>
          <span>${listing.price_per_day}/day</span>
        </div>
      </div>

      <p className="text-sm mb-4 line-clamp-2">
        {listing.description}
      </p>

      {listing.rentals && listing.rentals.length > 0 && (
        <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-3">
          <p className="font-semibold mb-2 text-purple-600 dark:text-purple-400">
            Rental Requests:
          </p>
          <div className="space-y-3">
            {listing.rentals.map((rental) => (
              <RentalRequest
                key={rental.id}
                rental={rental}
                onApprove={onApproveRental}
                onReject={onRejectRental}
              />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => onDeleteListing(listing.id)}
        className="w-full mt-4 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        aria-label="Delete listing"
      >
        <Trash2 className="h-5 w-5 mx-auto" />
      </button>
    </div>
  )
}
//ListingCard.tsx

import React from 'react'
import Image from 'next/image'
import { Outfit } from '../../types/dashboard'
import { categoryMap, getValidImageUrl } from '../../utils/dashboard'
import { RentalRequest } from './RentalRequest'
import { Trash2 } from 'lucide-react'

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
}) => (
  <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
    <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
      <Image
        src={getValidImageUrl(listing.images?.[0]?.image_url)}
        alt={listing.title}
        fill
        className="object-cover object-center"
      />
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

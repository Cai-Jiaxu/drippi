//ListingCard.tsx

import React from 'react'
import Image from 'next/image'
import { Listing } from '../../types/listings'

interface ListingCardProps {
  listing: Listing
  onClick: () => void
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  const getValidImageUrl = (url?: string): string => {
    if (!url) return '/images/placeholder.jpg'
    return url.startsWith('http') ? url : '/images/placeholder.jpg'
  }

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl cursor-pointer transition"
      onClick={onClick}
    >
      <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
        <Image
          src={getValidImageUrl(listing.images?.[0]?.image_url)}
          alt={listing.title}
          fill
          className="object-cover object-center w-full h-full"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
          {listing.title}
        </h3>
      </div>
    </div>
  )
}
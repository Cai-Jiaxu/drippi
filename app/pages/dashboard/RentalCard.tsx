//RentalCard.tsx

import React from 'react'
import Image from 'next/image'
import { Rental } from './types'
import { categoryMap, getStatusColor, getValidImageUrl } from './utils'

interface RentalCardProps {
  rental: Rental
  confirmCancelId: number | null
  onCancelClick: (rentalId: number) => void
  onConfirmCancel: (rentalId: number) => void
  onCancelConfirm: () => void
}

export const RentalCard: React.FC<RentalCardProps> = ({
  rental,
  confirmCancelId,
  onCancelClick,
  onConfirmCancel,
  onCancelConfirm,
}) => (
  <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
    <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
      <Image
        src={getValidImageUrl(rental.outfit_details.images?.[0]?.image_url)}
        alt={rental.outfit_details.title}
        fill
        className="object-cover object-center"
      />
    </div>

    <h3 className="text-lg font-semibold mb-2 line-clamp-1">
      {rental.outfit_details.title}
    </h3>

    <div className="space-y-2 mb-3 text-sm">
      <div className="flex justify-between">
        <span>Category</span>
        <span>{categoryMap[rental.outfit_details.category]}</span>
      </div>
      <div className="flex justify-between">
        <span>Size</span>
        <span>{rental.outfit_details.size}</span>
      </div>
      <div className="flex justify-between">
        <span>Price</span>
        <span>${rental.outfit_details.price_per_day}/day</span>
      </div>
    </div>

    <div className="flex justify-between items-center mb-3 text-sm">
      <span>
        {rental.start_date} ➜ {rental.end_date}
      </span>
      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(rental.status)}`}>
        {rental.status.toUpperCase()}
      </span>
    </div>

    {confirmCancelId === rental.id ? (
      <div className="flex flex-col gap-2 mt-2">
        <p className="text-center text-sm">Confirm cancel?</p>
        <div className="flex gap-2">
          <button
            onClick={() => onConfirmCancel(rental.id)}
            className="flex-1 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Yes
          </button>
          <button
            onClick={onCancelConfirm}
            className="flex-1 px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 rounded-lg"
          >
            No
          </button>
        </div>
      </div>
    ) : (
      <button
        onClick={() => onCancelClick(rental.id)}
        className="w-full mt-2 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
      >
        Cancel Rental
      </button>
    )}
  </div>
)

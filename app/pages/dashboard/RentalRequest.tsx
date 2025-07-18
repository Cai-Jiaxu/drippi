//RentalRequest.tsx

import React from 'react'
import { Rental } from './types'
import { formatRenter, getStatusColor } from './utils'

interface RentalRequestProps {
  rental: Rental
  onApprove: (rentalId: number) => void
  onReject: (rentalId: number) => void
}

export const RentalRequest: React.FC<RentalRequestProps> = ({
  rental,
  onApprove,
  onReject,
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
      <div className="mb-2">
        <p className="text-sm font-medium">Renter:</p>
        <p className="text-sm">{formatRenter(rental.renter)}</p>
      </div>
      <div className="mb-2">
        <p className="text-sm font-medium">Period:</p>
        <p className="text-sm">{rental.start_date} to {rental.end_date}</p>
      </div>
      <div className="mb-2 flex justify-between items-center">
        <p className="text-sm font-medium">Status:</p>
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(rental.status)}`}>
          {rental.status.toUpperCase()}
        </span>
      </div>

      {rental.renter.profile && (
        <div className="space-y-1 text-sm">
          {rental.renter.profile.gender && (
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Gender</span>
              <span>{rental.renter.profile.gender}</span>
            </div>
          )}
          {rental.renter.profile.telegram_handle && (
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Telegram</span>
              <span>{rental.renter.profile.telegram_handle}</span>
            </div>
          )}
          {rental.renter.profile.phone_number && (
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Phone</span>
              <span>{rental.renter.profile.phone_number}</span>
            </div>
          )}
        </div>
      )}

      {rental.status === 'requested' && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onApprove(rental.id)}
            className="flex-1 px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(rental.id)}
            className="flex-1 px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  )
}
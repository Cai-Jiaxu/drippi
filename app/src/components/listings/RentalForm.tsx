//RentalForm.tsx


import React from 'react'
import { Listing } from '../../types/listings'

interface RentalFormProps {
  listing: Listing
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onRent: () => void
  isOwner: boolean
  totalPrice: number
  infoMessage: string
}

export const RentalForm: React.FC<RentalFormProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onRent,
  isOwner,
  totalPrice,
  infoMessage,
}) => {
  return (
    <div className="mt-6 space-y-4">
      {infoMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm mb-4">
          {infoMessage}
        </div>
      )}

      <div>
        <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">
          Start Date
        </label>
        <input
          type="date"
          className="w-full rounded px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
          value={startDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => {
            onStartDateChange(e.target.value)
          }}
        />
      </div>

      <div>
        <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">
          End Date
        </label>
        <input
          type="date"
          className="w-full rounded px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
          value={endDate}
          min={startDate || new Date().toISOString().split('T')[0]}
          onChange={(e) => onEndDateChange(e.target.value)}
        />
      </div>

      {startDate && endDate && (
        <div className="text-md font-semibold text-gray-800 dark:text-gray-200 text-center">
          Total Price: ${totalPrice.toFixed(2)}
        </div>
      )}

      <button
        onClick={onRent}
        disabled={isOwner}
        className={`w-full py-3 text-white ${
          isOwner
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        } rounded-lg text-lg font-semibold shadow`}
      >
        {isOwner ? 'You cannot rent your own outfit' : 'Rent Now'}
      </button>
    </div>
  )
}

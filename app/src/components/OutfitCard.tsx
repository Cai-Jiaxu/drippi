import React from 'react'
import type { Outfit } from '../api'

export function OutfitCard({ outfit }: { outfit: Outfit }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h2 className="text-xl font-semibold">{outfit.title}</h2>
      <p className="text-gray-600">{outfit.size}</p>
      <p className="mt-2">${outfit.price_per_day.toFixed(2)}/day</p>
    </div>
  )
}

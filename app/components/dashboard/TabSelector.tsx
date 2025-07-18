//TabSelector.tsx 

import React from 'react'
import { TabType } from '../../src/types/dashboard'

interface TabSelectorProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex justify-center gap-4 mb-8">
      <button
        className={`px-4 py-2 rounded-lg border transition-colors ${
          activeTab === 'lister'
            ? 'bg-purple-600 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        onClick={() => onTabChange('lister')}
      >
        Your Listings
      </button>
      <button
        className={`px-4 py-2 rounded-lg border transition-colors ${
          activeTab === 'renter'
            ? 'bg-purple-600 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        onClick={() => onTabChange('renter')}
      >
        Your Rentals
      </button>
    </div>
  )
}
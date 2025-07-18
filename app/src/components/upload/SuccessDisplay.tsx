//SuccessDisplay.tsx

import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface SuccessDisplayProps {
  onListAnother: () => void
}

export default function SuccessDisplay({ onListAnother }: SuccessDisplayProps) {
  const router = useRouter()

  return (
    <div className="text-center py-8">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
        <Check className="h-6 w-6 text-green-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Outfit Listed Successfully!
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Your outfit is now available for rent.
      </p>
      <div className="flex justify-center gap-4">
        <Button
          onClick={onListAnother}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          List Another Outfit
        </Button>
        <Button
          onClick={() => router.push('/dashboard')}
          variant="outline"
          className="border-purple-600 text-purple-600"
        >
          View Your Listings
        </Button>
      </div>
    </div>
  )
}

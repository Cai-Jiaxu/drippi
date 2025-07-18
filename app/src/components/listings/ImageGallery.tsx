//ImageGallery.tsx


import React from 'react'
import Image from 'next/image'
import {ChevronLeft,ChevronRight} from 'lucide-react'

interface ImageGalleryProps {
  images: { id: number; image_url: string }[]
  currentIndex: number
  onPrevious: () => void
  onNext: () => void
  title: string
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  currentIndex,
  onPrevious,
  onNext,
  title,
}) => {
  const getValidImageUrl = (url?: string): string => {
    if (!url) return '/images/placeholder.jpg'
    return url.startsWith('http') ? url : '/images/placeholder.jpg'
  }

  return (
    <div className="flex flex-col relative h-full">
      <div className="relative w-full flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
        <Image
          src={getValidImageUrl(images[currentIndex]?.image_url)}
          alt={title}
          fill
          className="object-contain object-center"
        />
      </div>
      {/* Prev Arrow */}
      <button
        type="button"
        onClick={onPrevious}
        className="absolute top-1/2 left-2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm text-gray-800 dark:bg-black/70 dark:text-gray-200 hover:bg-white dark:hover:bg-black transition-shadow shadow-md"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Next Arrow */}
      <button
        type="button"
        onClick={onNext}
        className="absolute top-1/2 right-2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm text-gray-800 dark:bg-black/70 dark:text-gray-200 hover:bg-white dark:hover:bg-black transition-shadow shadow-md"
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
    
  )
}

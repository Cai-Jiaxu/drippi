//ImageUpload.tsx

import { UploadCloud } from 'lucide-react'
import Image from 'next/image'
import FileInput from '@/components/ui/file-input'

interface ImageUploadProps {
  images: File[]
  onImagesChange: (images: File[]) => void
}

export default function ImageUpload({ images, onImagesChange }: ImageUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    onImagesChange(files)
  }

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="sm:col-span-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Photos* (1-5 images)
      </label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <div className="flex text-sm text-gray-600 dark:text-gray-400">
            <FileInput
              id="images"
              multiple
              accept=".jpeg,.jpg,.png,.svg"
              onChange={handleFileChange}
              className="sr-only"
              required
            />
            <label
              htmlFor="images"
              className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 focus-within:outline-none"
            >
              <div className="flex flex-col items-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <span>Upload photos</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  PNG, JPG, SVG up to 10MB
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>
      {images.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-2">
          {images.map((file, index) => (
            <div key={index} className="relative group">
              <div className="h-24 w-full relative rounded overflow-hidden">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
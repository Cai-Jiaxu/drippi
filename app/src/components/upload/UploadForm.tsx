//UploadForm.tsx


import { useState, useEffect, FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Category, OutfitFormData } from '../../types/upload'
import { fetchCategories } from '../../api/upload'
import ImageUpload from './ImageUpload'

interface UploadFormProps {
  formData: OutfitFormData
  submitting: boolean
  updateField: <K extends keyof OutfitFormData>(field: K, value: OutfitFormData[K]) => void
  onSubmit: () => void
}

export default function UploadForm({ formData, submitting, updateField, onSubmit }: UploadFormProps) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(error => console.error('Category load failed:', error))
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Title */}
        <div className="sm:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Outfit Title*
          </label>
          <Input
            id="title"
            value={formData.title}
            onChange={e => updateField('title', e.target.value)}
            placeholder="e.g. Summer Floral Dress"
            className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            required
          />
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <Textarea
            id="description"
            rows={4}
            maxLength={500}
            value={formData.description}
            onChange={e => updateField('description', e.target.value)}
            placeholder="Tell renters about the condition, brand, style, etc."
            className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {formData.description.length}/500 characters
          </p>
        </div>

        {/* Size */}
        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Size*
          </label>
          <Input
            id="size"
            value={formData.size}
            onChange={e => updateField('size', e.target.value)}
            placeholder="e.g. M, 10, 32x34"
            className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price per day (SGD)*
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
            </div>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={e => updateField('price', e.target.value)}
              placeholder="0.00"
              className="pl-7 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div className="sm:col-span-2">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category*
          </label>
          <Select
            value={formData.categoryId === '' ? undefined : String(formData.categoryId)}
            onValueChange={val => updateField('categoryId', Number(val))}
          >
            <SelectTrigger className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
              {categories.map(category => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Images */}
        <ImageUpload
          images={formData.images}
          onImagesChange={images => updateField('images', images)}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 text-base font-medium rounded-full shadow-sm"
          disabled={submitting}
        >
          {submitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center">
              Submit Outfit <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
      </div>
    </form>
  )
}
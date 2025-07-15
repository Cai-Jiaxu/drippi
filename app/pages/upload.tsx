'use client'

import { useState, useEffect, FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import FileInput from '@/components/ui/file-input'
import { useAuth } from '@clerk/nextjs'
import { UploadCloud, ArrowRight, Check } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Category {
  id: number
  name: string
}

export default function UploadPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [size, setSize] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [images, setImages] = useState<File[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const { getToken } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetch('/api/categories/', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
      })
      .then((data: Category[]) => {
        console.log('🔽 fetched categories', data)
        setCategories(data)
      })
      .catch(err => console.error('Category load failed:', err))
  }, [])

  function validate() {
    const errs: string[] = []
    if (!title.trim()) errs.push('Title is required.')
    if (!size.trim()) errs.push('Size is required.')
    const p = parseFloat(price)
    if (isNaN(p) || p <= 0) errs.push('Price must be a positive number.')
    if (images.length < 1 || images.length > 5)
      errs.push('You must upload between 1 and 5 images.')
    for (const f of images) {
      if (f.size > 10 * 1024 * 1024) errs.push(`${f.name} exceeds 10 MB.`)
      if (!/\.(jpe?g|png|svg)$/i.test(f.name))
        errs.push(`${f.name} must be JPEG, PNG, or SVG.`)
    }
    if (categoryId === '') errs.push('Category is required.')
    return errs
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const clerkToken = await getToken()
    if (submitting) return

    const errs = validate()
    if (errs.length) {
      setErrors(errs)
      return
    }

    setSubmitting(true)
    setErrors([])

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;

    try {
      // 1) create outfit
      const outfitRes = await fetch(`${API_BASE}/api/outfits/`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${clerkToken}`,
        },
        body: JSON.stringify({
          title,
          description,
          size,
          price_per_day: price,
          category: categoryId,
        }),
      })
      if (!outfitRes.ok) throw new Error('Failed to create outfit.')
      const { id: outfitId } = await outfitRes.json()

      // 2) upload images
      for (const file of images) {
        const form = new FormData()
        form.append('outfit', String(outfitId))
        form.append('image', file)
        const imgRes = await fetch(`${API_BASE}/api/images/upload/`, {
          method: 'POST',
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${clerkToken}`,
          },
          body: form,
        })
        if (!imgRes.ok) throw new Error(`Failed to upload ${file.name}.`)
      }

      setSuccess(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrors([err.message || 'Unexpected error'])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-purple-700 dark:text-purple-400 mb-2">
            Share Your Style
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            List your outfit and start earning in minutes
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
          {/* Progress indicator */}
          <div className="bg-purple-600 dark:bg-purple-700 px-6 py-4">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${success ? 'bg-green-400' : 'bg-white'} mr-3`}>
                {success ? (
                  <Check className="w-5 h-5 text-purple-700" />
                ) : (
                  <span className="text-purple-700 font-bold">1</span>
                )}
              </div>
              <h2 className="text-lg font-semibold text-white">
                {success ? 'Upload Complete!' : 'Outfit Details'}
              </h2>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {success ? (
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
                    onClick={() => {
                      setTitle('')
                      setDescription('')
                      setSize('')
                      setPrice('')
                      setCategoryId('')
                      setImages([])
                      setSuccess(false)
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    List Another Outfit
                  </Button>
                  <Button 
                    onClick={() => router.push('/listings')}
                    variant="outline" 
                    className="border-purple-600 text-purple-600"
                  >
                    View Your Listings
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {errors.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 rounded">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                          Please fix the following errors:
                        </h3>
                        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                          <ul className="list-disc pl-5 space-y-1">
                            {errors.map((e, i) => (
                              <li key={i}>{e}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Title */}
                    <div className="sm:col-span-2">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Outfit Title*
                      </label>
                      <Input
                        id="title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
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
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Tell renters about the condition, brand, style, etc."
                        className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {description.length}/500 characters
                      </p>
                    </div>

                    {/* Size */}
                    <div>
                      <label htmlFor="size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Size*
                      </label>
                      <Input
                        id="size"
                        value={size}
                        onChange={e => setSize(e.target.value)}
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
                          value={price}
                          onChange={e => setPrice(e.target.value)}
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
                        value={categoryId === '' ? undefined : String(categoryId)}
                        onValueChange={val => setCategoryId(Number(val))}
                      >
                        <SelectTrigger className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                          {categories.map(cat => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Images */}
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
                              onChange={e => setImages(Array.from(e.target.files || []))}
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
                                  unoptimized // Required for blob URLs
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => setImages(images.filter((_, i) => i !== index))}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
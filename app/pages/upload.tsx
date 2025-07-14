'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useUploadForm } from '../hooks/useUploadForm'
import { InputField } from '../src/components/InputField'
import { SelectField } from '../src/components/SelectField'
import { FileInputField } from '../src/components/FileInputField'
import { Button } from '@/components/ui/button'
import { getCsrfToken } from '../src/lib/csrf'
import { useAuth } from '@clerk/nextjs'

export default function UploadPage() {
  const { formData, setField, errors, setErrors, submitting, setSubmitting, success, setSuccess, validate } = useUploadForm()
  const { getToken } = useAuth()
  const [imageUrls, setImageUrls] = useState<string[]>([])

  const categories = [
    { id: 1, name: 'Dress' },
    { id: 2, name: 'Top' },
    { id: 3, name: 'Pants' },
    { id: 4, name: 'Skirt' },
    { id: 5, name: 'Jacket' },
    { id: 6, name: 'Coat' },
    { id: 7, name: 'Sweater' },
    { id: 8, name: 'Shorts' },
    { id: 9, name: 'Activewear' },
    { id: 10, name: 'Footwear' },
    { id: 11, name: 'Other' },
  ]

  const API_BASE = process.env.NEXT_PUBLIC_API_URL

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setField('images', files)
    setImageUrls([])

    const csrf = getCsrfToken()
    for (const file of files) {
      const fd = new FormData()
      fd.append('image', file)

      try {
        const res = await fetch(`${API_BASE}/api/upload_image/`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'X-CSRFToken': csrf },
          body: fd,
        })
        const json = await res.json()

        if (res.ok && json.imageUrl) {
          setImageUrls(urls => [...urls, json.imageUrl])
        } else {
          console.error('Image upload failed:', json.error)
        }
      } catch (err) {
        console.error('Error uploading image:', err)
      }
    }
  }

  const handleSubmit = async (e: FormEvent) => {
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

    try {
      const outfitRes = await fetch(`${API_BASE}/api/outfits/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          size: formData.size,
          price_per_day: formData.price,
          category: formData.categoryId,
        }),
      })
      if (!outfitRes.ok) throw new Error('Failed to create outfit.')
      const { id: outfitId } = await outfitRes.json()

      for (const imageUrl of imageUrls) {
        const linkRes = await fetch(`${API_BASE}/api/images/`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken(),
            'Authorization': `Bearer ${clerkToken}`,
          },
          body: JSON.stringify({ outfit: outfitId, url: imageUrl }),
        })
        if (!linkRes.ok) {
          const text = await linkRes.text()
          throw new Error(`Failed to link image: ${text}`)
        }
      }

      setSuccess(true)
    } catch (err: unknown) {
      const error = err as Error
      setErrors([error.message || 'Unexpected error'])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen">
      <section className="py-20 px-4 bg-gradient-to-br from-purple-600 to-blue-500 dark:bg-gradient-to-tr dark:from-purple-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center">
        <div className="bg-white bg-opacity-30 dark:bg-gradient-to-br dark:from-gray-800 dark:to-purple-900 dark:bg-opacity-60 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-lg">
          <h1 className="text-3xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200 dark:from-gray-100 dark:to-gray-300">
            Upload Your Outfit
          </h1>

          {success && (
            <div className="bg-[var(--primary)] text-[var(--primary-foreground)] p-3 rounded mb-4">
              <span>Your outfit was uploaded successfully!</span>
            </div>
          )}

          {errors.length > 0 && (
            <div className="bg-[var(--destructive)] text-[var(--destructive-foreground)] p-3 rounded mb-4">
              <div className="flex flex-col space-y-1">
                {errors.map((e, i) => (
                  <span key={i}>• {e}</span>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              id="title"
              label="Title"
              value={formData.title}
              onChange={e => setField('title', e.target.value)}
              placeholder="Enter title"
              required
            />

            <InputField
              id="size"
              label="Size"
              value={formData.size}
              onChange={e => setField('size', e.target.value)}
              placeholder="Enter size"
              required
            />

            <InputField
              id="price"
             	label="Price per day (SGD)"
              type="number"
             	value={formData.price}
             	onChange={e => setField('price', e.target.value)}
              placeholder="0.00"
              required
             	step="0.01"
            />

            <SelectField
              id="category"
              label="Category"
              value={formData.categoryId}
              onChange={val => setField('categoryId', val)}
              options={categories}
            />

            <FileInputField
              id="images"
              label="Images (1–5)"
              value={formData.images}
              onChange={handleFileSelect}
            />

            <Button
              type="submit"
              className="bg-purple-700 text-white px-6 py-3 text-lg font-semibold rounded-full w-full hover:bg-purple-800 transform hover:-translate-y-0.5 transition"
              disabled={submitting}
            >
              {submitting ? 'Uploading…' : 'Submit Outfit'}
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}

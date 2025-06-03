// pages/upload.tsx
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
import { getCsrfToken } from '../src/lib/csrf'

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

  useEffect(() => {
    fetch('http://localhost:8000/api/categories/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((data: Category[]) => setCategories(data))
      .catch(console.error)
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
    if (submitting) return

    const errs = validate()
    if (errs.length) {
      setErrors(errs)
      return
    }

    setSubmitting(true)
    setErrors([])

    try {
      // 1) create outfit
      const outfitRes = await fetch('http://localhost:8000/api/outfits/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
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
        const imgRes = await fetch('http://localhost:8000/api/images/', {
          method: 'POST',
          credentials: 'include',
          headers: { 'X-CSRFToken': getCsrfToken() },
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
    <div className="min-h-screen bg-[var(--muted)] flex items-center justify-center p-4">
      <div className="bg-[var(--background)] shadow-lg p-6 rounded-lg w-full max-w-sm overflow-visible">
        <h1 className="text-2xl font-semibold text-[var(--foreground)] text-center mb-4">
          Upload Outfit
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
          {/* Title */}
          <div>
            <label htmlFor="title" className="block mb-1 text-[var(--foreground)] font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="TITLE"
              className="w-full bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)]"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block mb-1 text-[var(--foreground)] font-medium">
              Description (optional)
            </label>
            <Textarea
              id="description"
              rows={3}
              maxLength={500}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Tell renters more about this outfit"
              className="w-full bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)]"
            />
          </div>

          {/* Size */}
          <div>
            <label htmlFor="size" className="block mb-1 text-[var(--foreground)] font-medium">
              Size
            </label>
            <Input
              id="size"
              value={size}
              onChange={e => setSize(e.target.value)}
              placeholder="Size"
              className="w-full bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)]"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block mb-1 text-[var(--foreground)] font-medium">
              Price per day (SGD)
            </label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="Price"
              className="w-full bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)]"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block mb-1 text-[var(--foreground)] font-medium">
              Category
            </label>
            <Select
              value={categoryId === '' ? undefined : String(categoryId)}
              onValueChange={val => setCategoryId(Number(val))}
            >
              <SelectTrigger className="w-full bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent
                side="bottom"
                sideOffset={4}
                className="bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-md shadow-lg z-50"
              >
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Images */}
          <div>
            <label htmlFor="images" className="block mb-1 text-[var(--foreground)] font-medium">
              Images (1–5)
            </label>
            <FileInput
              id="images"
              multiple
              accept=".jpeg,.jpg,.png,.svg"
              onChange={e => setImages(Array.from(e.target.files || []))}
              required
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="outline"
            size="lg"
            className="w-full px-6 py-3 rounded-full font-semibold transition"
            disabled={submitting}
          >
            {submitting ? 'Uploading…' : 'Submit Outfit'}
          </Button>
        </form>
      </div>
    </div>
  )
}

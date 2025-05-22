// pages/upload.tsx
import { useState, useEffect, FormEvent } from 'react'
// import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth'
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
import FileInput  from '@/components/ui/file-input'
import { getCsrfToken } from '../src/lib/csrf'

interface Category {
  id: number
  name: string
}

export default function UploadPage() {
  const { user } = useAuth()
  // const router = useRouter()

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
    fetch('/api/categories/', { credentials: 'include' })
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
      const outfitRes = await fetch('/api/outfits/', {
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
        const imgRes = await fetch('/api/images/', {
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <p className="text-base-content">Please log in to upload an outfit.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-lg p-6">
        <h1 className="card-title justify-center mb-4">Upload Outfit</h1>

        {success && (
          <div className="alert alert-success shadow-lg mb-4">
            <span>Your outfit was uploaded successfully!</span>
          </div>
        )}

        {errors.length > 0 && (
          <div className="alert alert-error shadow-lg mb-4">
            <div className="flex flex-col space-y-1">
              {errors.map((e, i) => (
                <span key={i}>• {e}</span>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="form-control">
            <label htmlFor="title" className="label">
              <span className="label-text">Title</span>
            </label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="TITLE"
              className="input input-bordered bg-base-100 text-base-content w-full"
              required
            />
          </div>

          
          <div className="form-control">
            <label htmlFor="description" className="label">
              <span className="label-text">Description (optional)</span>
            </label>
            <Textarea
              id="description"
              rows={3}
              maxLength={500}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Tell renters more about this outfit"
              className="textarea textarea-bordered bg-base-100 text-base-content w-full"
            />
          </div>

          
          <div className="form-control">
            <label htmlFor="size" className="label">
              <span className="label-text">Size</span>
            </label>
            <Input
              id="size"
              value={size}
              onChange={e => setSize(e.target.value)}
              placeholder="Size"
              className="input input-bordered bg-base-100 text-base-content w-full"
              required
            />
          </div>

          
          <div className="form-control">
            <label htmlFor="price" className="label">
              <span className="label-text">Price per day (SGD)</span>
            </label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="Price"
              className="input input-bordered bg-base-100 text-base-content w-full"
              required
            />
          </div>

          {/* Category */}
          <div className="form-control">
            <label htmlFor="category" className="label">
              <span className="label-text">Category</span>
            </label>
            <Select
              onValueChange={val => setCategoryId(Number(val))}
              value={categoryId === '' ? undefined : String(categoryId)}
            >
              <SelectTrigger className="select select-bordered bg-base-100 text-base-content w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          
          <div className="form-control">
            <label htmlFor="images" className="label">
              <span className="label-text">Images (1–5)</span>
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
            className={`btn btn-primary w-full ${submitting ? 'loading' : ''}`}
            disabled={submitting}
          >
            {submitting ? 'Uploading…' : 'Submit Outfit'}
          </Button>
        </form>
      </div>
    </div>
  )
}

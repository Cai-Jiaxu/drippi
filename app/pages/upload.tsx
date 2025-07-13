// pages/upload.tsx
import { useState, FormEvent, ChangeEvent } from 'react'
import { useUploadForm } from '../hooks/useUploadForm'
import { InputField } from '../src/components/InputField'
import { SelectField } from '../src/components/SelectField'
import { FileInputField } from '../src/components/FileInputField'
import { Button } from '../src/components/ui/button'
import { getCsrfToken } from '../src/lib/csrf'

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

  const API_BASE =  process.env.NEXT_PUBLIC_API_URL;
   
  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setField('images', files)      // for your hook’s validation
    setImageUrls([])               // reset any previous URLs

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
      // 1) Create the outfit
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

      // 2) Upload images wif image URL
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
    } catch (err:unknown) {
      const error = err as Error;
      setErrors([error.message || 'Unexpected error'])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--muted)] flex items-center justify-center p-4">
      <div className="bg-[var(--background)] shadow-lg p-6 rounded-lg w-full max-w-sm overflow-visible">
        <h1 className="text-2xl font-semibold text-[var(--foreground)] text-center mb-4">Upload Outfit</h1>

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
            onChange={(e) => setField('title', e.target.value)}
            placeholder="TITLE"
            required
          />
          <InputField
            id="size"
            label="Size"
            value={formData.size}
            onChange={(e) => setField('size', e.target.value)}
            placeholder="Size"
            required
          />
          <InputField
            id="price"
            label="Price per day (SGD)"
            type="number"
            value={formData.price}
            onChange={(e) => setField('price', e.target.value)}
            placeholder="Price"
            required
            step="0.01"
          />
          <SelectField
            id="category"
            label="Category"
            value={formData.categoryId}
            onChange={(val) => setField('categoryId', val)}
            options={categories}
          />
          <FileInputField
            id="images"
            label="Images (1–5)"
            value={formData.images}
            onChange={handleFileSelect}
          />
          <Button type="submit" variant="outline" size="lg" className="w-full px-6 py-3 rounded-full font-semibold transition" disabled={submitting}>
            {submitting ? 'Uploading…' : 'Submit Outfit'}
          </Button>
        </form>
      </div>
    </div>
  )
}

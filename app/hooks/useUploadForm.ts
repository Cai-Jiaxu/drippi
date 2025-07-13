// hooks/useUploadForm.ts
import { useState } from 'react'

interface FormData {
  title: string
  description: string
  size: string
  price: string
  categoryId: string
  images: File[]
}

export const useUploadForm = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    size: '',
    price: '',
    categoryId: '',
    images: [],
  })
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const setField = (field: keyof FormData, value: string | File[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validate = () => {
    const errs: string[] = []
    if (!formData.title.trim()) errs.push('Title is required.')
    if (!formData.size.trim()) errs.push('Size is required.')
    const price = parseFloat(formData.price)
    if (isNaN(price) || price <= 0) errs.push('Price must be a positive number.')
    if (formData.images.length < 1 || formData.images.length > 5)
      errs.push('You must upload between 1 and 5 images.')
    for (const f of formData.images) {
      if (f.size > 10 * 1024 * 1024) errs.push(`${f.name} exceeds 10 MB.`)
      if (!/\.(jpe?g|png|svg)$/i.test(f.name))
        errs.push(`${f.name} must be JPEG, PNG, or SVG.`)
    }
    if (!formData.categoryId) errs.push('Category is required.')
    return errs
  }

  return {
    formData,
    setField,
    errors,
    setErrors,
    submitting,
    setSubmitting,
    success,
    setSuccess,
    validate,
  }
}

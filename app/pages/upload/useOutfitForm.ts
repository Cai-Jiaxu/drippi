import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { OutfitFormData } from './types'
import { validateOutfitForm } from './utils'
import { createOutfit, uploadImage } from './api'

export function useOutfitForm() {
  const [formData, setFormData] = useState<OutfitFormData>({
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
  const { getToken } = useAuth()

  const updateField = <K extends keyof OutfitFormData>(
    field: K,
    value: OutfitFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      size: '',
      price: '',
      categoryId: '',
      images: [],
    })
    setErrors([])
    setSuccess(false)
  }

  const submitForm = async () => {
    const token = await getToken()
    if (submitting || !token) return

    const validationErrors = validateOutfitForm(formData)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    setErrors([])

    try {
      const outfitId = await createOutfit(formData, token)
      
      for (const file of formData.images) {
        await uploadImage(outfitId, file, token)
      }

      setSuccess(true)
    } catch (error) {
      setErrors([(error as Error).message || 'Unexpected error'])
    } finally {
      setSubmitting(false)
    }
  }

  return {
    formData,
    errors,
    submitting,
    success,
    updateField,
    resetForm,
    submitForm,
  }
}
//api.ts

import { Category, OutfitFormData } from '../types/upload'

const API_BASE = process.env.NEXT_PUBLIC_API_URL

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch('/api/categories/', { credentials: 'include' })
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

export async function createOutfit(data: OutfitFormData, token: string): Promise<number> {
  const response = await fetch(`${API_BASE}/api/outfits/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      size: data.size,
      price_per_day: data.price,
      category: data.categoryId,
    }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create outfit.')
  }
  
  const { id } = await response.json()
  return id
}

export async function uploadImage(outfitId: number, file: File, token: string): Promise<void> {
  const formData = new FormData()
  formData.append('outfit', String(outfitId))
  formData.append('image', file)
  
  const response = await fetch(`${API_BASE}/api/images/upload/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  })
  
  if (!response.ok) {
    throw new Error(`Failed to upload ${file.name}.`)
  }
}
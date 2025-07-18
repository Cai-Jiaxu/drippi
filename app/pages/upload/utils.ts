import { OutfitFormData } from './types'

export function validateOutfitForm(data: OutfitFormData): string[] {
  const errors: string[] = []
  
  if (!data.title.trim()) {
    errors.push('Title is required.')
  }
  
  if (!data.size.trim()) {
    errors.push('Size is required.')
  }
  
  const price = parseFloat(data.price)
  if (isNaN(price) || price <= 0) {
    errors.push('Price must be a positive number.')
  }
  
  if (data.images.length < 1 || data.images.length > 5) {
    errors.push('You must upload between 1 and 5 images.')
  }
  
  for (const file of data.images) {
    if (file.size > 10 * 1024 * 1024) {
      errors.push(`${file.name} exceeds 10 MB.`)
    }
    if (!/\.(jpe?g|png|svg)$/i.test(file.name)) {
      errors.push(`${file.name} must be JPEG, PNG, or SVG.`)
    }
  }
  
  if (data.categoryId === '') {
    errors.push('Category is required.')
  }
  
  return errors
}
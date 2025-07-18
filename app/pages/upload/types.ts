export interface Category {
  id: number
  name: string
}

export interface OutfitFormData {
  title: string
  description: string
  size: string
  price: string
  categoryId: number | ''
  images: File[]
}
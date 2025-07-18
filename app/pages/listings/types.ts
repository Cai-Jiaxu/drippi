export interface Listing {
  id: number
  title: string
  description: string
  size: string
  price_per_day: number | string
  category: number
  images: { id: number; image_url: string }[]
  owner: {
    id: number
    username: string
  }
}

export interface Rental {
  id: number
  outfit: Listing
  status: string
}

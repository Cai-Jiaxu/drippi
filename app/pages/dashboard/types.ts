export interface OutfitImage {
  id: number
  image_url: string
}

export interface Profile {
  gender: string
  telegram_handle?: string
  phone_number?: string
}

export interface UserInfo {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  profile?: Profile
}

export interface Outfit {
  id: number
  title: string
  description: string
  size: string
  price_per_day: number
  category: number
  images: OutfitImage[]
  rentals?: Rental[]
}

export interface Rental {
  id: number
  outfit: number
  outfit_details: Outfit
  renter: UserInfo
  start_date: string
  end_date: string
  status: string
}

export type TabType = 'renter' | 'lister'
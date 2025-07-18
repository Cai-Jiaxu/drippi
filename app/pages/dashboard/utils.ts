import { UserInfo } from './types'

export const categoryMap: Record<number, string> = {
  1: 'Dress',
  2: 'Top',
  3: 'Pants',
  4: 'Skirt',
  5: 'Jacket',
  6: 'Coat',
  7: 'Sweater',
  8: 'Shorts',
  9: 'Activewear',
  10: 'Footwear',
  11: 'Others',
}

export const formatRenter = (renter?: { 
  first_name?: string; 
  last_name?: string; 
  email?: string 
}) => {
  if (!renter) return 'N/A'
  const fullName = `${renter.first_name ?? ''} ${renter.last_name ?? ''}`.trim()
  const email = renter.email ?? 'no email'
  return `${fullName} (${email})`
}

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'requested':
    case 'pending':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

export const getValidImageUrl = (url?: string): string => {
  if (!url) return '/images/placeholder.jpg'
  return url.startsWith('http://') || url.startsWith('https://') ? url : '/images/placeholder.jpg'
}
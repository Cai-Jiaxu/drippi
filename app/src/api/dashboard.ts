// api.ts
import { Rental, Outfit } from '../types/dashboard'

export class ApiService {
  private baseUrl: string
  private getToken: () => Promise<string | null>

  constructor(getToken: () => Promise<string | null>) {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    this.getToken = getToken
  }

  private async waitUntilTokenValid(token: string): Promise<void> {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const iat = payload.iat
      const now = Math.floor(Date.now() / 1000)
      const diff = iat - now
      if (diff > 0) {
        console.warn(`Token not valid yet. Waiting ${diff} seconds...`)
        await new Promise((res) => setTimeout(res, diff * 1000))
      }
    } catch (err) {
      console.warn('Could not parse token for iat:', err)
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getToken()
    if (!token) throw new Error('No authentication token available')

    await this.waitUntilTokenValid(token)

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      let errorBody = ''
      try {
        errorBody = await response.text()
        console.log('Error response body:', errorBody)
      } catch (e) {
        console.error('Failed to read error response body:', e)
      }

      const errorMessage = `API request failed: ${response.status} ${response.statusText}`
      const error = new Error(errorMessage)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(error as any).status = response.status
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(error as any).responseBody = errorBody
      throw error
    }

    return response.json()
  }

  private async makeDeleteRequest(endpoint: string, options: RequestInit = {}): Promise<void> {
    const token = await this.getToken()
    if (!token) throw new Error('No authentication token available')

    await this.waitUntilTokenValid(token)

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorMessage = `API request failed: ${response.status} ${response.statusText}`
      const error = new Error(errorMessage)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(error as any).status = response.status
      throw error
    }
  }

  async fetchMyRentals(): Promise<Rental[]> {
    return this.makeRequest<Rental[]>('/api/my-rentals/')
  }

  async fetchMyListings(): Promise<Outfit[]> {
    return this.makeRequest<Outfit[]>('/api/my-listings/')
  }

  async cancelRental(rentalId: number): Promise<void> {
    await this.makeRequest(`/api/cancel-rental/${rentalId}/`, {
      method: 'POST',
    })
  }

  async approveRental(rentalId: number): Promise<void> {
    await this.makeRequest(`/api/approve-rental/${rentalId}/`, {
      method: 'POST',
    })
  }

  async rejectRental(rentalId: number): Promise<void> {
    await this.makeRequest(`/api/reject-rental/${rentalId}/`, {
      method: 'POST',
    })
  }

  async deleteListing(listingId: number): Promise<void> {
    await this.makeDeleteRequest(`/api/delete-listing/${listingId}/`, {
      method: 'DELETE',
    })
  }
}

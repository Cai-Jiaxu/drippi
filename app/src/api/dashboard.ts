// api.ts
import { Rental, Outfit } from '../types/dashboard'

export class ApiService {
  private baseUrl: string
  private getToken: () => Promise<string | null>

  constructor(getToken: () => Promise<string | null>) {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    this.getToken = getToken
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Get fresh token for each request
    const token = await this.getToken()
    
    if (!token) {
      throw new Error('No authentication token available')
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      // Try to get response body for more details
      let errorBody = ''
      try {
        errorBody = await response.text()
        console.log('Error response body:', errorBody)
      } catch (e) {
        console.log('Could not read error response body')
      }
      
      const errorMessage = `API request failed: ${response.status} ${response.statusText}`
      const error = new Error(errorMessage)
      ;(error as any).status = response.status
      ;(error as any).responseBody = errorBody
      throw error
    }

    return response.json()
  }

  private async makeDeleteRequest(endpoint: string, options: RequestInit = {}): Promise<void> {
    const token = await this.getToken()
    
    if (!token) {
      throw new Error('No authentication token available')
    }

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
      ;(error as any).status = response.status
      throw error
    }
    return
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
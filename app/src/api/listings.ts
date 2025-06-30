// app/pages/api/listings.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchListingsFromDB } from './fetchListings'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const listings = await fetchListingsFromDB()
    res.status(200).json(listings)
  } catch (error) {
    console.error('Error fetching listings:', error)
    res.status(500).json({ error: 'Failed to load listings' })
  }
}
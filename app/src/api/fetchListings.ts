// src/api/fetchListings.ts

export interface Listing {
  id: number;
  title: string;
  description?: string;
  price_per_day: number;
  images: { id: number; image: string }[];
}

export interface PaginatedResponse<T> {
  results: T[];
  next: string | null;
}

/**
 * Fetch paginated, searchable listings.
 * @param search Optional search term.
 * @param page   Page number (1-based).
 * @param baseUrl Optional base URL (e.g., http://localhost:3000) for server-side use.
 */
export async function fetchListings(
  search?: string,
  page: number = 1,
  baseUrl?: string
): Promise<PaginatedResponse<Listing>> {
  const params = new URLSearchParams();
  params.set("page", page.toString());
  if (search) {
    params.set("search", search);
  }

  // Compose the endpoint
  const endpoint = `/api/outfits/?${params.toString()}`;
  // Use absolute URL on the server, relative in the browser
  const url = baseUrl ? `${baseUrl}${endpoint}` : endpoint;

  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    throw new Error(`fetchListings failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<PaginatedResponse<Listing>>;
}


import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import * as React from 'react';
import { fetchListings, Listing } from '../src/api/fetchListings';
import { OutfitCard } from '../src/components/OutfitCard';

interface Props {
  initialResults: Listing[];
  initialNext: string | null;
}

export default function Listings({ initialResults, initialNext }: Props) {
  const router = useRouter();
  const search = typeof router.query.search === 'string' ? router.query.search : '';

  const [items, setItems] = React.useState<Listing[]>(initialResults);
  const [next, setNext] = React.useState<string | null>(initialNext);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  // Reset when search term changes
  React.useEffect(() => {
    setItems(initialResults);
    setNext(initialNext);
    setPage(1);
  }, [search, initialResults, initialNext]);

  // Load subsequent pages
  React.useEffect(() => {
    if (page === 1) return;  // first page already rendered on server
    setLoading(true);
    fetchListings(search, page)
      .then(data => {
        setItems(prev => [...prev, ...(data.results ?? [])]);
        setNext(data.next ?? null);
      })
      .finally(() => setLoading(false));
  }, [page, search]);

  // Infinite-scroll sentinel
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!sentinelRef.current || !next) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setPage(p => p + 1),
      { rootMargin: '200px' }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [next]);

  const isFirstLoad = page === 1 && items.length === 0 && loading;

  return (
    <div className="min-h-screen bg-base-100 text-base-content p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isFirstLoad
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="max-w-xs w-full space-y-2 animate-pulse">
                <div className="h-56 bg-base-200 dark:bg-base-300 rounded" />
                <div className="h-4 bg-base-200 dark:bg-base-300 rounded w-3/4" />
                <div className="h-4 bg-base-200 dark:bg-base-300 rounded w-1/2" />
              </div>
            ))
          : items.map(o => (
              <OutfitCard key={o.id} outfit={o} onAddToCart={() => {}} />
            ))}
      </div>

      {loading && !isFirstLoad && (
        <p className="text-center mt-4">Loading more…</p>
      )}
      <div ref={sentinelRef} />

      {!loading && items.length === 0 && (
        <p className="text-center mt-4">No listings found.</p>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, req }) => {
  const search = typeof query.search === 'string' ? query.search : '';

  // Build absolute base URL for SSR fetch
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = req.headers.host || 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;

  try {
    const data = await fetchListings(search, 1, baseUrl);

    return {
      props: {
        // ensure these are never undefined
        initialResults: Array.isArray(data.results) ? data.results : [],
        initialNext: data.next ?? null,
      },
    };
  } catch (error) {
    console.error('Error fetching listings for SSR:', error);
    return {
      props: {
        initialResults: [],
        initialNext: null,
      },
    };
  }
};

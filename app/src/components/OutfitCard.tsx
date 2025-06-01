// components/OutfitCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Carousel } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export interface Outfit {
  id: number;
  title: string;
  description?: string;
  price_per_day: number;
  images: { id: number; image: string }[];
}

export interface OutfitCardProps {
  outfit: Outfit;
  onAddToCart: (outfit: Outfit) => void;
}

export function OutfitCard({ outfit, onAddToCart }: OutfitCardProps) {
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<Record<number, boolean>>({});

  const handleLoad = (id: number) => {
    setLoaded(prev => ({ ...prev, [id]: true }));
  };
  const handleError = (id: number) => {
    setError(prev => ({ ...prev, [id]: true }));
  };

  return (
    <Card className="max-w-xs transition-transform transition-shadow duration-200 ease-in-out hover:shadow-2xl hover:scale-[1.02]">
      <Carousel className="h-56 bg-[var(--muted)]">
        {outfit.images.map(img => (
          <div key={img.id} className="carousel-item w-full relative">
            {!loaded[img.id] && !error[img.id] && (
              <div className="absolute inset-0 bg-[var(--muted)] animate-pulse" />
            )}
            {error[img.id] && (
              <div className="absolute inset-0 bg-[var(--muted)] flex items-center justify-center">
                <span className="text-sm text-[var(--muted-foreground)]">
                  Image unavailable
                </span>
              </div>
            )}
            <Image
              src={img.image}
              alt={outfit.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-opacity ${
                loaded[img.id] ? 'opacity-100' : 'opacity-0'
              }`}
              onLoadingComplete={() => handleLoad(img.id)}
              onError={() => handleError(img.id)}
            />
          </div>
        ))}
      </Carousel>

      <div className="p-4 flex flex-col h-full bg-[var(--background)] text-[var(--foreground)]">
        <h2 className="text-lg font-semibold line-clamp-2">{outfit.title}</h2>
        {outfit.description && (
          <p className="text-sm text-[var(--muted-foreground)] mt-1 line-clamp-3">
            {outfit.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between space-x-2">
          <span className="text-lg font-bold">
            ${outfit.price_per_day.toFixed(2)}
          </span>
          <Button
            variant="default"
            size="sm"
            className="flex items-center"
            onClick={() => onAddToCart(outfit)}
          >
            <ShoppingCart className="mr-1 h-4 w-4" /> Add to cart
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Quick View
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[var(--background)] text-[var(--foreground)]">
              <DialogHeader>
                <DialogTitle>{outfit.title}</DialogTitle>
                <DialogDescription>{outfit.description}</DialogDescription>
              </DialogHeader>
              <Carousel className="h-64 bg-[var(--muted)]">
                {outfit.images.map(img => (
                  <div key={img.id} className="carousel-item w-full relative">
                    <Image
                      src={img.image}
                      alt={outfit.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </Carousel>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold">
                  ${outfit.price_per_day.toFixed(2)}
                </span>
                <Button
                  variant="default"
                  onClick={() => onAddToCart(outfit)}
                >
                  <ShoppingCart className="mr-1 h-4 w-4" />
                  Add to cart
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  );
}

'use client';

import { useEffect, useRef } from 'react';

export function useDebounce(
  value: string,
  delay: number,
  callback: () => void
) {
  
  const handler = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
 
    if (handler.current) {
      clearTimeout(handler.current);
    }

   
    handler.current = setTimeout(() => {
      callback();
    }, delay);

   
    return () => {
      if (handler.current) {
        clearTimeout(handler.current);
      }
    };
  }, [value, delay, callback]);
}

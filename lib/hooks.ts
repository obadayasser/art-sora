'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks whether the viewport is below the given breakpoint.
 * Used to switch between the mobile carousel and desktop grid
 * without duplicating resize listeners in every section.
 */
export function useIsMobile(breakpoint: number = 1024): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(query.matches);

    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [breakpoint]);

  return isMobile;
}

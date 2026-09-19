'use client';

import { useEffect } from 'react';

// Hides the browser scrollbar on <html> for as long as this component is
// mounted (scrolling still works). Used by the public landing page.
export default function HideScrollbar() {
  useEffect(() => {
    document.documentElement.classList.add('hide-scrollbar');
    return () => document.documentElement.classList.remove('hide-scrollbar');
  }, []);

  return null;
}

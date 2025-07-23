// src/components/ScrollLock.tsx
'use client';

import { useEffect } from 'react';

export default function ScrollLock() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // remember previous values
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    // lock immediately, on every screen size
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    // clean up when the component unmounts (nav to another page)
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return null;
}

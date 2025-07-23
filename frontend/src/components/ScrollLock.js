'use client';

import { useEffect } from 'react';

export default function ScrollLock() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const lock = () => {
      html.dataset.prevOverflow = html.style.overflow;
      body.dataset.prevOverflow = body.style.overflow;
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
    };

    const unlock = () => {
      html.style.overflow = html.dataset.prevOverflow || '';
      body.style.overflow = body.dataset.prevOverflow || '';
    };

    const mq = window.matchMedia('(max-width: 768px)'); // lock only on mobile
    if (mq.matches) lock();
    mq.addEventListener('change', (e) => (e.matches ? lock() : unlock()));

    return unlock;
  }, []);

  return null;
}

/* eslint-disable react/prop-types */
'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '../../styles/SupplierBrowser.module.css';

const ROW_SIZE = 4; // logos per row

export default function SupplierBrowser({ suppliers = [] }) {
  const [activeSlug, setActiveSlug] = useState(null);

  const activeIndex = suppliers.findIndex((s) => s.slug === activeSlug);
  const activeRow   = activeIndex === -1 ? -1 : Math.floor(activeIndex / ROW_SIZE);

  const items = [];
  suppliers.forEach((s, i) => {
    /* ───── logo card (logo OR fallback name) ───── */
    items.push(
      <li key={s.slug}>
        <button
          className={`${styles.card}${s.slug === activeSlug ? ` ${styles.active}` : ''}`}
          onClick={() => setActiveSlug(prev => (prev === s.slug ? null : s.slug))}
        >
          {s.logoUrl ? (
            <Image
              src={s.logoUrl}
              alt={s.logoAlt || s.name}
              width={120}
              height={120}
              priority={false}
            />
          ) : (
            <span className={styles.fallbackName}>{s.name}</span>
          )}
        </button>
      </li>,
    );

    /* insert detail at end of its row */
    const isRowEnd   = (i % ROW_SIZE === ROW_SIZE - 1) || i === suppliers.length - 1;
    const thisRowIdx = Math.floor(i / ROW_SIZE);

    if (activeIndex !== -1 && isRowEnd && thisRowIdx === activeRow) {
      const sel = suppliers[activeIndex];
      items.push(
        <li key={`${sel.slug}-detail`} className={styles.detailItem}>
          {sel.coverUrl && (
            <Image
              src={sel.coverUrl}
              alt={sel.coverAlt || sel.name}
              width={1200}
              height={400}
              className={styles.cover}
              priority
            />
          )}

          <h2 className={styles.title}>{sel.name}</h2>

          {sel.description && (
            <p className={styles.description}>{sel.description}</p>
          )}

          <h3 className={styles.subtitle}>Products</h3>
          {sel.products.length === 0 ? (
            <p>(No products linked yet)</p>
          ) : (
            <ul className={styles.products}>
              {sel.products.map((p) => (
                <li key={p.id} className={styles.productItem}>
                  {p.imageUrl && (
                    <Image
                      src={p.imageUrl}
                      alt={p.imageAlt || p.name}
                      width={60}
                      height={60}
                      className={styles.thumb}
                    />
                  )}
                  <div>
                    <strong>{p.name}</strong>{' '}
                    {p.sizes.length > 0 && <em>({p.sizes.join(', ')})</em>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </li>,
      );
    }
  });

  return <ul className={styles.grid}>{items}</ul>;
}

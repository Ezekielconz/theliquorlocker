/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import Image        from "next/image";
import styles       from "../../styles/SupplierBrowser.module.css";

export default function SupplierBrowser({ suppliers = [] }) {
  const [activeSlug, setActiveSlug] = useState(null);           // clicked icon
  const selected = suppliers.find((s) => s.slug === activeSlug);

  return (
    <>
      {/* ───── supplier icon grid ───── */}
      <ul className={styles.grid}>
        {suppliers.map((s) => (
          <li key={s.slug}>
            <button
              className={`${styles.card}${
                s.slug === activeSlug ? ` ${styles.active}` : ""
              }`}
              onClick={() => setActiveSlug(s.slug)}
            >
              {s.logoUrl && (
                <Image
                  src={s.logoUrl}
                  alt={s.logoAlt}
                  width={120}
                  height={120}
                  priority={false}
                />
              )}
              <span>{s.name}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* ───── detail panel ───── */}
      {selected && (
        <section className={styles.detail}>
          {selected.coverUrl && (
            <Image
              src={selected.coverUrl}
              alt={selected.coverAlt}
              width={1200}
              height={400}
              className={styles.cover}
              priority
            />
          )}

          <h2 className={styles.title}>{selected.name}</h2>

          {selected.description && (
            <p className={styles.description}>{selected.description}</p>
          )}

          <h3 className={styles.subtitle}>Products</h3>
          {selected.products.length === 0 ? (
            <p>(No products linked yet)</p>
          ) : (
            <ul className={styles.products}>
              {selected.products.map((p) => (
                <li key={p.id} className={styles.productItem}>
                  {p.imageUrl && (
                    <Image
                      src={p.imageUrl}
                      alt={p.imageAlt}
                      width={60}
                      height={60}
                      className={styles.thumb}
                    />
                  )}

                  <div>
                    <strong>{p.name}</strong>{" "}
                    {p.sizes.length > 0 && (
                      <em>({p.sizes.join(", ")})</em>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  );
}

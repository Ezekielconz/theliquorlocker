'use client';

import Image from 'next/image';
import styles from '../styles/Hero.module.css';

export default function Hero({
  title,
  imageUrl,
  imageAlt = '',
  buttonOne,
  buttonTwo,
}) {
  // Split title on line-breaks so we can animate each line separately
  const lines = title.split('\n');

  return (
    <section className={styles.hero}>
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={imageAlt || title}
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
      )}

      <div className={styles.overlay}>
        <h1 className={styles.heroTitle}>
          {lines.map((line, i) => (
            <span
              key={i}
              className={styles.line}
              style={{ animationDelay: `${0.2 + i * 0.8}s` }}
            >
              {line}
            </span>
          ))}
        </h1>

        <div className={styles.buttons}>
          {buttonOne?.text && (
            <a href={buttonOne.url} className={styles.primary}>
              {buttonOne.text}
            </a>
          )}
          {buttonTwo?.text && (
            <a href={buttonTwo.url} className={styles.secondary}>
              {buttonTwo.text}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

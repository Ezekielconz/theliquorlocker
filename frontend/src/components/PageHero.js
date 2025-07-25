// components/PageHero.jsx
import Image from 'next/image';
import styles from '../styles/PageHero.module.css';

export default function PageHero({ title, imageUrl, imageAlt = '' }) {
  return (
    <section className={styles.hero}>
      {/* left-half (or top on mobile) image */}
      <div className={styles.imageWrapper}>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            priority
            className={styles.img}
          />
        )}
      </div>

      {/* title block */}
      <div className={styles.textWrapper}>
        <h1 className={styles.title}>{title}</h1>
      </div>
    </section>
  );
}

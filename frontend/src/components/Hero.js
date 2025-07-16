import Image from 'next/image';
import styles from '../styles/Hero.module.css';

export default function Hero({
  title,
  imageUrl,
  imageAlt = '',
  buttonOne,
  buttonTwo,
}) {
  return (
    <section className={styles.hero}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageAlt || title || ''}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      ) : (
        <div className={styles.heroPlaceholder}>
          <h1>{title}</h1>
        </div>
      )}
      <div className={styles.overlay}>
        <h1>{title}</h1>
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

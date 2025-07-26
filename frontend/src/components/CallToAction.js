// components/CallToAction.jsx
import Link from 'next/link';
import styles from '../styles/CallToAction.module.css';

export default function CallToAction({ heading, body, buttonText, buttonUrl }) {
  if (!heading) return null;               // don’t render if Strapi left it blank

  return (
    <aside className={styles.cta}>
      <h3 className={styles.heading}>{heading}</h3>
      {body && <p className={styles.body}>{body}</p>}

      {buttonText && buttonUrl && (
        <Link href={buttonUrl} className={styles.button}>
          {buttonText}
        </Link>
      )}
    </aside>
  );
}

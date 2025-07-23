'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Footer.module.css';

export default function Footer({ logoUrl, logoAlt = 'The Liquor Locker' }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.column}>
        <Link href="/" className={styles.logo}>
          {logoUrl ? (
            <Image src={logoUrl} alt={logoAlt} width={120} height={40} priority />
          ) : (
            <span>{logoAlt}</span>
          )}
        </Link>
      </div>

      <div className={styles.column}>
        <div className={styles.details}>
          <a href="mailto:Ben@thespiritsnetwork.co.nz">Ben@thespiritsnetwork.co.nz</a>
          <a href="tel:+64276256220">+64&nbsp;27&nbsp;625&nbsp;6220</a>
          <span>Auckland, New&nbsp;Zealand</span>
        </div>
      </div>

      <div className={styles.column}>
        <div className={styles.myDetails}>
          <span>Created&nbsp;&amp;&nbsp;Designed&nbsp;By</span>
          <a
            href="https://ezekiel.co.nz/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.creatorLink}
          >
            Ezekiel
          </a>
        </div>
      </div>
    </footer>
  );
}

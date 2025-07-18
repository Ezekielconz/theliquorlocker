'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Footer.module.css';

export default function Footer({ logoUrl, logoAlt = 'The Liquor Locker' }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.column}>
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={logoAlt}
                width={120}
                height={40}
                priority
              />
            ) : (
              <span>{logoAlt}</span>
            )}
          </Link>
        </div>
      </div>

      <div className={styles.column}>
        <div className={styles.details}>
          <a href="mailto:Ben@thespiritsnetwork.co.nz">
            Ben@thespiritsnetwork.co.nz
          </a>
          <a href="tel:+64276256220">+64 27 625 6220</a>
          <span>Auckland, New Zealand</span>
        </div>
      </div>

      <div className={styles.column}>
        <div className={styles.myDetails}>
          <span>Created & Designed By</span>
          <strong>Ezekiel</strong>
        </div>
      </div>
    </footer>
  );
}

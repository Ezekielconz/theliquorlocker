'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Navbar.module.css';

/**
 * Navbar
 */
export default function Navbar({ logoUrl, logoAlt = 'The Liquor Locker' }) {
  // Dev logging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Navbar] logoUrl prop:', logoUrl);
    }
  }, [logoUrl]);

  return (
    <nav className={styles.navbar}>
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
            <span>The Liquor Locker</span>
          )}
        </Link>
      </div>

      <ul className={styles.navLinks}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/range">Range</Link></li>
        <li><Link href="/contact">Contact</Link></li>
        <li>
          <Link href="/signup" className={styles.signupButton}>
            Sign Up
          </Link>
        </li>
      </ul>
    </nav>
  );
}

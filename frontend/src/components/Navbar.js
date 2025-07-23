'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Navbar.module.css';

export default function Navbar({ logoUrl, logoAlt = 'The Liquor Locker' }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleRoute = () => setMenuOpen(false);
    window.addEventListener('next/navigation:before-navigate', handleRoute);
    return () =>
      window.removeEventListener('next/navigation:before-navigate', handleRoute);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Navbar] logoUrl prop:', logoUrl);
    }
  }, [logoUrl]);

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/" className={styles.logoLink}>
          {logoUrl ? (
            <Image src={logoUrl} alt={logoAlt} width={120} height={40} priority />
          ) : (
            <span>{logoAlt}</span>
          )}
        </Link>
      </div>

      <button
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((o) => !o)}
        className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
      >
        <span />
        <span />
        <span />
      </button>

      <ul
        id="primary-navigation"
        className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ''}`}
      >
        {[
          { href: '/', text: 'Home' },
          { href: '/about', text: 'About' },
          { href: '/range', text: 'Range' },
          { href: '/contact', text: 'Contact' },
        ].map(({ href, text }) => (
          <li
            key={href}
            className={`${styles.navLink} ${isActive(href) ? styles.active : ''}`}
          >
            <Link href={href}>{text}</Link>
          </li>
        ))}

        <li className={`${styles.navLink} ${styles.noUnderline}`}>
          <Link href="/signup" className={styles.signupButton}>
            Sign Up
          </Link>
        </li>
      </ul>
    </nav>
  );
}

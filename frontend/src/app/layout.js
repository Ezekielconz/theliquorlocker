// ── src/app/layout.js ───────────────────────────────────────────────────────
export const revalidate = 60;

import { Geist, Geist_Mono, Raleway } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getNavigation } from '../lib/strapi';

/* ---------------------------------------------------------------------------
   Load the variable versions and expose them as CSS custom-properties.
   You’ll reference these variables in globals.css / Tailwind.
--------------------------------------------------------------------------- */
const geistSans = Geist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
});

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['900'],
  variable: '--font-raleway',
});

export const metadata = {
  title: 'The Liquor Locker',
  description: 'Wine, Spirits & Beer Distributors',
};

export default async function RootLayout({ children }) {
  const navData = await getNavigation(); // { logoUrl, logoAlt }

  return (
    /* ↓ Attach the font *variables* to <html>. They’ll cascade globally. */
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${raleway.variable}`}
    >
      <body className="antialiased">
        <Navbar
          logoUrl={navData?.logoUrl ?? null}
          logoAlt={navData?.logoAlt ?? 'The Liquor Locker'}
        />
        <main>{children}</main>
        <Footer
          logoUrl={navData?.logoUrl ?? null}
          logoAlt={navData?.logoAlt ?? 'The Liquor Locker'}
        />
      </body>
    </html>
  );
}

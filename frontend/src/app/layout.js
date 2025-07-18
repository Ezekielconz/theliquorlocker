import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getNavigation } from '../lib/strapi'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'The Liquor Locker',
  description: 'Wine, Spirits & Beer Distributors',
}

export default async function RootLayout({ children }) {
  const navData = await getNavigation() // { logoUrl, logoAlt }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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
  )
}

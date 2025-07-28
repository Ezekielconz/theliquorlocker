// app/range/page.js
import PageHero from '../../components/PageHero';
import CallToAction from '../../components/CallToAction';
import {
  getRangePage,
  getSuppliersWithDetails,
} from '../../lib/strapi';
import SupplierBrowser from './SupplierBrowser';
import styles from '../../styles/Range.module.css';

export const revalidate = 60;          // ISR every minute

export default async function RangePage() {
  // parallel data fetch
  const [page, suppliers] = await Promise.all([
    getRangePage(),
    getSuppliersWithDetails(),
  ]);

  if (!page) return <p>Range content coming soon.</p>;

  return (
    <>
      <PageHero
        title={page.pageTitle}
        imageUrl={page.heroImageUrl}
        imageAlt={page.heroImageAlt}
      />

      <main className={styles.main}>
        {page.body && <p className={styles.body}>{page.body}</p>}

        {page.buttonText && page.downloadFileUrl && (
          <div className={styles.buttons}>
            <a
              href={page.downloadFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.button}
              aria-label={page.downloadFileAlt}
            >
              {page.buttonText}
            </a>
          </div>
        )}

        {/* supplier icons + live detail */}
        <SupplierBrowser suppliers={suppliers} />
      </main>

      {/* Call-to-Action (only rendered if Strapi returns one) */}
      {page.cta && <CallToAction {...page.cta} />}
    </>
  );
}

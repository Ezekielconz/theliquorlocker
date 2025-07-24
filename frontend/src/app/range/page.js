// app/range/page.js
import PageHero                 from "../../components/PageHero";
import { getRangePage,
         getSuppliersWithDetails } from "../../lib/strapi";
import SupplierBrowser          from "./SupplierBrowser";
import styles                   from "../../styles/Range.module.css";

export const revalidate = 60;          // ISR every minute

export default async function RangePage() {
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
          <a
            href={page.downloadFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.button}
            aria-label={page.downloadFileAlt}
          >
            {page.buttonText}
          </a>
        )}

        {/* supplier icons + live detail */}
        <SupplierBrowser suppliers={suppliers} />
      </main>
    </>
  );
}

// app/range/page.js
import PageHero         from '../../components/PageHero';
import { getRangePage } from '../../lib/strapi';
import styles           from '../../styles/Range.module.css';

export const revalidate = 60;

export default async function RangePage() {
  const data = await getRangePage();
  if (!data) return <p>Range content coming soon.</p>;

  return (
    <>
      <PageHero
        title={data.pageTitle}
        imageUrl={data.heroImageUrl}
        imageAlt={data.heroImageAlt}
      />

      <main className={styles.main}>
        {data.body && <p className={styles.body}>{data.body}</p>}

        {/* open the PDF in a new tab */}
        {data.buttonText && data.downloadFileUrl && (
          <a
            href={data.downloadFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.button}
            aria-label={data.downloadFileAlt}
          >
            {data.buttonText}
          </a>
        )}
      </main>
    </>
  );
}

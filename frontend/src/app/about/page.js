// app/about/page.js
import PageHero from '../../components/PageHero'
import { getAboutPage } from '../../lib/strapi'
import styles from '../../styles/About.module.css'

export const revalidate = 60

export default async function AboutPage() {
  const data = await getAboutPage()
  if (!data) {
    return <p>About content coming soon.</p>
  }

  return (
    <>
      <PageHero
        title={data.pageTitle}
        imageUrl={data.heroImageUrl}
        imageAlt={data.heroImageAlt}
        overlayColor="rgba(193,117,88,0.8)"
        height="50vh"
      />

      <section className={styles.content}>
        <h2 className={styles.heading}>{data.heading}</h2>
        <div
          className={styles.body}
          dangerouslySetInnerHTML={{ __html: data.body }}
        />
      </section>
    </>
  )
}

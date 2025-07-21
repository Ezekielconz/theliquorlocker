// app/about/page.js
import PageHero from '../../components/PageHero'
import { getAboutPage } from '../../lib/strapi'
import styles from '../../styles/About.module.css'

export const revalidate = 60

export default async function AboutPage() {
  const data = await getAboutPage()
  if (!data) return <p>About content coming soon.</p>

  return (
    <>
      <PageHero
        title={data.pageTitle}
        imageUrl={data.heroImageUrl}
        imageAlt={data.heroImageAlt}
        accent="#D07854"          // map from Strapi when available
        accentLight="#EAC1AF"     // ditto
        angle={8}                 // tweak until it visually matches Figma
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

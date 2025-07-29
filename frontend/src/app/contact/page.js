// app/contact/page.js
import PageHero        from '@/components/PageHero';
import ContactForm     from '@/components/ContactForm';
import CallToAction    from '@/components/CallToAction';
import { getContactPage, getBusinessInfo } from '@/lib/strapi';
import styles          from '@/styles/Contact.module.css';

export const revalidate = 60;

export default async function ContactPage() {
  const [pageData, biz] = await Promise.all([
    getContactPage(),
    getBusinessInfo()
  ]);

  if (!pageData) {
    return <p>Contact page not found.</p>;
  }

  return (
    <>
      <PageHero
        title={pageData.pageTitle}
        imageUrl={pageData.heroImageUrl}
        imageAlt={pageData.heroImageAlt}
      />

      <section className={styles.contactSection}>
        <div className={styles.details}>
          <h3>{biz.companyName}</h3>
          <div
            className={styles.address}
            dangerouslySetInnerHTML={{ __html: biz.address }}
          />
          <p>{biz.phone}</p>
          <p>
            <a href={`mailto:${biz.email}`}>{biz.email}</a>
          </p>
          <div
            className={styles.openingHours}
            dangerouslySetInnerHTML={{ __html: biz.openingHours }}
          />
        </div>

        <ContactForm />
      </section>

      <CallToAction {...pageData.cta} />
    </>
  );
}

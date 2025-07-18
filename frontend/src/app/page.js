import Hero from '../components/Hero';
import ScrollLock from '../components/ScrollLock';
import { getHomepage } from '../lib/strapi';

export const revalidate = 60;

export default async function HomePage() {
  const homepage = await getHomepage();

  return (
    <>
      <ScrollLock />

      <main>
        {homepage ? (
          <Hero
            title={homepage.heroTitle}
            imageUrl={homepage.heroImageUrl}
            imageAlt={homepage.heroImageAlt}
            buttonOne={{
              text: homepage.buttonOneText,
              url:  homepage.buttonOneUrl,
            }}
            buttonTwo={{
              text: homepage.buttonTwoText,
              url:  homepage.buttonTwoUrl,
            }}
          />
        ) : (
          <p>Content coming soon.</p>
        )}
      </main>
    </>
  );
}

import Hero from '../components/Hero';
import { getHomepage } from '../lib/strapi';

export const revalidate = 60;

export default async function HomePage() {
  const homepage = await getHomepage();

  if (!homepage) {
    return (
      <main>
        <p>Content coming soon.</p>
      </main>
    );
  }

  return (
    <main>
      <Hero
        title={homepage.heroTitle}
        imageUrl={homepage.heroImageUrl}
        imageAlt={homepage.heroImageAlt}
        buttonOne={{ text: homepage.buttonOneText, url: homepage.buttonOneUrl }}
        buttonTwo={{ text: homepage.buttonTwoText, url: homepage.buttonTwoUrl }}
      />
    </main>
  );
}

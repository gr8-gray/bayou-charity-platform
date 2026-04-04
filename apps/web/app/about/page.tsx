// About page — App Router Server Component
// Nav padding rule: interior page → pt-24

import About from '@/components/about';
import PageBackground from '@/components/shared/PageBackground';

export default function AboutPage() {
  return (
    <>
      <PageBackground page="about" />
      <main className="relative z-10 pt-24">
        <About />
      </main>
    </>
  );
}

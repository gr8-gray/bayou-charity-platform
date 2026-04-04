// Home page — App Router Server Component
// Nav padding rule: hero page → pt-0

import Home from '@/components/home';
import PageBackground from '@/components/shared/PageBackground';

export default function HomePage() {
  return (
    <>
      <PageBackground page="home" />
      <main className="relative z-10 pt-0">
        <Home />
      </main>
    </>
  );
}

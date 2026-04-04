// Innisfree page — App Router Server Component
// Nav padding rule: hero page → pt-0

import Innisfree from '@/components/innisfree';
import PageBackground from '@/components/shared/PageBackground';

export default function InnisfreePage() {
  return (
    <>
      <PageBackground page="innisfree" />
      <main className="relative z-10 pt-0">
        <Innisfree />
      </main>
    </>
  );
}

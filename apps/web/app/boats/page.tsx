// Boats page — App Router Server Component
// Nav padding rule: interior page → pt-24

import Boats from '@/components/boats';
import PageBackground from '@/components/shared/PageBackground';

export default function BoatsPage() {
  return (
    <>
      <PageBackground page="boats" />
      <main className="relative z-10 pt-24">
        <Boats />
      </main>
    </>
  );
}

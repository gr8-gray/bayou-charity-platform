// Donate page — App Router Server Component
// Nav padding rule: interior page → pt-24

import Donate from '@/components/donate';
import PageBackground from '@/components/shared/PageBackground';

export default function DonatePage() {
  return (
    <>
      <PageBackground page="donate" />
      <main className="relative z-10 pt-24">
        <Donate />
      </main>
    </>
  );
}

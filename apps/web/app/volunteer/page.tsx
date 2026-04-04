// Volunteer page — App Router Server Component
// Nav padding rule: interior page → pt-24

import Volunteer from '@/components/volunteer';
import PageBackground from '@/components/shared/PageBackground';

export default function VolunteerPage() {
  return (
    <>
      <PageBackground page="volunteer" />
      <main className="relative z-10 pt-24">
        <Volunteer />
      </main>
    </>
  );
}

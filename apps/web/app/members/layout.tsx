// Members layout — auth enforced by middleware.ts
import PageBackground from '@/components/shared/PageBackground';
import { MembersNav } from '@/components/members/MembersNav';

export default function MembersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageBackground page="about" />
      <div className="relative z-10 pt-24 min-h-screen">
        <MembersNav />
        <main className="container mx-auto px-4 pt-14 pb-8">
          {children}
        </main>
      </div>
    </>
  );
}

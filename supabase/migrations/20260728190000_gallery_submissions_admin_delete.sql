-- Admin-only DELETE on gallery_submissions.
--
-- Applied LIVE to prod 2026-07-28 during the gallery approve-copy fix (PR #3):
-- the admin gallery UI and the E2E roundtrip cleanup both delete submission rows,
-- and no DELETE policy existed at all. Committed here after the fact (flagged as
-- schema drift by PR verification) so fresh environments reproduce prod exactly.
-- Mirrors the storage.objects gallery_*_admin_delete policies: profiles.role='admin'.
drop policy if exists gallery_submissions_admin_delete on public.gallery_submissions;
create policy gallery_submissions_admin_delete
  on public.gallery_submissions
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Applied to prod 2026-10-10 via Supabase MCP (version 20261010190232); this file keeps the repo in sync.
-- Trigger functions never need caller EXECUTE (checked at CREATE TRIGGER, not at fire time;
-- verified on prod with a rolled-back probe: a role without EXECUTE still fired the trigger).
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.notify_admin() from public, anon, authenticated;
-- Anon/auth could run the archiver via RPC; only service_role/postgres should.
revoke execute on function public.auto_archive_posts() from public, anon, authenticated;
-- is_admin() intentionally untouched: referenced by RLS policies for role public.

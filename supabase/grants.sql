-- =====================================================================
-- OperIA — Droits d'accès (GRANT) pour l'environnement LOCAL
-- À exécuter dans : Supabase Dashboard → SQL Editor (ou psql en local).
-- Idempotent.
--
-- Sur Supabase hébergé, ces droits sont attribués automatiquement aux rôles
-- anon / authenticated / service_role lors de la création des tables. En
-- local, quand les tables sont chargées via psql, on les rend explicites.
-- La sécurité fine reste assurée par les policies RLS.
-- =====================================================================

grant usage on schema public to anon, authenticated, service_role;

-- profiles : la RLS limite déjà chaque utilisateur à sa propre ligne.
grant select, insert, update, delete on table public.profiles
  to authenticated, service_role;

-- waitlist : anon/authenticated ne peuvent qu'insérer (cf. RLS) ;
-- service_role (scripts d'admin) gère tout.
grant insert on table public.waitlist to anon, authenticated;
grant select, insert, update, delete on table public.waitlist to service_role;

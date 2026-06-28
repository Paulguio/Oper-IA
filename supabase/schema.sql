-- =====================================================================
-- OperIA — Schéma de la liste d'attente (table "waitlist")
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : peut être ré-exécuté sans erreur.
-- =====================================================================

-- 1) Table -------------------------------------------------------------
create table if not exists public.waitlist (
  id         uuid        primary key default gen_random_uuid(),
  email      text        not null,
  profile    text        not null default 'createur'
             check (profile in ('createur', 'entreprise')),
  created_at timestamptz not null default now()
);

-- Un même email ne peut s'inscrire qu'une fois.
-- (déclenche l'erreur 23505 → message "déjà inscrit" côté formulaire)
create unique index if not exists waitlist_email_unique
  on public.waitlist (lower(email));

-- 2) Row Level Security ------------------------------------------------
-- Active RLS : par défaut, plus aucun accès tant qu'une policy ne
-- l'autorise pas explicitement.
alter table public.waitlist enable row level security;

-- 3) Policy : autoriser UNIQUEMENT l'insertion par le rôle public/anon.
--    Pas de SELECT/UPDATE/DELETE pour anon → les emails collectés
--    ne sont jamais lisibles depuis le navigateur.
drop policy if exists "anon peut s'inscrire" on public.waitlist;

create policy "anon peut s'inscrire"
  on public.waitlist
  for insert
  to anon
  with check (true);

-- =====================================================================
-- Vérifications (optionnel) :
--   select * from public.waitlist;            -- via SQL Editor (role service)
--   Depuis le site, seul INSERT est permis pour anon.
-- =====================================================================

-- =====================================================================
-- OperIA — Authentification : table "profiles" + trigger d'inscription
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : peut être ré-exécuté sans erreur.
--
-- Prérequis (une seule fois, dans le Dashboard) :
--   Authentication → Providers → Email : activer "Email" (mot de passe).
--   Authentication → (URL Configuration) : renseigner le Site URL, ex.
--     http://localhost:3000 en local.
-- =====================================================================

-- 1) Table des profils -------------------------------------------------
--    Un profil par utilisateur auth. Le rôle détermine l'espace perso.
create table if not exists public.profiles (
  id         uuid        primary key references auth.users (id) on delete cascade,
  role       text        not null default 'utilisateur'
             check (role in ('utilisateur', 'createur')),
  nom        text,
  created_at timestamptz not null default now()
);

-- 2) Row Level Security ------------------------------------------------
alter table public.profiles enable row level security;

-- Chaque utilisateur ne voit et ne modifie que SON propre profil.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 3) Trigger : création automatique du profil à l'inscription ----------
--    Le rôle et le nom proviennent des métadonnées passées au signUp
--    (options.data.role / options.data.nom).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, nom)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'role', ''), 'utilisateur'),
    new.raw_user_meta_data ->> 'nom'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- Vérification (SQL Editor, rôle service) :
--   select * from public.profiles;
-- =====================================================================

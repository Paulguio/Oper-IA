-- =====================================================================
-- OperIA — Enrichissement de la table "profiles"
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : peut être ré-exécuté sans erreur.
-- Prérequis : supabase/auth-schema.sql déjà exécuté (table + trigger).
-- =====================================================================

-- 1) Nouvelles colonnes -----------------------------------------------
alter table public.profiles add column if not exists prenom text;
alter table public.profiles add column if not exists entreprise text;
alter table public.profiles add column if not exists taille_entreprise text;
alter table public.profiles add column if not exists secteur text;
alter table public.profiles add column if not exists source text;
alter table public.profiles add column if not exists nom_marque text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists domaine text;
alter table public.profiles add column if not exists outils text[];
alter table public.profiles add column if not exists lien_web text;
alter table public.profiles add column if not exists conditions_acceptees boolean default false;

-- 2) Mise à jour du trigger d'inscription -----------------------------
--    Le trigger recopie désormais tous les nouveaux champs depuis les
--    métadonnées Auth (options.data.* passées au signUp) vers profiles.
--    `outils` est un tableau JSON dans les métadonnées → converti en text[].
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.profiles (
    id, role, nom, prenom, entreprise, taille_entreprise, secteur, source,
    nom_marque, bio, domaine, outils, lien_web, conditions_acceptees
  )
  values (
    new.id,
    coalesce(nullif(meta ->> 'role', ''), 'utilisateur'),
    meta ->> 'nom',
    meta ->> 'prenom',
    meta ->> 'entreprise',
    meta ->> 'taille_entreprise',
    meta ->> 'secteur',
    meta ->> 'source',
    meta ->> 'nom_marque',
    meta ->> 'bio',
    meta ->> 'domaine',
    case
      when jsonb_typeof(meta -> 'outils') = 'array'
        then array(select jsonb_array_elements_text(meta -> 'outils'))
      else null
    end,
    meta ->> 'lien_web',
    coalesce((meta ->> 'conditions_acceptees')::boolean, false)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Le trigger on_auth_user_created (créé dans auth-schema.sql) pointe déjà
-- vers cette fonction ; rien d'autre à faire.

-- =====================================================================
-- Vérification :
--   select id, role, prenom, nom, entreprise, secteur, nom_marque, outils
--   from public.profiles;
-- =====================================================================

-- =====================================================================
-- OperIA — Schéma PostgreSQL (base "nue", sans Supabase)
-- Exécuté automatiquement au 1er démarrage du container Postgres
-- (monté dans /docker-entrypoint-initdb.d/).
-- =====================================================================

create extension if not exists pgcrypto; -- gen_random_uuid()

-- Utilisateurs (auth + profil fusionnés) --------------------------------
create table if not exists users (
  id                   uuid        primary key default gen_random_uuid(),
  email                text        not null,
  password_hash        text        not null,
  role                 text        not null default 'utilisateur'
                       check (role in ('utilisateur', 'createur')),
  nom                  text,
  prenom               text,
  entreprise           text,
  taille_entreprise    text,
  secteur              text,
  source               text,
  nom_marque           text,
  bio                  text,
  domaine              text,
  outils               text[],
  lien_web             text,
  conditions_acceptees boolean     default false,
  created_at           timestamptz not null default now()
);

-- Email unique (insensible à la casse).
create unique index if not exists users_email_lower_idx on users (lower(email));

-- Liste d'attente -------------------------------------------------------
create table if not exists waitlist (
  id         uuid        primary key default gen_random_uuid(),
  email      text        not null,
  profile    text        not null default 'createur'
             check (profile in ('createur', 'entreprise')),
  created_at timestamptz not null default now()
);

create unique index if not exists waitlist_email_lower_idx on waitlist (lower(email));

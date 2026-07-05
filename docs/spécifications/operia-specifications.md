# OperIA — Spécifications techniques

> Plateforme où créateurs et entreprises assemblent, partagent et déploient
> des métiers IA (« agents »).
> Dernière mise à jour : 2026-07-05.

---

## 1. Vue d'ensemble

OperIA est une application web **Next.js 16** (App Router, Turbopack) adossée à
**Supabase** (PostgreSQL + Auth + API REST). Elle comprend une landing page
premium, un catalogue d'agents, un système d'authentification complet et deux
espaces personnels distincts (utilisateur / créateur).

Le projet peut tourner **100 % en local via Docker** : un container web
Next.js + le stack Supabase local (géré par la CLI Supabase).

---

## 2. Stack technique

| Domaine | Choix |
|---|---|
| Framework | Next.js `16.2.9` (App Router, Turbopack) |
| UI | React `19.2.4`, Tailwind CSS `v4` |
| Polices | Inter (corps) + Playfair Display (titres) via `next/font` |
| Backend / DB | Supabase (`@supabase/supabase-js`) — PostgreSQL + Auth (GoTrue) + REST (PostgREST) |
| Auth | Supabase Auth email + mot de passe |
| Langage | TypeScript `^5` |
| Lint | ESLint `^9` (`eslint-config-next`) |
| Node | v24 |

### Palette & design premium
- Fond principal : `#FAF8F5` (beige chaud) — secondaire : `#F3F0EB`
- Vert primaire : `#3D6B4F` — hover : `#2E5440` — clair : `#EAF2EC`
- Texte : `#1A1A1A` — secondaire : `#6B6B6B` — bordures : `#E8E3DC`
- Cartes blanches, ombres douces, `border-radius: 16px`
- Animations : Intersection Observer (fade-up + stagger), compteurs animés,
  header à backdrop-blur au scroll, fade-in entre onglets.
- Classes utilitaires clés dans `app/globals.css` : `.card`, `.card-hover`,
  `.btn-primary`, `.btn-secondary`, `.nav-link`, `.label`, `.font-display`,
  `.hero-bg`, `.grain`, `.msg-in` (fade-in), `.focus-ring`, `.text-gradient`.

---

## 3. Arborescence

```
app/
  layout.tsx              # Polices Inter + Playfair, <html>/<body>
  globals.css             # Design system (tokens Tailwind v4 + utilitaires)
  page.tsx                # Landing page
  catalogue/page.tsx      # Catalogue des agents
  fonctionnement/page.tsx # Page "Comment ça marche"
  tarifs/page.tsx         # Tarifs + FAQ
  agents/seo/page.tsx     # Fiche Agent SEO
  agents/seo/chat/…       # Chat de l'Agent SEO
  connexion/page.tsx      # Connexion
  inscription/page.tsx    # Inscription (choix du rôle)
  compte/page.tsx         # Espace UTILISATEUR (onglets)
  createur/page.tsx       # Espace CRÉATEUR (onglets)
  mot-de-passe-oublie/…   # Demande de réinitialisation
  reinitialiser-mdp/…     # Nouveau mot de passe
  components/
    Header.tsx            # En-tête public (détecte l'état connecté)
    Footer.tsx            # Pied de page sombre
    DashboardTopBar.tsx   # Barre des espaces perso (logo + déconnexion)
    Reveal.tsx            # Animation d'apparition au scroll (IntersectionObserver)
    CountUp.tsx           # Compteur animé
    BrandLogos.tsx        # Logos SVG (Google, Slack, Notion, Gmail)
    FormControls.tsx      # Label, Select, Checkbox, ToggleChip, PasswordInput, inputClass
    SectionCard.tsx       # Carte de section
    AuthShell.tsx         # Coquille des pages d'auth
    WaitlistForm.tsx      # Formulaire liste d'attente
    CatalogueGrid.tsx / AgentTabs.tsx / Faq.tsx

lib/
  supabase.ts             # Client Supabase (navigateur)
  auth.ts                 # Types + helpers (Profile, cookie, getProfile, updateProfile…)
  useAuth.ts              # Hook d'auth client + signOut

middleware.ts             # Protection de /compte et /createur

supabase/
  config.toml             # Config du stack local (CLI)
  auth-schema.sql         # Table profiles + trigger + RLS
  update-profiles.sql     # Colonnes enrichies + mise à jour du trigger
  schema.sql              # Table waitlist + RLS
  grants.sql              # Droits d'accès (local)

scripts/seed.mjs          # Peuplement de la base locale
Dockerfile.dev            # Image du container web (dev)
docker-compose.yml        # Orchestration du web
.env.docker               # Variables du container (→ Supabase local)
.env.local                # Variables (→ Supabase hébergé)
```

---

## 4. Routes

| Route | Accès | Description |
|---|---|---|
| `/` | public | Landing page premium |
| `/catalogue` | public | Catalogue des agents (recherche + filtres) |
| `/fonctionnement` | public | Fonctionnement de la plateforme |
| `/tarifs` | public | Plans tarifaires + FAQ |
| `/agents/seo` | public | Présentation de l'Agent SEO |
| `/agents/seo/chat` | protégé | Chat de l'Agent SEO |
| `/api/chat/seo` | API | Endpoint de streaming du chat |
| `/connexion` | public | Connexion (email + mot de passe) |
| `/inscription` | public | Inscription + choix du rôle |
| `/mot-de-passe-oublie` | public | Demande de lien de réinitialisation |
| `/reinitialiser-mdp` | public | Définition d'un nouveau mot de passe |
| `/compte` | rôle `utilisateur` | Espace personnel utilisateur |
| `/createur` | rôle `createur` | Espace personnel créateur |

---

## 5. Authentification

- **Fournisseur** : Supabase Auth, email + mot de passe.
- **Inscription** (`/inscription`) : prénom, email, mot de passe (≥ 6),
  **choix du rôle** via deux cartes (Utilisateur / Créateur). Le rôle et les
  autres champs sont passés en `options.data` du `signUp` → métadonnées Auth.
- **Trigger** `handle_new_user` : à chaque insertion dans `auth.users`, crée
  automatiquement la ligne `public.profiles` en recopiant les métadonnées.
- **Gestion d'erreurs** : email déjà utilisé, identifiants invalides, email non
  confirmé — chacun avec un message clair.
- **Connexion** (`/connexion`) : `signInWithPassword`, « Se souvenir de moi »,
  lien mot de passe oublié.

### Protection des routes — `middleware.ts`
Un **cookie de présence** `operia-auth` (posé côté client à la connexion,
contenant le rôle) est lu par le middleware. Tout accès à `/compte`,
`/createur` ou `/agents/seo/chat` **sans cookie** redirige vers
`/connexion?redirect=…`. La vérification fine du rôle se fait dans chaque page
(via `useAuth`), la sécurité des données par les **policies RLS**.

> Choix d'architecture : `@supabase/ssr` n'ayant pas pu être installé, la
> session reste gérée par `supabase-js` (stockage navigateur) et le cookie ne
> sert qu'à la redirection middleware. Tous les appels Supabase sont côté
> navigateur ; le middleware ne fait que lire le cookie.

### `lib/auth.ts` — API principale
- `type Role = "utilisateur" | "createur"`
- `type Profile` (voir §6)
- `setAuthCookie(role, remember)` / `clearAuthCookie()`
- `spaceForRole(role)` → `/compte` ou `/createur`
- `displayName(profile, email)`
- `getProfile(userId)` → lit `public.profiles`
- `updateProfile(userId, patch)` → met à jour `profiles` + métadonnées Auth

### `lib/useAuth.ts`
Hook client `useAuth()` → `{ loading, user, profile }`. S'appuie sur la session
locale (`getSession`, sans réseau) puis `onAuthStateChange`. Maintient le cookie
de présence. Fonction `signOut()`.

---

## 6. Base de données

### Table `public.profiles`
Un profil par utilisateur (`id` = `auth.users.id`, FK ON DELETE CASCADE).

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid | PK, réf. `auth.users(id)` |
| `role` | text | `utilisateur` \| `createur` (check) |
| `nom`, `prenom` | text | |
| `entreprise`, `taille_entreprise`, `secteur`, `source` | text | champs **utilisateur** |
| `nom_marque`, `bio`, `domaine`, `lien_web` | text | champs **créateur** |
| `outils` | text[] | outils maîtrisés (créateur) |
| `conditions_acceptees` | boolean | |
| `created_at` | timestamptz | |

**RLS** : chaque utilisateur ne lit/modifie que sa propre ligne
(`auth.uid() = id`).

### Table `public.waitlist`
`id` (uuid), `email` (text, unique sur `lower(email)`),
`profile` (`createur` | `entreprise`), `created_at`.
**RLS** : `anon` peut uniquement INSÉRER (pas de lecture navigateur).

### Fichiers SQL (ordre d'exécution)
1. `supabase/auth-schema.sql` — table `profiles` + trigger + RLS
2. `supabase/update-profiles.sql` — colonnes enrichies + trigger mis à jour
3. `supabase/schema.sql` — table `waitlist` + RLS
4. `supabase/grants.sql` — droits d'accès (nécessaire en **local**)

---

## 7. Espaces personnels

### `/compte` — Espace UTILISATEUR
Bandeau (avatar initiales, prénom, badge « Utilisateur », « Membre depuis »).
4 onglets (fade-in, sans rechargement) :
- **Mes agents** : carte Agent SEO active (bouton « Ouvrir le chat → »
  `/agents/seo/chat`) + stats ; 7 autres agents « Bientôt disponible ».
- **Mes outils** : 5 cartes (Google Search Console, Google Analytics, Slack,
  Notion, Gmail) + modal « Disponible prochainement ».
- **Mon abonnement** : plan « Starter — Gratuit », bloc « Passer au Pro »
  (→ `/tarifs`), historique vide, encart essai gratuit 7 jours.
- **Mon profil** : formulaire inline (prénom, nom, email désactivé, entreprise,
  secteur, taille, source) → `updateProfile` + toast ; réinitialisation mot de
  passe ; suppression de compte en deux étapes.

### `/createur` — Espace CRÉATEUR
Header avec **barre de complétion du profil (%)**, avatar, badge « Créateur ».
4 onglets :
- **Mes agents** : bouton « Publier mon premier agent + » (modal), placeholder,
  3 types d'agents (Prompt simple, Webhook, Workflow JSON).
- **Mes revenus** : KPI (0€ ce mois, 0€ total, 15 % commission, — payout),
  graphique vide 6 mois, 3 conseils.
- **Mes abonnés** : compteur 0, message motivant, lien copiable
  `/createurs/{id}`.
- **Mon profil créateur** : formulaire inline (nom de marque, bio 150 car. avec
  compteur, domaine, chips outils, lien web) + **aperçu du profil public en
  temps réel** + toast.

> `Toasts` succès (vert) / erreur (rouge) en haut à droite ; animations
> `fade-in` entre onglets ; responsive mobile.

---

## 8. Environnement local Docker

### Architecture
- **Container web** Next.js (mode dev, hot reload) — `Dockerfile.dev` +
  `docker-compose.yml`.
- **Stack Supabase local** (Postgres + Auth + REST + Studio…) géré par la CLI
  Supabase (elle-même conteneurisée par Docker).
- Le navigateur (hôte) tape directement sur `http://localhost:54321` : le
  container web n'a **pas** besoin de réseau partagé avec la base.
- `.env.docker` fait pointer le web vers le Supabase **local** ; ces variables
  ont priorité sur `.env.local` dans le container.

### Services & ports

| Service | Container | URL |
|---|---|---|
| Web Next.js | `operia-web` | http://localhost:3000 |
| API Supabase (Auth + REST) | `supabase_kong_Operia` | http://localhost:54321 |
| PostgreSQL | `supabase_db_Operia` | `postgresql://postgres:postgres@localhost:54322/postgres` |
| Studio (interface DB) | `supabase_studio_Operia` | http://localhost:54323 |
| Mailpit (emails locaux) | `supabase_inbucket_Operia` | http://localhost:54324 |

### Commandes

```bash
# Base de données (Postgres + Auth + API)
npx supabase start
npx supabase stop
npx supabase status          # affiche URL + clés locales

# Container web
docker compose up -d --build
docker compose logs -f web
docker compose down

# Peuplement de la base de démo
npm run seed
```

### Setup d'une base neuve (après `supabase db reset`)
Recharger dans l'ordre puis peupler :
```bash
DB=supabase_db_Operia
for f in auth-schema update-profiles schema grants; do
  docker exec -i $DB psql -U postgres -d postgres < supabase/$f.sql
done
npm run seed
```

---

## 9. Données de démo (`scripts/seed.mjs`)

Script **idempotent** utilisant l'API admin (clé `service_role` locale). Crée
les comptes via `auth.admin.createUser` (email confirmé) → le trigger remplit
les profils → insère la waitlist.

**Comptes de démo — mot de passe : `password123`**

| Email | Rôle |
|---|---|
| `marie@operia.local` | utilisateur |
| `thomas@operia.local` | utilisateur |
| `camille@operia.local` | créateur |
| `lucas@operia.local` | créateur |

+ 3 entrées de waitlist (`alice`, `bob`, `chloe`).

---

## 10. Variables d'environnement

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de l'API Supabase (local : `http://localhost:54321`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique `anon` (JWT) |

- `.env.local` → identifiants du **Supabase hébergé**.
- `.env.docker` → identifiants du **Supabase local** (injectés dans le container,
  prioritaires). Clés de démo publiques, non sensibles → versionnées
  (exception `!.env.docker` dans `.gitignore`).

---

## 11. Qualité & build

- `npm run build` : build de production (doit passer sans erreur TypeScript).
- `npx tsc --noEmit` : typecheck.
- `npm run lint` : ESLint.

> Note Next.js 16 : le fichier `middleware.ts` déclenche un avertissement de
> dépréciation (`middleware` → `proxy`) ; il reste fonctionnel.

---

## 12. Points ouverts / TODO

- **Suppression de compte** : la suppression définitive nécessite une Edge
  Function (clé `service_role` côté serveur) — actuellement, confirmation en 2
  étapes + déconnexion.
- **Route publique `/createurs/[id]`** : référencée (liens « profil public »)
  mais pas encore créée → 404 pour l'instant.
- **Intégrations d'outils** (Google, Slack, Notion, Gmail) : UI présente,
  connexions réelles à implémenter (OAuth).
- **`@supabase/ssr`** : à installer pour une validation de session en edge
  (middleware) plus robuste que le cookie de présence.
- **Import des données hébergées** : non réalisé (choix : base de démo). Possible
  ultérieurement via la connection string du projet hébergé.

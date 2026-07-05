// Types partagés client + serveur (aucun import serveur ici).

export type Role = "utilisateur" | "createur";

/** Utilisateur minimal exposé au client (jamais le hash de mot de passe). */
export type AuthUser = {
  id: string;
  email: string;
  role: Role;
};

/** Profil complet (table `users` sans le hash). */
export type Profile = {
  id: string;
  role: Role;
  email: string;
  nom: string | null;
  prenom: string | null;
  entreprise: string | null;
  taille_entreprise: string | null;
  secteur: string | null;
  source: string | null;
  nom_marque: string | null;
  bio: string | null;
  domaine: string | null;
  outils: string[] | null;
  lien_web: string | null;
  conditions_acceptees: boolean | null;
  created_at: string;
};

// =====================================================================
// OperIA — Peuplement de la base LOCALE (Postgres nu, sans Supabase)
//
// Lancement :  npm run seed
//   Cible DATABASE_URL, sinon postgres://operia:operia@localhost:5432/operia
//   (le port 5432 est publié par le container operia-db).
// Idempotent : supprime d'abord les comptes/waitlist de démo.
// =====================================================================

import { randomBytes, scryptSync } from "node:crypto";
import pg from "pg";

const DATABASE_URL =
  process.env.DATABASE_URL ?? "postgres://operia:operia@localhost:5432/operia";
const PASSWORD = "password123";

/** Même format que lib/password.ts : scrypt$saltHex$hashHex */
function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

const USERS = [
  {
    email: "marie@operia.local",
    role: "utilisateur",
    prenom: "Marie",
    nom: "Lefort",
    entreprise: "Atelier Margaux",
    secteur: "E-commerce",
    taille_entreprise: "2 à 10 personnes",
    source: "Google",
  },
  {
    email: "thomas@operia.local",
    role: "utilisateur",
    prenom: "Thomas",
    nom: "Roy",
    entreprise: "Velora",
    secteur: "Technologie / SaaS",
    taille_entreprise: "11 à 50 personnes",
    source: "LinkedIn",
  },
  {
    email: "camille@operia.local",
    role: "createur",
    prenom: "Camille",
    nom: "Laurent",
    nom_marque: "Studio Nyx",
    bio: "Consultante SEO, j'automatise l'acquisition organique des PME.",
    domaine: "SEO & Marketing",
    outils: ["n8n", "Python"],
    lien_web: "https://linkedin.com/in/camille-laurent",
  },
  {
    email: "lucas@operia.local",
    role: "createur",
    prenom: "Lucas",
    nom: "Bernard",
    nom_marque: "Autobots",
    bio: "Dev full-stack, je construis des agents connectés à vos outils.",
    domaine: "Développement",
    outils: ["Make", "JavaScript", "Zapier"],
    lien_web: "https://autobots.dev",
  },
];

const WAITLIST = [
  { email: "alice@example.com", profile: "createur" },
  { email: "bob@example.com", profile: "entreprise" },
  { email: "chloe@example.com", profile: "createur" },
];

const client = new pg.Client({ connectionString: DATABASE_URL });

async function main() {
  await client.connect();
  console.log(`\nPeuplement de ${DATABASE_URL}\n`);

  // Nettoyage idempotent
  await client.query("delete from users where email = any($1)", [
    USERS.map((u) => u.email),
  ]);
  await client.query("delete from waitlist where email = any($1)", [
    WAITLIST.map((w) => w.email),
  ]);

  console.log("→ Création des comptes…");
  for (const u of USERS) {
    await client.query(
      `insert into users
         (email, password_hash, role, nom, prenom, entreprise, taille_entreprise,
          secteur, source, nom_marque, bio, domaine, outils, lien_web)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [
        u.email,
        hashPassword(PASSWORD),
        u.role,
        u.nom ?? null,
        u.prenom ?? null,
        u.entreprise ?? null,
        u.taille_entreprise ?? null,
        u.secteur ?? null,
        u.source ?? null,
        u.nom_marque ?? null,
        u.bio ?? null,
        u.domaine ?? null,
        u.outils ?? null,
        u.lien_web ?? null,
      ],
    );
    console.log(`  ✓ ${u.email}  (${u.role})`);
  }

  console.log("→ Waitlist…");
  for (const w of WAITLIST) {
    await client.query(
      "insert into waitlist (email, profile) values ($1, $2)",
      [w.email, w.profile],
    );
  }
  console.log(`  ✓ ${WAITLIST.length} entrées de waitlist`);

  console.log(`\n✅ Terminé. Comptes de démo (mot de passe : ${PASSWORD}) :`);
  for (const u of USERS) {
    console.log(`   • ${u.email.padEnd(24)} ${u.role}`);
  }
  console.log("");
  await client.end();
}

main().catch(async (e) => {
  console.error("\n❌ Échec du peuplement :", e.message);
  await client.end().catch(() => {});
  process.exit(1);
});

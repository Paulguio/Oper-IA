import Link from "next/link";
import AuthShell from "../components/AuthShell";

export default function MotDePasseOubliePage() {
  return (
    <AuthShell
      title="Mot de passe oublié"
      subtitle="Réinitialisation par email"
      footer={
        <Link
          href="/connexion"
          className="font-semibold text-forest hover:text-forest-dark"
        >
          Retour à la connexion
        </Link>
      }
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-soft text-2xl text-forest">
          ✉
        </div>
        <p className="mt-5 leading-7 text-muted">
          La réinitialisation de mot de passe par email n&apos;est pas encore
          disponible dans cette configuration (auth locale). Elle nécessite le
          branchement d&apos;un service d&apos;emails.
        </p>
        <p className="mt-3 text-sm text-muted">
          En attendant, contactez le support pour réinitialiser votre accès.
        </p>
      </div>
    </AuthShell>
  );
}

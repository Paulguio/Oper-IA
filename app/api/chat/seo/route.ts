import { NextResponse } from "next/server";

// ⚠️ Variable d'environnement requise : ANTHROPIC_API_KEY
//    - En local : ajoutez-la dans .env.local
//        ANTHROPIC_API_KEY=sk-ant-...
//    - En production (Vercel) : Project → Settings → Environment Variables
//        ANTHROPIC_API_KEY = sk-ant-...  (Production + Preview)
//
// Note : le SDK officiel @anthropic-ai/sdk n'a pas pu être installé
// (registre npm injoignable au moment du build). On appelle donc l'API
// Messages en HTTP direct avec streaming SSE, ré-émis via ReadableStream —
// approche recommandée par la doc Anthropic pour l'App Router Next.js.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "claude-sonnet-4-6";
const MAX_CONTEXT_MESSAGES = 20; // on ne garde que les 20 messages les plus récents

const SYSTEM_PROMPT = `Tu es l'Agent SEO d'OperIA, un expert en référencement naturel spécialisé pour les PME françaises. Tu as accès aux meilleures pratiques SEO de 2025. Tu réponds en français, de façon claire et actionnable. Tu poses des questions précises pour personnaliser tes recommandations. Tu es proactif — tu proposes toujours une prochaine étape concrète. Quand l'utilisateur mentionne son site, tu analyses sa structure probable et donnes des recommandations précises. Tu connais parfaitement Google Search Console, Google Analytics, les Core Web Vitals, le maillage interne, les balises meta, le contenu sémantique, et la stratégie de mots-clés longue traîne.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

function isValidMessages(value: unknown): value is ChatMessage[] {
  return (
    Array.isArray(value) &&
    value.every(
      (m) =>
        m &&
        typeof m === "object" &&
        (m as ChatMessage).role !== undefined &&
        ((m as ChatMessage).role === "user" ||
          (m as ChatMessage).role === "assistant") &&
        typeof (m as ChatMessage).content === "string",
    )
  );
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Clé API manquante. Ajoutez ANTHROPIC_API_KEY dans .env.local (et sur Vercel).",
      },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const rawMessages = (body as { messages?: unknown })?.messages;
  if (!isValidMessages(rawMessages)) {
    return NextResponse.json(
      { error: "Le champ 'messages' est invalide." },
      { status: 400 },
    );
  }

  // Mémoire de conversation : au plus les 20 messages les plus récents.
  const messages = rawMessages
    .filter((m) => m.content.trim() !== "")
    .slice(-MAX_CONTEXT_MESSAGES);

  if (messages.length === 0) {
    return NextResponse.json(
      { error: "Aucun message à traiter." },
      { status: 400 },
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2048,
        stream: true,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "Impossible de joindre le service. Réessayez." },
      { status: 502 },
    );
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error("Anthropic API error:", upstream.status, detail);
    const message =
      upstream.status === 401
        ? "Clé API Anthropic invalide."
        : "Le service SEO est momentanément indisponible. Réessayez.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  // Ré-émission du flux SSE Anthropic en texte simple, token par token.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body.getReader();
  let buffer = "";

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }

      buffer += decoder.decode(value, { stream: true });
      // On ne traite que les lignes complètes (terminées par \n) ; le
      // reste (ligne partielle) est conservé pour le prochain chunk.
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const evt = JSON.parse(payload);
          if (
            evt.type === "content_block_delta" &&
            evt.delta?.type === "text_delta" &&
            typeof evt.delta.text === "string"
          ) {
            controller.enqueue(encoder.encode(evt.delta.text));
          } else if (evt.type === "error") {
            controller.enqueue(
              encoder.encode(
                "\n\n⚠️ Une erreur est survenue pendant la réponse.",
              ),
            );
          }
        } catch {
          // Ligne non-JSON (commentaire SSE, ping) : ignorée.
        }
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-transform",
    },
  });
}

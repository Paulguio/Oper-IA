"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { displayName } from "@/lib/auth";
import { useAuth } from "@/lib/useAuth";

type Msg = { role: "user" | "assistant"; content: string; ts: string };

const MAX_MESSAGES = 50;

const SUGGESTIONS = [
  "Auditer mon site web",
  "Trouver des mots-clés",
  "Analyser ma concurrence",
  "Configurer mes rapports",
];

function nowTime() {
  return new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AgentSeoChatPage() {
  const router = useRouter();
  const { loading, user, profile } = useAuth();

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const initedRef = useRef(false);

  const name = displayName(profile, user?.email);
  const storageKey = user ? `operia_seo_chat_${user.id}` : null;

  const userMessages = messages.filter((m) => m.role === "user").length;
  const limitReached = userMessages >= MAX_MESSAGES;

  // Redirection de secours (le middleware protège déjà cette route).
  useEffect(() => {
    if (!loading && !user) router.replace("/connexion?redirect=/agents/seo/chat");
  }, [loading, user, router]);

  // Chargement de l'historique + message de bienvenue automatique.
  useEffect(() => {
    if (loading || !user || !storageKey || initedRef.current) return;
    initedRef.current = true;

    const stored =
      typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Msg[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- restauration one-shot depuis localStorage au montage
          setMessages(parsed);
          return;
        }
      } catch {
        /* ignore un historique corrompu */
      }
    }

    // Message de bienvenue après 800 ms.
    const welcome = `Bonjour ${name} ! Je suis votre Agent SEO. Je peux auditer votre site, analyser vos mots-clés, optimiser vos pages et vous envoyer des rapports automatiques chaque semaine. Par quoi souhaitez-vous commencer ?`;
    const t = setTimeout(() => {
      setMessages([{ role: "assistant", content: welcome, ts: nowTime() }]);
    }, 800);
    return () => clearTimeout(t);
  }, [loading, user, storageKey, name]);

  // Persistance dans le localStorage.
  useEffect(() => {
    if (!storageKey || messages.length === 0) return;
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  // Auto-scroll vers le bas.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streaming]);

  function autoGrow() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`; // ~4 lignes
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || streaming || limitReached) return;

    const history: Msg[] = [
      ...messages,
      { role: "user", content, ts: nowTime() },
    ];
    setMessages([
      ...history,
      { role: "assistant", content: "", ts: nowTime() },
    ]);
    setInput("");
    setStreaming(true);
    requestAnimationFrame(autoGrow);

    try {
      const res = await fetch("/api/chat/seo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Le service est indisponible.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let received = false;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        if (text) received = true;
        setMessages((prev) => {
          const copy = prev.slice();
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = { ...last, content: last.content + text };
          return copy;
        });
      }

      if (!received) {
        setMessages((prev) => {
          const copy = prev.slice();
          copy[copy.length - 1] = {
            ...copy[copy.length - 1],
            content:
              "Je n'ai pas pu générer de réponse. Vérifiez la configuration (clé API) et réessayez.",
          };
          return copy;
        });
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue. Réessayez.";
      setMessages((prev) => {
        const copy = prev.slice();
        copy[copy.length - 1] = {
          ...copy[copy.length - 1],
          content: `⚠️ ${msg}`,
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  if (loading || !user) {
    return (
      <div className="flex h-screen flex-1 items-center justify-center bg-beige text-muted">
        Chargement…
      </div>
    );
  }

  const showSuggestions =
    !streaming &&
    messages.length === 1 &&
    messages[0].role === "assistant";
  const progress = Math.min((userMessages / MAX_MESSAGES) * 100, 100);

  return (
    <div className="flex h-screen flex-col bg-beige text-ink">
      {/* ===== Zone 1 — Header agent ===== */}
      <header className="shrink-0 border-b border-line bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/agents/seo"
            aria-label="Retour à la fiche de l'agent"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-white text-lg text-ink transition-colors hover:bg-beige-deep"
          >
            ←
          </Link>

          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest text-xs font-bold text-white shadow-[0_2px_8px_rgba(61,107,79,0.35)]">
            SEO
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate font-semibold tracking-tight">
                Agent SEO
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-forest">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-forest animate-pulse-ring" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-forest" />
                </span>
                En ligne
              </span>
            </div>
            <p className="truncate text-xs text-muted">
              Connecté à Google Search Console · Gmail
            </p>
          </div>

          <div className="hidden w-40 shrink-0 sm:block">
            <div className="mb-1 text-right text-xs text-muted">
              {userMessages} / {MAX_MESSAGES} messages
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-forest transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ===== Zone 2 — Conversation ===== */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6">
          {messages.map((m, i) => {
            const isAgent = m.role === "assistant";
            const isTyping =
              isAgent &&
              streaming &&
              i === messages.length - 1 &&
              m.content === "";
            return (
              <div
                key={i}
                className={`msg-in flex items-end gap-2.5 ${
                  isAgent ? "justify-start" : "flex-row-reverse justify-start"
                }`}
              >
                {/* Avatar */}
                {isAgent ? (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest text-[10px] font-bold text-white">
                    SEO
                  </span>
                ) : (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink text-xs font-bold text-white">
                    {name.charAt(0).toUpperCase()}
                  </span>
                )}

                <div
                  className={`flex max-w-[80%] flex-col ${
                    isAgent ? "items-start" : "items-end"
                  }`}
                >
                  <div
                    className={`whitespace-pre-wrap rounded-[18px] px-4 py-2.5 text-[0.95rem] leading-6 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.04)] ${
                      isAgent
                        ? "rounded-bl-md border border-line bg-white text-ink"
                        : "rounded-br-md bg-forest text-white"
                    }`}
                  >
                    {isTyping ? (
                      <span className="flex items-center gap-1 py-1">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </span>
                    ) : (
                      m.content
                    )}
                  </div>
                  <span className="mt-1 px-1 text-[11px] text-muted">
                    {m.ts}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Suggestions rapides sous le message de bienvenue */}
          {showSuggestions && (
            <div className="ml-10 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-forest/25 bg-white px-4 py-2 text-sm font-medium text-forest-dark shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:border-forest/40 hover:bg-forest-soft active:scale-[0.98]"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== Zone 3 — Saisie ===== */}
      <div className="shrink-0 border-t border-line bg-white/85 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-3xl px-4 py-3 sm:px-6">
          {limitReached ? (
            <div className="rounded-2xl bg-forest-soft px-4 py-3 text-center text-sm font-medium text-forest-dark">
              Limite de {MAX_MESSAGES} messages atteinte pour cette conversation.
            </div>
          ) : (
            <div className="flex items-end gap-2 rounded-3xl border border-line bg-beige p-1.5 transition focus-within:border-forest focus-within:bg-white focus-within:ring-4 focus-within:ring-forest/15">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  autoGrow();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Écrivez votre message…  (Entrée pour envoyer, Maj+Entrée pour un retour à la ligne)"
                className="max-h-28 flex-1 resize-none bg-transparent px-3 py-2 text-[0.95rem] leading-6 text-ink outline-none placeholder:text-muted/70"
              />
              <button
                type="button"
                onClick={() => send(input)}
                disabled={streaming || input.trim() === ""}
                aria-label="Envoyer"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest text-white shadow-[0_2px_8px_rgba(61,107,79,0.35)] transition-all hover:bg-forest-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          )}
          <p className="mt-2 text-center text-[11px] text-muted">
            L&apos;Agent SEO peut faire des erreurs. Vérifiez les informations
            importantes.
          </p>
        </div>
      </div>
    </div>
  );
}

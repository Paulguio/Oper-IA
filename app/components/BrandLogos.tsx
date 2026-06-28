// Inline brand SVGs for the "connected tools" strip.
// Kept monochrome-friendly with real brand colors so the row reads instantly.

export function GoogleLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 9.5c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 2.99 29.93 1 24 1 15.4 1 7.96 5.93 4.34 13.12l7.35 5.7C13.42 13.62 18.27 9.5 24 9.5z"
      />
    </svg>
  );
}

export function SlackLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 122.8 122.8" className={className} aria-hidden="true">
      <path
        fill="#E01E5A"
        d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zM32.3 77.6c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
      />
      <path
        fill="#36C5F0"
        d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zM45.2 32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
      />
      <path
        fill="#2EB67D"
        d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zM90.5 45.2c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
      />
      <path
        fill="#ECB22E"
        d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zM77.6 90.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
      />
    </svg>
  );
}

export function NotionLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#1f2a24"
        d="M4.2 3.3 14.9 2.5c1.3-.1 1.7 0 2.5.6l3.1 2.2c.6.4.8.5.8 1v13.3c0 .9-.3 1.4-1.5 1.5l-12.4.8c-.8.1-1.2-.1-1.7-.7L3.4 18.7c-.5-.6-.7-1.1-.7-1.7V4.7c0-.7.3-1.3 1.5-1.4z"
      />
      <path
        fill="#fff"
        d="M14.9 2.5 4.2 3.3C3 3.4 2.7 4 2.7 4.7v12.3c0 .6.2 1.1.7 1.7l1.8 2.5c.5.6.9.8 1.7.7l12.4-.8c1.2-.1 1.5-.6 1.5-1.5V6.3c0-.5-.2-.6-.7-1l-3.2-2.2c-.8-.6-1.2-.7-2.4-.6zM7.1 6.5c-1.1.1-1.4.1-2-.4L3.5 4.9c-.2-.2-.1-.4.3-.4l10.3-.8c1 0 1.5.3 1.9.6l1.9 1.4c.1.1.4.4 0 .4l-10.6.6-.1-.2zm-1.3 14V9.4c0-.5.2-.7.6-.8l11.4-.7c.4 0 .6.2.6.6v11c0 .5-.1.9-.7.9l-11 .6c-.6 0-.9-.2-.9-.5zm10.6-10.4c.1.3 0 .6-.3.6l-.5.1v7.8c-.5.2-.9.4-1.2.4-.5 0-.7-.2-1.1-.7l-3.4-5.3v5.1l1.1.2s0 .6-.9.6l-2.3.1c-.1-.2 0-.5.2-.6l.6-.1V11l-.8-.1c-.1-.3.1-.7.6-.8l2.4-.1 3.4 5.2v-4.6l-.9-.1c-.1-.4.2-.6.6-.7l2.2-.1z"
      />
    </svg>
  );
}

export function GmailLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 52 40" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M3.5 40h7V21.8L0 13.6v22.9C0 38.4 1.6 40 3.5 40z" />
      <path
        fill="#34A853"
        d="M41.5 40h7c2 0 3.5-1.6 3.5-3.5V13.6L41.5 21.8z"
      />
      <path
        fill="#FBBC04"
        d="M41.5 3.5v18.3L52 13.6V5.3c0-4.4-5-6.9-8.5-4.2z"
      />
      <path fill="#EA4335" d="M10.5 21.8V3.5L26 15.1 41.5 3.5v18.3L26 33.4z" />
      <path
        fill="#C5221F"
        d="M0 5.3v8.3l10.5 8.2V3.5L8.5 1.1C5-1.6 0 .9 0 5.3z"
      />
    </svg>
  );
}

const TOOLS = [
  { name: "Google", Logo: GoogleLogo },
  { name: "Slack", Logo: SlackLogo },
  { name: "Notion", Logo: NotionLogo },
  { name: "Gmail", Logo: GmailLogo },
];

export default function BrandLogos() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-9 gap-y-5">
      {TOOLS.map(({ name, Logo }) => (
        <div
          key={name}
          className="group flex items-center gap-2.5 opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
        >
          <Logo className="h-6 w-6" />
          <span className="text-sm font-semibold text-muted transition-colors group-hover:text-ink">
            {name}
          </span>
        </div>
      ))}
    </div>
  );
}

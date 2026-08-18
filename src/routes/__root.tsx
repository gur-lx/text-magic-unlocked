import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="label-eyebrow">Error · 404</p>
        <h1 className="mt-4 text-6xl font-bold">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This cipher leads nowhere. Return to the codex.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-sm bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="label-eyebrow">Cipher failure</p>
        <h1 className="mt-4 text-2xl">This page didn't load</h1>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-sm bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Try again
          </button>
          <a href="/" className="rounded-sm border border-input px-4 py-2 text-sm">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Cryptex — NSC Project on RSA & Hill Cipher" },
      { name: "description", content: "An interactive study of two classical and modern cryptosystems: the RSA public-key algorithm and the Hill matrix cipher." },
      { property: "og:title", content: "Cryptex — NSC Project" },
      { property: "og:description", content: "Theory, comparison and interactive demos of RSA and the Hill cipher." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=JetBrains+Mono:wght@400;500;600&family=Inter+Tight:wght@400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function NavBar() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-[color:var(--paper)]/85 border-b border-[color:var(--rule)]">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-8 w-8 grid place-items-center border-2 border-[color:var(--ink)] font-mono text-[11px] font-bold">CX</div>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold">Cryptex</div>
            <div className="label-eyebrow !text-[9px]">NSC · 2026</div>
          </div>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "bg-[color:var(--ink)] text-[color:var(--paper)]" }} className="px-3 py-1.5 rounded-sm font-mono text-xs uppercase tracking-wider">
            01 · Theory
          </Link>
          <Link to="/rsa" activeProps={{ className: "bg-[color:var(--ink)] text-[color:var(--paper)]" }} className="px-3 py-1.5 rounded-sm font-mono text-xs uppercase tracking-wider">
            02 · RSA
          </Link>
          <Link to="/hill" activeProps={{ className: "bg-[color:var(--ink)] text-[color:var(--paper)]" }} className="px-3 py-1.5 rounded-sm font-mono text-xs uppercase tracking-wider">
            03 · Hill
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-[color:var(--rule)]">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
        <div>© 2026 · Cryptex Codex · Network Security & Cryptography</div>
        <div className="flex gap-4">
          <span>RSA-1977</span>
          <span>HILL-1929</span>
          <span className="text-accent">⬢ CLASSIFIED</span>
        </div>
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <NavBar />
      <main className="min-h-[calc(100vh-200px)]">
        <Outlet />
      </main>
      <Footer />
    </QueryClientProvider>
  );
}

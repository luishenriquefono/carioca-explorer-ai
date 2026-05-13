import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Mountain } from "lucide-react";

const links = [
  { to: "/", label: "Início" },
  { to: "/lugares", label: "Lugares" },
  { to: "/praias", label: "Praias" },
  { to: "/trilhas", label: "Trilhas" },
  { to: "/eventos", label: "Eventos" },
  { to: "/clima", label: "Clima" },
  { to: "/roteiro", label: "Roteiro IA" },
] as const;

export function Header() {
  const { user, signOut } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span
            className="grid h-9 w-9 place-items-center rounded-lg text-primary-foreground"
            style={{ background: "var(--gradient-rio)" }}
          >
            <Mountain className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline">Guia Turístico do Rio</span>
        </Link>
        <nav className="hidden flex-wrap items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "rounded-md px-3 py-1.5 text-sm text-primary font-medium bg-muted" }}
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <>
              <Link
                to="/favoritos"
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                activeProps={{ className: "rounded-md px-3 py-1.5 text-sm text-primary font-medium bg-muted" }}
              >
                Favoritos
              </Link>
              <Link
                to="/historico"
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                activeProps={{ className: "rounded-md px-3 py-1.5 text-sm text-primary font-medium bg-muted" }}
              >
                Histórico
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Button size="sm" variant="outline" onClick={() => void signOut()}>
              Sair
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
          )}
        </div>
      </div>
      <nav className="container mx-auto flex gap-1 overflow-x-auto px-4 pb-2 lg:hidden">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted"
            activeProps={{ className: "whitespace-nowrap rounded-md px-3 py-1.5 text-sm text-primary font-medium bg-muted" }}
          >
            {l.label}
          </Link>
        ))}
        {user && (
          <>
            <Link to="/favoritos" className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted">Favoritos</Link>
            <Link to="/historico" className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted">Histórico</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-muted/30">
      <div className="container mx-auto flex flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© Guia Turístico do Rio de Janeiro</p>
        <Link to="/sobre" className="hover:text-foreground">Sobre o projeto</Link>
      </div>
    </footer>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Waves, Mountain, Landmark, Music, Cloud, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

const cards = [
  { to: "/praias", icon: Waves, title: "Praias", desc: "Copacabana, Ipanema, Barra e mais." },
  { to: "/trilhas", icon: Mountain, title: "Trilhas", desc: "Pedra Bonita, Pedra da Gávea, Urca." },
  { to: "/lugares", icon: Landmark, title: "Pontos turísticos", desc: "Cristo, Pão de Açúcar, Selarón." },
  { to: "/eventos", icon: Music, title: "Shows e eventos", desc: "Réveillon, Carnaval, Rock in Rio." },
  { to: "/clima", icon: Cloud, title: "Previsão do tempo", desc: "Confira antes de sair." },
  { to: "/roteiro", icon: Sparkles, title: "Roteiro com IA", desc: "Guia Carioca IA monta para você." },
] as const;

function Index() {
  return (
    <div>
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-rio)" }}
      >
        <div className="container mx-auto px-4 py-20 text-primary-foreground sm:py-28">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest opacity-90">
            Cidade Maravilhosa
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Guia Turístico do Rio de Janeiro
          </h1>
          <p className="mt-5 max-w-2xl text-lg opacity-90">
            Use IA e dados públicos para descobrir praias, trilhas, pontos turísticos,
            eventos e roteiros personalizados pelo Rio.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/roteiro"
              className="rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground shadow-[var(--shadow-soft)] transition hover:opacity-90"
            >
              Montar roteiro com IA
            </Link>
            <Link
              to="/lugares"
              className="rounded-lg border border-primary-foreground/40 px-6 py-3 font-semibold transition hover:bg-primary-foreground/10"
            >
              Explorar lugares
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14">
        <h2 className="mb-2 text-2xl font-semibold">O que você quer fazer hoje?</h2>
        <p className="mb-8 text-muted-foreground">
          As informações são apoiadas por IA e fontes públicas — sempre confirme horários e preços em fontes oficiais.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ to, icon: Icon, title, desc }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
            >
              <div
                className="mb-4 grid h-12 w-12 place-items-center rounded-xl text-primary-foreground"
                style={{ background: "var(--gradient-rio)" }}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

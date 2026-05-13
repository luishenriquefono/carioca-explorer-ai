import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

export type Lugar = {
  id: string;
  nome: string;
  categoria: string;
  descricao: string | null;
  bairro: string | null;
  imagem_url: string | null;
  faixa_preco: string | null;
};

export function PlaceCard({ lugar }: { lugar: Lugar }) {
  return (
    <Link
      to="/lugares/$id"
      params={{ id: lugar.id }}
      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        {lugar.imagem_url ? (
          <img
            src={lugar.imagem_url}
            alt={lugar.nome}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            sem imagem
          </div>
        )}
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-secondary">
          {lugar.categoria.replace("_", " ")}
        </p>
        <h3 className="font-semibold text-foreground">{lugar.nome}</h3>
        {lugar.bairro && (
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {lugar.bairro}
          </p>
        )}
        {lugar.faixa_preco && (
          <p className="text-sm text-muted-foreground">{lugar.faixa_preco}</p>
        )}
      </div>
    </Link>
  );
}
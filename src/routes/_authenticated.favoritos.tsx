import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/PageHeader";
import { PlaceCard, type Lugar } from "@/components/PlaceCard";
import { Calendar, MapPin } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";

export const Route = createFileRoute("/_authenticated/favoritos")({ component: Favoritos });

type EventoFav = {
  id: string;
  nome: string;
  descricao: string | null;
  local: string | null;
  data_evento: string | null;
  categoria: string | null;
};

function Favoritos() {
  const { user } = useAuth();
  const [lugares, setLugares] = useState<Lugar[] | null>(null);
  const [eventos, setEventos] = useState<EventoFav[] | null>(null);
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("favoritos")
        .select("lugares(id,nome,categoria,descricao,bairro,imagem_url,faixa_preco), eventos(id,nome,descricao,local,data_evento,categoria)")
        .eq("user_id", user.id);
      const rows = (data ?? []) as { lugares: Lugar | null; eventos: EventoFav | null }[];
      setLugares(rows.map((r) => r.lugares).filter(Boolean) as Lugar[]);
      setEventos(rows.map((r) => r.eventos).filter(Boolean) as EventoFav[]);
    })();
  }, [user]);
  return (
    <div>
      <PageHeader title="Meus favoritos" subtitle="Lugares que você salvou." />
      <div className="container mx-auto px-4 py-10">
        {!lugares && !eventos && <p className="text-muted-foreground">Carregando...</p>}
        {lugares && eventos && lugares.length === 0 && eventos.length === 0 && (
          <p className="text-muted-foreground">Nenhum favorito. <Link to="/lugares" className="text-primary hover:underline">Explorar lugares</Link>.</p>
        )}
        {lugares && lugares.length > 0 && (
          <>
            <h2 className="mb-3 text-lg font-semibold">Lugares</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lugares.map((l) => <PlaceCard key={l.id} lugar={l} />)}
            </div>
          </>
        )}
        {eventos && eventos.length > 0 && (
          <>
            <h2 className="mb-3 mt-10 text-lg font-semibold">Eventos</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {eventos.map((e) => (
                <article key={e.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-secondary">{e.categoria}</p>
                      <h3 className="mt-1 text-lg font-semibold">{e.nome}</h3>
                    </div>
                    <FavoriteButton eventoId={e.id} variant="inline" />
                  </div>
                  {e.descricao && <p className="mt-2 text-sm text-muted-foreground">{e.descricao}</p>}
                  <div className="mt-3 grid gap-1 text-sm text-muted-foreground">
                    {e.data_evento && <p className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{new Date(e.data_evento).toLocaleString("pt-BR")}</p>}
                    {e.local && <p className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{e.local}</p>}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

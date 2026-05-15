import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Calendar, MapPin } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";

export const Route = createFileRoute("/eventos")({ component: Eventos });

type Evento = {
  id: string;
  nome: string;
  descricao: string | null;
  local: string | null;
  data_evento: string | null;
  categoria: string | null;
  preco: string | null;
  fonte_informacao: string | null;
};

function Eventos() {
  const [data, setData] = useState<Evento[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("eventos").select("*").order("data_evento");
      if (error) setErr("Não foi possível carregar os eventos.");
      else setData(data as Evento[]);
    })();
  }, []);

  return (
    <div>
      <PageHeader title="Shows e eventos" subtitle="Eventos selecionados — sempre confirme datas e ingressos nos canais oficiais." />
      <div className="container mx-auto px-4 py-10">
        {err && <p className="text-destructive">{err}</p>}
        {!data && !err && <p className="text-muted-foreground">Carregando...</p>}
        <div className="grid gap-4 md:grid-cols-2">
          {data?.map((e) => (
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
                {e.data_evento && (
                  <p className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{new Date(e.data_evento).toLocaleString("pt-BR")}</p>
                )}
                {e.local && <p className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{e.local}</p>}
                {e.preco && <p>💰 {e.preco}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
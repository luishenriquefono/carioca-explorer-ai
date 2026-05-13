import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/PageHeader";
import ReactMarkdown from "react-markdown";

type Roteiro = { id: string; titulo: string; resposta_ia: string | null; created_at: string };

export const Route = createFileRoute("/_authenticated/historico")({ component: Historico });

function Historico() {
  const { user } = useAuth();
  const [items, setItems] = useState<Roteiro[] | null>(null);
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("roteiros")
        .select("id,titulo,resposta_ia,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setItems((data as Roteiro[]) ?? []);
    })();
  }, [user]);
  return (
    <div>
      <PageHeader title="Histórico de roteiros" subtitle="Suas consultas ao Guia Carioca IA." />
      <div className="container mx-auto max-w-3xl px-4 py-10">
        {!items && <p className="text-muted-foreground">Carregando...</p>}
        {items && items.length === 0 && <p className="text-muted-foreground">Sem roteiros ainda.</p>}
        <div className="space-y-4">
          {items?.map((r) => (
            <details key={r.id} className="rounded-2xl border border-border bg-card p-5">
              <summary className="cursor-pointer text-sm font-medium">
                <span className="text-muted-foreground">{new Date(r.created_at).toLocaleString("pt-BR")} —</span> {r.titulo}
              </summary>
              {r.resposta_ia && (
                <article className="prose prose-sm mt-4 max-w-none">
                  <ReactMarkdown>{r.resposta_ia}</ReactMarkdown>
                </article>
              )}
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

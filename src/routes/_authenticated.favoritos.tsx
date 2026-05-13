import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/PageHeader";
import { PlaceCard, type Lugar } from "@/components/PlaceCard";

export const Route = createFileRoute("/_authenticated/favoritos")({ component: Favoritos });

function Favoritos() {
  const { user } = useAuth();
  const [lugares, setLugares] = useState<Lugar[] | null>(null);
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("favoritos")
        .select("lugares(id,nome,categoria,descricao,bairro,imagem_url,faixa_preco)")
        .eq("user_id", user.id);
      const arr = (data ?? []).map((r: { lugares: Lugar | null }) => r.lugares).filter(Boolean) as Lugar[];
      setLugares(arr);
    })();
  }, [user]);
  return (
    <div>
      <PageHeader title="Meus favoritos" subtitle="Lugares que você salvou." />
      <div className="container mx-auto px-4 py-10">
        {!lugares && <p className="text-muted-foreground">Carregando...</p>}
        {lugares && lugares.length === 0 && (
          <p className="text-muted-foreground">Nenhum favorito. <Link to="/lugares" className="text-primary hover:underline">Explorar lugares</Link>.</p>
        )}
        {lugares && lugares.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lugares.map((l) => <PlaceCard key={l.id} lugar={l} />)}
          </div>
        )}
      </div>
    </div>
  );
}

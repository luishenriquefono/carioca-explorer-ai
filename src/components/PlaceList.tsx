import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PlaceCard, type Lugar } from "./PlaceCard";

export function PlaceList({ categoria }: { categoria?: string }) {
  const [lugares, setLugares] = useState<Lugar[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      let q = supabase.from("lugares").select("id,nome,categoria,descricao,bairro,imagem_url,faixa_preco").order("nome");
      if (categoria) q = q.eq("categoria", categoria);
      const { data, error } = await q;
      if (!active) return;
      if (error) setError("Não foi possível carregar os lugares.");
      else setLugares(data as Lugar[]);
    })();
    return () => {
      active = false;
    };
  }, [categoria]);

  if (error) return <p className="text-destructive">{error}</p>;
  if (!lugares) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }
  if (lugares.length === 0) return <p className="text-muted-foreground">Nada encontrado.</p>;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {lugares.map((l) => (
        <PlaceCard key={l.id} lugar={l} />
      ))}
    </div>
  );
}
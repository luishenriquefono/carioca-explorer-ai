import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, MapPin, Clock, Tag } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/lugares/$id")({ component: LugarDetalhe });

type LugarFull = {
  id: string;
  nome: string;
  categoria: string;
  descricao: string | null;
  endereco: string | null;
  bairro: string | null;
  horario_funcionamento: string | null;
  faixa_preco: string | null;
  imagem_url: string | null;
  fonte_informacao: string | null;
};

function LugarDetalhe() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const [lugar, setLugar] = useState<LugarFull | null>(null);
  const [favorito, setFavorito] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("lugares").select("*").eq("id", id).maybeSingle();
      if (error) setErr("Não foi possível carregar este lugar.");
      else setLugar(data as LugarFull | null);
    })();
  }, [id]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("favoritos").select("id").eq("user_id", user.id).eq("lugar_id", id).maybeSingle();
      setFavorito(!!data);
    })();
  }, [user, id]);

  const toggleFav = async () => {
    if (!user) {
      toast.info("Entre para salvar favoritos.");
      return;
    }
    setLoadingFav(true);
    try {
      if (favorito) {
        await supabase.from("favoritos").delete().eq("user_id", user.id).eq("lugar_id", id);
        setFavorito(false);
      } else {
        await supabase.from("favoritos").insert({ user_id: user.id, lugar_id: id });
        setFavorito(true);
      }
    } catch {
      toast.error("Não foi possível atualizar seus favoritos.");
    } finally {
      setLoadingFav(false);
    }
  };

  if (err) return <div className="container mx-auto px-4 py-10 text-destructive">{err}</div>;
  if (!lugar) return <div className="container mx-auto px-4 py-10 text-muted-foreground">Carregando...</div>;

  return (
    <div>
      <div className="relative h-64 w-full overflow-hidden bg-muted sm:h-96">
        {lugar.imagem_url && <img src={lugar.imagem_url} alt={lugar.nome} className="h-full w-full object-cover" />}
      </div>
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Link to="/lugares" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-secondary">{lugar.categoria.replace("_", " ")}</p>
            <h1 className="mt-1 text-3xl font-semibold">{lugar.nome}</h1>
          </div>
          <Button onClick={toggleFav} disabled={loadingFav} variant={favorito ? "default" : "outline"}>
            <Heart className={`mr-2 h-4 w-4 ${favorito ? "fill-current" : ""}`} />
            {favorito ? "Salvo" : "Favoritar"}
          </Button>
        </div>
        {lugar.descricao && <p className="mt-4 text-foreground/90">{lugar.descricao}</p>}
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          {lugar.endereco && <Info icon={<MapPin className="h-4 w-4" />} label="Endereço" value={`${lugar.endereco}${lugar.bairro ? ` - ${lugar.bairro}` : ""}`} />}
          {lugar.horario_funcionamento && <Info icon={<Clock className="h-4 w-4" />} label="Horário" value={lugar.horario_funcionamento} />}
          {lugar.faixa_preco && <Info icon={<Tag className="h-4 w-4" />} label="Preço" value={lugar.faixa_preco} />}
        </dl>
        <p className="mt-6 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          ⚠️ Horários, preços e condições podem mudar. Confirme em fontes oficiais{lugar.fonte_informacao ? ` (${lugar.fonte_informacao})` : ""}.
        </p>
      </div>
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">{icon}{label}</div>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}
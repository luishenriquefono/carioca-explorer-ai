import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
  lugarId?: string;
  eventoId?: string;
  variant?: "overlay" | "inline";
  className?: string;
};

export function FavoriteButton({ lugarId, eventoId, variant = "overlay", className }: Props) {
  const { user } = useAuth();
  const [fav, setFav] = useState(false);
  const [loading, setLoading] = useState(false);

  const col = lugarId ? "lugar_id" : "evento_id";
  const id = lugarId ?? eventoId;

  useEffect(() => {
    if (!user || !id) {
      setFav(false);
      return;
    }
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("favoritos")
        .select("id")
        .eq("user_id", user.id)
        .eq(col, id)
        .maybeSingle();
      if (active) setFav(!!data);
    })();
    return () => {
      active = false;
    };
  }, [user, id, col]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.info("Entre para salvar favoritos.");
      return;
    }
    if (!id || loading) return;
    setLoading(true);
    try {
      if (fav) {
        const { error } = await supabase
          .from("favoritos")
          .delete()
          .eq("user_id", user.id)
          .eq(col, id);
        if (error) throw error;
        setFav(false);
      } else {
        const payload: { user_id: string; lugar_id?: string; evento_id?: string } = { user_id: user.id };
        if (lugarId) payload.lugar_id = lugarId;
        if (eventoId) payload.evento_id = eventoId;
        const { error } = await supabase.from("favoritos").insert(payload);
        if (error) throw error;
        setFav(true);
      }
    } catch {
      toast.error("Não foi possível atualizar seus favoritos.");
    } finally {
      setLoading(false);
    }
  };

  const base =
    variant === "overlay"
      ? "absolute right-2 top-2 z-10 grid h-9 w-9 place-items-center rounded-full bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background transition"
      : "inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-sm hover:bg-accent transition";

  return (
    <button
      type="button"
      aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      aria-pressed={fav}
      onClick={toggle}
      disabled={loading}
      className={cn(base, className)}
    >
      <Heart className={cn("h-4 w-4", fav ? "fill-primary text-primary" : "text-foreground")} />
      {variant === "inline" && <span>{fav ? "Salvo" : "Favoritar"}</span>}
    </button>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { gerarRoteiro } from "@/lib/roteiro.functions";
import { PageHeader } from "@/components/PageHeader";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { MAX_INPUT, validateUserInput } from "@/lib/validation";
import { toast } from "sonner";

export const Route = createFileRoute("/roteiro")({ component: Roteiro });

const SUGESTOES = [
  "Tenho 3 dias no Rio com minha família, gostamos de praia e cultura. O que sugere?",
  "Casal jovem, 2 dias, gostamos de trilhas e gastronomia, orçamento médio.",
  "Estou sozinho 4 dias, quero vida noturna na Lapa e shows.",
];

function Roteiro() {
  const { user } = useAuth();
  const fn = useServerFn(gerarRoteiro);
  const [pergunta, setPergunta] = useState("");
  const [loading, setLoading] = useState(false);
  const [resposta, setResposta] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const enviar = async (texto?: string) => {
    const q = (texto ?? pergunta).trim();
    const v = validateUserInput(q);
    if (!v.ok) {
      setErro(v.reason);
      setResposta(null);
      return;
    }
    setErro(null);
    setResposta(null);
    setLoading(true);
    try {
      const result = await fn({ data: { pergunta: v.value } });
      if (result.ok) {
        setResposta(result.resposta);
        if (user) {
          await supabase.from("historico_consultas").insert({
            user_id: user.id,
            pergunta: v.value,
            resposta: result.resposta,
          });
          await supabase.from("roteiros").insert({
            user_id: user.id,
            titulo: v.value.slice(0, 80),
            preferencias_usuario: { pergunta: v.value },
            resposta_ia: result.resposta,
          });
        }
      } else {
        setErro(result.error);
      }
    } catch {
      setErro("Não foi possível gerar a resposta agora. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Guia Carioca IA"
        subtitle="Conte sobre sua viagem: dias no Rio, estilo de passeio, orçamento, com quem viaja, esforço físico para trilhas, região de hospedagem."
      />
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <Textarea
            placeholder="Ex.: Vou ficar 4 dias no Rio com minha namorada, gostamos de praia, trilhas leves e boa comida. Orçamento médio. Hospedagem em Copacabana."
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value.slice(0, MAX_INPUT))}
            rows={5}
            maxLength={MAX_INPUT}
          />
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{pergunta.length}/{MAX_INPUT}</span>
            {!user && <span>Entre para salvar este roteiro no seu histórico.</span>}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {SUGESTOES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPergunta(s)}
                className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {s.length > 60 ? s.slice(0, 60) + "..." : s}
              </button>
            ))}
          </div>
          <Button onClick={() => void enviar()} disabled={loading} className="mt-4 w-full sm:w-auto">
            <Sparkles className="mr-2 h-4 w-4" />
            {loading ? "Pensando..." : "Gerar roteiro"}
          </Button>
        </div>

        {erro && (
          <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {erro}
          </div>
        )}

        {resposta && (
          <article className="prose prose-sm mt-6 max-w-none rounded-2xl border border-border bg-card p-6 shadow-sm">
            <ReactMarkdown>{resposta}</ReactMarkdown>
            <p className="mt-4 rounded bg-muted p-3 text-xs not-prose text-muted-foreground">
              ⚠️ Sugestões geradas por IA. Confirme horários, preços e disponibilidade em fontes oficiais.
            </p>
          </article>
        )}
      </div>
    </div>
  );
}
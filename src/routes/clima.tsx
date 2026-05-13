import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { obterClima } from "@/lib/clima.functions";
import { PageHeader } from "@/components/PageHeader";
import { CloudSun, Droplets, Wind } from "lucide-react";

export const Route = createFileRoute("/clima")({ component: Clima });

function Clima() {
  const fn = useServerFn(obterClima);
  const { data, isLoading } = useQuery({ queryKey: ["clima"], queryFn: () => fn(), staleTime: 5 * 60_000 });

  return (
    <div>
      <PageHeader title="Previsão do tempo" subtitle="Tempo agora no Rio de Janeiro." />
      <div className="container mx-auto max-w-2xl px-4 py-10">
        {isLoading && <p className="text-muted-foreground">Carregando...</p>}
        {data && data.ok && (
          <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
            <p className="text-sm text-muted-foreground">{data.cidade}</p>
            <div className="mt-1 flex items-center gap-4">
              <CloudSun className="h-14 w-14 text-accent" />
              <p className="text-6xl font-semibold">{data.temperatura}°</p>
            </div>
            <p className="mt-2 capitalize text-foreground/80">{data.descricao}</p>
            <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
              <Stat label="Sensação" value={`${data.sensacao}°`} />
              <Stat icon={<Droplets className="h-4 w-4" />} label="Umidade" value={`${data.umidade}%`} />
              <Stat icon={<Wind className="h-4 w-4" />} label="Vento" value={`${data.vento} km/h`} />
            </div>
          </div>
        )}
        {data && !data.ok && (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">{data.error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-muted p-3">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">{icon}{label}</div>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
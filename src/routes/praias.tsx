import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { PlaceList } from "@/components/PlaceList";

export const Route = createFileRoute("/praias")({
  component: () => (
    <div>
      <PageHeader title="Praias" subtitle="As praias mais famosas do Rio." />
      <div className="container mx-auto px-4 py-10"><PlaceList categoria="praia" /></div>
    </div>
  ),
});
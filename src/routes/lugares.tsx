import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { PlaceList } from "@/components/PlaceList";

export const Route = createFileRoute("/lugares")({ component: () => (
  <div>
    <PageHeader title="Lugares" subtitle="Pontos turísticos, praias e trilhas do Rio de Janeiro." />
    <div className="container mx-auto px-4 py-10"><PlaceList /></div>
  </div>
) });
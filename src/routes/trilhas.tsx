import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { PlaceList } from "@/components/PlaceList";

export const Route = createFileRoute("/trilhas")({
  component: () => (
    <div>
      <PageHeader title="Trilhas" subtitle="Caminhadas com vistas espetaculares." />
      <div className="container mx-auto px-4 py-10"><PlaceList categoria="trilha" /></div>
    </div>
  ),
});
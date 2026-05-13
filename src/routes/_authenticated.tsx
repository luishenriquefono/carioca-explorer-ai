import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({ component: AuthLayout });

function AuthLayout() {
  const { user, loading } = useAuth();
  if (loading) return <div className="container mx-auto px-4 py-10 text-muted-foreground">Carregando...</div>;
  if (!user) return <Navigate to="/login" />;
  return <Outlet />;
}
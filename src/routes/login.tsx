import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const SIGNUP_TIMEOUT_MS = 15000;
const RESEND_COOLDOWN_S = 60;

function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("already registered") || m.includes("user already"))
    return "Este e-mail já está cadastrado. Tente entrar ou reenviar a confirmação.";
  if (m.includes("invalid login")) return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed"))
    return "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.";
  if (m.includes("rate") || m.includes("too many"))
    return "Muitas tentativas. Aguarde alguns segundos e tente novamente.";
  if (m.includes("timeout") || m.includes("network") || m.includes("failed to fetch"))
    return "A conexão demorou muito. Verifique sua internet e tente novamente.";
  if (m.includes("password")) return "A senha precisa ter ao menos 6 caracteres.";
  return "Não foi possível continuar. Tente novamente em instantes.";
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await withTimeout(
          supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
              data: { nome },
            },
          }),
          SIGNUP_TIMEOUT_MS,
        );
        if (error) throw error;
        setSignupSuccess(true);
        setResendCooldown(RESEND_COOLDOWN_S);
        toast.success("Cadastro realizado! Confira seu e-mail.");
      } else {
        const { error } = await withTimeout(
          supabase.auth.signInWithPassword({ email, password }),
          SIGNUP_TIMEOUT_MS,
        );
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        navigate({ to: "/" });
      }
    } catch (err) {
      const raw = err instanceof Error ? err.message : "";
      toast.error(friendlyAuthError(raw));
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  const resendConfirmation = async () => {
    if (resendCooldown > 0 || !email) return;
    setLoading(true);
    try {
      const { error } = await withTimeout(
        supabase.auth.resend({
          type: "signup",
          email,
          options: { emailRedirectTo: `${window.location.origin}/` },
        }),
        SIGNUP_TIMEOUT_MS,
      );
      if (error) throw error;
      toast.success("E-mail de confirmação reenviado.");
      setResendCooldown(RESEND_COOLDOWN_S);
    } catch (err) {
      const raw = err instanceof Error ? err.message : "";
      toast.error(friendlyAuthError(raw));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
        <h1 className="text-2xl font-semibold">
          {mode === "login" ? "Entrar" : "Criar conta"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Salve favoritos, roteiros e seu histórico de consultas.
        </p>
        {signupSuccess && mode === "signup" && (
          <Alert className="mt-4">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Quase lá!</AlertTitle>
            <AlertDescription>
              Enviamos um link de confirmação para <strong>{email}</strong>. Pode levar alguns
              minutos. Não esqueça de checar a pasta de spam.
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void resendConfirmation()}
                  disabled={loading || resendCooldown > 0}
                >
                  <MailCheck className="h-4 w-4" />
                  {resendCooldown > 0
                    ? `Reenviar em ${resendCooldown}s`
                    : "Reenviar e-mail"}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required maxLength={80} />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {mode === "login" ? "Entrando..." : "Criando conta..."}
              </>
            ) : mode === "login" ? (
              "Entrar"
            ) : (
              "Cadastrar"
            )}
          </Button>
        </form>
        {mode === "login" && (
          <button
            type="button"
            onClick={() => void resendConfirmation()}
            disabled={loading || !email || resendCooldown > 0}
            className="mt-3 w-full text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            {resendCooldown > 0
              ? `Reenviar confirmação em ${resendCooldown}s`
              : "Não recebeu o e-mail? Reenviar confirmação"}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setSignupSuccess(false);
          }}
          className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "login" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
        </button>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Continuar como visitante</Link>
        </p>
      </div>
    </div>
  );
}
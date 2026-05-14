# Guia Turístico do Rio de Janeiro

Aplicação web full-stack para ajudar turistas a planejarem visitas ao Rio de Janeiro com informações reais sobre praias, trilhas, passeios, eventos, previsão do tempo e roteiros gerados por IA.

## 🎯 Objetivo

Oferecer um guia turístico completo e funcional do Rio de Janeiro, com:

- Catálogo de lugares turísticos, praias e trilhas
- Eventos e shows na cidade
- Previsão do tempo em tempo real
- Geração de roteiros personalizados com IA (Guia Carioca IA)
- Favoritos e histórico de roteiros por usuário autenticado

## 🛠 Tecnologias

- **Frontend:** React 19, TanStack Start, TanStack Router, TanStack Query, Tailwind CSS v4, shadcn/ui, lucide-react
- **Backend:** TanStack Server Functions (`createServerFn`) rodando em Cloudflare Workers (edge)
- **Banco de dados & Auth:** Supabase (Postgres + Auth) via Lovable Cloud
- **IA:** Lovable AI Gateway (Vercel AI SDK + `@ai-sdk/openai-compatible`) — modelo `google/gemini-2.5-flash`
- **Clima:** OpenWeather API (One Call / Current Weather)
- **Build:** Vite 7, Bun

## 🚀 Como rodar localmente

Pré-requisitos: [Bun](https://bun.sh) instalado.

```bash
bun install
bun run dev
```

A aplicação ficará disponível em `http://localhost:5173`.

## 🔐 Variáveis de ambiente

O arquivo `.env` (gerado automaticamente pelo Lovable Cloud) contém as variáveis públicas do Supabase:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=...
SUPABASE_URL=...
SUPABASE_PUBLISHABLE_KEY=...
```

Variáveis **secretas** (acessíveis apenas no backend via `process.env` dentro de server functions):

| Nome | Uso |
|------|-----|
| `SUPABASE_SERVICE_ROLE_KEY` | Cliente admin (bypass RLS) em rotas de servidor |
| `LOVABLE_API_KEY` | Acesso ao Lovable AI Gateway para o roteiro com IA |
| `OPENWEATHER_API_KEY` | Consulta de previsão do tempo |

> ⚠️ **Nunca** exponha essas chaves no frontend. Elas só são lidas dentro de server functions (`src/lib/*.functions.ts`).

## 🗄 Setup do Supabase (Lovable Cloud)

O projeto já vem conectado ao Lovable Cloud. As migrations em `supabase/migrations/` criam:

- `users_profile` — perfil do usuário, criado automaticamente via trigger `handle_new_user`
- `lugares` — pontos turísticos, praias e trilhas
- `eventos` — shows e eventos
- `favoritos` — relação usuário ↔ lugar (RLS por `user_id`)
- `roteiros` — roteiros gerados pela IA (RLS por `user_id`)
- `historico_consultas` — histórico de prompts (RLS por `user_id`)

Todas as tabelas privadas têm **Row Level Security** ativada — usuários só leem/escrevem seus próprios registros.

Autenticação: e-mail + senha via Supabase Auth (rota `/login`).

## 🌤 Setup do OpenWeather

1. Crie uma conta gratuita em [openweathermap.org](https://openweathermap.org/api).
2. Gere uma API key no painel.
3. Adicione como secret do projeto com o nome `OPENWEATHER_API_KEY`.

A chamada acontece em `src/lib/clima.functions.ts` (server function `obterClima`), que consulta `api.openweathermap.org` para a cidade do Rio de Janeiro.

## 📦 Dependências principais

- `@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/react-query`
- `@supabase/supabase-js`
- `ai`, `@ai-sdk/openai-compatible` — integração com Lovable AI Gateway
- `react-markdown` — renderização do roteiro gerado
- `tailwindcss`, `class-variance-authority`, `lucide-react`
- `zod` — validação de inputs nas server functions

## 🛡 Práticas de segurança

- **Chaves de API no backend:** `LOVABLE_API_KEY` e `OPENWEATHER_API_KEY` são lidas via `process.env` dentro de server functions e **nunca** chegam ao bundle do navegador.
- **RLS no Supabase:** todas as tabelas com dados de usuário têm políticas que filtram por `auth.uid()`. O cliente admin (service role) só é usado em rotas de servidor confiáveis.
- **Validação de input:** `src/lib/validation.ts` limita prompts a 800 caracteres e bloqueia tentativas de prompt injection (ex.: "ignore as instruções anteriores", "revele seu prompt").
- **Escopo da IA:** o system prompt do Guia Carioca IA restringe respostas exclusivamente a turismo no Rio de Janeiro.
- **Auth-middleware:** server functions sensíveis usam `requireSupabaseAuth`, garantindo que apenas usuários autenticados executem a operação e que as queries herdem as políticas RLS do usuário.
- **Tratamento de erros:** falhas em APIs externas (clima, IA) retornam mensagens amigáveis em vez de vazar detalhes do provedor.

## ⚠️ Limitações

- A previsão do tempo depende da disponibilidade da OpenWeather API.
- Eventos e lugares são populados via seed; não há ingestão automática de fontes externas.
- O roteiro gerado pela IA é uma sugestão e pode conter imprecisões — sempre confirme horários e preços oficiais.

---

Construído com ❤️ no [Lovable](https://lovable.dev).
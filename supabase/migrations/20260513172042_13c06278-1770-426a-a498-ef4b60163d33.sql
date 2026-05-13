
-- Profiles
create table public.users_profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  nome text,
  created_at timestamptz not null default now()
);
alter table public.users_profile enable row level security;
create policy "profiles select own" on public.users_profile for select using (auth.uid() = user_id);
create policy "profiles insert own" on public.users_profile for insert with check (auth.uid() = user_id);
create policy "profiles update own" on public.users_profile for update using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users_profile (user_id, nome)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', new.email));
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Lugares (public)
create table public.lugares (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  categoria text not null,
  descricao text,
  endereco text,
  bairro text,
  horario_funcionamento text,
  faixa_preco text,
  imagem_url text,
  fonte_informacao text,
  created_at timestamptz not null default now()
);
alter table public.lugares enable row level security;
create policy "lugares public read" on public.lugares for select using (true);

-- Eventos (public)
create table public.eventos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  local text,
  data_evento timestamptz,
  categoria text,
  preco text,
  fonte_informacao text,
  created_at timestamptz not null default now()
);
alter table public.eventos enable row level security;
create policy "eventos public read" on public.eventos for select using (true);

-- Favoritos
create table public.favoritos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lugar_id uuid not null references public.lugares(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, lugar_id)
);
alter table public.favoritos enable row level security;
create policy "fav select own" on public.favoritos for select using (auth.uid() = user_id);
create policy "fav insert own" on public.favoritos for insert with check (auth.uid() = user_id);
create policy "fav delete own" on public.favoritos for delete using (auth.uid() = user_id);

-- Roteiros
create table public.roteiros (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null,
  preferencias_usuario jsonb,
  resposta_ia text,
  created_at timestamptz not null default now()
);
alter table public.roteiros enable row level security;
create policy "rot select own" on public.roteiros for select using (auth.uid() = user_id);
create policy "rot insert own" on public.roteiros for insert with check (auth.uid() = user_id);
create policy "rot delete own" on public.roteiros for delete using (auth.uid() = user_id);

-- Histórico de consultas
create table public.historico_consultas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pergunta text not null,
  resposta text,
  created_at timestamptz not null default now()
);
alter table public.historico_consultas enable row level security;
create policy "hist select own" on public.historico_consultas for select using (auth.uid() = user_id);
create policy "hist insert own" on public.historico_consultas for insert with check (auth.uid() = user_id);
create policy "hist delete own" on public.historico_consultas for delete using (auth.uid() = user_id);

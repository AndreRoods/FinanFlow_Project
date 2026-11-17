-- FinanFlow: autenticação própria por nome de usuário e senha.
-- Execute este arquivo no SQL Editor do Supabase antes de publicar a nova versão.

create extension if not exists pgcrypto;

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  password_hash text,
  created_at timestamptz not null default now(),
  constraint app_users_username_format check (username = lower(username) and username ~ '^[a-z0-9._-]{3,24}$')
);

create unique index if not exists app_users_username_unique on public.app_users (username);

-- Preserva os IDs de contas antigas para manter os vínculos das transações e categorias.
-- A senha antiga não pode ser extraída do Supabase Auth; essas contas precisarão de novo cadastro.
do $$
declare
  old_user record;
  base_name text;
  candidate text;
begin
  if to_regclass('auth.users') is not null then
    for old_user in
      select id, email, raw_user_meta_data
      from auth.users
    loop
      base_name := lower(regexp_replace(
        coalesce(old_user.raw_user_meta_data->>'username', split_part(coalesce(old_user.email, 'usuario'), '@', 1), 'usuario'),
        '[^a-z0-9._-]', '', 'g'
      ));
      base_name := left(base_name, 17);
      if length(base_name) < 3 then base_name := 'user'; end if;
      candidate := base_name || '_' || left(replace(old_user.id::text, '-', ''), 6);
      insert into public.app_users (id, username, password_hash)
      values (old_user.id, candidate, null)
      on conflict (id) do nothing;
    end loop;
  end if;
end $$;

-- Troca as referências antigas de auth.users para a tabela de contas do FinanFlow.
alter table public.categories drop constraint if exists categories_user_id_fkey;
alter table public.transactions drop constraint if exists transactions_user_id_fkey;

alter table public.categories
  add constraint categories_user_id_fkey foreign key (user_id) references public.app_users(id) on delete cascade;
alter table public.transactions
  add constraint transactions_user_id_fkey foreign key (user_id) references public.app_users(id) on delete cascade;

alter table public.app_users enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

-- Não crie políticas para anon/authenticated: somente as rotas do servidor,
-- usando SUPABASE_SERVICE_ROLE_KEY, devem acessar essas tabelas.

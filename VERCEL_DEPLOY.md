# Publicar o FinanFlow na Vercel

O FinanFlow usa Next.js App Router, rotas de servidor, Proxy para atualizar a sessão e Supabase. Publique como aplicação **Next.js**, não como site estático.

## 1. Importar o repositório

1. Entre em https://vercel.com e escolha **Add New > Project**.
2. Importe `AndreRoods/FinanFlow_Project` do GitHub.
3. Mantenha **Root Directory** como `./`.
4. Confirme o framework **Next.js**.
5. Use Node.js **22.x** nas configurações do projeto. O mínimo suportado pelo Next.js 16 é Node.js 20.9.

A Vercel detecta o pnpm pelo `pnpm-lock.yaml` e o comando de build pelo `package.json`. Não configure `output: export`, não use GitHub Pages e não crie um `index.html` manual.

## 2. Configurar as variáveis de ambiente

Em **Project > Settings > Environment Variables**, adicione as duas variáveis abaixo para Production, Preview e Development:

| Nome | Valor |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave publicável/anon do Supabase |

Encontre os valores em **Supabase > Project Settings > API**.

Use somente a chave publicável/anon no navegador. **Nunca** coloque `service_role`, senhas ou tokens privados em variáveis `NEXT_PUBLIC_*` ou no GitHub.

Depois de salvar as variáveis, faça um novo deploy para que elas sejam aplicadas ao build e à execução.

## 3. Autorizar o domínio no Supabase Auth

No painel Supabase, abra **Authentication > URL Configuration**:

- Configure **Site URL** com o domínio principal publicado, por exemplo `https://seu-projeto.vercel.app`.
- Em **Redirect URLs**, adicione o domínio publicado com o caminho permitido para o redirecionamento de autenticação, por exemplo `https://seu-projeto.vercel.app/**`.
- Mantenha também `http://localhost:3000/**` para desenvolvimento local, se necessário.
- Se usar domínio próprio, adicione-o também.

A URL de redirecionamento usada no cadastro é baseada no domínio atual do site. O domínio de produção precisa estar autorizado no Supabase.

## 4. Banco de dados

Se ainda não executou o SQL do projeto, abra **Supabase > SQL Editor** e execute:

`scripts/001_create_financial_tables.sql`

O script cria as tabelas, políticas RLS e categorias padrão para novos usuários. Não desative o RLS para corrigir erros de acesso.

## 5. Publicar e validar

1. Clique em **Deploy** na Vercel.
2. Aguarde o build terminar sem erros.
3. Teste criação de conta, confirmação de e-mail (se habilitada), login, dashboard, criação de transação e exclusão.
4. Se alterar variáveis de ambiente, gere um novo deploy.

## Configuração de build

- Framework: Next.js
- Root Directory: `./`
- Install Command: automático via pnpm / `pnpm install`
- Build Command: `pnpm build`
- Output Directory: automático (não sobrescrever)
- Node.js: 22.x

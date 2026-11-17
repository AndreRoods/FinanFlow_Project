# FinanFlow — login com nome de usuário e senha

A nova autenticação não usa Supabase Auth, e-mail ou confirmação por e-mail. O servidor cria contas em `app_users`, armazena somente o hash da senha (scrypt) e mantém uma sessão em cookie HttpOnly, Secure em produção e SameSite=Lax.

## Configuração obrigatória

1. No Supabase, abra **SQL Editor** e execute o arquivo `scripts/002_username_auth.sql`.
2. No Supabase, abra **Project Settings → API Keys** (ou API) e copie a chave **secret/service_role** do projeto. Ela será usada somente no servidor. Nunca use uma chave publishable/anon no lugar dela e nunca coloque essa chave em variável `NEXT_PUBLIC_...`.
3. No Vercel, abra **Settings → Environment Variables** do projeto e configure:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL do mesmo projeto Supabase.
   - `SUPABASE_SERVICE_ROLE_KEY`: chave secreta/service_role do mesmo projeto.
   - `SESSION_SECRET`: uma string aleatória longa (mínimo 32 caracteres). Gere localmente com `openssl rand -hex 32` ou outro gerador seguro.
4. Marque as três variáveis para **Production**, **Preview** e **Development**, conforme necessário.
5. Faça um novo deploy no Vercel.

## Como funciona

- Cadastro: somente nome de usuário (3–24 caracteres) e senha (8–128 caracteres).
- Login: nome de usuário e senha.
- O nome é único e não diferencia maiúsculas de minúsculas.
- Senhas são armazenadas com scrypt + salt, nunca em texto puro.
- Cada operação do painel usa o ID do usuário da sessão no servidor.
- A chave secreta do banco fica exclusivamente no servidor.

## Contas antigas

O SQL preserva os IDs antigos do Supabase Auth e a associação das transações/categorias. As senhas antigas não podem ser migradas. Por segurança, essas contas antigas não conseguem entrar com a senha anterior e devem criar uma conta nova com outro nome de usuário. Não apague os dados antigos antes de decidir se precisa recuperá-los.

## Observação

Este fluxo é simples para o usuário final, mas continua usando autenticação real no servidor. Antes de usar com dados financeiros importantes, faça revisão de segurança, backups e adicione proteção contra tentativas repetidas de login.

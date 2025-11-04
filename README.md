#FinanFlow - Gestor Financeiro Pessoal

Um aplicativo moderno de gestão financeira pessoal desenvolvido com Next.js 16, React, TypeScript e Supabase. Controle suas receitas, despesas e visualize sua saúde financeira em tempo real.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat&logo=supabase)

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)

## 🎯 Sobre o Projeto

O FinanFlow é uma aplicação web completa para gestão de finanças pessoais. Permite que você:

- 📊 Registre receitas e despesas
- 📈 Visualize resumos financeiros
- 🎨 Organize por categorias personalizadas
- 📉 Acompanhe gastos por categoria
- 📱 Tenha uma interface moderna e responsiva

## ✨ Funcionalidades

### 📊 Dashboard Principal
- **Resumo Financeiro**: Visualize receitas, despesas e saldo em cards coloridos
- **Gráfico de Distribuição**: Veja a distribuição de despesas por categoria em gráfico de pizza
- **Lista de Transações**: Acompanhe todas as transações recentes
- **Gastos por Categoria**: Tabela expandível agrupando gastos por categoria

### ➕ Gestão de Transações
- Adicionar novas transações (receitas ou despesas)
- Selecionar categoria personalizada
- Definir valor, descrição e data
- Excluir transações existentes

### 🏷️ Categorias
- Categorias pré-configuradas para receitas e despesas
- Cores personalizadas para identificação visual
- Organização automática por tipo

### 🔐 Autenticação
- Sistema de login seguro
- Criação de contas
- Proteção de rotas com middleware

## 📦 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** ou **npm** (gerenciador de pacotes)
- Conta no **Supabase** ([Criar conta grátis](https://supabase.com))

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositório>
cd FinanFlow_Project-main
```

### 2. Instale as dependências

```bash
pnpm install
```

ou

```bash
npm install
```

### 3. Configure o Supabase

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Crie um novo projeto (se ainda não tiver)
3. Anote a **URL do projeto** e a **anon/public key** (encontre em Settings > API)

### 4. Execute o script SQL

No Supabase, vá em **SQL Editor** e execute o script localizado em:

```
scripts/001_create_financial_tables.sql
```

Este script cria todas as tabelas necessárias:
- `profiles` - Perfis de usuários
- `categories` - Categorias de receitas e despesas
- `transactions` - Transações financeiras
- Políticas de segurança (RLS - Row Level Security)
- Categorias padrão para novos usuários

### 5. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
```

**⚠️ IMPORTANTE:**
- Substitua pelos valores reais do seu projeto Supabase
- A URL deve terminar com `.supabase.co` (não `.com`)
- Nunca commite o arquivo `.env.local` no git

### 6. Inicie o servidor de desenvolvimento

```bash
pnpm dev
```

ou

```bash
npm run dev
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000)

## 📖 Como Usar

### Primeiro Acesso

1. **Criar uma Conta**
   - Acesse a página inicial
   - Clique em "Criar Conta"
   - Preencha email e senha
   - Faça login

2. **Dashboard Automático**
   - Após criar a conta, você será redirecionado para o dashboard
   - Categorias padrão serão criadas automaticamente:
     - **Receitas**: Salário, Freelance, Investimentos
     - **Despesas**: Alimentação, Transporte, Educação, Saúde, Entretenimento

### Adicionar Transações

1. No dashboard, clique em **"Adicionar Transação"**
2. Preencha os campos:
   - **Tipo**: Receita ou Despesa
   - **Categoria**: Selecione uma categoria (filtrará automaticamente por tipo)
   - **Descrição**: Nome/descrição da transação
   - **Valor**: Valor monetário
   - **Data**: Data da transação
3. Clique em **"Adicionar"**
4. A transação aparecerá imediatamente no dashboard

### Visualizar Gastos por Categoria

1. Role até a seção **"Gastos por Categoria"**
2. Veja o total gasto em cada categoria
3. Clique em uma categoria para expandir e ver os gastos individuais
4. Clique novamente para recolher

### Excluir Transações

1. Na lista de transações, localize a transação que deseja excluir
2. Clique no ícone de lixeira (🗑️) ao lado da transação
3. Confirme a exclusão no popup
4. A transação será removida permanentemente

### Entendendo o Dashboard

- **Cards de Resumo**: Mostram receitas (verde), despesas (vermelho) e saldo (azul)
- **Gráfico de Pizza**: Visualização da distribuição percentual de despesas por categoria
- **Lista de Transações**: Últimas transações registradas, ordenadas por data
- **Gastos por Categoria**: Agrupamento completo de todas as despesas por categoria

## 📁 Estrutura do Projeto

```
FinanFlow_Project-main/
├── app/                      # Rotas e páginas (Next.js App Router)
│   ├── api/                  # API Routes
│   │   └── transactions/     # Endpoints de transações
│   ├── dashboard/            # Página do dashboard
│   ├── login/                # Página de login
│   ├── sign-up/              # Página de cadastro
│   └── page.tsx              # Página inicial
├── components/               # Componentes React
│   ├── ui/                   # Componentes de UI (shadcn/ui)
│   ├── add-transaction-form.tsx
│   ├── dashboard-header.tsx
│   ├── expense-chart.tsx
│   ├── expenses-by-category-table.tsx
│   ├── financial-summary.tsx
│   └── transactions-list.tsx
├── lib/                      # Bibliotecas e utilitários
│   └── supabase/             # Clientes Supabase
├── scripts/                  # Scripts SQL
│   └── 001_create_financial_tables.sql
├── public/                   # Arquivos estáticos
├── .env.local                # Variáveis de ambiente (não commitado)
├── package.json
└── README.md
```

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 16** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes de UI
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones

### Backend & Banco de Dados
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Row Level Security (RLS)
  - Autenticação

### Desenvolvimento
- **pnpm** - Gerenciador de pacotes
- **ESLint** - Linter
- **Turbopack** - Bundler rápido

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Inicia servidor de desenvolvimento

# Produção
pnpm build        # Cria build de produção
pnpm start        # Inicia servidor de produção

# Qualidade de Código
pnpm lint         # Executa o linter
```

## 📝 Notas Importantes

### Segurança
- Todas as rotas (exceto login/signup) são protegidas por autenticação
- Row Level Security (RLS) garante que usuários só acessem seus próprios dados
- Variáveis de ambiente nunca devem ser commitadas

### Performance
- Revalidação automática do dashboard (`revalidate = 0`)
- Atualização otimizada usando `router.refresh()`
- Componentes client-side apenas onde necessário

### Limitações
- Categorias são criadas automaticamente para novos usuários
- Não é possível criar/editar categorias pela interface (apenas via SQL)
- Transações são permanentes (sem rascunhos)

## 🐛 Solução de Problemas

### Erro: "Variáveis de ambiente não encontradas"
- Verifique se o arquivo `.env.local` existe na raiz
- Confirme que as variáveis estão com os nomes corretos
- Reinicie o servidor após criar/modificar o `.env.local`

### Erro: "ERR_NAME_NOT_RESOLVED"
- Verifique se a URL do Supabase está correta (deve terminar com `.supabase.co`)
- Confirme que o projeto Supabase está ativo e não pausado
- Teste a URL acessando diretamente no navegador

### Transações não aparecem
- Verifique se executou o script SQL no Supabase
- Confirme que as políticas RLS estão ativas
- Verifique o console do navegador para erros

### Botão de excluir não funciona
- Confirme que está usando Next.js 16 (params são Promise)
- Verifique o console do navegador para erros
- Certifique-se de que a rota de API está correta

## 📚 Recursos Adicionais

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Supabase](https://supabase.com/docs)
- [Documentação shadcn/ui](https://ui.shadcn.com)

## 📄 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

**Desenvolvido com ❤️ usando Next.js e Supabase**
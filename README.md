# CommerceFly

Aplicação completa de e-commerce desenvolvida com foco em arquitetura moderna, boas práticas e integração com serviços reais como autenticação e pagamentos.

---

## Demonstração

> Em breve (adicione aqui o link da sua aplicação em produção)

---

## Sobre o Projeto

Este projeto simula um e-commerce real, permitindo que usuários naveguem por produtos, adicionem itens ao carrinho e realizem compras com pagamento integrado.

Foi desenvolvido com foco em:

- Arquitetura escalável
- Boas práticas de desenvolvimento
- Integração com serviços externos
- Experiência do usuário

---

## Tecnologias Utilizadas

### Front-end

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

### Back-end

- Next.js API Routes / Server Actions
- Node.js

### Banco de Dados

- PostgreSQL
- Prisma ORM

### Autenticação

- Clerk

### Pagamentos

- Stripe

---

## Funcionalidades

### Autenticação

- Login e registro de usuários
- Proteção de rotas privadas
- Controle de sessão com Clerk

### Produtos

- Listagem de produtos
- Filtro por categorias
- Página de detalhes do produto

### Carrinho

- Adicionar/remover produtos
- Atualizar quantidade
- Cálculo de subtotal e total
- Persistência:
  - Usuário logado → banco de dados
  - Usuário não logado → localStorage

### Checkout

- Integração com Stripe
- Criação de sessão de pagamento
- Redirecionamento para checkout seguro

### Webhook (Stripe)

- Confirmação automática de pagamento
- Criação de pedidos no banco
- Armazenamento de itens comprados

### Pedidos

- Listagem de pedidos do usuário
- Visualização de status
- Histórico de compras

### Admin

- CRUD de produtos
- CRUD de categorias
- Controle de acesso por role (ADMIN)

---

## Estrutura do Projeto

```bash
src/
 ├── app/
 │   ├── (public)/
 │   ├── (auth)/
 │   ├── (protected)/
 │   ├── admin/
 │   ├── api/
 │   ├── layout.tsx
 │   ├── globals.css
 │   └── not-found.tsx
 │
 ├── components/
 ├── lib/
 ├── prisma/
 ├── hooks/
 ├── context/

```

## Modelagem do Banco

### Entidades principais:

- User
- Category
- Product
- Cart
- Order
- OrderItem

### Relacionamentos:

- Uma categoria possui vários produtos
- Um usuário possui vários pedidos
- Um pedido possui vários itens

---

## Como Rodar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/ivanrods/commercefly.git
cd commercefly
yarn install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo .env na raiz do projeto:

```bash
DATABASE_URL=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SIGNING_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

### 3. Rodar migrations

```bash
npx prisma migrate dev
npm run dev
```

### 5. Rodar o projeto

```bash
yarn run dev
```

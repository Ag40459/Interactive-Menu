# Interactive Menu — Cardápio Digital (MVP Tirador de Pedidos)

MVP focado em **Next.js 14 (App Router)** com **Tailwind + shadcn/ui + Zustand**.  
Catálogo em `data/menu.json` (fase 1). **Pedidos gravados em Postgres** e exibidos no **painel do lojista**.

## 📦 Stack
- Next.js 14 (App Router)
- Tailwind CSS + shadcn/ui
- Zustand (estado do carrinho)
- PostgreSQL (Vercel Postgres ou Supabase) via Prisma
- API interna:
  - `POST /api/orders` — cria pedido
  - `GET /api/orders?status=` — lista por status
  - `PATCH /api/orders/:id/status` — atualiza status

## 📁 Estrutura (resumo)
app/
├─ (client)/ # app do cliente (cardápio)
│ ├─ layout.tsx
│ ├─ page.tsx # home
│ ├─ cart/page.tsx # carrinho
│ ├─ checkout/page.tsx # pagamento/recebimento
│ ├─ receipt/page.tsx # comprovante
│ └─ _components/
├─ (admin)/dashboard/ # painel do lojista
│ ├─ page.tsx
│ └─ _components/
├─ api/
│ ├─ orders/route.ts
│ └─ orders/[id]/status/route.ts
└─ globals.css
data/menu.json
lib/{cartStore,db,types,validators}.ts
prisma/schema.prisma
public/images/

## 🔧 Variáveis de Ambiente
Crie `.env.local`:

NEXT_PUBLIC_STORE_NAME="Your Store"
NEXT_PUBLIC_WHATSAPP_NUMBER="+5581999999999" # reserva (opcional na fase 1)
PANEL_PASSCODE="admin123" # protege /dashboard
DATABASE_URL="postgres://..." # quando ativar o DB


## 🚀 Executando localmente
```bash
npm install
npm run dev
# http://localhost:3000

☁️ Deploy (Vercel)

GitHub

git init
git add .
git commit -m "chore: initial"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main


Vercel

Add New → Project → Import do GitHub

Configure Environment Variables (ver acima)

Deploy

Domínio do cliente (opcional)

Project → Settings → Domains → Add

Siga as instruções de DNS (CNAME/TXT)

🧭 Telas obrigatórias (fase 1)

Home (Food/Drinks; exibe “Table X” se ?table=12)

Listagem de produtos (grid + categorias)

Carrinho (itens, qty, notas, total)

Pagamento (dinheiro: troco; pix: chave/QR simples)

Modal de endereço (entrega)

Comprovante (número do pedido, itens, valores, destino)

Painel do lojista (/dashboard) — Kanban: Novo → Preparo → Pronto → Entregue/Cancelado

🗺️ Roadmap rápido

Fase 1: catálogo via JSON + pedidos no Postgres + painel por polling

Fase 1.5: Pix “copia e cola” e impressão no painel

Futuro: real-time no painel, CRUD de catálogo, auth completa
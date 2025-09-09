# 🍽️ Cardápio Digital Interativo

Projeto de **Cardápio Digital** para restaurantes, bares e pastelarias,
com integração via QR Code, seleção de mesa, carrinho e checkout.

------------------------------------------------------------------------

## 🚀 Tecnologias

-   **Next.js 15** (App Router, Turbopack)
-   **React 18**
-   **TypeScript**
-   **TailwindCSS**
-   **shadcn/ui**
-   **Node.js** (fs, path)
-   **Vercel** (deploy)
-   Estrutura pronta para **migração futura para banco de dados**

------------------------------------------------------------------------

## 📂 Estrutura de Pastas

    app/
     ├─ (client)/
     │   ├─ menu/page.tsx
     │   ├─ catalog/page.tsx
     │   ├─ cart/page.tsx
     │   ├─ checkout/page.tsx
     │   └─ receipt/page.tsx
     │
     ├─ (admin)/
     │   └─ dashboard/page.tsx
     │
     ├─ api/
     │   ├─ orders/[id]/status/route.ts
     │   ├─ orders/route.ts
     │   └─ qrcode/route.ts
     │
     ├─ layout.tsx      # Layout raiz (com <html> e <body>)
     └─ globals.css

------------------------------------------------------------------------

## 🗂️ Estrutura dos Dados

Agora o cardápio foi dividido em **dois arquivos JSON** dentro da pasta
`data/`:

-   `food.json`
-   `drinks.json`

Cada arquivo segue o formato:

``` json
{
  "categories": [
    { "id": "pastels", "label": "Pasteis" },
    { "id": "combos", "label": "Combos" }
  ],
  "items": [
    {
      "id": "pastel-carne",
      "name": "Pastel de Carne",
      "description": "Pastel frito com carne moída",
      "price": 8.50,
      "image": "/images/products/pastel-carne.jpg",
      "category": "pastels"
    }
  ]
}
```

-   Se `categories` não existir, elas são **derivadas automaticamente**
    dos itens.

------------------------------------------------------------------------

## 🔄 Funcionalidades Implementadas

-   [x] **Divisão JSON** (`food.json` e `drinks.json`)
-   [x] **Categorias automáticas** se não forem fornecidas no JSON
-   [x] **Filtro de categorias**
    -   Sem botão "Apply filter" → já aplica no `onChange`
    -   Reset para `ALL` ao trocar entre comidas e bebidas
-   [x] **Fallback de imagens** (não quebra a página se não encontrar)
-   [x] **Correções de Layout**
    -   `app/(client)/layout.tsx` não contém `<html>/<body>`
    -   Apenas `app/layout.tsx` raiz usa `<html>/<body>`
-   [x] **Rotas de API preparadas**
    -   `/api/orders/[id]/status`
    -   `/api/orders`
    -   `/api/qrcode`
-   [x] **Deploy funcional no Vercel**

------------------------------------------------------------------------

## 🖼️ Interface

-   **Menu inicial** → escolha de mesa e acesso rápido ao cardápio
-   **Catálogo (Comida/Bebida)** → filtro por categorias, grid
    responsivo de produtos
-   **Carrinho** → revisão dos itens
-   **Checkout** → finalização do pedido
-   **Receipt** → recibo simplificado

------------------------------------------------------------------------

## 🛠️ Como rodar localmente

``` bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

------------------------------------------------------------------------

## 🌐 Deploy

O projeto está configurado para deploy no **Vercel**.\
Apenas rodar no terminal:

``` bash
vercel
```

E seguir as instruções (o projeto já está linkado).

------------------------------------------------------------------------

## 📌 Próximos Passos

-   Integração real com **banco de dados**
-   Painel administrativo completo
-   Integração de **pagamentos**

------------------------------------------------------------------------

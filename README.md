# ÉCLAT — Shopping Cart

A polished React shopping cart app built as part of The Odin Project curriculum.

## Features

- **Home page** — landing page with hero, stats strip, and feature highlights
- **Shop page** — product grid fetched from [FakeStore API](https://fakestoreapi.com/), filterable by category, with quantity controls and add-to-cart
- **Cart page** — item list with quantity management, line totals, order summary, free-shipping threshold
- **Navbar** — persistent navigation with live cart item badge
- **Routing** — React Router v6 (`BrowserRouter`)
- **State** — `useReducer`-based `CartContext`
- **Tests** — Vitest + React Testing Library, 30+ assertions across all major components

## Tech Stack

| Tool | Purpose |
|---|---|
| Vite | Build tool |
| React 18 | UI |
| React Router v6 | Client-side routing |
| Vitest | Test runner |
| React Testing Library | Component tests |

## Getting Started

```bash
npm install
npm run dev       # start dev server at http://localhost:5173
npm test          # run tests in watch mode
npm run build     # production build
npm run preview   # preview production build
```

## Deployment

### Netlify
The `public/_redirects` file is already included for SPA routing.

### Vercel
The `vercel.json` file is already included for SPA routing.

### Cloudflare Pages
No additional configuration needed.

## Project Structure

```
src/
├── __tests__/          # All test files
├── components/
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   └── CartItem.jsx
├── context/
│   └── CartContext.jsx  # useReducer cart state
├── hooks/
│   └── useFetch.js      # Generic data fetching hook
├── pages/
│   ├── Home.jsx
│   ├── Shop.jsx
│   └── Cart.jsx
├── App.jsx
├── main.jsx
└── index.css
```

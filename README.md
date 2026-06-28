# Procura — Enterprise Procurement Management

A modern, frontend-only **Procurement Management System** modelled on a hospital
procurement workflow (Material Request → RFQ → Comparison → New Material / Rate
Revision with HOD & CEO sign-off → Purchase Order). Built as a premium enterprise
ERP UI with mock data and ready for real backend API integration.

## Tech Stack

React 19 · TypeScript (strict) · Vite · React Router v7 · TanStack Query ·
TanStack Table · Zustand · React Hook Form · Zod · Tailwind CSS · shadcn-style UI ·
Lucide Icons · Recharts · Framer Motion · ESLint · Prettier.

> 100% TypeScript. No `any`. No JavaScript source files.

## Getting Started

```bash
npm install
npm run dev       # start dev server (http://localhost:5173)
npm run build     # type-check + production build
npm run preview   # preview the production build
npm run lint      # eslint
npm run format    # prettier
```

## Architecture

```
src/
 ├── app/            App root (providers, router, theme)
 ├── components/
 │    ├── ui/        shadcn-style primitives (button, card, modal, drawer…)
 │    ├── common/    composite reusables (DataTable badges, KpiCard, Timeline…)
 │    ├── layout/    Sidebar, Navbar, NotificationDrawer, PageHeader, Breadcrumbs
 │    ├── forms/     FormField, DatePicker, MultiSelect, Autocomplete, FileUpload
 │    ├── tables/    Generic TanStack DataTable + RowActions
 │    └── charts/    Recharts wrappers
 ├── features/       Feature-based pages (dashboard, vendors, items, procurement,
 │                   approvals, analytics)
 ├── hooks/          TanStack Query hooks, theme, media-query
 ├── layouts/        AppLayout shell
 ├── lib/            utils, formatters, axios, queryClient, zod schemas, options
 ├── mocks/          Mock JSON data (vendors, items, MRs, RFQs, POs, …)
 ├── pages/          Standalone pages (Notifications, Profile, NotFound)
 ├── routes/         Path constants, navigation config, router
 ├── services/       Mock service layer (swap for axios calls later)
 ├── store/          Zustand stores (auth/role, theme, ui, toast)
 ├── styles/         Global Tailwind + design tokens
 └── types/          Shared interfaces, enums, API models
```

## Key Features

- **Role-based dashboards** — Purchase / HOD / CEO, switchable via the navbar
  role switcher (mock auth in Zustand).
- **36 routes** across Dashboards, Master Data, Procurement, Approvals & Analytics.
- **Reusable DataTable** with search, sort, pagination, row selection, filters,
  export (UI), action menus, status badges, empty & loading states.
- **Professional forms** (RHF + Zod) for Item, Vendor, Material Request, RFQ,
  New Material, Rate Revision and Purchase Order — with dynamic line items,
  date pickers, multi-select, autocomplete and file-upload UI.
- **Approval workflows** with timeline trails and approve/reject actions.
- **Analytics** with Recharts (spend, category, trend, vendor performance, KPI)
  and an immutable audit log.
- **Dark mode**, responsive layout, mobile navigation, command palette (⌘K),
  notification drawer and subtle Framer Motion animations.

## Backend Integration

All data flows through `src/services/procurement.service.ts`, which currently
returns mock data with simulated latency. Replace the function bodies with
`api.get(...)` calls (see `src/lib/axios.ts`) — the TanStack Query hooks,
types and components require no changes.

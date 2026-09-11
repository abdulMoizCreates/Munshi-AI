# Munshi AI — Technical Architecture v3

## 1. MVP Architecture

```text
React Web App
    |
    +---- Supabase Auth
    |
    +---- Supabase PostgreSQL
    |
    +---- Supabase RLS
```

No custom server is required for the initial MVP.

## 2. Frontend Structure

```text
src/
├── components/
├── layouts/
├── pages/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── sales/
│   ├── khata/
│   ├── products/
│   ├── inventory/
│   ├── customers/
│   ├── orders/
│   ├── offers/
│   └── reports/
├── hooks/
├── lib/
├── services/
├── utils/
├── constants/
└── styles/
```

Feature-oriented organization is preferred.

## 3. App Shell
Authenticated desktop screens share a common shell:

```text
┌────────────────┬─────────────────────────────────────────────┐
│ Munshi AI      │ Search / utilities / notifications / user   │
│                ├─────────────────────────────────────────────┤
│ Dashboard      │ Page heading                  Primary action│
│ Sales          │                                             │
│ Khata          │ Main page content                           │
│ Inventory      │                                             │
│ Products       │                                             │
│ Customers      │                                             │
│ Orders         │                                             │
│ Offers         │                                             │
│ Reports        │                                             │
│                │                                             │
│ Settings       │                                             │
└────────────────┴─────────────────────────────────────────────┘
```

The shell should remain visually stable across routes.

## 4. Authentication
Use Supabase Auth.

Authentication answers:
"Who is this user?"

Authorization answers:
"What is this user allowed to access?"

Never treat frontend state as the security boundary.

## 5. Authorization
Use RLS for shop-owned data.

Every shopkeeper request must be evaluated against the authenticated user and their authorized shop.

Never rely on:
- localStorage
- hidden buttons
- frontend-only route guards
- email comparisons
- client-supplied shop_id without policy validation

## 6. Routing

```text
/
/features
/pricing
/login
/signup

/app
/app/sales
/app/khata
/app/inventory
/app/products
/app/customers
/app/orders
/app/offers
/app/reports

/admin
/admin/shopkeepers
/admin/shops
/admin/plans
/admin/subscriptions
```

## 7. Sale Data Flow

```text
Sale UI
  ↓
Validate input
  ↓
Create sale + sale items
  ↓
Update stock safely
  ↓
Record relevant movement
  ↓
Return updated state
  ↓
Refresh visible UI
```

Financial and inventory consistency is more important than frontend convenience.

## 8. UI Architecture
Create reusable primitives:
- AppShell
- Sidebar
- Header
- PageHeader
- Metric
- DataTable
- StatusBadge
- EmptyState
- FormSection
- SearchInput
- Select
- Button
- Modal/Drawer where genuinely useful
- Toast/feedback

Components should support the same visual language across every page.

## 9. Layout Stability
Dynamic elements must not cause layout shift.

Examples:
- timers
- changing counters
- live statuses
- notifications

Reserve enough width for changing values and use stable containers.

## 10. Future Architecture
Only when justified:

```text
React
  ↓
Node / Express
  ↓
Business Logic API
  ↓
Database
  ↓
AI / Automation / Integrations
```

Do not build this during MVP merely because it may be useful later.

## 11. Environment Security
Never expose service-role credentials in the browser.

Only browser-safe Supabase configuration may be used client-side.

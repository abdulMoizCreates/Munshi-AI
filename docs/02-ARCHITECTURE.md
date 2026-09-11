# Munshi AI — Technical Architecture

## 1. Current Architecture

```text
React Application
       |
       v
Supabase
  |-- Authentication
  |-- PostgreSQL Database
  |-- Row Level Security (RLS)
  |-- Storage / other Supabase services when needed
```

There is NO custom backend in the MVP.

## 2. Frontend
Recommended structure:

```text
src/
├── components/
├── pages/
├── layouts/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── products/
│   ├── customers/
│   ├── khata/
│   ├── sales/
│   ├── inventory/
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

Feature-oriented organization is preferred as the application grows.

## 3. Authentication
Use Supabase Auth.

Authentication answers:
"Who is this user?"

Authorization answers:
"What is this user allowed to do?"

Never rely on localStorage, frontend-only role checks, hidden buttons, or email comparisons for security.

## 4. Authorization
Use database-level Row Level Security.

Every shop-owned record must be associated with a shop.

Conceptually:

```text
user
  |
  +-- profile
        |
        +-- role
        +-- shop_id
```

Shopkeeper queries must only return rows belonging to their shop.

Admin policies can provide platform-level access.

## 5. Routing
Conceptual routes:

```text
/
 /features
 /pricing
 /login
 /signup

 /app
 /app/products
 /app/customers
 /app/khata
 /app/sales
 /app/inventory
 /app/orders
 /app/offers
 /app/reports

 /admin
 /admin/shopkeepers
 /admin/shops
 /admin/plans
```

Routes must be protected by authentication and authorization.

## 6. Data Flow Example: Sale

```text
Shopkeeper
   ↓
React Sale UI
   ↓
Validate input
   ↓
Supabase
   ↓
Database transaction / safe operation
   ↓
Sale record + sale items + stock update
   ↓
Updated UI
```

Data integrity is more important than convenience.

## 7. Future Architecture

Only when justified:

```text
React
  ↓
Node + Express
  ↓
Business Logic / API
  ↓
Database
  ↓
AI / Agent Layer
  ↓
n8n / Automations
  ↓
External integrations
```

Do not prematurely implement this architecture in the MVP.

## 8. Environment Variables
Never expose service-role keys or privileged credentials in the frontend.

Only browser-safe Supabase configuration may be exposed to the React client.

## 9. Architecture Principle
Build the MVP simply, but avoid decisions that make future extraction of business logic impossible.

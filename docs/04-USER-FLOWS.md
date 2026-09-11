# Munshi AI — User Flows v3

## 1. Guest

```text
Landing
  ↓
Features / Pricing
  ↓
Login or Signup
```

## 2. Shopkeeper Onboarding

```text
Signup
  ↓
Create Shop
  ↓
Dashboard
```

Keep onboarding short.

## 3. Login

```text
Login
  ↓
Authenticated
  ↓
Authorized Role
  ├── shopkeeper → /app
  └── admin → /admin
```

## 4. Dashboard

```text
Dashboard
  ↓
See today's business
  ├── Sales
  ├── Khata outstanding
  ├── Stock attention
  └── Recent activity
```

The dashboard is an overview, not a place for every possible operation.

## 5. Add Product

```text
Products
  ↓
Naya Product
  ↓
Enter details
  ↓
Save
  ↓
Products list
```

## 6. Record Sale

```text
Sales
  ↓
Search product
  ↓
Add item
  ↓
Set quantity
  ↓
Review total
  ↓
Optional customer
  ↓
Payment status
  ↓
Confirm sale
  ↓
Inventory updates
```

The sale workflow should require as few unnecessary steps as possible.

## 7. Khata Payment

```text
Khata
  ↓
Select customer
  ↓
View outstanding balance
  ↓
Record payment
  ↓
Balance updates
  ↓
Transaction appears in history
```

## 8. Inventory Adjustment

```text
Inventory
  ↓
Select product
  ↓
Adjust stock
  ↓
Enter reason
  ↓
Save
  ↓
Stock + movement history update
```

## 9. Customer

```text
Customers
  ↓
Select customer
  ↓
Overview
  ├── balance
  ├── transactions
  └── purchase history
```

## 10. Orders

```text
Orders
  ↓
Create / open order
  ↓
Customer + items
  ↓
Review amount
  ↓
Save
  ↓
Manage status
```

## 11. Admin

```text
Admin
  ├── Platform Overview
  ├── Shopkeepers
  ├── Shops
  ├── Plans
  └── Subscriptions
```

Admin screens should use the same visual language but can have denser information because their job is platform management.

# Munshi AI — User Flows

## 1. Guest Flow

```text
Open Munshi
  ↓
Landing Page
  ├── Features
  ├── Pricing
  ├── About
  ├── Login
  └── Sign Up
```

Guest has no private application access.

## 2. Shopkeeper Onboarding

```text
Sign Up
  ↓
Verify / establish session
  ↓
Create Shop Profile
  ↓
Choose Language
  ↓
Dashboard
  ↓
Add First Product / Customer
```

Onboarding should be short and progressive.

## 3. Login Flow

```text
Login
  ↓
Supabase Auth
  ↓
Authenticated User
  ↓
Read authorized profile/role
  ↓
role?
 ├── admin → Admin Dashboard
 └── shopkeeper → Shopkeeper Dashboard
```

## 4. Add Product

```text
Products
  ↓
Add Product
  ↓
Name + price + stock + threshold
  ↓
Validate
  ↓
Save
  ↓
Product appears in list
```

## 5. Record Sale

```text
New Sale
  ↓
Select product
  ↓
Quantity
  ↓
Add more items
  ↓
Select customer (optional)
  ↓
Payment method/status
  ↓
Review total
  ↓
Confirm
  ↓
Create sale
  ↓
Create sale items
  ↓
Update inventory
  ↓
Optional khata entry if credit
  ↓
Success confirmation
```

## 6. Khata Payment

```text
Customer
  ↓
Khata
  ↓
Record Payment
  ↓
Amount
  ↓
Confirm
  ↓
New transaction
  ↓
Updated balance
```

## 7. Admin Flow

```text
Admin Login
  ↓
Admin Dashboard
  ├── Shopkeepers
  ├── Shops
  ├── Plans
  └── Platform overview
```

Admin can manage platform-level entities but should not casually bypass security controls.

## 8. Error/Empty States
Every major screen needs:
- Loading state
- Empty state
- Error state
- Success feedback
- Retry/recovery path

Never leave users staring at a blank screen.

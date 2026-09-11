# Munshi AI — Database Schema

## 1. Database
Supabase PostgreSQL is the database for the initial MVP.

## 2. Core Entities

```text
profiles
shops
products
customers
sales
sale_items
khata_entries
stock_movements
orders
order_items
offers
subscriptions
plans
```

## 3. profiles
Purpose: application-level information about authenticated users.

Suggested fields:
- id (uuid, references auth.users)
- full_name
- role (`admin` | `shopkeeper`)
- shop_id (nullable for admin)
- preferred_language (`en` | `roman_urdu`)
- created_at
- updated_at

## 4. shops
Suggested fields:
- id
- owner_id
- shop_name
- phone
- address
- created_at
- updated_at

A shopkeeper normally owns one shop in the MVP.

## 5. products
Suggested fields:
- id
- shop_id
- name
- sku (optional)
- category_id (optional future)
- cost_price
- selling_price
- stock_quantity
- low_stock_threshold
- unit
- is_active
- created_at
- updated_at

## 6. customers
Suggested fields:
- id
- shop_id
- name
- phone
- address (optional)
- notes (optional)
- created_at
- updated_at

## 7. sales
Suggested fields:
- id
- shop_id
- customer_id (nullable)
- total_amount
- payment_method
- payment_status
- created_at

## 8. sale_items
Suggested fields:
- id
- sale_id
- product_id
- quantity
- unit_price
- subtotal

## 9. khata_entries
Suggested fields:
- id
- shop_id
- customer_id
- type (`credit` | `payment` | `debit` as business rules require)
- amount
- description
- reference_sale_id (nullable)
- created_at

The exact balance model should be finalized before implementation.

## 10. stock_movements
Suggested fields:
- id
- shop_id
- product_id
- type (`sale` | `purchase` | `adjustment` | `return`)
- quantity
- reference_id (nullable)
- note
- created_at

## 11. orders
Suggested fields:
- id
- shop_id
- customer_id (nullable)
- status
- total_amount
- notes
- created_at
- updated_at

## 12. order_items
Suggested fields:
- id
- order_id
- product_id
- quantity
- unit_price
- subtotal

## 13. offers
Suggested fields:
- id
- shop_id
- title
- description
- discount_type
- discount_value
- starts_at
- ends_at
- is_active
- created_at
- updated_at

## 14. plans / subscriptions
These will support monetization.

The exact billing provider and schema should be finalized when payment integration is actually implemented.

## 15. Critical Database Rules
- Every shop-owned table must have `shop_id` directly or through a secure relationship.
- Enable RLS on all private tables.
- Shopkeepers can only SELECT/INSERT/UPDATE/DELETE their own shop data according to business rules.
- Admin permissions must be explicitly defined.
- Never trust client-provided `shop_id` for authorization.
- Prefer database constraints for data integrity.
- Monetary values require appropriate numeric types; avoid floating-point money calculations.

## 16. Important Implementation Note
Sales and stock changes must remain consistent. If a sale reduces stock, the implementation must prevent partial updates that could create incorrect inventory.

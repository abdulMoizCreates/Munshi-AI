# Munshi AI — Database Schema v3

## 1. Core Tables

### profiles
- id
- full_name
- phone
- role
- shop_id
- created_at

Roles:
- shopkeeper
- admin

### shops
- id
- name
- owner_id
- phone
- address
- created_at

### products
- id
- shop_id
- name
- sku
- selling_price
- cost_price
- stock_quantity
- low_stock_threshold
- created_at
- updated_at

### customers
- id
- shop_id
- name
- phone
- address
- created_at
- updated_at

### sales
- id
- shop_id
- customer_id
- total_amount
- payment_status
- created_at

### sale_items
- id
- sale_id
- product_id
- quantity
- unit_price
- subtotal

### khata_entries
- id
- shop_id
- customer_id
- type
- amount
- note
- created_at

### stock_movements
- id
- shop_id
- product_id
- type
- quantity
- note
- created_at

### orders
- id
- shop_id
- customer_id
- status
- total_amount
- created_at

### order_items
- id
- order_id
- product_id
- quantity
- unit_price
- subtotal

### offers
- id
- shop_id
- title
- description
- discount_type
- discount_value
- start_at
- end_at
- active

### plans
- id
- name
- price
- billing_period
- features

### subscriptions
- id
- shop_id
- plan_id
- status
- trial_start
- trial_end
- started_at
- ends_at

## 2. Ownership
Shop-owned records must be linked to a shop.

Where practical, use direct `shop_id` columns to make RLS policies explicit and easy to audit.

## 3. RLS
Enable RLS on private tables.

Policies must derive authorization from the authenticated user's trusted relationship to the shop.

## 4. Money
Use exact numeric/decimal types for money.

Do not use floating-point values for financial amounts.

## 5. Inventory Integrity
A sale should not silently create inconsistent stock.

Stock changes should have traceable movement records where required.

## 6. Schema Evolution
Keep the MVP schema simple.

Do not create tables for future AI agents, automation jobs, WhatsApp workflows or analytics pipelines until those features are actually implemented.

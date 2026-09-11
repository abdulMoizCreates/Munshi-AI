# Munshi AI — Recommended Implementation Order

## Step 1 — Project Foundation
- React setup
- Environment variables
- Supabase client
- Base styling
- Routing
- Layout system

## Step 2 — Authentication
- Signup
- Login
- Logout
- Session handling
- Protected routes

## Step 3 — Roles & Shop Setup
- Profiles
- Admin/shopkeeper roles
- Shop creation
- Initial RLS policies

## Step 4 — Application Shell
- Shopkeeper dashboard shell
- Admin dashboard shell
- Navigation
- Responsive mobile navigation

## Step 5 — Products
- Product database
- CRUD
- Stock quantity
- Low-stock threshold

## Step 6 — Customers
- Customer CRUD
- Customer detail page

## Step 7 — Khata
- Transactions
- Balance
- Payment recording
- History

## Step 8 — Sales
- Cart/sale creation
- Sale items
- Payment state
- Customer association
- Inventory update
- Khata integration

## Step 9 — Inventory
- Stock movement history
- Adjustments
- Low-stock states

## Step 10 — Dashboard
Build dashboard metrics from real data rather than mock data.

## Step 11 — Orders & Offers
Implement after the core transaction system is stable.

## Step 12 — Reports
Build basic useful reports.

## Step 13 — Localization
Polish English and Roman Urdu across the product.

## Step 14 — Admin
Expand platform-management capabilities.

## Step 15 — Production Hardening
- RLS audit
- Validation
- Error handling
- Mobile testing
- Performance
- Security
- Deployment

## Rule
Do not build the entire UI first and connect the database at the end. Build feature slices end-to-end so the real data model informs the UI.

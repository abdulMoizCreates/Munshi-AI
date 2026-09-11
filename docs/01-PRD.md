# Munshi AI — Product Requirements Document

## 1. Product Overview
Munshi AI is a mobile-first SaaS application for Pakistani general-store shopkeepers. It helps replace manual khata, sales, inventory and stock-management processes with a simple digital system.

The initial product is built with React and Supabase. The MVP intentionally does not use a custom Node/Express backend, MongoDB, n8n, automations, or agentic workflows.

## 2. Vision
Make everyday shop management simple enough that an average Pakistani shopkeeper can use it without needing technical expertise.

## 3. Target Users
### Primary
Pakistani general-store / kiryana shopkeepers.

### Secondary
Platform administrator who operates Munshi AI.

### Public
Guests visiting the website before authentication.

## 4. Core Product Principles
- Mobile-first
- Extremely simple UX
- Fast data entry
- Minimal cognitive load
- Practical over decorative
- Roman Urdu support alongside English
- Strong data isolation between shops
- Secure authorization at the database level
- Build the MVP before advanced AI/automation

## 5. Roles
### Guest
Unauthenticated visitor. Can access public pages such as landing, features, pricing and authentication screens.

### Shopkeeper
Authenticated user who can manage only their own shop's data:
- Dashboard
- Products
- Inventory
- Stock
- Sales
- Customers
- Khata
- Orders
- Offers
- Reports

### Admin
Platform owner/operator. Can manage shopkeepers, shops, subscriptions/plans and platform-level information.

Admin must authenticate like every other privileged user. Authorization determines access after authentication.

## 6. MVP Features
### Authentication
- Sign up
- Login
- Logout
- Session persistence
- Role-based routing

### Shopkeeper Dashboard
- Today's sales
- Outstanding khata
- Low-stock products
- Quick actions
- Useful summary metrics

### Products
- Create product
- Edit product
- Delete/archive product
- Selling price
- Cost price
- Stock quantity
- Low-stock threshold

### Customers
- Create customer
- Edit customer
- Contact information
- Purchase history
- Current khata balance

### Khata
- Credit/debit entries
- Payments
- Transaction history
- Customer balance

### Sales
- Create sale
- Add products and quantities
- Calculate total
- Associate customer
- Payment status
- Update inventory

### Inventory
- Current stock
- Stock adjustments
- Low-stock indicators
- Stock history

### Orders
- Record/manage orders
- Order status
- Customer association

### Offers
- Create basic offers
- Display/manage active offers

### Reports
- Daily sales
- Monthly sales
- Top products
- Basic business summaries

### Admin
- View/manage shopkeepers
- View/manage shops
- Platform-level overview
- Subscription/plan management foundation

## 7. Non-MVP / Future
- Custom Node/Express backend
- MongoDB migration if justified
- n8n automation
- WhatsApp/SMS integrations
- AI business assistant
- Agentic workflows
- Smart inventory prediction
- Automated reminders
- Advanced analytics
- Multi-branch management
- Employee/staff roles

## 8. Monetization
Initial model:
- 2-month free trial
- Paid plans after trial
- Higher-priced plan provides additional features and automation/intelligence.

Exact pricing will be finalized after MVP validation.

## 9. Success Criteria
MVP should allow a shopkeeper to:
1. Create an account.
2. Set up their shop.
3. Add products.
4. Add customers.
5. Record sales.
6. Record khata transactions.
7. See updated stock.
8. Understand their basic business performance from the dashboard.

## 10. Key UX Requirement
A shopkeeper should be able to complete common tasks quickly with minimal typing and navigation.

The interface should feel closer to a simple calculator/ledger/business assistant than enterprise ERP software.

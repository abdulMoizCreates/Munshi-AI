# Munshi AI — Product Requirements Document v3

## 1. Product Overview
Munshi AI is a SaaS web application for Pakistani general-store / kiryana shopkeepers.

Its purpose is to make everyday shop management simple:
- record sales
- manage products
- track inventory
- manage customer khata
- manage orders
- create offers
- understand basic business performance

The product should be approachable for a shopkeeper who is not highly technical.

## 2. Product Vision
Make shop management feel as easy as having a reliable munshi sitting beside the shopkeeper.

## 3. Target Users

### Primary
Pakistani general-store / kiryana shopkeepers.

### Secondary
Munshi AI platform administrators.

### Public
Guests visiting the marketing website before authentication.

## 4. Product Principles
1. Simplicity before feature count.
2. Speed before decoration.
3. Useful information before visual effects.
4. Trust before novelty.
5. Desktop-first web design.
6. Natural English/Roman Urdu language.
7. Database-level security.
8. MVP first; advanced architecture later.

## 5. Roles

### Guest
Unauthenticated visitor. Can access:
- landing page
- features
- pricing
- login
- signup

### Shopkeeper
Authenticated user with access only to their shop:
- dashboard
- sales
- khata
- inventory
- products
- customers
- orders
- offers
- reports

### Admin
Platform operator with platform-level permissions.

Admin must never be self-assigned through public signup.

## 6. MVP Features

### Authentication
- signup
- login
- logout
- session persistence
- protected routes

### Dashboard
The dashboard should answer four questions quickly:
1. How much did I sell?
2. How much money is outstanding in khata?
3. What needs attention in stock?
4. What happened recently?

Dashboard sections should include:
- compact summary metrics
- sales overview
- recent sales/activity
- top-selling products
- inventory attention
- useful quick actions

Do not create a wall of KPI cards.

### Sales
- create sale
- search/select products
- set quantity
- calculate subtotal/total
- optional customer
- payment status
- update stock

### Khata
- customer balances
- credit/debit entries
- payment records
- transaction history

### Products
- create
- edit
- archive/delete
- selling price
- cost price
- stock
- low-stock threshold

### Customers
- create/edit
- phone/contact information
- purchase history
- khata balance

### Inventory
- current stock
- low-stock status
- stock adjustments
- stock movement history

### Orders
- create/manage orders
- customer association
- status
- total amount

### Offers
- create/edit
- activate/deactivate
- start/end dates
- discount information

### Reports
- daily sales
- monthly sales
- top products
- basic business summaries

### Admin
- shopkeepers
- shops
- plans
- subscriptions
- platform overview

## 7. Future Features
Only after MVP validation:
- AI assistant
- smart predictions
- WhatsApp/SMS
- automated reminders
- n8n
- agentic workflows
- advanced analytics
- staff roles
- multi-branch
- custom backend

## 8. Monetization
Initial direction:
- 2-month free trial
- paid plans after trial
- higher plan can later unlock intelligence/automation features

Exact pricing remains a business-validation decision.

## 9. UX Success Criteria
A shopkeeper should be able to:
1. sign up
2. create a shop
3. add products
4. add customers
5. record a sale
6. record a khata payment
7. see stock change
8. understand the day's business from the dashboard

## 10. UI Success Criteria
The UI is successful when it feels:
- clean
- modern
- minimal
- trustworthy
- easy to scan
- visually balanced
- intentionally designed

It fails when it feels:
- AI-generated
- cluttered
- overly futuristic
- enterprise-heavy
- decorative
- card-heavy

## 11. Desktop-First Requirement
Desktop/laptop is the primary design target.

The interface should use horizontal space intelligently for:
- tables
- sales workflows
- dashboard sections
- reports

Mobile is responsive, not the source of the information architecture.

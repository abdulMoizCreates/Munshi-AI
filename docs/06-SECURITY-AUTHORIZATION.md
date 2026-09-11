# Munshi AI — Security & Authorization

## 1. Core Principle
Authentication and authorization are different.

Authentication:
"Who are you?"

Authorization:
"What are you allowed to do?"

## 2. Authentication
Supabase Auth is the source of authentication.

Use:
- Secure login
- Secure signup
- Session management
- Logout
- Password recovery when implemented

## 3. Roles
Allowed application roles:
- admin
- shopkeeper

Guest is an unauthenticated state, not a privileged database role.

## 4. Role Assignment
Users must NOT be able to choose `admin` during public signup.

Admin accounts must be provisioned through a trusted process.

## 5. Row Level Security
RLS is mandatory for private business data.

Example conceptual rule:

```text
shopkeeper can access row
ONLY IF
row.shop_id belongs to authenticated user's shop
```

Do not rely on:
- React conditional rendering
- URL parameters
- hidden buttons
- localStorage role values
- client-supplied shop IDs

## 6. Admin Access
Admin permissions must be explicitly represented and enforced.

Admin should be able to manage platform resources according to defined policies.

## 7. Secrets
Never put:
- Supabase service-role key
- private API secrets
- payment secrets
- privileged credentials

in frontend source code.

## 8. Input Validation
Validate:
- Required fields
- Numeric values
- Quantity
- Prices
- Phone formats where appropriate
- UUIDs / identifiers
- Business constraints

Frontend validation improves UX.
Database constraints/RLS provide security.

## 9. Financial Data
Money calculations should avoid floating-point errors.

Use suitable PostgreSQL numeric types and consistent rounding rules.

## 10. Auditability
For important business actions, consider storing:
- created_at
- updated_at
- actor/user ID
- references to originating transaction

Detailed audit logs can be expanded later.

## 11. Security Review Checklist
Before production:
- RLS enabled everywhere required
- Policies tested with multiple users
- Admin access tested
- Shopkeeper cross-shop access tested
- Service-role credentials protected
- Validation tested
- Unauthorized routes tested
- Error messages do not leak secrets

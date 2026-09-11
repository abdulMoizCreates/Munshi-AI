# Munshi AI — Security & Authorization v3

## 1. Core Rule
Authentication identifies a user.

Authorization decides what the user may access.

Never confuse the two.

## 2. Roles
- guest
- shopkeeper
- admin

Guest is unauthenticated.

Shopkeeper and admin are authenticated roles.

## 3. Shop Isolation
Shopkeeper A must never read or modify Shopkeeper B's data.

RLS is the database security boundary.

## 4. Never Trust
Do not use these as authorization:
- frontend role variables
- localStorage
- URL parameters
- hidden buttons
- email comparisons
- client-supplied shop_id alone

## 5. Admin
Admin access must be granted through a trusted administrative mechanism.

Public signup must never allow a user to choose `admin`.

## 6. Financial Operations
Sales, payments, khata entries and inventory updates require careful consistency.

The UI must not claim success until the relevant database operation succeeds.

## 7. Secrets
Never expose:
- Supabase service-role key
- privileged API keys
- server-only credentials

in frontend code.

## 8. Validation
Validate input on the client for usability.

Do not treat client validation as the security boundary.

Database constraints and authorization policies remain authoritative.

## 9. Error Handling
Do not expose sensitive database details to shopkeepers.

Show simple user-facing errors and log/debug technical information appropriately during development.

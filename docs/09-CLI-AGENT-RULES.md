# Munshi AI — CLI Coding Agent Rules

## Project Context
Munshi AI is a real SaaS product for Pakistani general-store shopkeepers.

## Current Stack
- React
- Supabase
- PostgreSQL through Supabase
- Supabase Auth
- Supabase RLS

## Explicitly NOT in Current MVP
- Node.js custom backend
- Express.js API
- MongoDB
- n8n
- Agentic workflows
- Automation engine

Do not introduce these technologies unless explicitly requested.

## Coding Principles
1. Prefer simple solutions.
2. Do not over-engineer.
3. Keep components maintainable.
4. Reuse components where appropriate.
5. Keep feature logic organized.
6. Never bypass RLS for convenience.
7. Never put privileged Supabase credentials in the client.
8. Validate user input.
9. Handle loading, empty, error and success states.
10. Keep mobile UX as the primary concern.
11. Do not hardcode role-based security in the frontend.
12. Avoid unnecessary dependencies.

## Database Rules
- Use Supabase PostgreSQL.
- Enable RLS for private tables.
- Every shop-owned record must be safely associated with its shop.
- Never trust a client-provided shop_id for authorization.
- Protect financial consistency.

## Role Rules
- Guest = unauthenticated public visitor.
- Shopkeeper = access to own shop.
- Admin = platform-level access.
- Public signup must never allow self-assigned admin privileges.

## UI Rules
- Mobile first.
- Simple language.
- English + Roman Urdu.
- Clear touch targets.
- Strong hierarchy.
- Avoid unnecessary visual complexity.

## Development Workflow
For every feature:
1. Understand requirement.
2. Inspect existing code.
3. Plan minimal implementation.
4. Implement.
5. Test happy path.
6. Test validation/error states.
7. Test authorization.
8. Review for regressions.
9. Keep code clean.

## Important
Do not invent missing requirements silently. If a requirement materially affects architecture or data integrity, ask for clarification or document the assumption.

# Munshi AI — CLI / Coding Agent Rules v3

## 1. Architecture Rules
- Use React for the MVP frontend.
- Use Supabase for auth and database.
- Do not add Node/Express unless explicitly approved.
- Do not add MongoDB.
- Do not add n8n.
- Do not add agentic workflows.
- Do not create unnecessary backend layers.

## 2. Security Rules
- RLS is mandatory for shop-owned data.
- Never use frontend checks as the only authorization.
- Never expose service-role credentials.
- Never allow public signup to assign admin.

## 3. UI Rules
The approved visual direction is:
- clean
- minimal
- modern
- desktop-first
- calm
- practical
- premium
- restrained

Avoid:
- AI aesthetics
- sparkles
- random dots
- random symbols
- gradients everywhere
- glassmorphism
- excessive cards
- card-inside-card
- huge KPI walls
- decorative illustrations
- unnecessary animation

## 4. Layout Rules
- Persistent desktop sidebar.
- Clean top utility area.
- Spacious main content.
- Tables for desktop data-heavy screens.
- One primary action per screen.
- Keep layouts stable.

## 5. Dynamic UI
Timers, counters and changing states must not cause layout shift.

Use fixed dimensions and reserved space.

## 6. Component Reuse
Prefer reusable components over duplicated page-specific UI.

## 7. Data Integrity
Never fake success.

Only update UI state as successful after the underlying operation succeeds.

## 8. Before Adding a Feature
Ask:
1. Is it required by the MVP?
2. Does it simplify a real shopkeeper workflow?
3. Does it fit the approved design system?
4. Does it create unnecessary architecture?

If not, do not add it.

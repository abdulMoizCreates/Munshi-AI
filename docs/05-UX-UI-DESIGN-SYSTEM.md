# Munshi AI — UX/UI Design System v3

## 1. Approved Visual Direction

The supplied reference is now the primary visual direction for the application.

The design language can be summarized as:

> **Minimal business dashboard + soft modern SaaS + purposeful color + strong spacing + restrained rounded surfaces.**

The goal is not to copy another product. The goal is to reproduce the same level of simplicity, balance and visual confidence.

## 2. Visual Personality

Munshi AI should feel:
- modern
- calm
- reliable
- friendly
- professional
- lightweight
- practical
- premium without being luxurious

It should NOT feel:
- futuristic
- robotic
- AI-generated
- corporate ERP
- childish
- overly playful
- visually noisy

## 3. Layout

### Desktop
Use a persistent left sidebar.

Approximate structure:

```text
Sidebar 240–270px
Main content = remaining width

Top utility bar
↓
Page header
↓
Main content sections
```

Do not squeeze the main content.

### Main Content
Use a comfortable maximum content width when appropriate, while allowing tables and business workflows to use available width.

## 4. Sidebar

The sidebar should be visually quiet.

Include:
- Munshi AI brand/logo area
- Dashboard
- Sales
- Products
- Inventory
- Customers
- Khata
- Orders
- Offers
- Reports

Separate:
- Settings
- profile/account

Active navigation should use a soft filled state rather than a loud border or gradient.

Avoid:
- giant icons
- decorative symbols
- random badges
- excessive navigation sections

## 5. Header

The header should contain only useful utilities:
- global search
- notifications
- profile/shop identity

Search should feel like a utility, not a giant hero element.

## 6. Page Header

Use:
- small contextual greeting or breadcrumb where useful
- clear page title
- one short supporting sentence when needed
- one primary action

Example:

**Good morning, Abdul.**
**Here's what's happening at your shop today.**

Supporting line:
**Keep track of sales, stock and your business performance.**

Do not write long explanatory copy inside the app.

## 7. Dashboard Layout

Recommended composition:

```text
Page Header
────────────────────────────────────────

Small summary metrics
────────────────────────────────────────

Sales Overview          Top Selling Products
────────────────────    ────────────────────

Recent Sales            Inventory Status
────────────────────    ────────────────────
```

The exact grid may change, but the principle stays:
**few sections, strong hierarchy, no dashboard wall.**

## 8. Metric Cards

Use a small number of metrics.

Each metric should have:
- subtle icon container
- label
- primary number
- small trend/context line

Do not put a chart inside every metric.

Use accent colors sparingly.

## 9. Cards / Surfaces

Cards should be:
- white/near-white
- lightly bordered or subtly shadowed
- moderately rounded
- spacious internally

Avoid:
- extreme corner radii
- thick borders
- heavy shadows
- cards nested inside cards

## 10. Color Strategy

Brand colors are still not permanently locked.

The approved interaction principle is:

**neutral foundation + small purposeful accents.**

Possible semantic/accent roles:
- primary brand accent
- positive/success
- warning
- danger
- informational accent
- optional secondary accent

Accent colors should communicate meaning or establish hierarchy.

Do not color every component.

Avoid rainbow dashboards.

## 11. Typography

Use a modern, highly readable sans-serif.

Hierarchy:
- page title: strong and prominent
- section title: medium/semibold
- body: comfortable reading size
- metadata: smaller and quieter
- financial values: large, high contrast

Numbers should be especially legible.

## 12. Spacing

Use consistent spacing tokens.

Suggested base rhythm:
- 4
- 8
- 12
- 16
- 20
- 24
- 32
- 40

Do not use arbitrary spacing for every component.

## 13. Radius

Use restrained rounded corners.

Suggested:
- controls: 8–12px
- cards: 14–18px
- larger panels: 18–22px

Do not make every object pill-shaped.

## 14. Borders and Shadows

Prefer subtle borders and very soft shadows.

The UI should still look clean if shadows are removed.

## 15. Icons

Use one consistent outline icon family.

Icons should:
- support recognition
- remain visually quiet
- have consistent stroke weight

Do not use decorative icons simply to fill space.

## 16. Tables

Tables are important for desktop.

Prioritize:
- readable rows
- sufficient horizontal spacing
- clear column labels
- subtle dividers
- obvious row actions
- status badges only where useful

Avoid excessive zebra striping and excessive borders.

## 17. Charts

Charts should answer a business question.

Examples:
- sales over time
- top products
- inventory status

Use restrained visual treatment.

Do not add charts just because empty space exists.

## 18. Forms

Forms should be:
- short
- grouped logically
- easy to scan
- clearly labeled

Use one primary action.

Do not turn simple forms into multi-step wizards.

## 19. Buttons

Primary button:
- clear
- visually prominent
- not oversized

Secondary actions:
- quieter

Destructive actions:
- clearly differentiated

Avoid multiple competing primary buttons.

## 20. Interaction

Interaction should feel smooth but quiet.

Use:
- hover states
- focus states
- pressed states
- subtle transitions

Avoid:
- bouncing elements
- flashy animations
- floating decorations
- layout-shifting live widgets

## 21. Dynamic Content / Timer Rule

Any timer, live counter or changing status must use a fixed-size container.

Reserve enough width for the largest expected value.

If numeric values change, use tabular/monospaced numerals where appropriate.

**No layout shift.**

## 22. Empty States
Empty states should explain:
- what is missing
- why it matters
- what the user can do next

Keep them simple.

## 23. Loading
Prefer:
- skeletons
- stable placeholders
- minimal spinners where appropriate

Never let loading states radically change layout dimensions.

## 24. Error / Success
Feedback should be:
- immediate
- concise
- understandable

Avoid technical error messages for shopkeepers.

## 25. Responsive Design

Desktop is primary.

### Tablet
- compact sidebar
- reduced spacing
- preserve tables where practical

### Mobile
- stack sections
- adapt tables into readable layouts
- preserve same navigation concepts
- maintain clear primary actions

Do not redesign the product as a mobile-first app.

## 26. Design Guardrails

Never introduce without a real product reason:
- decorative dots
- random symbols
- sparkles
- AI/robot graphics
- gradients everywhere
- glassmorphism
- excessive cards
- card-inside-card
- huge KPI walls
- giant illustrations
- oversized empty areas
- unnecessary modals
- excessive floating buttons

## 27. Quality Test

Before approving a screen, ask:

1. Can I understand the screen in 3 seconds?
2. Is the primary action obvious?
3. Is there anything decorative that does not help?
4. Does the layout feel balanced?
5. Are numbers and business data easy to scan?
6. Does it look like a real business product rather than AI-generated UI?
7. Does anything move or shift unexpectedly?

# Munshi AI — Localization Strategy

## Supported Languages
1. English (`en`)
2. Roman Urdu (`roman_urdu`)

## Principles
Roman Urdu is not a literal English translation.

The goal is natural language understood by the target Pakistani shopkeeper.

## Examples

| English | Roman Urdu |
|---|---|
| Dashboard | Dashboard |
| Add Customer | Naya Customer |
| Customers | Customers |
| Inventory | Stock |
| Outstanding Balance | Baqi Raqam |
| Record Payment | Payment Jama Karein |
| Today's Sales | Aaj Ki Sale |
| Low Stock | Stock Kam Hai |
| Total Sales | Kul Sale |

These are starting examples. Validate terminology with real target users.

## Implementation
Do not hardcode user-facing strings throughout components.

Use a centralized translation structure, for example:

```text
translations/
  en.ts
  romanUrdu.ts
```

Example concept:

```js
t("dashboard.todaySales")
```

## Rules
- Keep terminology consistent.
- Do not translate product names or user-entered data.
- Numbers and currency should follow appropriate formatting.
- UI labels should remain short.
- Roman Urdu spelling can vary; choose one consistent product vocabulary.

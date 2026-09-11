# Munshi AI — Localization v3

## 1. Languages
MVP UI should support:
- English
- natural Roman Urdu

## 2. Language Philosophy
Roman Urdu should sound like a Pakistani shopkeeper/business user would naturally understand it.

Avoid literal machine translations.

Good:
- Naya Customer
- Naya Product
- Baqi Raqam
- Stock Kam Hai
- Aaj ki Sales
- Payment Jama Karein

Avoid awkward literal translations.

## 3. Terminology
Use consistent terms.

| English | Roman Urdu |
|---|---|
| Dashboard | Dashboard |
| Sales | Sales |
| Customer | Customer |
| Products | Products |
| Inventory | Stock |
| Khata | Khata |
| Outstanding Balance | Baqi Raqam |
| Low Stock | Stock Kam Hai |
| Add Customer | Naya Customer |
| Add Product | Naya Product |
| Record Payment | Payment Jama Karein |
| Total Sales | Kul Sales |

## 4. UI Design Implication
Layouts must tolerate different text lengths.

Do not hard-code widths around English-only labels.

## 5. Numbers
Financial numbers should remain highly readable.

Use Pakistani currency presentation such as:
`Rs. 24,580`

Formatting rules should eventually be centralized.

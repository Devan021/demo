# ClarityOS CRM + POS concept demo

A dependency-free, interactive front-end concept for the AI Automation Engineer / Replit CRM and POS MVP brief.

## What it demonstrates

- CRM customer profiles, purchase history, tags, notes, and search
- POS cart with a test-mode checkout state and digital receipt confirmation
- Editable AI-assisted follow-up drafts based on mock customer history
- Responsive desktop, tablet, and mobile layouts

## Run locally

```bash
python3 -m http.server 4173 --directory demo-crm-pos
```

Open `http://localhost:4173`.

## Important

This is a proposal demo using synthetic customer and sales data. It does not charge cards, call Stripe/Square/OpenAI, send email, or persist data.

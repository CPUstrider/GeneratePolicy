# AI Policy OS (MVP)

Generate AI compliance policy packs for EU AI Act + US best practices.
**Templates only. Not legal advice.**

## What you get (MVP)
- AI Acceptable Use Policy
- LLM Data Handling Policy
- AI Governance Framework
- Risk Matrix
- Vendor Assessment Template
- EU AI Act risk classification (template)
- PDF export

---

## 1) Local setup

### Prereqs
- Node.js 20+
- Supabase project
- Stripe account (with 2 recurring prices)
- OpenAI API key

### Install
```bash
npm install
cp .env.example .env.local
```

### Supabase
1. Create a Supabase project.
2. In Supabase SQL editor, run: `supabase/schema.sql`
3. Enable Auth providers as you like (Email is easiest for MVP).
4. Get:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY

### Stripe
1. Create 2 recurring prices in Stripe:
   - Monthly $79
   - Yearly $199
2. Put price IDs into:
   - STRIPE_PRICE_ID_MONTHLY
   - STRIPE_PRICE_ID_YEARLY
3. Create a webhook endpoint (local via Stripe CLI or in prod via Vercel):
   - events: customer.subscription.created/updated/deleted
4. Put STRIPE_WEBHOOK_SECRET into env.

### Run
```bash
npm run dev
```

---

## 2) Deploy on Vercel

### Steps
1. Push this repo to GitHub
2. Import into Vercel
3. Set Environment Variables in Vercel (same as .env.example)
4. Deploy

### Stripe webhook in production
- Add webhook endpoint:
  `https://YOUR_DOMAIN/api/stripe/webhook`
- Copy signing secret to STRIPE_WEBHOOK_SECRET (Vercel env)
- Redeploy if needed

### Supabase Auth redirect URLs
Add these to Supabase Auth settings:
- `https://YOUR_DOMAIN/*`
- `https://YOUR_DOMAIN/auth/callback` (if you implement callback route)

---

## Notes
- PDF export uses Puppeteer + chromium. Works on Vercel with @sparticuz/chromium.

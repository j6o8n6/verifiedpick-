# VerifiedPicks

VerifiedPicks is a two-sided subscription marketplace where elite sports handicappers monetize their picks and bettors unlock premium analysis instantly after checkout. The project ships with a modern Next.js 14 stack, Prisma ORM, PostgreSQL (or SQLite in development), NextAuth authentication, and Stripe (Checkout + Subscriptions + Connect Express) already wired.

## Features

- **Role-based access** for bettors, cappers, and admins using NextAuth sessions
- **Capper verification workflow** with admin approval and configurable platform fees
- **Stripe Checkout** with automated platform fee skim (15% verified / 25% unverified by default)
- **Stripe webhooks** to activate subscriptions and unlock paid picks in real time
- **Capper dashboards** to publish picks, manage plans, and request verification
- **Bettor dashboards** to review active subscriptions and view unlocked picks
- **Admin console** for revenue insights, fee management, and verification approvals
- **Zod-validated API routes** for secure input handling
- **Tailwind CSS styling** with placeholder components ready for custom design systems

## Tech Stack

- Next.js 14 App Router (TypeScript)
- React + Tailwind CSS
- Prisma ORM with PostgreSQL (SQLite in development)
- NextAuth (credentials provider) for authentication
- Stripe Checkout, Subscriptions, and Connect Express
- Zod for runtime validation
- React Query + SWR for client data fetching

## Getting Started

1. **Install dependencies**

   ```bash
   pnpm install # or npm install / yarn install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env.local` and update the values:

   ```bash
   cp .env.example .env.local
   ```

   Required keys:

   - `DATABASE_URL` — PostgreSQL connection string (use `file:./dev.db` for SQLite dev)
   - `NEXTAUTH_SECRET` — a random string for session encryption
   - `NEXTAUTH_URL` — base URL of the app (e.g. `http://localhost:3000`)
   - `STRIPE_SECRET_KEY` — Stripe secret API key
   - `STRIPE_WEBHOOK_SECRET` — webhook signing secret from Stripe CLI/dashboard
   - `STRIPE_CONNECT_CLIENT_ID` — Connect Express client id (used for onboarding)

3. **Generate Prisma client and push schema**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

   > **Note**: Use `npx prisma migrate dev` when working with a persistent database.

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` to view the marketing homepage.

## Stripe Webhooks (Local Development)

Use the Stripe CLI to forward webhook events:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Database Models (Prisma)

- `User` — core account model with role metadata and Stripe ids
- `Capper` — profile data tied to a user (bio, sports, performance)
- `Plan` — subscription offerings with interval + pricing
- `Pick` — handicapping picks produced by cappers
- `Subscription` — active subscriptions linking bettors to cappers + plans
- `VerificationRequest` — pending verification requests for admin review
- `PlatformSettings` — configurable platform fee percentages

## Folder Structure

```
app/
  admin/
  api/
  auth/
  cappers/
  dashboard/
  layout.tsx
  page.tsx
components/
  dashboards/
  header.tsx
  providers.tsx
  subscribe-button.tsx
  tabs.tsx
lib/
  auth.ts
  prisma.ts
  stripe.ts
  format.ts
prisma/
  schema.prisma
```

## Deployment Notes

- Provision a PostgreSQL database and update `DATABASE_URL`
- Configure environment secrets in your hosting platform (Vercel, Fly.io, etc.)
- Ensure Stripe webhooks are connected to the deployed `/api/stripe/webhook` endpoint
- Run `prisma migrate deploy` during deployment for schema synchronization

## Next Steps

- Integrate the upcoming custom React UI components (drop-in replacements for current placeholders)
- Implement Stripe Connect onboarding UI for cappers to connect their accounts
- Layer in real analytics dashboards sourced from pick outcomes and settlements

---

Paste your mock UI so I can integrate it into the real project.

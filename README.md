# School Website System

A **reusable, single-school** website: public site + admin dashboard + parent
portal + online fees (Paystack) + student results. Not a SaaS — each school
gets its own copy of this codebase, its own database, and its own deploy.

```text
school-website/
├── frontend/   React + Vite + Tailwind public site + admin/staff + parent portal
├── backend/    Node + Express + MongoDB API: auth, students, fees, payments, results
└── README.md
```

## What each role can do

| Role | Signs in at | Can do |
|---|---|---|
| **Admin** | `/admin/login` | Create students (with passport photo), link them to parents, create fees and invoices, create teachers and link them to classes and students, review and approve results, post announcements, change school settings |
| **Teacher (STAFF)** | `/staff/login` | See only the classes and students assigned to them, enter scores, save drafts, submit results to the admin, fix results the admin sent back |
| **Parent** | `/portal/login` | See their own children (with passport), pay fees, read **published** results only |

### Result workflow

```text
DRAFT ──submit──▶ SUBMITTED ──approve & publish──▶ PUBLISHED (parent can see)
  ▲                   │
  └──── RETURNED ◀────┘  admin sends back with a written reason
```

Every step is logged on the result (who, when, note). By default the admin
cannot publish a result while that student's fees for the term are unpaid;
switch this off in **School settings**.

### Teacher scope

A teacher sees a student if the student is in one of the teacher's **assigned classes**,
or the admin linked that student to the teacher individually. Everything else returns 403
from the API (not just hidden in the UI).

### Passport photos

Admin uploads on the student form (JPG/PNG/WebP, max 1.5 MB). Files are stored in
`backend/uploads/passports/` and served from `/uploads/...`. **In production, mount
`backend/uploads` on a persistent disk or volume** (many hosts wipe the container disk on deploy).

## Images

All artwork lives in `frontend/public/images/` and is wired in `frontend/src/config/school.config.js`.
The bundled files are original illustrations so the site is complete on day one.
To use real photographs, drop a file in `public/images/` and change the path in the config
(or overwrite the file with the same name). Recommended sizes: hero 1800x1100, about 1000x1250 (portrait),
programme and gallery 1200x800, leadership portrait 1000x1250, `og-image.png` 1200x630.

## Tests

```bash
cd backend && npm run seed && npm start      # terminal 1
cd backend && npm run test:e2e               # terminal 2: 39 role / workflow checks
```

## 1. Install

```bash
cd backend && npm install
cd ../frontend && npm install
```

## 2. Configure

```bash
cd backend
cp .env.example .env
```

Fill in `.env`:

| Variable | What it is |
|---|---|
| `MONGODB_URI` | Your MongoDB connection string (local or Atlas). One database per school. |
| `JWT_SECRET` | Any long random string — used to sign login tokens. |
| `PAYSTACK_PUBLIC_KEY` / `PAYSTACK_SECRET_KEY` | From your [Paystack dashboard](https://dashboard.paystack.com/#/settings/developer). Use test keys while developing. |
| `PAYSTACK_CALLBACK_URL` | Where Paystack redirects the parent after paying — the parent portal's payment callback page. |
| `FRONTEND_URL` | Used for CORS. |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | The first admin account, created by the seed script. |

The Paystack **secret** key is only ever read on the backend (`backend/src/services/paystack.js`) — it is never sent to the browser.

## 3. Seed demo data (optional but recommended first run)

```bash
cd backend
npm run seed
```

Creates an admin account, a staff account (`staff@school.edu.ng` / `Staff123!`), a demo parent (`demo.parent@example.com` / `Parent123!`), two demo students, a class list, a session/term, a fee structure, a part-paid invoice, one published result, one result awaiting admin review, the demo teacher linked to two classes, and two sample announcements — all clearly prefixed `[DEMO]` / `DEMO-000x` so they're easy to find and delete before going live.

## 4. Run

```bash
# backend
cd backend && npm run dev      # http://localhost:5000

# frontend
cd frontend && npm run dev     # http://localhost:5173
```

## 5. Customize for a new school

Two layers of configuration now exist:

1. **`frontend/src/config/*.js`** — still controls the public marketing pages exactly as before (colours, programmes, gallery, admissions copy). Unchanged.
2. **`backend` → `SchoolSettings` (one document in MongoDB, edited from Admin → Website Settings)** — controls the *operational* side: school name/logo/contact used on invoices and receipts, feature flags, the grading scale, and whether partial fee payment is allowed.

To stand up another school: copy this whole folder, point `MONGODB_URI` at a new database, run the seed script (or create the admin manually), update `frontend/src/config/*.js`, and set new Paystack keys. No code changes required.

## 6. API overview

```text
POST   /api/auth/login
GET    /api/auth/me

GET/POST/PUT/DELETE   /api/students
GET/POST/PUT          /api/parents
PUT                    /api/parents/:id/reset-password

GET/POST/PUT/DELETE   /api/classes
GET/POST              /api/sessions          PUT /api/sessions/:id/activate
GET/POST              /api/terms             PUT /api/terms/:id/activate
GET/POST/PUT          /api/subjects

GET/POST/PUT   /api/fees/structures
POST           /api/fees/invoices/generate
GET            /api/fees/invoices            GET /api/fees/invoices/:id

POST   /api/payments/initialize
GET    /api/payments/verify/:reference
POST   /api/payments/webhook   (Paystack calls this directly)
GET    /api/payments

GET/POST         /api/results
PUT               /api/results/:id/publish
PUT               /api/results/:id/unpublish

GET/PUT   /api/settings
GET/POST/PUT/DELETE   /api/announcements
GET   /api/dashboard/overview
```

Every route except `/api/auth/login`, `/api/settings` (GET), and `/api/payments/webhook` requires `Authorization: Bearer <token>`. Parents are automatically scoped to their own children/invoices/results inside the controllers — there is no way to pass a different student/parent ID and see someone else's data.

## 7. Payment flow & security

- The frontend never talks to Paystack's secret key. It calls `POST /api/payments/initialize`, gets back a Paystack `authorization_url`, and redirects the parent there.
- After payment, the frontend calls `GET /api/payments/verify/:reference` — **this re-verifies the transaction directly with Paystack's API**; the frontend claiming success is never trusted on its own.
- Paystack's webhook (`POST /api/payments/webhook`) is also verified independently (HMAC signature check, then a fresh call to Paystack's verify endpoint) — this means the invoice is credited correctly even if the parent closes the tab before the redirect completes.
- The Paystack transaction **reference** has a unique index on `Payment.reference`, so the same transaction can never be recorded twice, however many times verify/webhook fire for it.

## 8. Receipts

Every successful payment gets a printable receipt: parents open it from Payment History (`/portal/receipts/:id`) and admins from Fees & Invoices (`/admin/payments/:id/receipt`). Both use the browser's own print dialog (`window.print()`) — no PDF library needed — and hide all navigation chrome in print via Tailwind's `print:` variants.

## 9. Grading

The 6-band grading scale (A–F) lives in `SchoolSettings.gradingScale` with sane defaults, editable from the admin settings API — it is not hard-coded in the results logic.

## 10. Production-readiness notes

This build pass also tightens the application around the intended role model:

- **ADMIN** manages students, parents, academic setup, fees, settings and result publication.
- **STAFF** (teachers) enter and submit results only for students in their assigned classes, and post announcements. They cannot see other classes, fees, parents or any administrative write API.
- **PARENT** can only access their own children, invoices, payments and published results.
- Online payment initialization/verification is restricted to parent accounts; Paystack webhook verification remains server-side.
- Result subjects use `CA1 /20 + CA2 /20 + Exam /60`; zero scores are retained instead of being silently omitted.
- Invoice numbers no longer depend on a race-prone database document count.
- The reusable school configuration has been cleaned of stale demo-school references and points to an existing OG image asset.

### Final verification

The backend JavaScript files were syntax-checked and the frontend JavaScript/JSX source was parsed successfully with the TypeScript parser; all relative source imports resolve. A full Vite production build still needs to be run on a machine with the frontend dependencies installed because this sandbox cannot download the uncached npm packages.

Before a live deployment, run:

```bash
cd backend && npm install && npm run seed
cd ../frontend && npm install && npm run build
```

Then test the complete flow with real/test infrastructure: admin login → academic setup → parent creation → student creation → fee structure → invoice generation → parent login → Paystack test payment → receipt → result entry → staff submission → fee settlement → admin publication → parent result view.

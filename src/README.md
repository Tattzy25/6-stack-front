# TaTTTy

AI tattoo generator. React + TypeScript + Tailwind + Stack Auth.

## 🚀 Quick Start

```bash
# Setup (first time)
cp .env.example .env
cp server/.env.example server/.env
# Edit server/.env with your secrets (see QUICK_SETUP.md)

# Install & Run
npm install
npm run dev

# Backend (separate terminal)
cd server
npm install
npm run dev
```

**📖 Full setup guide:** [QUICK_SETUP.md](/QUICK_SETUP.md)

---

## ✨ Features

- **4 Generators:** Freestyle, Couples, Cover-Up, Extend
- **Auth:** Email OTP (Stack Auth) + Google OAuth
- **Database:** Neon PostgreSQL with RLS
- **Dashboard:** User profiles, favorites, designs
- **Community:** Share and discover tattoos
- **Blog:** Tattoo stories and guides

---

## 🔐 Authentication

- **OTP Service:** Stack Auth + Neon Database
- **Project ID:** `<STACK_PROJECT_ID>`
- **Server Secrets:** managed via environment variables (see `.env` templates)
- **Schema:** `/database/PRODUCTION_SCHEMA.sql`
- **Backend:** `/server/api.ts`

**📖 Full auth docs:** [AUTH_CONFIGURATION.md](/AUTH_CONFIGURATION.md)  
**📖 Stack Auth guide:** [STACK_AUTH_INTEGRATION.md](/STACK_AUTH_INTEGRATION.md)  
**📖 Security checklist:** [SECURITY_CHECKLIST.md](/SECURITY_CHECKLIST.md)

---

## 🎨 Design System

- **Base:** `#0C0C0D` (dark)
- **Accent:** `#57f1d6` (teal)
- **Style:** Frosted glass UI, edgy/casual tone
- **Components:** `/components/shared/` (shared across app)

---

## 📂 Project Structure

```
/
├── .env.example              ← Frontend env template
├── components/               ← React components
│   ├── shared/              ← Shared components (use these!)
│   ├── generator/           ← Generator-specific
│   └── ui/                  ← shadcn/ui components
├── config/                   ← Configuration files
│   ├── stackAuth.ts         ← Stack Auth config (env-driven)
│   └── masterAccess.ts      ← Legacy stub (master access disabled)
├── server/                   ← Backend API
│   ├── .env.example         ← Backend env template (SECRETS!)
│   └── api.ts               ← Express server
├── database/                 ← SQL schemas
└── utils/                    ← Helper functions
```

---

## 🔒 Environment Variables

### Frontend (/.env)
- `VITE_STACK_PROJECT_ID` - Stack Auth project (safe)
- `VITE_STACK_PUBLISHABLE_CLIENT_KEY` - Public key (safe)
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth (safe)

### Backend (/server/.env) - SECRETS!
- `STACK_PROJECT_ID` - Stack Auth project (server validation)
- `STACK_PUBLISHABLE_CLIENT_KEY` - Stack Auth publishable key (server usage)
- `STACK_SECRET_SERVER_KEY` - Stack Auth secret (NEVER expose!)
- `DATABASE_URL` - Neon connection (NEVER expose!)
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret (NEVER expose!)

**⚠️ See [SECURITY_CHECKLIST.md](/SECURITY_CHECKLIST.md) for details!**

---

## 📚 Documentation

### Quick Start
- **[QUICK_SETUP.md](/QUICK_SETUP.md)** - Get started in 5 minutes
- **[ENVIRONMENT_SETUP_SUMMARY.md](/ENVIRONMENT_SETUP_SUMMARY.md)** - What you need to do
- **[ENV_VARIABLES_DIAGRAM.md](/ENV_VARIABLES_DIAGRAM.md)** - Visual guide to env vars

### Authentication
- **[AUTH_CONFIGURATION.md](/AUTH_CONFIGURATION.md)** - Complete auth guide
- **[STACK_AUTH_INTEGRATION.md](/STACK_AUTH_INTEGRATION.md)** - Stack Auth details
- **[SECURITY_CHECKLIST.md](/SECURITY_CHECKLIST.md)** - Security best practices

### Other
- **[Attributions.md](/Attributions.md)** - Credits and licenses
- **[server/sql/stored_procedures.sql](/src/server/sql/stored_procedures.sql)** - Required database functions

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Express, Node.js
- **Database:** Neon PostgreSQL (serverless)
- **Auth:** Stack Auth + Google OAuth
- **Email:** Stack Auth email service
- **Deployment:** Vercel (frontend), Railway (backend)

---

## 🐛 Troubleshooting

**OTP not working?**
- Check `STACK_SECRET_SERVER_KEY` is in `/server/.env`
- In dev mode, OTP codes are logged to backend console

**Database errors?**
- Verify `DATABASE_URL` in `/server/.env`
- Check Neon database is running

**Google OAuth failing?**
- Check `GOOGLE_CLIENT_SECRET` in `/server/.env`
- Verify redirect URI in Google Cloud Console

**See [QUICK_SETUP.md](/QUICK_SETUP.md) for more help!**

---

## 📄 License

MIT - See [Attributions.md](/Attributions.md) for details.

---

**Built with 🔐 security in mind. Never hardcode secrets!**

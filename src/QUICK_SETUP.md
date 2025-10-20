# 🚀 Quick Setup Guide - TaTTTy Authentication

## 📋 Prerequisites

- Neon PostgreSQL database
- Stack Auth account
- Google Cloud OAuth credentials

---

## 🔧 Setup Steps

### 1. Frontend Environment Variables

```bash
# Copy the example file
cp .env.example .env


VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_API_URL=http://localhost:3001
```

### 2. Backend Environment Variables (SECRETS!)

```bash
# Copy the example file
cp server/.env.example server/.env

# Edit server/.env and add your secret values:
nano server/.env  # or your preferred editor
```

**Required values to add:**

1. **DATABASE_URL** - Get from [Neon Console](https://console.neon.tech/)
   ```
   postgresql://[user]:[password]@[host]/[database]?sslmode=require
   ```

2. **STACK_SECRET_SERVER_KEY** - Get from [Stack Auth Dashboard](https://app.stack-auth.com/projects/<STACK_PROJECT_ID>)
   - Navigate to: Settings → API Keys
   - Copy "Secret Server Key"
   - Paste in server/.env
   ```
   STACK_SECRET_SERVER_KEY=<STACK_SECRET_SERVER_KEY>
   ```


### 3. Verify .gitignore

Make sure these files are NOT committed:

```bash
# Check .gitignore includes:
.env
.env.local
server/.env
```

### 4. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 5. Start Development Servers

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd server
npm run dev
```

---

## ✅ Quick Test

1. **Open browser**: http://localhost:5173
2. **Click "Sign In"**
3. **Enter your email**
4. **Check console for OTP** (dev mode fallback)
5. **Enter OTP code**
6. **Should redirect to generator** ✅

---

## 🔍 Troubleshooting

### "Stack Auth credentials not configured"

```bash
# Check server/.env has:
STACK_PROJECT_ID=<STACK_PROJECT_ID>
STACK_SECRET_SERVER_KEY=<STACK_SECRET_SERVER_KEY>
```

### "Database connection failed"

```bash
# Check server/.env has valid Neon connection string:
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

### "OTP not sending"

```bash
# In development, OTPs are logged to console:
# Check backend terminal for:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 OTP Verification Code
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email: test@example.com
🔢 Code:  123456
⏰ Valid for: 10 minutes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### "Google OAuth not working"

```bash
# Check .env has:
VITE_GOOGLE_CLIENT_ID=<VITE_GOOGLE_CLIENT_ID>
VITE_GOOGLE_REDIRECT_URI=<VITE_GOOGLE_REDIRECT_URI>

# Check server/.env has:
GOOGLE_CLIENT_SECRET=<GOOGLE_CLIENT_SECRET>
```

---

## 🎯 What Each File Does

```
/
├── .env                      ← Frontend variables (safe to see in browser)
├── .env.example              ← Template (commit this)
├── .gitignore                ← Prevents committing secrets
└── server/
    ├── .env                  ← Backend SECRETS (NEVER commit!)
    └── .env.example          ← Template (commit this)
```

---

## 🔐 Security Reminders

- ✅ Frontend `.env` is safe (only VITE_ variables)
- 🔐 Backend `server/.env` has SECRETS (never commit!)
- ✅ Example files are safe to commit
- 🔐 Never hardcode secrets in code
- ✅ Use environment variables everywhere

---

## 📚 Next Steps

Once setup is working:

1. Read [SECURITY_CHECKLIST.md](/SECURITY_CHECKLIST.md) for production deployment
2. Review [AUTH_CONFIGURATION.md](/AUTH_CONFIGURATION.md) for full details
3. Check [STACK_AUTH_INTEGRATION.md](/STACK_AUTH_INTEGRATION.md) for Stack Auth specifics

---

## 🆘 Still Having Issues?

1. Check all environment variables are set correctly
2. Verify Stack Auth dashboard shows your project
3. Confirm Neon database is running
4. Check browser console for errors
5. Check backend terminal for errors
6. Review documentation files listed above

---

**Setup should take 5-10 minutes** ⏱️

**Most issues are missing environment variables** 🔍

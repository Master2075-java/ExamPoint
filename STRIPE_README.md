# 🎯 Stripe Integration - Complete Guide

This document provides **everything you need** to understand and set up Stripe payments in this app.

---

## 📚 Documentation Overview

We have **3 main guides** to help you:

| Guide | Purpose | When to Use |
|-------|---------|-------------|
| **[QUICKSTART.md](./QUICKSTART.md)** | ⚡ Fast setup guide with visual examples | Start here! Best for beginners |
| **[STRIPE_SETUP.md](./STRIPE_SETUP.md)** | 📖 Detailed step-by-step instructions | Need more context or troubleshooting |
| **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** | 🔧 Technical architecture details | Understanding the code |

---

## 🚀 Quick Decision Tree

**❓ "I just want to see how it works"**
→ Open the app - it's already in demo mode!

**❓ "I want to set up real Stripe payments"**
→ Read [QUICKSTART.md](./QUICKSTART.md) (3 steps, 5 minutes)

**❓ "I'm confused about where to put the `.env` file"**
→ Jump to [Step 2 in QUICKSTART.md](./QUICKSTART.md#step-2-create-env-file-1-minute)

**❓ "The setup isn't working"**
→ Check the [Troubleshooting section in QUICKSTART.md](./QUICKSTART.md#troubleshooting)

**❓ "I want to customize the pricing tiers"**
→ Edit `src/lib/constants.ts` → `SUBSCRIPTION_TIERS` array

**❓ "How does the code work internally?"**
→ Read [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

---

## 🗂️ File Locations Guide

### Frontend Files (vite-template/)

```
vite-template/
├── .env                          ← CREATE THIS (Stripe keys)
├── .env.example                  ← Template to copy from
├── QUICKSTART.md                 ← Start here!
├── STRIPE_SETUP.md               ← Detailed instructions
├── STRIPE_README.md              ← This file
│
├── src/
│   ├── lib/
│   │   └── constants.ts          ← Pricing configuration
│   │
│   ├── components/
│   │   └── StripeCheckout.tsx   ← Checkout button component
│   │
│   └── routes/
│       └── index.tsx             ← Main pricing page
│
└── package.json
```

### Backend Files (my-backend/)

```
my-backend/                        ← Create this folder separately
├── .env                           ← Backend Stripe secret key
├── server.js                      ← One endpoint for checkout
└── package.json
```

---

## ❓ Common Confusions - Clarified!

### 🔑 "What's the difference between pk_test_ and sk_test_ keys?"

- **`pk_test_...`** = **Publishable key** (safe to use in frontend)
  - Goes in: `vite-template/.env` → `VITE_STRIPE_PUBLISHABLE_KEY`
  - Used by: React app to initialize Stripe

- **`sk_test_...`** = **Secret key** (dangerous! keep server-side only)
  - Goes in: `my-backend/.env` → `STRIPE_SECRET_KEY`
  - Used by: Backend server to create checkout sessions

### 📁 "Where exactly is the project root?"

The **project root** is the folder that contains `package.json`.

```bash
# Find it using terminal:
cd vite-template
ls package.json   # Should show: package.json

# The .env file goes HERE (same level as package.json)
touch .env
```

### 🔄 "Why are there TWO .env files?"

Because you have **two separate applications**:

1. **Frontend** (React app) - `vite-template/.env`
   - Contains: `VITE_STRIPE_PUBLISHABLE_KEY`
   - Safe to expose to browsers

2. **Backend** (Node.js server) - `my-backend/.env`
   - Contains: `STRIPE_SECRET_KEY`
   - Never exposed to browsers

### 🎭 "What is demo mode?"

**Demo mode** = App works WITHOUT Stripe setup

- Automatically enabled when no `.env` file exists
- All features work (payments are simulated)
- Perfect for testing UI/UX
- No backend needed

### 🔧 "Do I need a backend?"

**For testing/development:** No! Use demo mode.

**For production (real payments):** Yes! You need a backend server to:
- Securely create Stripe checkout sessions
- Handle webhook events
- Process subscription updates

---

## 📋 Setup Checklist

Use this to verify you've done everything correctly:

### ✅ Demo Mode (No Setup)
- [x] App works immediately
- [x] All features are testable
- [x] No configuration needed

### ✅ Production Setup

**Part 1: Stripe Account**
- [ ] Created Stripe account at https://stripe.com
- [ ] Found API keys in Dashboard → Developers → API keys
- [ ] Copied both `pk_test_...` and `sk_test_...` keys

**Part 2: Frontend Setup**
- [ ] Created `.env` in `vite-template/` folder
- [ ] Added `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`
- [ ] Added `VITE_API_URL=http://localhost:3000/api`
- [ ] File is at same level as `package.json`
- [ ] Restarted dev server after creating `.env`

**Part 3: Backend Setup**
- [ ] Created `my-backend/` folder (separate from React)
- [ ] Ran `npm install express stripe cors dotenv`
- [ ] Created `server.js` with checkout endpoint
- [ ] Created `.env` in backend with `STRIPE_SECRET_KEY=sk_test_...`
- [ ] Started backend: `node server.js`
- [ ] Backend shows: "Backend running at http://localhost:3000"

**Part 4: Testing**
- [ ] Both servers running (frontend + backend)
- [ ] Clicked "Choose Plan" button
- [ ] Redirected to Stripe checkout page
- [ ] Used test card `4242 4242 4242 4242`
- [ ] Payment succeeded ✅

---

## 🧪 Test Cards Reference

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | ✅ Success |
| `4000 0000 0000 0002` | ❌ Declined |
| `4000 0025 0000 3155` | 🔐 Requires authentication |
| `4000 0000 0000 9995` | 🚫 Insufficient funds |

**For all cards:**
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

---

## 🆘 Getting Help

1. **Check the FAQ** in [QUICKSTART.md](./QUICKSTART.md#faq)
2. **Review Troubleshooting** in [QUICKSTART.md](./QUICKSTART.md#troubleshooting)
3. **Verify file structure** matches the examples above
4. **Check browser console** for error messages
5. **Check terminal** for server errors

---

## 📁 Quick Copy-Paste Commands

### Create .env from template
```bash
cd vite-template
cp .env.example .env
# Then edit .env and add your Stripe keys
```

### Set up backend
```bash
mkdir my-backend
cd my-backend
npm init -y
npm install express stripe cors dotenv
# Then create server.js (copy from QUICKSTART.md)
```

### Run both servers
```bash
# Terminal 1 - Frontend
cd vite-template
npm run dev

# Terminal 2 - Backend
cd my-backend
node server.js
```

---

## 🎯 Summary

**The setup is now:**
1. ✅ **Simpler** - Just 3 steps instead of 9
2. ✅ **Clearer** - Explicit instructions on file locations
3. ✅ **Faster** - 5 minutes instead of 30+
4. ✅ **Flexible** - Works in demo mode or production mode
5. ✅ **Well-documented** - Multiple guides for different needs

**Read [QUICKSTART.md](./QUICKSTART.md) to get started!** 🚀

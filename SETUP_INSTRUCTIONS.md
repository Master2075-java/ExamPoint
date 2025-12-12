# Complete Stripe Setup Instructions

Follow these steps to get Stripe payments working for ExamPoint.

## 📋 Prerequisites

- Stripe account (sign up at https://dashboard.stripe.com/register)
- Node.js installed on your computer

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Your Stripe Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy these two keys:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`)

### Step 2: Setup Frontend

1. **Navigate to your project folder:**
   ```bash
   cd /path/to/vite-template
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file and add your Stripe publishable key:**
   ```bash
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Start the frontend:**
   ```bash
   npm install  # if you haven't already
   npm run dev
   ```

### Step 3: Setup Backend

1. **Open a NEW terminal window**

2. **Navigate to backend folder:**
   ```bash
   cd /path/to/my-backend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Edit `.env` file and add your Stripe secret key:**
   ```bash
   STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
   PORT=3000
   ```

5. **Start the backend server:**
   ```bash
   npm start
   ```

   You should see: `Backend running at http://localhost:3000`

---

## ✅ Verify Everything Works

### Terminal Check

You should have **TWO terminals running**:

**Terminal 1 (Frontend):**
```bash
cd /path/to/vite-template
npm run dev
# Should show: http://localhost:5173
```

**Terminal 2 (Backend):**
```bash
cd /path/to/my-backend
npm start
# Should show: Backend running at http://localhost:3000
```

### Browser Test

1. Open http://localhost:5173
2. Click on a pricing plan (Basic or Elite)
3. Sign up for a new account
4. You should be redirected to Stripe checkout page
5. Use test card: `4242 4242 4242 4242`
6. Any future expiry date, any CVC, any ZIP

---

## 📁 File Structure Overview

```
Projects/
├── vite-template/              ← Frontend (React)
│   ├── .env                     ← Your Stripe publishable key
│   ├── .env.example             ← Template to copy from
│   ├── package.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── StripeCheckout.tsx
│   │   │   └── SubscriptionManager.tsx
│   │   └── ...
│   └── ...
│
└── my-backend/                 ← Backend (Node.js)
    ├── .env                     ← Your Stripe secret key
    ├── server.js                ← Express server
    ├── package.json
    └── README.md
```

---

## 🧪 Test Cards

Use these cards on the Stripe checkout page:

- **Success:** `4242 4242 4242 4242`
- **Declined:** `4000 0000 0000 0002`
- **Requires authentication:** `4000 0025 0000 3155`

Use any:
- Future expiry date (e.g., 12/34)
- Any CVC (e.g., 123)
- Any ZIP code (e.g., 12345)

---

## 🔧 Troubleshooting

### Frontend doesn't connect to backend

**Problem:** Payments fail with network error

**Solution:**
1. Make sure backend is running at http://localhost:3000
2. Check `.env` file has `VITE_API_URL=http://localhost:3000/api`
3. Restart frontend after changing `.env`: `npm run dev`

### Backend won't start

**Problem:** "Port 3000 already in use"

**Solution:**
1. Change port in backend `.env`: `PORT=3001`
2. Update frontend `.env`: `VITE_API_URL=http://localhost:3001/api`
3. Restart both frontend and backend

### Stripe errors

**Problem:** "Invalid API key"

**Solution:**
1. Check your Stripe secret key in backend `.env` starts with `sk_test_`
2. Check your Stripe publishable key in frontend `.env` starts with `pk_test_`
3. Make sure there are no spaces before/after the keys

### Demo mode instead of real Stripe

**Problem:** Payments are simulated instead of redirecting to Stripe

**Solution:**
1. Make sure `.env` file exists in `vite-template/` folder
2. Make sure `VITE_STRIPE_PUBLISHABLE_KEY` is set
3. Make sure `VITE_API_URL` is set
4. Restart frontend: `npm run dev`

---

## 📚 Additional Documentation

- **QUICKSTART.md** - Quick reference guide
- **STRIPE_SETUP.md** - Detailed Stripe setup guide
- **STRIPE_README.md** - Master documentation overview
- **my-backend/README.md** - Backend-specific instructions

---

## 🎯 What's Implemented

✅ FREE tier - No payment, just signup
✅ BASIC tier - $7/month subscription
✅ ELITE tier - $15/month subscription
✅ Automatic demo mode (if Stripe not configured)
✅ Real Stripe checkout integration
✅ Success/cancel URL handling
✅ Secure payment processing

---

## 🚀 Going Live (Production)

When ready for production:

1. **Switch to live mode** in Stripe dashboard
2. **Get live keys** (start with `pk_live_` and `sk_live_`)
3. **Update `.env` files** with live keys
4. **Deploy backend** to a server (Heroku, Railway, etc.)
5. **Update frontend `.env`** with production API URL:
   ```bash
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
   VITE_API_URL=https://your-backend.com/api
   ```
6. **Deploy frontend** (Vercel, Netlify, etc.)

---

## 💡 Need Help?

- Stripe Docs: https://stripe.com/docs/checkout/quickstart
- Test Cards: https://stripe.com/docs/testing
- Stripe Dashboard: https://dashboard.stripe.com

---

**Done! Your Stripe integration is complete!** 🎉

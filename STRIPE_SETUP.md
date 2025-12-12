# Stripe Setup - Super Simple Guide

Get Stripe payments working in **3 easy steps**. No complicated configuration needed!

---

## 🗺️ Quick Navigation

- **New to Stripe?** → Start at [Step 1: Get Your Stripe Keys](#step-1-get-your-stripe-keys)
- **Need help with `.env`?** → Jump to [Step 2: Create .env File](#step-2-create-env-file)
- **Setting up backend?** → Go to [Step 3: Create Backend Endpoint](#step-3-create-backend-endpoint)
- **Just want to test?** → Read [Demo Mode](#-demo-mode)

---

## 🎯 Quick Setup (5 minutes)

### Step 1: Get Your Stripe Keys

1. Go to **https://dashboard.stripe.com/register** and create an account
2. Click **Developers** → **API keys**
3. Copy these two values:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`)

That's it for Stripe dashboard! 🎉

---

### Step 2: Create `.env` File

**📁 WHERE to create it:**

The `.env` file goes in your **project root directory** - the same folder that contains:
- `package.json`
- `index.html`
- `README.md`
- `src/` folder

**💡 How to find your project root:**

```bash
# Open your terminal and navigate to your project folder
cd /path/to/vite-template

# Verify you're in the right place - you should see these files:
ls
# Expected output: package.json, index.html, src/, node_modules/, etc.
```

**✍️ Create the file:**

```bash
# Option 1: Copy from example template (RECOMMENDED)
cp .env.example .env

# Option 2: Create from scratch
touch .env

# Option 3: Using your code editor
# File → New File → Save as ".env" in the project root folder
```

**📝 Add your configuration:**

Open `.env` in your text editor and paste this (replace with your actual keys):

```bash
# Stripe Keys (from Step 1)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
VITE_STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE

# Your backend API URL (use this for local development)
VITE_API_URL=http://localhost:3000/api
```

**📂 Your file structure should look like:**

```
vite-template/
├── .env                    ← CREATE THIS FILE HERE!
├── .env.local
├── package.json
├── index.html
├── README.md
├── STRIPE_SETUP.md
├── src/
│   ├── routes/
│   ├── components/
│   └── ...
└── node_modules/
```

**⚠️ IMPORTANT:**
- The `.env` file should be at the **same level** as `package.json`
- Never commit `.env` to git (it contains secrets!)
- The file starts with a dot: `.env` not `env` or `env.txt`

---

### Step 3: Create Backend Endpoint

**🎯 What you need:**

A simple backend server with **ONE endpoint** that creates Stripe checkout sessions.

**📦 Quick Setup - Node.js + Express**

1. **Create a new backend project:**

```bash
# In a NEW folder (NOT inside your React project)
mkdir my-backend
cd my-backend

# Initialize and install dependencies
npm init -y
npm install express stripe cors dotenv
```

2. **Create `server.js`:**

```javascript
// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// This is your ONE required endpoint
app.post('/api/create-checkout', async (req, res) => {
  try {
    const { tier, price } = req.body;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `ExamPoint ${tier} Plan`,
            description: `Monthly subscription to ${tier} tier`,
          },
          unit_amount: price * 100, // Stripe uses cents ($7 = 700)
          recurring: { interval: 'month' },
        },
        quantity: 1,
      }],
      success_url: 'http://localhost:5173/?success=true',
      cancel_url: 'http://localhost:5173/?canceled=true',
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
```

3. **Create `.env` in your backend folder:**

```bash
# Backend .env (NOT the same as your React .env!)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
PORT=3000
```

4. **Run your backend:**

```bash
node server.js
```

**✅ Verification:**

Your backend should print: `Backend running at http://localhost:3000`

**📁 Final folder structure:**

```
📂 Projects/
├── 📂 vite-template/           ← Your React frontend
│   ├── .env                     (contains VITE_STRIPE_PUBLISHABLE_KEY)
│   ├── package.json
│   └── src/
│
└── 📂 my-backend/              ← Your Node.js backend
    ├── .env                     (contains STRIPE_SECRET_KEY)
    ├── server.js
    └── package.json
```

**🎉 That's it!** Your Stripe integration is complete.

Now when users click "Choose Plan", they'll be redirected to real Stripe checkout pages!

---

## ✅ Verification Checklist

Before testing, verify you've completed all steps:

**Frontend Setup:**
- [ ] Created `.env` file in `vite-template/` folder (same level as `package.json`)
- [ ] Added `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...` to `.env`
- [ ] Added `VITE_API_URL=http://localhost:3000/api` to `.env`
- [ ] Restarted dev server (`npm run dev`) after creating `.env`

**Backend Setup:**
- [ ] Created separate `my-backend/` folder (outside React project)
- [ ] Installed dependencies: `express`, `stripe`, `cors`, `dotenv`
- [ ] Created `server.js` with checkout endpoint
- [ ] Created `.env` in backend folder with `STRIPE_SECRET_KEY=sk_test_...`
- [ ] Backend is running (`node server.js` shows "Backend running...")

**Testing:**
```bash
# Terminal 1 (Frontend)
cd vite-template
npm run dev
# Should show: http://localhost:5173

# Terminal 2 (Backend)
cd my-backend
node server.js
# Should show: Backend running at http://localhost:3000
```

---

## 🧪 Testing

Use these test cards in your app:

- **Success:** `4242 4242 4242 4242`
- **Declined:** `4000 0000 0000 0002`
- Any future expiry date, any CVC, any ZIP

---

## 📦 Demo Mode

**Don't have a backend yet?** No problem!

The app automatically runs in **demo mode** if you don't set the environment variables. Payments will be simulated, and everything still works for development.

---

## 🚀 Going Live

When ready for production:

1. Switch to **live mode** in Stripe dashboard
2. Get your **live keys** (start with `pk_live_` and `sk_live_`)
3. Update `.env` with live keys
4. Deploy your backend
5. Update `VITE_API_URL` to your production backend URL

Done! 🎉

---

## 💡 Need Help?

- **Stripe Docs:** https://stripe.com/docs/checkout/quickstart
- **Test Cards:** https://stripe.com/docs/testing

---

## 📋 What You Get

✅ **FREE tier** - No payment, just signup
✅ **BASIC tier** - $7/month subscription
✅ **ELITE tier** - $15/month subscription
✅ Automatic demo mode for development
✅ Simple backend integration
✅ Secure payment processing

**No complex configuration. No Price IDs. No webhook setup required for basic functionality.**

Just 3 steps and you're done! 🎯

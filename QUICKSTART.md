# 🚀 Quick Start - Stripe Subscription System

## ⚡ Get Started in 3 Steps

### Option A: Demo Mode (No Setup - Works Now!)

The system works **immediately** without any configuration:

1. Open your app in the browser
2. Click "Start Free" or any pricing button
3. Sign up with any email/password (e.g., `test@example.com` / `password123`)
4. Experience the full subscription flow!

**🎯 What works in demo mode:**
- ✅ User signup/login
- ✅ 3-tier subscription display
- ✅ Payment flow simulation
- ✅ Tier upgrades/downgrades
- ✅ Access control (FREE users blocked from BASIC features)
- ✅ Complete UI/UX testing

---

### Option B: Real Stripe Payments (Production Setup)

Follow these **3 simple steps** to enable real Stripe payments:

---

## 📋 Step 1: Get Stripe Keys (2 minutes)

1. Go to **https://dashboard.stripe.com/register**
2. Create a free Stripe account
3. Click **Developers** → **API keys**
4. Copy these two values:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`)

---

## 📋 Step 2: Create `.env` File (1 minute)

**📁 WHERE:** In your **project root folder** (same folder as `package.json`)

**✍️ HOW TO CREATE:**

```bash
# Option 1: Copy from template (RECOMMENDED - easiest!)
cd /path/to/vite-template
cp .env.example .env

# Option 2: Create from scratch
cd /path/to/vite-template
touch .env

# Option 3: Using VS Code / text editor
# File → New File → Save as ".env" in the vite-template folder
```

**📝 WHAT TO PUT IN IT:**

Open `.env` and paste this (replace with your actual keys from Step 1):

```bash
# Stripe Keys (from Step 1)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
VITE_STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE

# Backend API URL (for local development)
VITE_API_URL=http://localhost:3000/api
```

**📂 Your project should now look like:**

```
vite-template/
├── .env                    ← YOU JUST CREATED THIS!
├── .env.local
├── package.json           ← Same level as package.json
├── index.html
├── QUICKSTART.md          ← You're reading this file
├── src/
│   ├── routes/
│   └── components/
└── node_modules/
```

**⚠️ IMPORTANT:**
- The `.env` file must be in the **root folder**, not inside `src/`
- File name is exactly `.env` (starts with a dot!)
- Never commit this file to git (contains secrets)

---

## 📋 Step 3: Create Backend (2 minutes)

**📦 Setup a simple Node.js backend:**

```bash
# Create a NEW folder (outside your React project)
mkdir my-backend
cd my-backend

# Initialize and install
npm init -y
npm install express stripe cors dotenv
```

**📝 Create `server.js`:**

```javascript
// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

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
          },
          unit_amount: price * 100, // $7 = 700 cents
          recurring: { interval: 'month' },
        },
        quantity: 1,
      }],
      success_url: 'http://localhost:5173/?success=true',
      cancel_url: 'http://localhost:5173/?canceled=true',
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Backend running at http://localhost:3000'));
```

**📝 Create `.env` in backend folder:**

```bash
# Backend .env (different from React .env!)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
```

**🚀 Run your backend:**

```bash
node server.js
```

You should see: `Backend running at http://localhost:3000`

---

## 🎉 You're Done!

Now test the full flow:

1. **Start your React app** (in the `vite-template` folder):
   ```bash
   npm run dev
   ```

2. **Click "Choose Plan"** on any tier

3. **You'll be redirected to real Stripe checkout!**

Use test card: `4242 4242 4242 4242` (any expiry/CVC)

---

## 📁 Final Project Structure

```
📂 Your Projects Folder/
│
├── 📂 vite-template/              ← React Frontend
│   ├── .env                        (VITE_STRIPE_PUBLISHABLE_KEY)
│   ├── package.json
│   ├── src/
│   └── ...
│
└── 📂 my-backend/                 ← Node.js Backend
    ├── .env                        (STRIPE_SECRET_KEY)
    ├── server.js
    └── package.json
```

**🔑 Key Points:**
- Two separate folders
- Two separate `.env` files
- Frontend uses `VITE_STRIPE_PUBLISHABLE_KEY`
- Backend uses `STRIPE_SECRET_KEY`

---

## 🧪 Try These User Flows

### Free Signup
```
1. Click "Start Free"
2. Sign up: test@example.com / password123
3. See FREE tier dashboard
4. Try "AI Tutor" → Blocked (requires BASIC)
```

### Upgrade to BASIC
```
1. Click subscription icon (💳) in nav
2. Click "Upgrade to Basic"
3. Enter test card: 4242 4242 4242 4242
4. Complete payment
5. Now you can access AI Tutor!
```

### Upgrade to ELITE
```
1. Click subscription icon
2. Click "Upgrade to Elite"
3. Complete payment
4. Full unlimited access!
```

---

## 🧪 Stripe Test Cards

| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | ✅ Success |
| `4000 0000 0000 0002` | ❌ Declined |
| `4000 0025 0000 3155` | 🔐 Requires 3D Secure |

- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

---

## 🔐 Access Control Matrix

| Feature | FREE | BASIC ($7/mo) | ELITE ($15/mo) |
|---------|------|---------------|----------------|
| Dashboard | ✅ | ✅ | ✅ |
| Flashcards | ✅ 3/mo | ✅ 50/mo | ✅ Unlimited |
| Quizzes | ✅ 5/day | ✅ 100/day | ✅ Unlimited |
| AI Tutor | ❌ | ✅ 20/day | ✅ Unlimited |
| Analytics | ❌ | ✅ Basic | ✅ Advanced |
| Multi-Subject | ❌ 1 only | ✅ 5 max | ✅ Unlimited |

---

## ❓ FAQ

**Q: Where exactly do I create the `.env` file?**

A: In the `vite-template/` folder - the same level as `package.json`. NOT inside `src/` or any subdirectory.

```bash
cd vite-template
touch .env    # Creates it in the right place
```

**Q: Do I need a backend to test this?**

A: No! It works in demo mode without any setup. Backend is only needed for real Stripe payments.

**Q: Why are there two `.env` files?**

A: One for your React app (frontend), one for your Node.js server (backend). They're in different folders and contain different keys.

**Q: Can I change the pricing?**

A: Yes! Edit `src/lib/constants.ts` → Update the `SUBSCRIPTION_TIERS` array.

**Q: What happens if I don't create the `.env` file?**

A: The app automatically runs in **demo mode** - everything works, but payments are simulated.

**Q: Is this production-ready?**

A: The UI/UX is production-ready. For real production, you'll also need:
- Database (to persist subscriptions)
- Webhooks (to handle subscription events)
- HTTPS (required by Stripe)

---

## 🆘 Troubleshooting

**Problem: "Cannot find `.env` file"**
- Make sure it's in `vite-template/` folder (same level as `package.json`)
- File must start with a dot: `.env` not `env`

**Problem: "VITE_STRIPE_PUBLISHABLE_KEY is undefined"**
- Check that your `.env` file has the correct variable names
- Restart your dev server after creating `.env`

**Problem: Backend won't start**
- Check that you created `.env` in the `my-backend/` folder (not React folder)
- Verify your `STRIPE_SECRET_KEY` starts with `sk_test_`

**Problem: Payment redirects to demo page**
- Your backend isn't running - start it with `node server.js`
- Check `VITE_API_URL` in React `.env` points to `http://localhost:3000/api`

**Problem: Subscription resets on page refresh**
- This is expected (no database yet)
- For production, add database persistence

---

## 📚 Additional Resources

- **Detailed Setup Guide:** `STRIPE_SETUP.md`
- **Implementation Details:** `IMPLEMENTATION_SUMMARY.md`
- **Stripe Documentation:** https://stripe.com/docs/checkout/quickstart
- **Test Cards:** https://stripe.com/docs/testing

---

## 🎯 What's Next?

### For Development
- [x] Test all 3 subscription tiers
- [x] Try upgrade/downgrade flows
- [x] Verify access control
- [x] Customize pricing

### For Production
- [ ] Set up database (PostgreSQL/MySQL)
- [ ] Implement webhook handling
- [ ] Deploy backend with HTTPS
- [ ] Switch to live Stripe keys
- [ ] Set up monitoring

**Ready for production?** → Read `STRIPE_SETUP.md` for the complete deployment guide! 🚀

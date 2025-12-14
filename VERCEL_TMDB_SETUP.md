# 🔑 Setting TMDB API Key on Vercel - Step by Step Guide

## Your TMDB API Key
**Key**: `0b7ec94633601478da8ad67533d0275c`

---

## 📋 Method 1: Via Vercel Dashboard (Recommended)

### Step 1: Go to Your Vercel Project
1. Open your browser and go to [https://vercel.com](https://vercel.com)
2. **Log in** to your Vercel account (or sign up if you don't have one)
3. Click on your **project name** (or create a new project if you haven't deployed yet)

### Step 2: Navigate to Settings
1. In your project dashboard, look at the **top menu bar**
2. Click on **"Settings"** (it's usually the rightmost option)

### Step 3: Go to Environment Variables
1. In the **left sidebar**, you'll see several options
2. Click on **"Environment Variables"** (under the "General" section)

### Step 4: Add the TMDB API Key
1. Click the **"Add New"** button (usually at the top right)
2. Fill in the form:
   - **Key**: `TMDB_API_KEY`
     - ⚠️ **Important**: Type this EXACTLY as shown (case-sensitive, no spaces)
   - **Value**: `0b7ec94633601478da8ad67533d0275c`
     - Copy and paste your API key here
   - **Environment**: 
     - ✅ Check **Production**
     - ✅ Check **Preview**
     - ✅ Check **Development**
     - (Select all three to make it work everywhere)

3. Click **"Save"** button

### Step 5: Redeploy Your Project
1. Go to the **"Deployments"** tab (in the top menu)
2. Find your **latest deployment**
3. Click the **three dots (⋯)** on the right side of that deployment
4. Select **"Redeploy"** from the dropdown menu
5. Click **"Redeploy"** in the confirmation popup
6. Wait for the deployment to complete (usually 1-2 minutes)

### Step 6: Test It
1. Open your deployed website
2. Try searching for a movie
3. If it works, you're all set! ✅

---

## 📋 Method 2: Via Vercel CLI

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
- This will open your browser to authenticate

### Step 3: Add Environment Variable
```bash
vercel env add TMDB_API_KEY
```

When prompted:
- **Value**: `0b7ec94633601478da8ad67533d0275c`
- **Environment**: Select all (Production, Preview, Development)
  - Type `a` to select all, or type `1,2,3` and press Enter

### Step 4: Redeploy
```bash
vercel --prod
```

---

## 📋 Method 3: During Initial Deployment

If you're deploying for the first time:

1. **Import your project** to Vercel (from GitHub or upload files)
2. Before clicking "Deploy", click **"Environment Variables"** section
3. Add:
   - **Key**: `TMDB_API_KEY`
   - **Value**: `0b7ec94633601478da8ad67533d0275c`
   - **Environment**: All
4. Click **"Deploy"**

---

## ✅ Verification Checklist

After setting up, verify:

- [ ] Environment variable `TMDB_API_KEY` is set in Vercel
- [ ] Value is correct: `0b7ec94633601478da8ad67533d0275c`
- [ ] All environments are selected (Production, Preview, Development)
- [ ] Project has been redeployed after setting the variable
- [ ] Movie search works on your deployed site

---

## 🔍 Troubleshooting

### Problem: "TMDB API key not configured" error

**Solution**:
1. Double-check the environment variable name is exactly `TMDB_API_KEY` (case-sensitive)
2. Make sure you selected all environments (Production, Preview, Development)
3. **Redeploy** your project after adding the variable
4. Wait a few minutes for the deployment to complete

### Problem: Works locally but not on Vercel

**Solution**:
- Local uses the API key from `home.js`
- Vercel uses the environment variable
- Make sure you set the environment variable in Vercel
- Make sure you redeployed after setting it

### Problem: Can't find Environment Variables option

**Solution**:
- Make sure you're in the **Settings** tab
- Look in the **left sidebar** under "General"
- If you don't see it, make sure you have the correct permissions for the project

### Problem: Environment variable not working after redeploy

**Solution**:
1. Go to Settings → Environment Variables
2. Verify the variable exists and is correct
3. Try deleting it and adding it again
4. Make sure to select all environments
5. Redeploy again

---

## 📸 Visual Guide

### Where to Find Settings:
```
Vercel Dashboard
└── Your Project
    └── Settings (top menu)
        └── Environment Variables (left sidebar)
            └── Add New (button)
```

### What the Form Looks Like:
```
┌─────────────────────────────────────┐
│ Add Environment Variable            │
├─────────────────────────────────────┤
│ Key:                                │
│ [TMDB_API_KEY              ]        │
│                                     │
│ Value:                              │
│ [0b7ec94633601478da8ad67533d0275c] │
│                                     │
│ Environment:                        │
│ ☑ Production                        │
│ ☑ Preview                           │
│ ☑ Development                       │
│                                     │
│ [Cancel]  [Save]                    │
└─────────────────────────────────────┘
```

---

## 🎯 Quick Reference

**Variable Name**: `TMDB_API_KEY`  
**Variable Value**: `0b7ec94633601478da8ad67533d0275c`  
**Environments**: All (Production, Preview, Development)  
**Action Required**: Redeploy after setting

---

## 💡 Pro Tips

1. **Always redeploy** after adding/changing environment variables
2. **Select all environments** to avoid issues in preview deployments
3. **Double-check spelling** - `TMDB_API_KEY` is case-sensitive
4. **Test immediately** after redeploy to catch issues early
5. **Keep your API key secure** - never commit it to GitHub

---

## 🆘 Still Having Issues?

1. Check Vercel deployment logs:
   - Go to Deployments → Click on a deployment → View logs
   - Look for any error messages

2. Check browser console:
   - Open your site → Press F12 → Console tab
   - Look for API errors

3. Verify API key works:
   - Test the API key directly: `https://api.themoviedb.org/3/movie/popular?api_key=YOUR_KEY`
   - Replace `YOUR_KEY` with your actual key

---

**Need more help?** Check the main `VERCEL_DEPLOYMENT.md` file for general deployment instructions.


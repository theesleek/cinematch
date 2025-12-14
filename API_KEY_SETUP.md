# 🔑 API Key Setup Guide

## ✅ Your API Key
**API Key**: `0b7ec94633601478da8ad67533d0275c`

## Where to Put Your TMDB API Key

### ✅ **FOR VERCEL DEPLOYMENT (Recommended)**

**Location:** Vercel Dashboard → Environment Variables

**Steps:**
1. Go to your project on https://vercel.com
2. Click **Settings** (in the top menu)
3. Click **Environment Variables** (in the left sidebar)
4. Click **Add New**
5. Enter:
   - **Name:** `TMDB_API_KEY`
   - **Value:** `0b7ec94633601478da8ad67533d0275c`
   - **Environment:** Select all (Production, Preview, Development)
6. Click **Save**
7. **Redeploy** your project (go to Deployments → click ⋯ → Redeploy)

**That's it!** The API proxy will automatically use this key.

---

### 🏠 **FOR LOCAL DEVELOPMENT (Optional)**

**Location:** `home.js` - Line 26

**Steps:**
1. Open `home.js` file
2. Find line 26:
   ```javascript
   const TMDB_API_KEY = 'YOUR_TMDB_API_KEY_HERE';
   ```
3. Replace `'YOUR_TMDB_API_KEY_HERE'` with your actual API key:
   ```javascript
   const TMDB_API_KEY = '0b7ec94633601478da8ad67533d0275c'; // Your API key
   ```
   
   **Note:** This is already done! ✅ The API key is already set in `home.js` line 26.
4. Save the file

**Note:** This is only needed if you want to use direct API calls locally. The API proxy works locally too if you're running a local server.

---

## 📍 Visual Guide

### Vercel Dashboard Path:
```
Vercel Dashboard
  └── Your Project
      └── Settings
          └── Environment Variables
              └── Add New
                  ├── Name: TMDB_API_KEY
                  ├── Value: [Your API Key]
                  └── Environment: All
```

### File Location (Local):
```
home.js
  └── Line 26
      └── const TMDB_API_KEY = 'YOUR_TMDB_API_KEY_HERE';
```

---

## 🔐 How to Get Your TMDB API Key

1. Go to https://www.themoviedb.org/
2. Sign up or log in (free account)
3. Go to **Settings** → **API**
4. Click **Request an API Key**
5. Fill out the form (select "Developer" for personal use)
6. Copy your API key

---

## ✅ Verification

**For Vercel:**
- After setting the environment variable and redeploying, try searching for a movie
- If it works, you're all set!

**For Local:**
- Open `home.html` in a browser
- Try searching for a movie
- If it works, you're all set!

---

## ⚠️ Important Notes

- **Never commit your API key to Git** (it's already in `.gitignore`)
- **For Vercel:** Always use Environment Variables (more secure)
- **The API proxy** (`/api/movie-search.js`) automatically uses the Vercel environment variable
- **No code changes needed** for Vercel - just set the environment variable!


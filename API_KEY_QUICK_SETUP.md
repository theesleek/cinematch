# 🔑 API Key Quick Setup Guide

## ✅ Current Status

**API Key**: `0b7ec94633601478da8ad67533d0275c`

### ✅ Local Development - CONFIGURED
- **Location**: `home.js` line 26
- **Status**: ✅ Already set
- **Works**: Yes, ready to use locally

### ⚠️ Vercel Deployment - NEEDS SETUP
- **Location**: Vercel Environment Variables
- **Status**: ⚠️ Needs to be set
- **Action Required**: Follow steps below

---

## 🚀 Quick Setup for Vercel

### Step 1: Deploy to Vercel
1. Go to https://vercel.com
2. Sign up/Login
3. Click "New Project"
4. Import your repository or upload files

### Step 2: Set Environment Variable (CRITICAL)

1. In your Vercel project dashboard, click **Settings**
2. Click **Environment Variables** (in left sidebar)
3. Click **Add New**
4. Enter:
   - **Name**: `TMDB_API_KEY`
   - **Value**: `0b7ec94633601478da8ad67533d0275c`
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**

### Step 3: Redeploy

1. Go to **Deployments** tab
2. Click the three dots (⋯) on the latest deployment
3. Select **Redeploy**
4. Wait for deployment to complete

### Step 4: Test

1. Open your deployed site
2. Try searching for a movie
3. If it works, you're all set! ✅

---

## 🏠 Local Development

### Already Configured ✅

The API key is already set in `home.js`:
```javascript
const TMDB_API_KEY = '0b7ec94633601478da8ad67533d0275c';
```

### To Test Locally:

1. Open `home.html` in your browser
   - Or use a local server: `python -m http.server 8000`
2. Try searching for a movie
3. Should work immediately! ✅

---

## 🔍 How It Works

### Local Development:
- Uses **direct TMDB API calls**
- API key is in `home.js` (line 26)
- No server needed (but recommended for CORS)

### Vercel Deployment:
- Uses **API proxy** (`/api/movie-search`)
- API key is in **Environment Variables**
- Automatically handles CORS and VPN issues
- More secure (key not exposed to client)

---

## ✅ Verification Checklist

### Local:
- [x] API key set in `home.js` line 26
- [ ] Test search functionality
- [ ] Verify movies appear

### Vercel:
- [ ] Environment variable `TMDB_API_KEY` set
- [ ] Value: `0b7ec94633601478da8ad67533d0275c`
- [ ] All environments selected
- [ ] Project redeployed
- [ ] Test search on deployed site

---

## 🐛 Troubleshooting

### Local: "API Key not configured"
- ✅ Already fixed - key is in `home.js`
- If still seeing error, clear browser cache (Ctrl+F5)

### Vercel: "TMDB API key not configured"
- Check Environment Variable is set correctly
- Make sure you redeployed after setting it
- Check variable name is exactly: `TMDB_API_KEY`
- Check value is exactly: `0b7ec94633601478da8ad67533d0275c`

### Search Not Working
- Check browser console (F12) for errors
- Verify internet connection
- Check API key is correct
- For Vercel: Check deployment logs

---

## 📝 Important Notes

1. **Local**: API key is visible in code (fine for development)
2. **Vercel**: API key is in environment variables (secure)
3. **Both**: Use the same API key: `0b7ec94633601478da8ad67533d0275c`
4. **Auto-detection**: App automatically uses correct method (local vs Vercel)

---

## ✨ You're All Set!

- **Local**: Ready to use ✅
- **Vercel**: Just set the environment variable and redeploy ✅

The API key is configured and ready to use!


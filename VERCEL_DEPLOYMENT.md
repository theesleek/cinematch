# 🚀 Vercel Deployment Guide

## Why It Might Not Work When Files Are Directly Selected

When deploying directly by selecting files on Vercel, there are a few common issues:

### 1. **Node.js Version** ✅ FIXED
- The API function uses `fetch()` which requires Node.js 18+
- **Solution**: Added `"engines": { "node": ">=18.0.0" }` to `package.json`
- Added explicit runtime configuration in `vercel.json`

### 2. **Environment Variables** ⚠️ REQUIRED
- The `TMDB_API_KEY` must be set in Vercel
- **How to set**:
  1. Go to your Vercel project dashboard
  2. Navigate to **Settings** → **Environment Variables**
  3. Add new variable:
     - **Name**: `TMDB_API_KEY`
     - **Value**: Your TMDB API key (e.g., `0b7ec94633601478da8ad67533d0275c`)
     - **Environment**: Select all (Production, Preview, Development)
  4. Click **Save**
  5. **Redeploy** your project

### 3. **File Structure** ✅ CORRECT
- API functions must be in `/api/` directory
- Current structure: `/api/movie-search.js` ✅

### 4. **Deployment Method**

#### Option A: Git Integration (Recommended)
1. Push your code to GitHub/GitLab/Bitbucket
2. Import the repository in Vercel
3. Vercel will automatically detect and deploy

#### Option B: Vercel CLI (Recommended for Direct File Deployment)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production
vercel --prod
```

#### Option C: Direct File Upload (May Have Issues)
- When uploading files directly, Vercel might not properly detect:
  - Node.js version requirements
  - Serverless function structure
  - Environment variables

**Recommendation**: Use Git integration or Vercel CLI instead.

## ✅ Deployment Checklist

- [x] `vercel.json` configured with Node.js 18+ runtime
- [x] `package.json` specifies Node.js 18+ requirement
- [ ] `TMDB_API_KEY` environment variable set in Vercel
- [ ] Project redeployed after setting environment variable
- [ ] API function is in `/api/movie-search.js`

## 🔍 Troubleshooting

### Issue: "TMDB API key not configured"
**Solution**: Set `TMDB_API_KEY` in Vercel Environment Variables and redeploy

### Issue: "fetch is not defined" or "ReferenceError: fetch is not defined"
**Solution**: 
- Ensure Node.js 18+ is specified (already done in `vercel.json` and `package.json`)
- Redeploy the project

### Issue: API endpoint returns 404
**Solution**: 
- Ensure the file is at `/api/movie-search.js` (not nested in subdirectories)
- Check Vercel deployment logs for function detection

### Issue: CORS errors
**Solution**: 
- CORS headers are already configured in `vercel.json` and the API function
- If issues persist, check browser console for specific error

## 📝 Quick Deploy Steps

1. **Set Environment Variable**:
   ```
   Vercel Dashboard → Settings → Environment Variables
   Add: TMDB_API_KEY = your-api-key-here
   ```

2. **Deploy**:
   - If using Git: Push to repository, Vercel auto-deploys
   - If using CLI: Run `vercel --prod`
   - If using file upload: Upload all files, then set env var and redeploy

3. **Verify**:
   - Visit your deployed site
   - Open browser console (F12)
   - Try searching for a movie
   - Check Network tab for `/api/movie-search` requests

## 🎯 Why Direct File Selection Can Fail

1. **No Git History**: Vercel uses Git commits to track changes and trigger rebuilds
2. **Environment Detection**: Vercel might not properly detect Node.js version requirements
3. **Function Detection**: Serverless functions might not be properly recognized
4. **Build Process**: No build process to verify configuration

**Best Practice**: Always use Git integration or Vercel CLI for reliable deployments.


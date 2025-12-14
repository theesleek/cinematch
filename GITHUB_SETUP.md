# 🚀 Clean GitHub Setup Guide

## Step 1: Clean Up Your Repository

### Files/Folders to Remove (Optional but Recommended):

1. **Delete these folders** (they contain old/unnecessary files):
   - `New folder/` - Contains old documents and images
   - `CINEMATCH/` - Duplicate/old files

2. **Optional: Consolidate Documentation**
   - You can keep all the `.md` files OR
   - Delete the individual setup files and keep only `README.md` and `VERCEL_DEPLOYMENT.md`

### Files to Keep (Essential):
```
✅ api/
   └── movie-search.js
✅ auth.js
✅ database.html
✅ database.js
✅ home.html
✅ home.js
✅ index.png
✅ landing.html
✅ login.html
✅ login.js
✅ register.html
✅ register.js
✅ styles.css
✅ package.json
✅ vercel.json
✅ .gitignore
✅ README.md
```

## Step 2: Initialize Git Repository

```bash
# Navigate to your project folder
cd "d:\cinematch final"

# Initialize git (if not already done)
git init

# Add all files (respects .gitignore)
git add .

# Make your first commit
git commit -m "Initial commit: CineMatch movie database app"
```

## Step 3: Create GitHub Repository

1. Go to https://github.com
2. Click the **+** icon → **New repository**
3. Repository name: `cinematch` (or your preferred name)
4. Description: "Movie discovery and tracking application"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (you already have these)
7. Click **Create repository**

## Step 4: Push to GitHub

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/cinematch.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 5: Verify

1. Go to your GitHub repository
2. Check that all files are there
3. Verify `.gitignore` is working (unnecessary files should not appear)

## Clean Repository Structure

After cleanup, your repository should look like:

```
cinematch/
├── api/
│   └── movie-search.js
├── auth.js
├── database.html
├── database.js
├── home.html
├── home.js
├── index.png
├── landing.html
├── login.html
├── login.js
├── register.html
├── register.js
├── styles.css
├── package.json
├── vercel.json
├── .gitignore
├── README.md
└── VERCEL_DEPLOYMENT.md (optional)
```

## Quick Commands Reference

```bash
# Check what will be committed
git status

# See what files are ignored
git status --ignored

# Remove files from git (but keep locally)
git rm --cached -r "New folder"
git rm --cached -r "CINEMATCH"

# Commit the removal
git commit -m "Remove unnecessary folders"

# Push changes
git push
```

## Tips for Clean Repository

1. ✅ **Keep it simple**: Only essential files
2. ✅ **Use .gitignore**: Automatically excludes unnecessary files
3. ✅ **Good README**: Clear instructions for others
4. ✅ **Organized structure**: Logical file organization
5. ✅ **No sensitive data**: API keys in env vars, not in code

## After Pushing to GitHub

1. **Deploy to Vercel**:
   - Go to Vercel
   - Import from GitHub
   - Set `TMDB_API_KEY` environment variable
   - Deploy!

2. **Share your project**:
   - Clean repository = professional look
   - Easy for others to understand
   - Ready for portfolio/resume


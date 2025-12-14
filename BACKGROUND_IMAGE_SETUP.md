# 🖼️ Background Image Setup Instructions

## Quick Setup Guide

### Step 1: Prepare Your Image
1. Choose your background image file
2. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
3. Recommended size: 1920x1080 or larger for best quality
4. Place the image file in the **same folder** as your HTML files

### Step 2: Update Configuration

You need to update the background image in **TWO places**:

#### A. For Login & Register Pages (`styles.css`)

1. Open `styles.css`
2. Find line **26** (in the `:root` section):
   ```css
   --background-image: url('cine-match-bg.jpg');
   ```
3. Change `'cine-match-bg.jpg'` to your image filename:
   ```css
   --background-image: url('your-image.jpg');
   ```

#### B. For Home Page (`home.html`)

1. Open `home.html`
2. Find line **35** (in the `<style>` section):
   ```css
   background-image: url('cine-match-bg.jpg');
   ```
3. Change `'cine-match-bg.jpg'` to your image filename:
   ```css
   background-image: url('your-image.jpg');
   ```
4. Also update line **67** (in the `::after` pseudo-element):
   ```css
   background-image: url('your-image.jpg');
   ```

### Step 3: Verify

1. Make sure the filename matches **EXACTLY** (case-sensitive)
2. Make sure the file is in the same folder as your HTML files
3. Refresh your browser (Ctrl+F5 or Cmd+Shift+R to clear cache)

---

## Common Issues & Solutions

### ❌ Background Image Not Showing

**Problem:** Only gradient is visible, no image

**Solutions:**
1. **Check filename spelling** - Must match exactly (case-sensitive)
   - ✅ `cine-match-bg.jpg`
   - ❌ `Cine-Match-Bg.jpg` (wrong case)
   - ❌ `cine-match-bg.JPG` (wrong extension case)

2. **Check file location** - Image must be in same folder as HTML files
   ```
   Your Project Folder/
   ├── home.html
   ├── login.html
   ├── register.html
   ├── styles.css
   └── your-image.jpg  ← Image should be here
   ```

3. **Check file extension** - Make sure it matches
   - If file is `background.png`, use `url('background.png')`
   - If file is `bg.jpg`, use `url('bg.jpg')`

4. **Clear browser cache** - Old cached version might be showing
   - Press `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)

5. **Check browser console** - Open Developer Tools (F12)
   - Look for 404 errors for the image file
   - This will tell you if the file path is wrong

### ❌ Image Shows But Looks Wrong

**Problem:** Image is stretched, cropped, or positioned incorrectly

**Solutions:**
- The CSS uses `background-size: cover` which fills the entire screen
- For different sizing, you can change in `styles.css`:
  - `cover` - Fills screen, may crop edges
  - `contain` - Shows full image, may have empty space
  - `100% 100%` - Stretches to fill exactly

### ❌ Different Images on Different Pages

**Problem:** Login/Register show one image, Home shows another

**Solution:**
- Make sure you updated **both** locations:
  1. `styles.css` line 26 (for login/register)
  2. `home.html` lines 35 and 67 (for home page)

---

## Examples

### Example 1: Using a PNG file
```css
/* In styles.css */
--background-image: url('movie-background.png');

/* In home.html */
background-image: url('movie-background.png');
```

### Example 2: Image in a subfolder
```css
/* In styles.css */
--background-image: url('images/background.jpg');

/* In home.html */
background-image: url('images/background.jpg');
```

### Example 3: Remove background image (use gradient only)
```css
/* In styles.css */
--background-image: url('');

/* In home.html */
background-image: url('');
```

---

## File Structure Reference

```
Your Project/
├── home.html          ← Home page
├── login.html         ← Login page (uses styles.css)
├── register.html      ← Register page (uses styles.css)
├── database.html      ← Database page (uses styles.css)
├── styles.css         ← Global styles (background for login/register)
├── home.js
├── login.js
├── register.js
├── database.js
├── auth.js
└── your-image.jpg    ← Your background image here
```

---

## Testing Checklist

- [ ] Image file is in the correct folder
- [ ] Filename matches exactly (case-sensitive)
- [ ] Updated `styles.css` line 26
- [ ] Updated `home.html` line 35
- [ ] Updated `home.html` line 67
- [ ] Cleared browser cache
- [ ] Checked browser console for errors
- [ ] Tested on login page
- [ ] Tested on register page
- [ ] Tested on home page

---

## Need Help?

If the image still doesn't show:
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for red error messages
4. Go to Network tab
5. Refresh the page
6. Look for your image file - if it shows 404, the path is wrong


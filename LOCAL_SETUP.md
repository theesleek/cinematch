# 🏠 Local Development Setup

## Quick Start

### Option 1: Simple File Opening (No Server)
1. **Add your TMDB API key**:
   - Open `home.js`
   - Find line 26: `const TMDB_API_KEY = 'YOUR_TMDB_API_KEY_HERE';`
   - Replace with your actual API key: `const TMDB_API_KEY = 'your-key-here';`

2. **Open the app**:
   - Simply open `home.html` in your web browser
   - The app will automatically use direct API calls

**Note:** This method may have CORS limitations. For best results, use Option 2.

---

### Option 2: Local Server (Recommended)

1. **Add your TMDB API key** (same as Option 1)

2. **Start a local server**:

   **Using Python:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Using Node.js:**
   ```bash
   # Install http-server globally (one time)
   npm install -g http-server
   
   # Run server
   http-server -p 8000
   ```

   **Using PHP:**
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**:
   - Go to `http://localhost:8000`
   - Open `home.html`

---

## How It Works

The app **automatically detects** where it's running:

- **On Vercel**: Uses `/api/movie-search` proxy (requires `TMDB_API_KEY` in Vercel env vars)
- **Locally**: Uses direct TMDB API calls (requires API key in `home.js`)

No code changes needed when deploying to Vercel!

---

## Getting Your TMDB API Key

1. Go to https://www.themoviedb.org/
2. Sign up or log in (free account)
3. Navigate to **Settings** → **API**
4. Click **Request an API Key**
5. Fill out the form (select "Developer" for personal use)
6. Copy your API key

---

## Troubleshooting

### "TMDB API Key not configured"
- Make sure you've added your API key in `home.js` line 26
- Check that the key is between quotes: `'your-key-here'`

### "Network Error" or CORS Error
- Use a local server (Option 2) instead of opening the file directly
- Or deploy to Vercel where CORS is handled automatically

### "Invalid API key"
- Verify your API key is correct
- Make sure there are no extra spaces
- Get a new key from TMDB if needed

### API Not Working Locally
- Check your internet connection
- Verify the API key is correct
- Try using a local server instead of opening the file directly

---

## Testing Both Modes

**Local Mode:**
- Open `home.html` in browser (or via local server)
- Should use direct API calls
- Requires API key in `home.js`

**Vercel Mode:**
- Deploy to Vercel
- Should automatically use API proxy
- Requires `TMDB_API_KEY` in Vercel Environment Variables

The app detects the environment automatically! 🎉


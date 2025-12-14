/**
 * Home Page Script
 * Handles TMDB API search, account menu, and user authentication state
 */

// ============================================
// TMDB API CONFIGURATION
// ============================================
// 
// DEPLOYMENT MODE:
// - On Vercel: Uses API proxy function (/api/movie-search) - handles CORS and VPN issues
// - Local development: Can use direct API or proxy
//
// FOR LOCAL DEVELOPMENT (if not using proxy):
// 1. Go to https://www.themoviedb.org/
// 2. Create a free account
// 3. Go to Settings > API
// 4. Request an API key (it's free)
// 5. Copy your API key
// 6. Replace 'YOUR_TMDB_API_KEY_HERE' below with your actual API key
//
// FOR VERCEL DEPLOYMENT:
// Set TMDB_API_KEY in Vercel Environment Variables (Settings > Environment Variables)
// The API proxy will automatically use it
//
const TMDB_API_KEY = '0b7ec94633601478da8ad67533d0275c'; // Only needed for local direct API calls

// Detect if running on Vercel, Netlify, or local
const IS_VERCEL = window.location.hostname.includes('vercel.app') || 
                  window.location.hostname.includes('vercel.com') ||
                  window.location.hostname.includes('.vercel.app');
const IS_NETLIFY = window.location.hostname.includes('netlify.app') ||
                   window.location.hostname.includes('netlify.com');

// API Configuration
// Automatically uses proxy on Vercel/Netlify, direct API locally
// On Vercel: Uses /api/movie-search proxy (requires TMDB_API_KEY in Vercel env vars)
// On Netlify: Uses direct API (Netlify Functions setup optional - see DEPLOYMENT_FIX.md)
// Locally: Uses direct TMDB API (requires API key in home.js below)
const USE_API_PROXY = IS_VERCEL; // Netlify can use direct API or set up Functions
const API_PROXY_URL = '/api/movie-search';
const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Genre mapping (TMDB genre IDs to names)
let genreMap = {};
let selectedGenre = null;
let loadedSections = new Set();

// ============================================
// Search Functionality
// ============================================

/**
 * Search for movies using TMDB API
 * @param {string} query - Search query
 */
async function searchMovies() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    const resultsSection = document.getElementById('resultsSection');
    const resultsContainer = document.getElementById('resultsContainer');
    
    if (!query) {
        alert('Please enter a search term');
        return;
    }
    
    // Clear genre filter when searching
    if (selectedGenre) {
        clearGenreFilter();
    }
    
    // Show loading state
    resultsSection.style.display = 'block';
    resultsContainer.innerHTML = '<div class="loading">🔍 Searching movies...</div>';
    
    try {
        let data;
        
        if (USE_API_PROXY) {
            // Use API proxy (on Vercel - handles CORS and VPN issues)
            const proxyUrl = `${API_PROXY_URL}?type=search&query=${encodeURIComponent(query)}&page=1&media_type=movie`;
            const response = await fetch(proxyUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `API Error: ${response.status}`);
            }
            
            const proxyData = await response.json();
            
            if (!proxyData.success) {
                throw new Error(proxyData.message || 'API request failed');
            }
            
            data = {
                results: proxyData.results || [],
                total_pages: proxyData.total_pages || 0,
                total_results: proxyData.total_results || 0
            };
        } else {
            // Direct API call (for local development)
            if (TMDB_API_KEY === 'YOUR_TMDB_API_KEY_HERE' || !TMDB_API_KEY) {
                resultsContainer.innerHTML = `
                    <div class="no-results">
                        <p>⚠️ TMDB API Key not configured</p>
                        <p style="margin-top: 10px; font-size: 14px;">
                            For local development, please add your TMDB API key in <code>home.js</code> (line 26)
                        </p>
                        <p style="margin-top: 10px; font-size: 12px; opacity: 0.8;">
                            Get your API key from: <a href="https://www.themoviedb.org/settings/api" target="_blank" style="color: var(--home-light-purple);">themoviedb.org/settings/api</a>
                        </p>
                    </div>
                `;
                return;
            }
            
            const response = await fetch(
                `${TMDB_API_BASE}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`
            );
            
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Invalid API key. Please check your TMDB API key in home.js');
                }
                throw new Error(`API Error: ${response.status}`);
            }
            
            data = await response.json();
        }
        
        if (data.results && data.results.length > 0) {
            displayMovieResults(data.results);
        } else {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>No movies found for "${escapeHtml(query)}"</p>
                    <p style="margin-top: 10px; font-size: 14px;">Try a different search term</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Search error:', error);
        const isNetworkError = error.message.includes('Failed to fetch') || error.message.includes('NetworkError');
        
        resultsContainer.innerHTML = `
            <div class="no-results">
                <p>❌ Error searching movies</p>
                <p style="margin-top: 10px; font-size: 14px;">
                    ${error.message || 'An unexpected error occurred'}
                </p>
                ${USE_API_PROXY ? `
                    <p style="margin-top: 10px; font-size: 12px; opacity: 0.8;">
                        ${isNetworkError ? 'Network error. ' : ''}Make sure TMDB_API_KEY is set in Vercel Environment Variables
                    </p>
                ` : `
                    <p style="margin-top: 10px; font-size: 12px; opacity: 0.8;">
                        ${isNetworkError ? 'Network error. ' : ''}For local development, add your API key in home.js (line 26)
                    </p>
                `}
            </div>
        `;
    }
}

/**
 * Display movie search results
 * @param {Array} movies - Array of movie objects from TMDB
 */
function displayMovieResults(movies) {
    const resultsContainer = document.getElementById('resultsContainer');
    
    const moviesHTML = movies.map(movie => {
        return createMovieCard(movie);
    }).join('');
    
    resultsContainer.innerHTML = `
        <div class="results-grid">
            ${moviesHTML}
        </div>
    `;
}

/**
 * Create a movie card HTML element
 * @param {Object} movie - Movie object from TMDB
 * @param {string} mediaType - 'movie' or 'tv'
 * @returns {string} HTML string for movie card
 */
function createMovieCard(movie, mediaType = 'movie') {
    const posterPath = movie.poster_path 
        ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
        : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzJkMWI0ZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM4YjVjZjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
    
    const title = movie.title || movie.name || 'Unknown';
    const releaseDate = movie.release_date || movie.first_air_date || null;
    const releaseYear = releaseDate 
        ? new Date(releaseDate).getFullYear()
        : 'N/A';
    
    // Get genres for the movie
    const genres = movie.genre_ids ? movie.genre_ids.map(id => genreMap[id]).filter(Boolean) : [];
    const genresHTML = genres.slice(0, 2).map(genre => 
        `<span class="movie-genre">${escapeHtml(genre)}</span>`
    ).join('');
    
    return `
        <div class="movie-card" onclick="handleMovieClick(${movie.id}, '${escapeHtml(title)}', ${releaseDate ? `'${releaseDate}'` : 'null'}, '${mediaType}')">
            <img 
                src="${posterPath}" 
                alt="${escapeHtml(title)}" 
                class="movie-poster"
                loading="lazy"
                onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzJkMWI0ZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM4YjVjZjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='"
            >
            <div class="movie-info">
                <div class="movie-title">${escapeHtml(title)}</div>
                <div class="movie-year">${releaseYear}</div>
                ${genresHTML ? `<div style="margin-top: 8px;">${genresHTML}</div>` : ''}
            </div>
        </div>
    `;
}

/**
 * Handle movie card click
 * @param {number} movieId - TMDB movie ID
 * @param {string} title - Movie title
 * @param {string|null} releaseDate - Release date
 * @param {string} mediaType - 'movie' or 'tv'
 */
function handleMovieClick(movieId, title, releaseDate, mediaType = 'movie') {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        // If not logged in, prompt to login
        if (confirm('Please login to add movies to your database. Would you like to go to the login page?')) {
            window.location.href = 'login.html';
        }
        return;
    }
    
    // If logged in, redirect to database to add the movie
    const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
    const encodedTitle = encodeURIComponent(title);
    const encodedYear = year ? encodeURIComponent(year) : '';
    
    // Redirect to database page with movie info
    window.location.href = `database.html?addMovie=${encodedTitle}&year=${encodedYear}`;
}

// ============================================
// Account Menu Functionality
// ============================================

/**
 * Toggle account menu dropdown
 */
function toggleAccountMenu() {
    const menu = document.getElementById('accountMenu');
    menu.classList.toggle('show');
}

/**
 * Close account menu when clicking outside
 */
document.addEventListener('click', function(event) {
    const accountMenu = document.getElementById('accountMenu');
    const accountButton = document.getElementById('accountButton');
    
    if (!accountMenu.contains(event.target) && !accountButton.contains(event.target)) {
        accountMenu.classList.remove('show');
    }
});

/**
 * Handle logout
 */
function handleLogout() {
    logoutUser();
    updateAccountMenu();
    // Close the dropdown menu
    const menu = document.getElementById('accountMenu');
    menu.classList.remove('show');
}

/**
 * Update account menu based on login status
 */
function updateAccountMenu() {
    const currentUser = getCurrentUser();
    const accountButtonText = document.getElementById('accountButtonText');
    const logoutButton = document.getElementById('logoutButton');
    const loginLink = document.getElementById('loginLink');
    
    if (currentUser) {
        // User is logged in
        accountButtonText.textContent = currentUser.name;
        if (logoutButton) logoutButton.style.display = 'block';
        if (loginLink) loginLink.style.display = 'none';
        
        // Show database links (always visible, but now user is logged in)
        const wishlistLink = document.getElementById('wishlistLink');
        const watchingLink = document.getElementById('watchingLink');
        const watchedLink = document.getElementById('watchedLink');
        if (wishlistLink) wishlistLink.style.display = 'block';
        if (watchingLink) watchingLink.style.display = 'block';
        if (watchedLink) watchedLink.style.display = 'block';
    } else {
        // User is not logged in
        accountButtonText.textContent = 'Account';
        if (logoutButton) logoutButton.style.display = 'none';
        if (loginLink) loginLink.style.display = 'block';
        
        // Show database links (they will redirect to login page if clicked)
        // This way users can see what's available in the menu
        const wishlistLink = document.getElementById('wishlistLink');
        const watchingLink = document.getElementById('watchingLink');
        const watchedLink = document.getElementById('watchedLink');
        if (wishlistLink) wishlistLink.style.display = 'block';
        if (watchingLink) watchingLink.style.display = 'block';
        if (watchedLink) watchedLink.style.display = 'block';
    }
}

// ============================================
// Genre Functions
// ============================================

/**
 * Fetch and display genres
 */
async function loadGenres() {
    const genresContainer = document.getElementById('genresContainer');
    
    try {
        let data;
        
        if (USE_API_PROXY) {
            const response = await fetch(`${API_PROXY_URL}?type=genres&media_type=movie`);
            if (!response.ok) throw new Error('Failed to fetch genres');
            const proxyData = await response.json();
            if (!proxyData.success) throw new Error('Failed to fetch genres');
            data = { genres: proxyData.genres || [] };
        } else {
            const response = await fetch(`${TMDB_API_BASE}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`);
            if (!response.ok) throw new Error('Failed to fetch genres');
            const result = await response.json();
            data = { genres: result.genres || [] };
        }
        
        // Build genre map
        genreMap = {};
        data.genres.forEach(genre => {
            genreMap[genre.id] = genre.name;
        });
        
        // Display genres with "All" option
        const genresHTML = `<div class="genre-chip active" onclick="clearGenreFilter()">All</div>` + 
            data.genres.map(genre => 
                `<div class="genre-chip" onclick="filterByGenre(${genre.id}, '${escapeHtml(genre.name)}')">${escapeHtml(genre.name)}</div>`
            ).join('');
        
        genresContainer.innerHTML = genresHTML;
    } catch (error) {
        console.error('Error loading genres:', error);
        genresContainer.innerHTML = '<div class="section-loading">Failed to load genres</div>';
    }
}

/**
 * Clear genre filter
 */
function clearGenreFilter() {
    selectedGenre = null;
    
    // Update active state
    document.querySelectorAll('.genre-chip').forEach(chip => {
        chip.classList.remove('active');
        if (chip.textContent.trim() === 'All') {
            chip.classList.add('active');
        }
    });
    
    // Hide results section
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'none';
}

/**
 * Filter movies by genre
 * @param {number} genreId - Genre ID
 * @param {string} genreName - Genre name
 */
async function filterByGenre(genreId, genreName) {
    // Update active state
    document.querySelectorAll('.genre-chip').forEach(chip => {
        chip.classList.remove('active');
        if (chip.textContent.trim() === genreName) {
            chip.classList.add('active');
        }
    });
    
    selectedGenre = genreId;
    
    // Clear search results and show genre results
    const resultsSection = document.getElementById('resultsSection');
    const resultsContainer = document.getElementById('resultsContainer');
    resultsSection.style.display = 'block';
    resultsContainer.innerHTML = '<div class="loading">Loading movies...</div>';
    
    try {
        let data;
        
        if (USE_API_PROXY) {
            const response = await fetch(`${API_PROXY_URL}?type=discover&media_type=movie&genre=${genreId}&page=1`);
            if (!response.ok) throw new Error('Failed to fetch movies');
            data = await response.json();
        } else {
            const response = await fetch(`${TMDB_API_BASE}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreId}`);
            if (!response.ok) throw new Error('Failed to fetch movies');
            data = await response.json();
        }
        
        if (data.results && data.results.length > 0) {
            displayMovieResults(data.results);
        } else {
            resultsContainer.innerHTML = '<div class="no-results">No movies found in this genre</div>';
        }
    } catch (error) {
        console.error('Error filtering by genre:', error);
        resultsContainer.innerHTML = '<div class="no-results">Error loading movies</div>';
    }
}

// ============================================
// Content Section Functions
// ============================================

/**
 * Fetch data from TMDB API
 * @param {string} type - Endpoint type (popular, top_rated, etc.)
 * @param {string} mediaType - 'movie' or 'tv'
 * @param {number} page - Page number
 * @returns {Promise<Object>} API response data
 */
async function fetchTMDBData(type, mediaType = 'movie', page = 1) {
    try {
        if (USE_API_PROXY) {
            const response = await fetch(`${API_PROXY_URL}?type=${type}&media_type=${mediaType}&page=${page}`);
            if (!response.ok) throw new Error(`Failed to fetch ${type}`);
            return await response.json();
        } else {
            let url;
            if (type === 'popular') {
                url = `${TMDB_API_BASE}/${mediaType}/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`;
            } else if (type === 'top_rated') {
                url = `${TMDB_API_BASE}/${mediaType}/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`;
            } else if (type === 'now_playing') {
                url = `${TMDB_API_BASE}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`;
            } else if (type === 'on_the_air') {
                url = `${TMDB_API_BASE}/tv/on_the_air?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`;
            } else {
                throw new Error('Invalid type');
            }
            
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch ${type}`);
            return await response.json();
        }
    } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        throw error;
    }
}

/**
 * Load and display popular movies
 */
async function loadPopularMovies() {
    if (loadedSections.has('popular')) return;
    loadedSections.add('popular');
    
    const container = document.getElementById('popularContainer');
    
    try {
        const data = await fetchTMDBData('popular', 'movie');
        if (data.results && data.results.length > 0) {
            const moviesHTML = data.results.map(movie => createMovieCard(movie, 'movie')).join('');
            container.innerHTML = `<div class="section-grid">${moviesHTML}</div>`;
        } else {
            container.innerHTML = '<div class="no-results">No popular movies found</div>';
        }
    } catch (error) {
        container.innerHTML = '<div class="no-results">Failed to load popular movies</div>';
    }
}

/**
 * Load and display top rated movies
 */
async function loadTopRatedMovies() {
    if (loadedSections.has('topRated')) return;
    loadedSections.add('topRated');
    
    const container = document.getElementById('topRatedContainer');
    
    try {
        const data = await fetchTMDBData('top_rated', 'movie');
        if (data.results && data.results.length > 0) {
            const moviesHTML = data.results.map(movie => createMovieCard(movie, 'movie')).join('');
            container.innerHTML = `<div class="section-grid">${moviesHTML}</div>`;
        } else {
            container.innerHTML = '<div class="no-results">No top rated movies found</div>';
        }
    } catch (error) {
        container.innerHTML = '<div class="no-results">Failed to load top rated movies</div>';
    }
}

/**
 * Load and display now playing movies
 */
async function loadNowPlayingMovies() {
    if (loadedSections.has('nowPlaying')) return;
    loadedSections.add('nowPlaying');
    
    const container = document.getElementById('nowPlayingContainer');
    
    try {
        const data = await fetchTMDBData('now_playing', 'movie');
        if (data.results && data.results.length > 0) {
            const moviesHTML = data.results.map(movie => createMovieCard(movie, 'movie')).join('');
            container.innerHTML = `<div class="section-grid">${moviesHTML}</div>`;
        } else {
            container.innerHTML = '<div class="no-results">No now playing movies found</div>';
        }
    } catch (error) {
        container.innerHTML = '<div class="no-results">Failed to load now playing movies</div>';
    }
}

/**
 * Load and display popular TV shows
 */
async function loadTVShows() {
    if (loadedSections.has('tvShows')) return;
    loadedSections.add('tvShows');
    
    const container = document.getElementById('tvShowsContainer');
    
    try {
        const data = await fetchTMDBData('popular', 'tv');
        if (data.results && data.results.length > 0) {
            const showsHTML = data.results.map(show => createMovieCard(show, 'tv')).join('');
            container.innerHTML = `<div class="section-grid">${showsHTML}</div>`;
        } else {
            container.innerHTML = '<div class="no-results">No TV shows found</div>';
        }
    } catch (error) {
        container.innerHTML = '<div class="no-results">Failed to load TV shows</div>';
    }
}

/**
 * Load and display shows on the air
 */
async function loadOnTheAir() {
    if (loadedSections.has('onTheAir')) return;
    loadedSections.add('onTheAir');
    
    const container = document.getElementById('onTheAirContainer');
    
    try {
        const data = await fetchTMDBData('on_the_air', 'tv');
        if (data.results && data.results.length > 0) {
            const showsHTML = data.results.map(show => createMovieCard(show, 'tv')).join('');
            container.innerHTML = `<div class="section-grid">${showsHTML}</div>`;
        } else {
            container.innerHTML = '<div class="no-results">No shows on the air found</div>';
        }
    } catch (error) {
        container.innerHTML = '<div class="no-results">Failed to load shows on the air</div>';
    }
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) + 200
    );
}

/**
 * Handle scroll to load sections
 */
function handleScroll() {
    const sections = [
        { id: 'popularSection', loader: loadPopularMovies },
        { id: 'topRatedSection', loader: loadTopRatedMovies },
        { id: 'nowPlayingSection', loader: loadNowPlayingMovies },
        { id: 'tvShowsSection', loader: loadTVShows },
        { id: 'onTheAirSection', loader: loadOnTheAir }
    ];
    
    sections.forEach(({ id, loader }) => {
        const section = document.getElementById(id);
        if (section && isInViewport(section)) {
            loader();
        }
    });
}

// ============================================
// Utility Functions
// ============================================

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// Initialize Page
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Update account menu based on login status
    updateAccountMenu();
    
    // Load genres
    loadGenres();
    
    // Load initial sections (popular movies)
    loadPopularMovies();
    
    // Handle Enter key in search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchMovies();
            }
        });
    }
    
    // Close dropdown when clicking on a link
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            const menu = document.getElementById('accountMenu');
            if (menu) {
                menu.classList.remove('show');
            }
        });
    });
    
    // Ensure dropdown menu is properly initialized
    const accountMenu = document.getElementById('accountMenu');
    if (accountMenu && !accountMenu.classList.contains('initialized')) {
        accountMenu.classList.add('initialized');
    }
    
    // Handle scroll to load sections
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 100);
    });
    
    // Initial check for sections in viewport
    setTimeout(handleScroll, 500);
});


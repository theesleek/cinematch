/**
 * Movie Database Script
 * Handles movie storage, management, and user-specific data
 * Works online and offline using localStorage
 */

// Storage key for movies (user-specific)
const MOVIES_STORAGE_KEY = 'user_movies';

/**
 * Get current user's movies from storage
 * @returns {Object} Object with wishlist, watching, and already_watched arrays
 */
function getUserMovies() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return { wishlist: [], watching: [], already_watched: [] };
    }
    
    const storageKey = `${MOVIES_STORAGE_KEY}_${currentUser.id}`;
    const moviesJson = localStorage.getItem(storageKey);
    
    if (!moviesJson) {
        // Initialize empty movie lists for new user
        const emptyMovies = { wishlist: [], watching: [], already_watched: [] };
        localStorage.setItem(storageKey, JSON.stringify(emptyMovies));
        return emptyMovies;
    }
    
    return JSON.parse(moviesJson);
}

/**
 * Save current user's movies to storage
 * @param {Object} movies - Object with wishlist, watching, and already_watched arrays
 */
function saveUserMovies(movies) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return;
    }
    
    const storageKey = `${MOVIES_STORAGE_KEY}_${currentUser.id}`;
    localStorage.setItem(storageKey, JSON.stringify(movies));
}

/**
 * Add a new movie to the database
 * @param {string} title - Movie title
 * @param {string} category - Category (wishlist, watching, already_watched)
 * @param {number|null} year - Movie year (optional)
 * @returns {Object} Result object with success status and message
 */
function addMovie(title, category, year = null) {
    if (!title || !title.trim()) {
        return {
            success: false,
            message: 'Movie title is required'
        };
    }
    
    if (!['wishlist', 'watching', 'already_watched'].includes(category)) {
        return {
            success: false,
            message: 'Invalid category'
        };
    }
    
    const movies = getUserMovies();
    
    // Check if movie already exists in any category
    const allMovies = [...movies.wishlist, ...movies.watching, ...movies.already_watched];
    const existingMovie = allMovies.find(
        movie => movie.title.toLowerCase().trim() === title.toLowerCase().trim()
    );
    
    if (existingMovie) {
        return {
            success: false,
            message: 'This movie already exists in your database'
        };
    }
    
    // Create new movie object
    const newMovie = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: title.trim(),
        year: year || null,
        category: category,
        addedAt: new Date().toISOString()
    };
    
    // Add to appropriate category
    movies[category].push(newMovie);
    saveUserMovies(movies);
    
    // Display category name nicely
    const categoryNames = {
        wishlist: 'Wishlist',
        watching: 'Watching',
        already_watched: 'Already Watched'
    };
    
    return {
        success: true,
        message: `Movie "${title}" added to ${categoryNames[category]} category`,
        movie: newMovie
    };
}

/**
 * Move a movie between categories
 * @param {string} movieId - Movie ID
 * @param {string} newCategory - New category (wishlist, watching, already_watched)
 * @returns {Object} Result object with success status and message
 */
function moveMovie(movieId, newCategory) {
    if (!['wishlist', 'watching', 'already_watched'].includes(newCategory)) {
        return {
            success: false,
            message: 'Invalid category'
        };
    }
    
    const movies = getUserMovies();
    let movie = null;
    let oldCategory = null;
    
    // Find and remove movie from current category
    for (const category of ['wishlist', 'watching', 'already_watched']) {
        const index = movies[category].findIndex(m => m.id === movieId);
        if (index !== -1) {
            movie = movies[category].splice(index, 1)[0];
            oldCategory = category;
            break;
        }
    }
    
    if (!movie) {
        return {
            success: false,
            message: 'Movie not found'
        };
    }
    
    // Don't move if already in the same category
    if (oldCategory === newCategory) {
        return {
            success: false,
            message: 'Movie is already in this category'
        };
    }
    
    // Update movie category and add to new category
    movie.category = newCategory;
    movies[newCategory].push(movie);
    saveUserMovies(movies);
    
    // Display category name nicely
    const categoryNames = {
        wishlist: 'Wishlist',
        watching: 'Watching',
        already_watched: 'Already Watched'
    };
    
    return {
        success: true,
        message: `Movie moved to ${categoryNames[newCategory]} category`,
        movie: movie
    };
}

/**
 * Delete a movie from the database
 * @param {string} movieId - Movie ID
 * @returns {Object} Result object with success status and message
 */
function deleteMovie(movieId) {
    const movies = getUserMovies();
    let deleted = false;
    let movieTitle = '';
    
    // Find and remove movie from any category
    for (const category of ['wishlist', 'watching', 'already_watched']) {
        const index = movies[category].findIndex(m => m.id === movieId);
        if (index !== -1) {
            movieTitle = movies[category][index].title;
            movies[category].splice(index, 1);
            deleted = true;
            break;
        }
    }
    
    if (!deleted) {
        return {
            success: false,
            message: 'Movie not found'
        };
    }
    
    saveUserMovies(movies);
    
    return {
        success: true,
        message: `Movie "${movieTitle}" deleted successfully`
    };
}

/**
 * Render all movies in their respective categories
 */
function renderMovies() {
    const movies = getUserMovies();
    
    // Render each category
    ['wishlist', 'watching', 'already_watched'].forEach(category => {
        const listElement = document.getElementById(`${category}List`);
        const countElement = document.getElementById(`${category}Count`);
        
        if (!listElement || !countElement) return;
        
        const categoryMovies = movies[category];
        countElement.textContent = categoryMovies.length;
        
        // Clear list
        listElement.innerHTML = '';
        
        if (categoryMovies.length === 0) {
            // Show empty state
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            const icons = { wishlist: '📽️', watching: '🎥', already_watched: '🎬' };
            emptyState.innerHTML = `
                <div class="empty-state-icon">${icons[category]}</div>
                <p>No movies in this category</p>
            `;
            listElement.appendChild(emptyState);
        } else {
            // Render movies
            categoryMovies.forEach(movie => {
                const movieItem = createMovieElement(movie, category);
                listElement.appendChild(movieItem);
            });
        }
    });
}

/**
 * Create a movie element for display
 * @param {Object} movie - Movie object
 * @param {string} currentCategory - Current category
 * @returns {HTMLElement} Movie element
 */
function createMovieElement(movie, currentCategory) {
    const movieDiv = document.createElement('div');
    movieDiv.className = 'movie-item';
    movieDiv.dataset.movieId = movie.id;
    
    const yearText = movie.year ? ` (${movie.year})` : '';
    
    movieDiv.innerHTML = `
        <div class="movie-title">${escapeHtml(movie.title)}${yearText}</div>
        <div class="movie-actions">
            ${createCategoryButtons(movie, currentCategory)}
            <button class="btn-small btn-delete" onclick="handleDeleteMovie('${movie.id}')">Delete</button>
        </div>
    `;
    
    return movieDiv;
}

/**
 * Create category move buttons for a movie
 * @param {Object} movie - Movie object
 * @param {string} currentCategory - Current category
 * @returns {string} HTML string for buttons
 */
function createCategoryButtons(movie, currentCategory) {
    const categories = [
        { value: 'wishlist', label: 'Wishlist' },
        { value: 'watching', label: 'Watching' },
        { value: 'already_watched', label: 'Already Watched' }
    ];
    
    return categories
        .filter(cat => cat.value !== currentCategory)
        .map(cat => 
            `<button class="btn-small btn-move" onclick="handleMoveMovie('${movie.id}', '${cat.value}')">Move to ${cat.label}</button>`
        )
        .join('');
}

/**
 * Handle movie deletion
 * @param {string} movieId - Movie ID
 */
function handleDeleteMovie(movieId) {
    if (!confirm('Are you sure you want to delete this movie?')) {
        return;
    }
    
    const result = deleteMovie(movieId);
    showMessage(result.message, result.success ? 'success' : 'error');
    
    if (result.success) {
        renderMovies();
    }
}

/**
 * Handle moving a movie to a different category
 * @param {string} movieId - Movie ID
 * @param {string} newCategory - New category
 */
function handleMoveMovie(movieId, newCategory) {
    const result = moveMovie(movieId, newCategory);
    showMessage(result.message, result.success ? 'success' : 'error');
    
    if (result.success) {
        renderMovies();
    }
}

/**
 * Handle logout
 */
function handleLogout() {
    logoutUser();
    window.location.href = 'home.html';
}

/**
 * Display a message
 * @param {string} text - Message text
 * @param {string} type - Message type ('success' or 'error')
 */
function showMessage(text, type = 'success') {
    const messageElement = document.getElementById('message');
    if (!messageElement) return;
    
    messageElement.textContent = text;
    messageElement.className = `message ${type === 'success' ? 'success-message' : 'error-message'}`;
    messageElement.style.display = 'block';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 3000);
}

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

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        // Redirect to login page if not authenticated
        window.location.href = 'login.html';
        return;
    }
    
    // Display user greeting
    const greetingElement = document.getElementById('userGreeting');
    if (greetingElement) {
        greetingElement.textContent = `Welcome back, ${escapeHtml(currentUser.name)}!`;
    }
    
    // Handle URL parameters for adding movies from home page
    const urlParams = new URLSearchParams(window.location.search);
    const addMovieParam = urlParams.get('addMovie');
    const yearParam = urlParams.get('year');
    
    if (addMovieParam) {
        // Pre-fill the form with movie data from URL
        const movieTitle = document.getElementById('movieTitle');
        const movieYear = document.getElementById('movieYear');
        
        if (movieTitle) {
            movieTitle.value = decodeURIComponent(addMovieParam);
        }
        if (movieYear && yearParam) {
            movieYear.value = decodeURIComponent(yearParam);
        }
        
        // Scroll to form
        const addMovieSection = document.querySelector('.add-movie-section');
        if (addMovieSection) {
            addMovieSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Highlight the form
        if (movieTitle) {
            movieTitle.focus();
            movieTitle.style.borderColor = 'var(--primary-color)';
            setTimeout(() => {
                if (movieTitle) movieTitle.style.borderColor = '';
            }, 2000);
        }
        
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Handle hash navigation to specific category
    const hash = window.location.hash.substring(1);
    if (hash && ['wishlist', 'watching', 'already_watched'].includes(hash)) {
        const categoryCard = document.querySelector(`[data-category="${hash}"]`);
        if (categoryCard) {
            setTimeout(() => {
                categoryCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Highlight the category briefly
                categoryCard.style.transition = 'box-shadow 0.3s ease';
                categoryCard.style.boxShadow = '0 0 20px rgba(79, 70, 229, 0.5)';
                setTimeout(() => {
                    categoryCard.style.boxShadow = '';
                }, 2000);
            }, 300);
        }
    }
    
    // Handle add movie form submission
    const addMovieForm = document.getElementById('addMovieForm');
    if (addMovieForm) {
        addMovieForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('movieTitle').value.trim();
            const category = document.getElementById('movieCategory').value;
            const year = document.getElementById('movieYear').value 
                ? parseInt(document.getElementById('movieYear').value) 
                : null;
            
            const result = addMovie(title, category, year);
            showMessage(result.message, result.success ? 'success' : 'error');
            
            if (result.success) {
                addMovieForm.reset();
                renderMovies();
            }
        });
    }
    
    // Initial render of movies
    renderMovies();
});


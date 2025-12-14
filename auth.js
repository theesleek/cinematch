/**
 * Authentication Utility Module
 * Handles user data storage and authentication logic
 * This module is designed to be easily modifiable for future enhancements
 */

// Storage key for user data
const STORAGE_KEY = 'users';

/**
 * Initialize storage if it doesn't exist
 */
function initStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
}

/**
 * Get all users from storage
 * @returns {Array} Array of user objects
 */
function getUsers() {
    initStorage();
    const usersJson = localStorage.getItem(STORAGE_KEY);
    return JSON.parse(usersJson || '[]');
}

/**
 * Save users to storage
 * @param {Array} users - Array of user objects
 */
function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Object|null} User object or null if not found
 */
function findUserByEmail(email) {
    const users = getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Register a new user
 * @param {string} name - User's full name
 * @param {string} email - User's email
 * @param {string} password - User's password (will be stored as plain text for simplicity)
 * @returns {Object} Result object with success status and message
 */
function registerUser(name, email, password) {
    // Validate input
    if (!name || !email || !password) {
        return {
            success: false,
            message: 'All fields are required'
        };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            success: false,
            message: 'Please enter a valid email address'
        };
    }

    // Validate password length
    if (password.length < 6) {
        return {
            success: false,
            message: 'Password must be at least 6 characters long'
        };
    }

    // Check if user already exists
    if (findUserByEmail(email)) {
        return {
            success: false,
            message: 'An account with this email already exists'
        };
    }

    // Create new user object
    const newUser = {
        id: Date.now().toString(), // Simple ID generation
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password, // In production, this should be hashed
        createdAt: new Date().toISOString()
    };

    // Save user
    const users = getUsers();
    users.push(newUser);
    saveUsers(users);

    return {
        success: true,
        message: 'Account created successfully!',
        user: newUser
    };
}

/**
 * Authenticate user login
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Result object with success status and message
 */
function loginUser(email, password) {
    // Validate input
    if (!email || !password) {
        return {
            success: false,
            message: 'Email and password are required'
        };
    }

    // Find user
    const user = findUserByEmail(email);
    
    if (!user) {
        return {
            success: false,
            message: 'Invalid email or password'
        };
    }

    // Check password
    if (user.password !== password) {
        return {
            success: false,
            message: 'Invalid email or password'
        };
    }

    // Store current user session (optional)
    sessionStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email
    }));

    return {
        success: true,
        message: 'Login successful!',
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    };
}

/**
 * Get current logged-in user
 * @returns {Object|null} Current user object or null
 */
function getCurrentUser() {
    const userJson = sessionStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * Logout current user
 */
function logoutUser() {
    sessionStorage.removeItem('currentUser');
}

/**
 * Update user data (for future modifications)
 * @param {string} userId - User ID
 * @param {Object} updates - Object with fields to update
 * @returns {Object} Result object with success status and message
 */
function updateUser(userId, updates) {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
        return {
            success: false,
            message: 'User not found'
        };
    }

    // Update user data
    users[userIndex] = { ...users[userIndex], ...updates };
    saveUsers(users);

    return {
        success: true,
        message: 'User updated successfully',
        user: users[userIndex]
    };
}

/**
 * Delete user account (for future modifications)
 * @param {string} userId - User ID
 * @returns {Object} Result object with success status and message
 */
function deleteUser(userId) {
    const users = getUsers();
    const filteredUsers = users.filter(user => user.id !== userId);
    
    if (users.length === filteredUsers.length) {
        return {
            success: false,
            message: 'User not found'
        };
    }

    saveUsers(filteredUsers);
    return {
        success: true,
        message: 'Account deleted successfully'
    };
}

// Initialize storage on module load
initStorage();


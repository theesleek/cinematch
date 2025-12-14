/**
 * Login Page Script
 * Handles login form submission and user authentication
 */

// Configuration: Set the path to your home page
const HOME_PAGE_PATH = 'home.html'; // Change this to your home page filename/path

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        // Redirect to home page if already logged in
        window.location.href = HOME_PAGE_PATH;
        return;
    }

    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous messages
        hideMessages();

        // Get form data
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Attempt login
        const result = loginUser(email, password);

        if (result.success) {
            showMessage(successMessage, result.message);
            
            // If remember me is checked, store in localStorage (optional enhancement)
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            // Reset form
            loginForm.reset();

            // Redirect to home page after successful login
            setTimeout(() => {
                window.location.href = HOME_PAGE_PATH;
            }, 1500);
        } else {
            showMessage(errorMessage, result.message);
        }
    });

    // Load remembered email if exists
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('loginEmail').value = rememberedEmail;
        document.getElementById('rememberMe').checked = true;
    }
});

/**
 * Display a message
 * @param {HTMLElement} element - Message element
 * @param {string} text - Message text
 */
function showMessage(element, text) {
    element.textContent = text;
    element.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideMessage(element);
    }, 5000);
}

/**
 * Hide a message
 * @param {HTMLElement} element - Message element
 */
function hideMessage(element) {
    element.style.display = 'none';
}

/**
 * Hide all messages
 */
function hideMessages() {
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    hideMessage(errorMessage);
    hideMessage(successMessage);
}


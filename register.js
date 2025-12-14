/**
 * Registration Page Script
 * Handles registration form submission and user creation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        // Redirect to home page if already logged in
        window.location.href = 'home.html';
        return;
    }
    
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const passwordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Real-time password confirmation validation
    confirmPasswordInput.addEventListener('input', function() {
        validatePasswordMatch();
    });

    passwordInput.addEventListener('input', function() {
        validatePasswordMatch();
    });

    // Handle form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous messages
        hideMessages();

        // Get form data
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Validate terms agreement
        if (!agreeTerms) {
            showMessage(errorMessage, 'Please agree to the Terms and Conditions');
            return;
        }

        // Validate password match
        if (password !== confirmPassword) {
            showMessage(errorMessage, 'Passwords do not match');
            return;
        }

        // Attempt registration
        const result = registerUser(name, email, password);

        if (result.success) {
            showMessage(successMessage, result.message);
            
            // Reset form
            registerForm.reset();

            // Optional: Redirect to login page after successful registration
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showMessage(errorMessage, result.message);
        }
    });
});

/**
 * Validate password match in real-time
 */
function validatePasswordMatch() {
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmInput = document.getElementById('confirmPassword');

    if (confirmPassword && password !== confirmPassword) {
        confirmInput.setCustomValidity('Passwords do not match');
        confirmInput.style.borderColor = 'var(--error-color)';
    } else {
        confirmInput.setCustomValidity('');
        confirmInput.style.borderColor = '';
    }
}

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


/*
  HBNB - Fonctions partagées par toutes les pages
*/

// Configuration de l'API
const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

console.log("HBNB scripts loaded");

// ============================================
// COMMON FUNCTIONS - COOKIES
// ============================================

/**
 * Fonction pour stocker le token JWT dans un cookie
 * @param {string} token - Le token JWT à stocker
 */
function setTokenCookie(token) {
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`;
}

/**
 * Fonction pour récupérer un cookie par son nom
 * @param {string} name - Le nom du cookie à récupérer
 * @returns {string|null} - La valeur du cookie ou null s'il n'existe pas
 */
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(c => c.startsWith(`${name}=`));
    return cookie ? cookie.split('=')[1] : null;
}

// ============================================
// COMMON FUNCTIONS - AUTH & ERROR HANDLING
// ============================================

/**
 * Fonction pour gérer la connexion de l'utilisateur
 * @param {string} email - L'email de l'utilisateur
 * @param {string} password - Le mot de passe de l'utilisateur
 * @returns {Promise<Object>} - Les données de la réponse
 */
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            return { success: true, data };
        } else {
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                message: errorData.message || `Login failed: ${response.statusText}`
            };
        }
    } catch (error) {
        return {
            success: false,
            message: `Network error: ${error.message}`
        };
    }
}

/**
 * Affichage Message d'erreur
 * @param {string} message
 */
function displayErrorMessage(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

/**
 * Fonction pour masquer le message d'erreur
 */
function hideErrorMessage() {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
        errorElement.textContent = '';
    }
}

// ============================================
// LOGIN PAGE - EVENT LISTENER
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Gestion du formulaire de login
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Masquer les erreurs précédentes
            hideErrorMessage();

            // Récupérer les valeurs du formulaire
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            // Validation basique
            if (!email || !password) {
                displayErrorMessage('Please enter both email and password.');
                return;
            }

            // Appeler la fonction de login
            const result = await loginUser(email, password);

            if (result.success) {
                // Stocker le token dans un cookie
                setTokenCookie(result.data.access_token);

                // Rediriger vers la page principale
                window.location.href = 'index.html';
            } else {
                // Afficher le message d'erreur
                displayErrorMessage(result.message);
            }
        });
    }
});

// ============================================
// MENU HAMBURGER TOGGLE
// ============================================

/**
 * Toggle le menu hamburger (responsive)
 */
function toggleMenu() {
    const nav = document.getElementById('nav-menu');
    const toggle = document.querySelector('.menu-toggle');

    if (nav && toggle) {
        nav.classList.toggle('active');
        toggle.classList.toggle('active');
    }
}

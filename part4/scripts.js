/*
  HBNB - Part 4 JavaScript
*/

// Configuration de l'API
// TODO: Remplacer cette URL par l'URL réelle de votre API backend
const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';


console.log("HBNB scripts loaded");

// ============================================
// TASK 1: LOGIN FUNCTIONALITY
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
 * Fonction pour stocker le token JWT dans un cookie
 * @param {string} token - Le token JWT à stocker
 */
function setTokenCookie(token) {
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`;
}

/**
 * Fonction pour récupérer le token depuis les cookies
 * @returns {string|null} - Le token ou null s'il n'existe pas
 */
function getTokenFromCookie() {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
}

/**
 * Fonction pour afficher un message d'erreur
 * @param {string} message - Le message d'erreur à afficher
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

// Event listener pour le chargement du DOM
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

    // Vérifier si l'utilisateur est déjà connecté
    const token = getTokenFromCookie();
    const loginLink = document.getElementById('login-link');

    if (token && loginLink) {
        // Si un token existe, changer le texte du bouton de login
        loginLink.textContent = 'Logout';
        loginLink.addEventListener('click', (event) => {
            event.preventDefault();
            // Supprimer le cookie
            document.cookie = 'token=; path=/; max-age=0';
            // Rediriger vers la page de login
            window.location.href = 'login.html';
        });
    }
});

/*
  HBNB - Part 4 JavaScript
*/

// Configuration de l'API
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
 * Fonction générique pour récupérer un cookie par son nom
 * @param {string} name - Le nom du cookie à récupérer
 * @returns {string|null} - La valeur du cookie ou null s'il n'existe pas
 */
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(c => c.startsWith(`${name}=`));
    return cookie ? cookie.split('=')[1] : null;
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

// ============================================
// TASK 2: INDEX PAGE (PLACES)
// ============================================

/**
 * Fonction pour récupérer la liste des places depuis l'API
 * @param {string} token - Le token JWT pour l'authentification
 */
async function fetchPlaces(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/places/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const places = await response.json();
            console.log('Places fetched:', places);
            displayPlaces(places);
        } else {
            console.error('Failed to fetch places:', response.status);
        }
    } catch (error) {
        console.error('Error fetching places:', error);
    }
}

/**
 * Fonction pour afficher les places dynamiquement dans la page
 * @param {Array} places - Tableau des places à afficher
 */
function displayPlaces(places) {
    const placesList = document.getElementById('places-list');

    // Vider la liste actuelle
    placesList.innerHTML = '';

    // Créer une carte pour chaque place
    places.forEach(place => {
        const placeCard = document.createElement('div');
        placeCard.className = 'place-card';
        placeCard.dataset.price = place.price;  // Stocker le prix pour le filtre

        placeCard.innerHTML = `
            <h2>${place.title}</h2>
            <p class="price">Price: ${place.price}€ per night</p>
            <a href="place.html?place_id=${place.id}" class="details-button">View Details</a>
        `;

        placesList.appendChild(placeCard);
    });
}

/**
 * Fonction pour vérifier l'authentification et gérer l'affichage
 */
function checkAuthentication() {
    const token = getTokenFromCookie();
    const loginLink = document.getElementById('login-link');

    if (!token) {
        // Utilisateur non connecté
        if (loginLink) {
            loginLink.style.display = 'block';
        }
        console.log('User not authenticated');
    } else {
        // Utilisateur connecté
        if (loginLink) {
            loginLink.style.display = 'none';
        }
        // Récupérer les places
        fetchPlaces(token);
    }
}

  // ============================================
  // TASK 3: PLACE DETAILS PAGE
  // ============================================

/**
   * Récupérer l'ID de la place depuis l'URL
   */
  function getPlaceIdFromURL() {
      const params = new URLSearchParams(window.location.search);
      return params.get('place_id');
  }

  /**
   * Récupérer les détails d'une place depuis l'API
   */
  async function fetchPlaceDetails(placeId, token) {
      try {
          const response = await fetch(`${API_BASE_URL}/places/${placeId}`, {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });

          if (response.ok) {
              const place = await response.json();
              console.log('Place details:', place);
              displayPlaceDetails(place);
          } else {
              console.error('Failed to fetch place details');
          }
      } catch (error) {
          console.error('Error:', error);
      }
  }
/**
   * Afficher les détails de la place
   */
  function displayPlaceDetails(place) {
      // Remplir les infos de base
      document.getElementById('place-name').textContent = place.title;
      document.getElementById('place-host').textContent =
          `${place.owner.first_name} ${place.owner.last_name}`;
      document.getElementById('place-price').textContent = place.price;
      document.getElementById('place-description').textContent = place.description;

      // Afficher les amenities
      const amenitiesList = document.getElementById('amenities-list');
      amenitiesList.innerHTML = '';
      if (place.amenities && place.amenities.length > 0) {
          place.amenities.forEach(amenity => {
              const li = document.createElement('li');
              li.textContent = amenity.name;
              amenitiesList.appendChild(li);
          });
      } else {
          amenitiesList.innerHTML = '<li>No amenities listed</li>';
      }

      // Afficher les reviews
      const reviewsList = document.getElementById('reviews-list');
      reviewsList.innerHTML = '';
      if (place.reviews && place.reviews.length > 0) {
          place.reviews.forEach(review => {
              const article = document.createElement('article');
              article.className = 'review-card';
              article.innerHTML = `
                  <p class="review-author"><strong>${review.user_id}</strong></p>
                  <p class="review-rating">Rating: ${'⭐'.repeat(review.rating)} (${review.rating}/5)</p>
                  <p class="review-comment">${review.comment}</p>
              `;
              reviewsList.appendChild(article);
          });
      } else {
          reviewsList.innerHTML = '<p>No reviews yet.</p>';
      }
  }


/**
 * Fonction pour configurer le filtre par prix
 */
function setupPriceFilter() {
    const priceFilter = document.getElementById('price-filter');

    if (priceFilter) {
        priceFilter.addEventListener('change', (event) => {
            const selectedPrice = event.target.value;
            const placeCards = document.querySelectorAll('.place-card');

            placeCards.forEach(card => {
                const placePrice = parseInt(card.dataset.price);

                if (selectedPrice === 'all') {
                    card.style.display = 'block';
                } else if (placePrice <= parseInt(selectedPrice)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}
      // Gestion de la page place details
      const placeDetails = document.getElementById('place-details');
      if (placeDetails) {
          const placeId = getPlaceIdFromURL();
          const token = getTokenFromCookie();

          if (placeId) {
              fetchPlaceDetails(placeId, token);
          }

          // Afficher le bouton "Add Review" si connecté
          if (token) {
              const addReviewSection = document.getElementById('add-review');
              if (addReviewSection) {
                  addReviewSection.style.display = 'block';
                  // Mettre à jour le lien avec le bon place_id
                  const addReviewLink = addReviewSection.querySelector('a');
                  if (addReviewLink) {
                      addReviewLink.href = `add_review.html?place_id=${placeId}`;
                  }
              }
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

    // Gestion de la page index (liste des places)
    const placesList = document.getElementById('places-list');
    if (placesList) {
        checkAuthentication();
        setupPriceFilter();
    }
});

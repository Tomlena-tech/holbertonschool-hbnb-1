/*
  HBNB - Place Details Page JavaScript
  Gère l'affichage des détails d'une place spécifique
*/

// ============================================
// PLACE DETAILS PAGE
// ============================================

/**
 * Récupérer l'ID de la place depuis l'URL
 * @returns {string|null} - L'ID de la place ou null
 */
function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('place_id');
}

/**
 * Récupérer les détails d'une place depuis l'API
 * @param {string} placeId - L'ID de la place
 * @param {string} token - Le token JWT pour l'authentification
 */
async function fetchPlaceDetails(placeId, token) {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };

        // Ajouter le token si disponible
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/places/${placeId}`, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            const place = await response.json();
            console.log('Place details:', place);
            displayPlaceDetails(place);
        } else {
            console.error('Failed to fetch place details:', response.status);
            alert('Unable to load place details. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching place details:', error);
        alert('Network error. Please check your connection.');
    }
}

/**
 * Afficher les détails de la place dans la page
 * @param {Object} place - Les données de la place
 */
function displayPlaceDetails(place) {
    // Remplir les informations de base
    document.getElementById('place-name').textContent = place.title || 'Unknown Place';

    // Afficher le host
    if (place.owner) {
        document.getElementById('place-host').textContent =
            `${place.owner.first_name} ${place.owner.last_name}`;
    }

    document.getElementById('place-price').textContent = place.price || '0';
    document.getElementById('place-description').textContent =
        place.description || 'No description available.';

    // Afficher les amenities
    const amenitiesList = document.getElementById('amenities-list');
    amenitiesList.innerHTML = '';

    if (place.amenities && place.amenities.length > 0) {
        place.amenities.forEach(amenity => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${amenity.name}</span>`;
            amenitiesList.appendChild(li);
        });
    } else {
        amenitiesList.innerHTML = '<li><span>No amenities listed</span></li>';
    }

    // Afficher les reviews
    const reviewsList = document.getElementById('reviews-list');
    reviewsList.innerHTML = '';

    if (place.reviews && place.reviews.length > 0) {
        place.reviews.forEach(review => {
            const article = document.createElement('article');
            article.className = 'review-card';

            // Créer les étoiles selon la note
            const stars = '⭐'.repeat(review.rating);

            article.innerHTML = `
                <p class="review-author"><strong>${review.user_id}</strong></p>
                <p class="review-rating">Rating: ${stars} (${review.rating}/5)</p>
                <p class="review-comment">${review.comment}</p>
            `;
            reviewsList.appendChild(article);
        });
    } else {
        reviewsList.innerHTML = '<p>No reviews yet. Be the first to review!</p>';
    }
}

/**
 * Afficher ou cacher le bouton "Add Review" selon l'authentification
 * @param {string} token - Le token JWT
 * @param {string} placeId - L'ID de la place
 */
function toggleAddReviewButton(token, placeId) {
    const addReviewSection = document.getElementById('add-review');

    if (addReviewSection) {
        if (token) {
            // Utilisateur connecté - afficher le bouton
            addReviewSection.style.display = 'block';

            // Mettre à jour le lien avec le bon place_id
            const addReviewLink = addReviewSection.querySelector('a');
            if (addReviewLink && placeId) {
                addReviewLink.href = `add_review.html?place_id=${placeId}`;
            }
        } else {
            // Utilisateur non connecté - cacher le bouton
            addReviewSection.style.display = 'none';
        }
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const placeDetails = document.getElementById('place-details');

    if (placeDetails) {
        const placeId = getPlaceIdFromURL();
        const token = getCookie('token');

        if (placeId) {
            // Charger les détails de la place
            fetchPlaceDetails(placeId, token);

            // Gérer le bouton "Add Review"
            toggleAddReviewButton(token, placeId);
        } else {
            console.error('No place_id found in URL');
            alert('Invalid place ID. Redirecting to home...');
            window.location.href = 'index.html';
        }
    }
});

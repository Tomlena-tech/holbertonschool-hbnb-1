/*
  HBNB - Add Review Page JavaScript
  Gère la soumission des avis pour une place
*/

// ============================================
// ADD REVIEW PAGE
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
 * Vérifier l'authentification et rediriger si nécessaire
 * @returns {string|null} - Le token ou null
 */
function checkAuthenticationForReview() {
    const token = getCookie('token');

    if (!token) {
        alert('You must be logged in to add a review.');
        window.location.href = 'index.html';
        return null;
    }

    return token;
}

/**
 * Soumettre un avis à l'API
 * @param {string} placeId - L'ID de la place
 * @param {string} token - Le token JWT
 * @param {string} comment - Le commentaire de l'avis
 * @param {number} rating - La note (1-5)
 */
async function submitReview(placeId, token, comment, rating) {
    try {
        const response = await fetch(`${API_BASE_URL}/reviews/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                text: comment,
                rating: parseInt(rating),
                place_id: placeId
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Review submitted:', data);
            alert('Review submitted successfully!');
            // Rediriger vers la page de détails de la place
            window.location.href = `place.html?place_id=${placeId}`;
        } else {
            const errorData = await response.json().catch(() => ({}));
            console.error('Failed to submit review:', response.status, errorData);
            alert(errorData.error || errorData.message || 'Failed to submit review. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('Network error. Please check your connection.');
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('review-form');

    if (reviewForm) {
        // Vérifier l'authentification
        const token = checkAuthenticationForReview();
        const placeId = getPlaceIdFromURL();

        if (!placeId) {
            alert('Invalid place ID. Redirecting to home...');
            window.location.href = 'index.html';
            return;
        }

        // Gérer la soumission du formulaire
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Récupérer les valeurs du formulaire
            const comment = document.getElementById('review').value.trim();
            const rating = document.getElementById('rating').value;

            // Validation
            if (!comment) {
                alert('Please enter a comment.');
                return;
            }

            if (!rating || rating < 1 || rating > 5) {
                alert('Please select a rating between 1 and 5.');
                return;
            }

            // Soumettre l'avis
            await submitReview(placeId, token, comment, rating);
        });
    }
});

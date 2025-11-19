/*
  HBNB - Index Page JavaScript
  Gère l'affichage de la liste des places et le filtre par prix
*/

// ============================================
// INDEX PAGE - PLACES LIST
// ============================================

/**
 * Fonction pour vérifier l'authentification et gérer l'affichage
 */
function checkAuthentication() {
    const token = getCookie('token');
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

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const placesList = document.getElementById('places-list');
    if (placesList) {
        checkAuthentication();
        setupPriceFilter();
    }
});

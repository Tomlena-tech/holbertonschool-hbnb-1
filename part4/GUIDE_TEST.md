# 🧪 Guide de Test - Task 2 (Index Page)

## ✅ Serveur API démarré

Votre serveur Flask tourne sur: **http://127.0.0.1:5001**

⚠️ **Note:** Le port 5001 est utilisé à la place du 5000 pour éviter les conflits avec AirPlay Receiver sur macOS.

## 📋 Données de test créées

3 places ont été créées dans la base de données:

1. **Cozy Apartment** - 100€/nuit
2. **Beach House** - 250€/nuit
3. **Mountain Cabin** - 75€/nuit

## 🔐 Compte de test

- **Email:** admin@hbnb.io
- **Password:** admin1234

## 📝 Étapes pour tester la Task 2

### ÉTAPE 1: Ouvrir la console du navigateur

1. Ouvrez `index.html` dans votre navigateur (déjà fait)
2. Appuyez sur **F12** ou **Cmd+Option+I** pour ouvrir les DevTools
3. Allez dans l'onglet **Console**

### ÉTAPE 2: Vérifier l'état initial

Dans la console, vous devriez voir:
```
HBNB scripts loaded
User not authenticated
```

Et sur la page:
- ✅ Le bouton **Login** est visible
- ✅ Les places statiques (HTML) sont affichées

### ÉTAPE 3: Se connecter

1. Cliquez sur le bouton **Login**
2. Entrez les credentials:
   - Email: `admin@hbnb.io`
   - Password: `admin1234`
3. Cliquez sur **Submit**

### ÉTAPE 4: Vérifier après login

**Dans la console:**
```
HBNB scripts loaded
User not authenticated  (première fois)
Places fetched: (3) [{...}, {...}, {...}]
```

**Sur la page:**
- ✅ Le bouton **Login** est caché
- ✅ Les places sont maintenant chargées depuis l'API
- ✅ Vous voyez 3 places au lieu des 4 statiques

### ÉTAPE 5: Tester le filtre par prix

1. Utilisez le dropdown **Filter by price**
2. Sélectionnez **100**:
   - ✅ Devrait afficher: Cozy Apartment (100€) et Mountain Cabin (75€)
   - ❌ Beach House (250€) est cachée

3. Sélectionnez **50**:
   - ✅ Devrait afficher: Mountain Cabin (75€) seulement
   - ❌ Les autres sont cachées

4. Sélectionnez **All**:
   - ✅ Toutes les places réapparaissent

## 🔍 Vérification du Fetch API en détail

### Dans la console du navigateur, testez manuellement:

```javascript
// 1. Récupérer le token
const token = getCookie('token');
console.log('Token:', token);

// 2. Faire la requête Fetch
fetch('http://127.0.0.1:5001/api/v1/places/', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
.then(response => {
    console.log('Response status:', response.status);
    console.log('Response OK:', response.ok);
    return response.json();
})
.then(data => {
    console.log('Places received:', data);
    console.log('Number of places:', data.length);
})
.catch(error => {
    console.error('Error:', error);
});
```

### Résultat attendu:

```
Response status: 200
Response OK: true
Places received: Array(3)
  0: {id: "...", title: "Cozy Apartment", price: 100, ...}
  1: {id: "...", title: "Beach House", price: 250, ...}
  2: {id: "...", title: "Mountain Cabin", price: 75, ...}
Number of places: 3
```

## 📊 Vérification de l'onglet Network

1. Dans les DevTools, allez dans **Network**
2. Rafraîchissez la page (F5)
3. Vous devriez voir une requête:
   - **Name:** `places/`
   - **Status:** `200`
   - **Type:** `xhr` ou `fetch`
   - **Method:** `GET`

4. Cliquez sur cette requête pour voir:
   - **Headers:** `Authorization: Bearer ...`
   - **Response:** Le JSON avec les 3 places

## 🎯 Points de vérification Task 2

| Fonctionnalité | État | Description |
|----------------|------|-------------|
| ✅ getCookie() | OK | Fonction implémentée |
| ✅ checkAuthentication() | OK | Vérifie le token et affiche/cache login |
| ✅ fetchPlaces() | OK | Récupère les places de l'API |
| ✅ displayPlaces() | OK | Affiche dynamiquement les places |
| ✅ setupPriceFilter() | OK | Filtre par prix sans recharger |
| ✅ Options filtre | OK | 10, 50, 100, All |
| ✅ CORS | OK | Configuré dans l'API |

## 🐛 Dépannage

### Problème: "User not authenticated" même après login

**Solution:**
1. Vérifiez les cookies: DevTools > Application > Cookies
2. Cherchez le cookie `token`
3. S'il n'existe pas, le login a échoué

### Problème: Erreur CORS

**Console:**
```
Access to fetch at 'http://127.0.0.1:5000/api/v1/places/' from origin 'null'
has been blocked by CORS policy
```

**Solution:**
- CORS est déjà configuré dans votre API (ligne 31 de `app/__init__.py`)
- Assurez-vous que le serveur Flask tourne

### Problème: Places ne s'affichent pas

**Vérifications:**
1. Console > Y a-t-il des erreurs?
2. Network > La requête GET /places/ réussit-elle?
3. Console > `console.log('Places fetched:', places)` affiche-t-il les données?

### Problème: Filtre ne fonctionne pas

**Vérifications:**
1. Inspectez un élément `.place-card`
2. Vérifiez qu'il a l'attribut `data-price`
3. Console: `document.querySelectorAll('.place-card')` devrait retourner les cartes

## 📸 Captures d'écran attendues

### Avant login:
```
┌─────────────────────────────────────┐
│ HBNB Logo    Home    [Login]        │
├─────────────────────────────────────┤
│ Available Places                    │
│                                     │
│ Filter by price: [All ▼]           │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ Cozy Apartment              │   │
│ │ Price: 100€ per night       │   │
│ │ [View Details]              │   │
│ └─────────────────────────────┘   │
│ ┌─────────────────────────────┐   │
│ │ Beach House                 │   │
│ │ Price: 250€ per night       │   │
│ │ [View Details]              │   │
│ └─────────────────────────────┘   │
│ ┌─────────────────────────────┐   │
│ │ Mountain Cabin              │   │
│ │ Price: 75€ per night        │   │
│ │ [View Details]              │   │
│ └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Après login:
```
┌─────────────────────────────────────┐
│ HBNB Logo    Home                   │  <- Pas de bouton Login
├─────────────────────────────────────┤
│ Available Places                    │
│                                     │
│ Filter by price: [All ▼]           │
│                                     │
│ [3 places chargées depuis l'API]   │
└─────────────────────────────────────┘
```

## 🎓 Ce que vous avez appris

✅ Utiliser `fetch()` pour envoyer des requêtes HTTP GET
✅ Gérer l'authentification JWT avec des cookies
✅ Manipuler le DOM dynamiquement avec JavaScript
✅ Filtrer des données côté client
✅ Gérer les erreurs avec try/catch
✅ Utiliser async/await pour du code asynchrone
✅ Configurer CORS pour permettre les requêtes cross-origin

## 🚀 Prochaines étapes

- Task 3: Place Details (afficher les détails d'une place)
- Task 4: Add Review Form (ajouter des avis)

## 📞 Test rapide en une commande

Pour tester l'API en ligne de commande:

```bash
# Login
curl -X POST http://127.0.0.1:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hbnb.io","password":"admin1234"}'

# Get places
curl -s http://127.0.0.1:5001/api/v1/places/
```

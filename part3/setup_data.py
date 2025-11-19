#!/usr/bin/env python3
"""
Setup script to populate the database with test data
"""
import requests
import json

API_BASE_URL = 'http://127.0.0.1:5000/api/v1'

def create_users():
    """Create test users"""
    print("Creating users...")

    users = [
        {
            'first_name': 'Admin',
            'last_name': 'HBnB',
            'email': 'admin@hbnb.io',
            'password': 'admin1234'
        },
        {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john@example.com',
            'password': 'password123'
        },
        {
            'first_name': 'Jane',
            'last_name': 'Smith',
            'email': 'jane@example.com',
            'password': 'password123'
        },
        {
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'test@hbnb.io',
            'password': 'test1234'
        }
    ]

    created_users = {}
    for user_data in users:
        try:
            response = requests.post(f'{API_BASE_URL}/users/', json=user_data)
            if response.status_code == 201:
                result = response.json()
                created_users[user_data['email']] = result['id']
                print(f"✓ Created user: {user_data['email']}")

                # Grant admin rights to admin@hbnb.io
                if user_data['email'] == 'admin@hbnb.io':
                    import subprocess
                    subprocess.run([
                        'python3', '-c',
                        "from app import create_app, db; from app.models.user import User; "
                        "app = create_app(); "
                        "app.app_context().push(); "
                        "admin = User.query.filter_by(email='admin@hbnb.io').first(); "
                        "admin.is_admin = True; "
                        "db.session.commit()"
                    ], capture_output=True)
                    print(f"  ✓ Admin rights granted")
            else:
                print(f"✗ Failed to create {user_data['email']}: {response.text}")
        except Exception as e:
            print(f"✗ Error creating {user_data['email']}: {e}")

    return created_users

def get_token(email, password):
    """Get JWT token for a user"""
    response = requests.post(
        f'{API_BASE_URL}/auth/login',
        json={'email': email, 'password': password}
    )
    if response.status_code == 200:
        return response.json()['access_token']
    return None

def create_amenities(token):
    """Get or create amenities"""
    print("\nFetching amenities...")

    try:
        response = requests.get(f'{API_BASE_URL}/amenities/')
        if response.status_code == 200:
            existing_amenities = response.json()
            if len(existing_amenities) == 0:
                # Créer les amenities de base
                print("Creating base amenities...")
                amenity_names = ['WiFi', 'Swimming Pool', 'Parking', 'Kitchen',
                                'Air Conditioning', 'TV', 'Heating']
                headers = {'Authorization': f'Bearer {token}'}
                amenities_map = {}
                for name in amenity_names:
                    r = requests.post(f'{API_BASE_URL}/amenities/',
                                     headers=headers, json={'name': name})
                    if r.status_code == 201:
                        amenities_map[name] = r.json()['id']
                        print(f"  ✓ {name}")
                    else:
                        print(f"  ✗ Failed: {name}")
                return amenities_map
            else:
                amenities_map = {a['name']: a['id'] for a in existing_amenities}
                print(f"✓ Found {len(amenities_map)} existing amenities")
                for name in amenities_map:
                    print(f"  - {name}")
                return amenities_map
        else:
            print(f"✗ Failed to fetch amenities: {response.text}")
            return {}
    except Exception as e:
        print(f"✗ Error fetching amenities: {e}")
        return {}

def create_places(token, amenities):
    """Create places"""
    print("\nCreating places...")

    places_data = [
        {
            'title': 'Cozy Apartment',
            'description': 'A cozy apartment in the city center with modern amenities',
            'price': 40.0,
            'latitude': 48.8566,
            'longitude': 2.3522,
            'amenities': ['WiFi', 'Kitchen', 'TV']
        },
        {
            'title': 'Beach House',
            'description': 'Beautiful beach house with ocean view and private beach access',
            'price': 80.0,
            'latitude': 43.6047,
            'longitude': 1.4442,
            'amenities': ['WiFi', 'Swimming Pool', 'Parking']
        },
        {
            'title': 'Mountain Cabin',
            'description': 'Cozy cabin in the mountains, perfect for winter holidays',
            'price': 120.0,
            'latitude': 45.4215,
            'longitude': 6.2341,
            'amenities': ['Heating', 'Kitchen', 'WiFi']
        },
        {
            'title': 'City Loft',
            'description': 'Modern loft in downtown area with great city views',
            'price': 90.0,
            'latitude': 48.8584,
            'longitude': 2.2945,
            'amenities': ['WiFi', 'Air Conditioning', 'Parking']
        },
        {
            'title': 'Countryside Villa',
            'description': 'Spacious villa in the countryside, ideal for large families',
            'price': 150.0,
            'latitude': 43.2965,
            'longitude': 5.3698,
            'amenities': ['Swimming Pool', 'WiFi', 'Parking', 'Kitchen']
    
        },
        
        {
            'title': 'Villa Schweppes',
            'description': 'Spacious villa in Cannes, ideal for the FIF',
            'price': 550.0,
            'latitude': 43.2965,
            'longitude': 5.3698,
            'amenities': ['Swimming Pool', 'WiFi', 'Parking', 'Kitchen', 'Air Conditioning', 'Car park']
        }   
    ]
    

    headers = {'Authorization': f'Bearer {token}'}
    created_places = []

    for place_data in places_data:
        # Get amenity IDs
        amenity_ids = [amenities[name] for name in place_data['amenities'] if name in amenities]

        payload = {
            'title': place_data['title'],
            'description': place_data['description'],
            'price': place_data['price'],
            'latitude': place_data['latitude'],
            'longitude': place_data['longitude'],
            'amenities': amenity_ids
        }

        try:
            response = requests.post(
                f'{API_BASE_URL}/places/',
                headers=headers,
                json=payload
            )
            if response.status_code == 201:
                result = response.json()
                created_places.append(result['id'])
                print(f"✓ Created place: {place_data['title']}")
            else:
                print(f"✗ Failed to create {place_data['title']}: {response.text}")
        except Exception as e:
            print(f"✗ Error creating {place_data['title']}: {e}")

    return created_places

def create_reviews(token, places):
    """Create reviews for places"""
    print("\nCreating reviews...")

    reviews_data = [
        {'text': 'Amazing place! Very clean and comfortable.', 'rating': 5},
        {'text': 'Great location, would definitely come back!', 'rating': 4},
        {'text': 'Good value for money.', 'rating': 4},
        {'text': 'Perfect for a weekend getaway!', 'rating': 5}
    ]

    headers = {'Authorization': f'Bearer {token}'}

    for i, place_id in enumerate(places[:len(reviews_data)]):
        review = reviews_data[i]
        try:
            response = requests.post(
                f'{API_BASE_URL}/reviews/',
                headers=headers,
                json={
                    'text': review['text'],
                    'rating': review['rating'],
                    'place_id': place_id
                }
            )
            if response.status_code == 201:
                print(f"✓ Created review for place {i+1}")
            else:
                print(f"✗ Failed to create review: {response.text}")
        except Exception as e:
            print(f"✗ Error creating review: {e}")

def main():
    """Main setup function"""
    print("=" * 50)
    print("HBNB Database Setup")
    print("=" * 50)

    # Create users (or skip if they exist)
    users = create_users()

    # Get tokens (users might already exist)
    admin_token = get_token('admin@hbnb.io', 'admin1234')
    test_token = get_token('test@hbnb.io', 'test1234')

    if not admin_token:
        print("\n✗ Failed to get admin token. Exiting.")
        return

    # Create amenities
    amenities = create_amenities(admin_token)

    # Create places
    places = create_places(admin_token, amenities)

    # Create reviews (with test user)
    if test_token and places:
        create_reviews(test_token, places)

    print("\n" + "=" * 50)
    print("Setup complete!")
    print("=" * 50)
    print("\nTest credentials:")
    print("  Admin: admin@hbnb.io / admin1234")
    print("  Test:  test@hbnb.io / test1234")
    print("  User1: john@example.com / password123")
    print("  User2: jane@example.com / password123")

if __name__ == '__main__':
    main()

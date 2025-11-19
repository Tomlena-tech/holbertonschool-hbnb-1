#!/usr/bin/env python3
"""Create base amenities"""
import requests

API_URL = 'http://127.0.0.1:5000/api/v1'

# Login as admin
response = requests.post(f'{API_URL}/auth/login',
                        json={'email': 'admin@hbnb.io', 'password': 'admin1234'})
token = response.json()['access_token']

headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

amenities = ['WiFi', 'Swimming Pool', 'Parking', 'Kitchen', 'Air Conditioning', 'TV', 'Heating']

for name in amenities:
    response = requests.post(f'{API_URL}/amenities/',
                            headers=headers,
                            json={'name': name})
    if response.status_code == 201:
        print(f'✓ Created: {name}')
    else:
        print(f'✗ Failed: {name} - {response.text}')

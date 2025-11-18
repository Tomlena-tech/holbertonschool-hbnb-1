#!/usr/bin/env python3
"""Initialize the database with tables and initial data"""
from app import create_app, db
from app.models.user import User
from app.models.place import Place
from app.models.review import Review
from app.models.amenity import Amenity
import uuid

def init_db():
    """Create all tables and insert initial data"""
    app = create_app()
    
    with app.app_context():
        print("🗑️  Dropping existing tables...")
        db.drop_all()
        
        print("🏗️  Creating all tables...")
        db.create_all()
        
        print("👤 Creating admin user...")
        from app.services.facade import HBnBFacade
        facade = HBnBFacade()
        
        # Créer l'administrateur
        admin_data = {
            'first_name': 'Admin',
            'last_name': 'HBnB',
            'email': 'admin@hbnb.io',
            'password': 'admin1234',
            'is_admin': True
        }
        
        try:
            admin = facade.create_user(admin_data)
            print(f"✅ Admin created: {admin.email}")
        except Exception as e:
            print(f"⚠️  Admin already exists or error: {e}")
        
        # Créer des amenities initiales
        print("🏊 Creating initial amenities...")
        amenities_data = [
            {'name': 'WiFi'},
            {'name': 'Swimming Pool'},
            {'name': 'Air Conditioning'},
            {'name': 'Parking'},
            {'name': 'Kitchen'}
        ]
        
        for amenity_data in amenities_data:
            try:
                amenity = facade.create_amenity(amenity_data)
                print(f"  ✓ {amenity.name}")
            except Exception as e:
                print(f"  ⚠️  {amenity_data['name']}: {e}")
        
        print("\n✨ Database initialization complete!")
        print(f"📊 Tables created: {db.metadata.tables.keys()}")

if __name__ == '__main__':
    init_db()

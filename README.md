# HBnB Evolution - Part 4: Database Integration & Authentication

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-Latest-green.svg)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-ORM-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

A complete RESTful API backend for an AirBnB clone, implementing database persistence with SQLAlchemy, JWT authentication, and a layered architecture following industry best practices.

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Database Models](#database-models)
- [Testing](#testing)
- [Authors](#authors)

---

## 🎯 About

**HBnB Part 4** is the fourth iteration of the Holberton School AirBnB clone project. This version evolves from in-memory storage to persistent database storage using **SQLAlchemy ORM**, implements **JWT-based authentication**, and follows a **layered architecture** pattern.

### Evolution from Previous Parts:
- **Part 1**: Basic console and in-memory storage
- **Part 2**: Web static pages
- **Part 3**: RESTful API with in-memory storage
- **Part 4**: Database integration, authentication, and production-ready architecture ✨

---

## ✨ Features

### Core Functionality
- ✅ Complete CRUD operations for Users, Places, Reviews, and Amenities
- ✅ Persistent storage with SQLite/PostgreSQL via SQLAlchemy
- ✅ JWT-based authentication and authorization
- ✅ Role-based access control (User/Admin)
- ✅ Password hashing with bcrypt
- ✅ Data validation at multiple layers
- ✅ RESTful API with Swagger documentation

### Architecture & Design
- 🏗️ Layered architecture (Presentation, Business Logic, Persistence, Data)
- 📦 Repository pattern for data access
- 🎭 Facade pattern for business logic
- 🔒 Secure password storage and JWT tokens
- 📝 Comprehensive input validation

---

## 🛠️ Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| **Python** | Programming language | 3.8+ |
| **Flask** | Web framework | Latest |
| **Flask-RESTX** | REST API framework with Swagger | Latest |
| **SQLAlchemy** | ORM for database operations | Latest |
| **Flask-SQLAlchemy** | SQLAlchemy integration for Flask | Latest |
| **Flask-JWT-Extended** | JWT authentication | Latest |
| **Flask-Bcrypt** | Password hashing | Latest |
| **SQLite** | Development database | 3.x |

---

## 📂 Project Structure

```
hbnb-part4/
├── app/
│   ├── __init__.py              # Flask application factory
│   ├── models/                  # Database models (ORM)
│   │   ├── __init__.py
│   │   ├── basemodel.py         # Base model with common attributes
│   │   ├── user.py              # User model
│   │   ├── place.py             # Place model
│   │   ├── review.py            # Review model
│   │   ├── amenity.py           # Amenity model
│   │   └── amenities_places.py  # Many-to-many relationship table
│   ├── api/                     # API endpoints (Presentation layer)
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── users.py         # User routes
│   │       ├── places.py        # Place routes
│   │       ├── reviews.py       # Review routes
│   │       ├── amenities.py     # Amenity routes
│   │       ├── auth.py          # Authentication routes
│   │       └── protected.py     # Protected route examples
│   ├── services/                # Business logic layer
│   │   ├── __init__.py
│   │   └── facade.py            # Facade pattern implementation
│   └── persistence/             # Data access layer
│       ├── __init__.py
│       ├── repository.py        # Abstract repository
│       ├── user_repository.py   # User data access
│       ├── place_repository.py  # Place data access
│       ├── review_repository.py # Review data access
│       └── amenity_repository.py# Amenity data access
├── config.py                    # Configuration settings
├── run.py                       # Application entry point
├── requirements.txt             # Python dependencies
├── README.md                    # This file
└── script_database/
    └── generate.sql             # Database initialization script
```

---

## 🚀 Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)
- Virtual environment (recommended)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/hbnb-part4.git
   cd hbnb-part4
   ```

2. **Create and activate virtual environment**
   ```bash
   # Create virtual environment
   python3 -m venv venv

   # Activate (macOS/Linux)
   source venv/bin/activate

   # Activate (Windows)
   venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables (optional)**
   ```bash
   export SECRET_KEY='your-secret-key-here'
   export FLASK_ENV='development'
   ```

5. **Initialize the database**
   ```bash
   # The database will be created automatically on first run
   python3 run.py
   ```

---

## ⚙️ Configuration

Configuration is managed in `config.py`:

```python
class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///development.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
```

### Environment Variables
- `SECRET_KEY`: Secret key for JWT token signing (default: 'default_secret_key')
- `FLASK_ENV`: Environment mode ('development' or 'production')

**⚠️ Important:** Change the `SECRET_KEY` in production!

---

## 📖 Usage

### Start the Application

```bash
python3 run.py
```

The API will be available at: **http://127.0.0.1:5000**

### Access API Documentation

Once running, open your browser to:
- **Swagger UI**: http://127.0.0.1:5000
- Interactive API testing interface with all endpoints documented

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/login` | User login, returns JWT token | No |

### Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users` | List all users | No |
| POST | `/api/v1/users` | Create new user (register) | No |
| GET | `/api/v1/users/<id>` | Get user by ID | No |
| PUT | `/api/v1/users/<id>` | Update user | Yes (Owner/Admin) |

### Places
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/places` | List all places | No |
| POST | `/api/v1/places` | Create new place | Yes |
| GET | `/api/v1/places/<id>` | Get place by ID | No |
| PUT | `/api/v1/places/<id>` | Update place | Yes (Owner/Admin) |
| DELETE | `/api/v1/places/<id>` | Delete place | Yes (Owner/Admin) |

### Reviews
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/reviews` | List all reviews | No |
| POST | `/api/v1/reviews` | Create new review | Yes |
| GET | `/api/v1/reviews/<id>` | Get review by ID | No |
| GET | `/api/v1/places/<id>/reviews` | Get reviews for a place | No |
| PUT | `/api/v1/reviews/<id>` | Update review | Yes (Author/Admin) |
| DELETE | `/api/v1/reviews/<id>` | Delete review | Yes (Author/Admin) |

### Amenities
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/amenities` | List all amenities | No |
| POST | `/api/v1/amenities` | Create new amenity | Yes (Admin only) |
| GET | `/api/v1/amenities/<id>` | Get amenity by ID | No |
| PUT | `/api/v1/amenities/<id>` | Update amenity | Yes (Admin only) |

---

## 🔐 Authentication

### How JWT Authentication Works

1. **Register a new user** (or use existing credentials)
2. **Login** to receive a JWT token
3. **Include the token** in subsequent requests

### Example Flow

#### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

#### 2. Login to Get Token
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 3. Use Token in Protected Requests
```bash
curl -X POST http://localhost:5000/api/v1/places \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Beautiful Beach House",
    "description": "A stunning oceanfront property",
    "price": 250.00,
    "latitude": 34.0522,
    "longitude": -118.2437
  }'
```

### Authorization Levels

- **Public**: No authentication needed (GET endpoints)
- **Authenticated**: Valid JWT required (POST, PUT, DELETE own resources)
- **Admin**: Admin role required (manage amenities, update any resource)

---

## 🗄️ Database Models

### User
- `id`: Unique identifier (UUID)
- `first_name`: User's first name (max 50 chars)
- `last_name`: User's last name (max 50 chars)
- `email`: Unique email address
- `password`: Hashed password (bcrypt)
- `is_admin`: Admin flag (boolean)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Place
- `id`: Unique identifier (UUID)
- `title`: Place title (10-100 chars)
- `description`: Description (max 500 chars)
- `price`: Price per night (positive float)
- `latitude`: GPS latitude (-90 to 90)
- `longitude`: GPS longitude (-180 to 180)
- `user_id`: Foreign key to User (owner)
- `created_at`: Timestamp
- `updated_at`: Timestamp

**Relationships:**
- One owner (User)
- Many reviews
- Many amenities (many-to-many)

### Review
- `id`: Unique identifier (UUID)
- `text`: Review text (10-500 chars)
- `rating`: Rating (1-5 integer)
- `user_id`: Foreign key to User (author)
- `place_id`: Foreign key to Place
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Amenity
- `id`: Unique identifier (UUID)
- `name`: Amenity name (unique, max 50 chars)
- `created_at`: Timestamp
- `updated_at`: Timestamp

---

## 🧪 Testing

### Run Tests
```bash
# Run all tests
python3 -m pytest app/test_models/

# Run specific test file
python3 -m pytest app/test_models/test_user.py

# Run with verbose output
python3 -m pytest app/test_models/ -v
```

### Manual Testing with cURL

Test files are available in `manual_review.py` for comprehensive API testing.

```bash
python3 manual_review.py
```

---

## 📚 Additional Resources

### Architecture Documentation
For a visual, interactive guide to the project architecture, models, and API design, check out the educational tutorial site:

```bash
cd ~/Desktop/hbnb-part4-tutorial
python3 -m http.server 8000
# Open: http://localhost:8000
```

### Learning Path
1. **Architecture** - Understand the layered architecture pattern
2. **Models** - Learn about SQLAlchemy ORM and relationships
3. **Repositories** - Explore the Repository and Facade patterns
4. **API** - Master RESTful API design
5. **Authentication** - Secure your API with JWT

---

## 🤝 Contributing

This is a student project for Holberton School. If you're a fellow student:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is part of the Holberton School curriculum.

---

## 👥 Authors

**Thomas Decourtt**
- Holberton School Student
- Cohort: C27

---

## 🙏 Acknowledgments

- **Holberton School** - For the project guidelines and curriculum
- **Flask Team** - For the excellent web framework
- **SQLAlchemy** - For the powerful ORM
- **Community** - For support and collaboration

---

## 📞 Support

For questions or issues:
- Check the [tutorial site](file:///Users/thomas/Desktop/hbnb-part4-tutorial/index.html)
- Review Holberton intranet resources
- Consult with peers and mentors

---

**Made with difficulties at Holberton School**

*Last updated: November 2024*

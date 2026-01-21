# Himalayan Nest - Backend API

Node.js + Express + PostgreSQL backend with feature-based MVC architecture.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure `.env`**
   ```bash
   cp .env.example .env
   # Edit .env with your database and Cloudinary credentials
   ```

3. **Run**
   ```bash
   npm start
   ```

## API Endpoints

**Base URL:** `http://localhost:5000/api/v1`

### Auth (`/auth`)
- `POST /register` - Register user
- `POST /login` - Login
- `GET /profile` - Get profile (protected)
- `PUT /profile` - Update profile (protected)

### Properties (`/properties`)
- `GET /` - List properties
- `GET /:id` - Get property
- `POST /` - Create (dealer only)
- `PUT /:id` - Update (dealer only)
- `DELETE /:id` - Delete (dealer only)

### Enquiries (`/enquiries`)
- `POST /` - Create enquiry
- `GET /` - List enquiries (protected)
- `PUT /:id` - Update (protected)

### Subscriptions (`/subscriptions`)
- `POST /` - Subscribe (dealer only)
- `GET /my-subscription` - Get subscription (dealer only)

## Tech Stack

- Express.js - Web framework
- PostgreSQL - Database
- Sequelize - ORM
- JWT - Authentication
- Cloudinary - Image storage
- Zod - Validation

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for details.

```
Routes → Controllers → Services → Repositories → Models
```

Each feature in `api/v1/{feature}/` contains:
- `controller.js` - HTTP handlers
- `service.js` - Business logic
- `routes.js` - Route definitions
- `validation.js` - Zod schemas


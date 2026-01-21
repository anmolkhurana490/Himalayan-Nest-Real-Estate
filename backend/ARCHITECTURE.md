# Backend Architecture

## Structure

```
backend/
├── api/v1/{feature}/       # Feature-based organization
│   ├── controller.js       # HTTP handlers
│   ├── service.js          # Business logic
│   ├── routes.js           # Route definitions
│   └── validation.js       # Zod schemas
├── repositories/           # Data access layer
├── models/                 # Sequelize models
├── middlewares/            # Auth, validation, file upload
├── constants/              # Enums and messages
├── config/                 # DB and Cloudinary
└── utils/                  # JWT helpers
```

## Layer Flow

```
Routes → Controllers → Services → Repositories → Models
```

**Controllers**: Handle HTTP requests/responses  
**Services**: Business logic and orchestration  
**Repositories**: Database operations (CRUD)  
**Models**: Sequelize schema definitions

## Key Principles

1. **Feature-based**: Each feature (auth, property, etc.) in separate folder
2. **Separation of concerns**: Each layer has single responsibility
3. **Reusability**: Repositories shared across services
4. **API Versioning**: All routes under `/api/v1/`

## Adding New Feature

1. Create `api/v1/feature-name/` with controller, service, routes, validation
2. Create `repositories/featureRepository.js`
3. Add routes to `api/v1/index.js`
4. Add constants if needed

## Authentication

- JWT tokens in HTTP-only cookies
- `AuthMiddleware` verifies token and attaches `req.user`
- Role-based access: customer, dealer, admin

## File Uploads

- Multer + Cloudinary integration
- Images uploaded to cloud, URLs stored in DB
- Auto-cleanup on delete


# Frontend Architecture Overview

## MVVM Architecture Pattern

This application follows **MVVM (Model-View-ViewModel)** architecture with a **Repository pattern** for clean separation of concerns.

```
View → ViewModel → Repository → Backend API
```

### Architecture Layers

1. **Model** - Data structures and transformations (`features/*/model/`)
2. **View** - UI components, no business logic (`features/*/views/`)
3. **ViewModel** - Business logic and state management (`features/*/viewmodel/`)
4. **Repository** - API calls and data fetching (`features/*/repositories.js`)

## Folder Structure

```
frontend/
├── app/                          # Next.js routing (re-exports views)
├── config/                       # Application configuration
│   ├── apiConfig.js             # Axios setup & interceptors
│   ├── appConfig.js             # App-wide constants
│   └── constants/
│       ├── apis.js              # API endpoint constants
│       └── routes.js            # Route path constants
├── shared/                       # Shared across features
│   ├── components/              # Reusable UI components
│   └── stores/
│       └── appStore.js          # Zustand global state
├── features/                     # Feature-based modules
│   ├── auth/
│   │   ├── model/               # User data models
│   │   ├── viewmodel/           # Auth business logic
│   │   ├── repositories.js      # Auth API calls
│   │   ├── views/               # Login, Register components
│   │   └── components/          # Auth-specific components
│   ├── properties/
│   ├── dashboard/
│   ├── enquiry/
│   └── home/
└── utils/                        # Helper functions
    ├── imageHelpers.js
    ├── helpers.js
    └── storage.js
```

## Import Examples

```javascript
// Config & Constants
import api from '@/config/apiConfig';
import { AUTH_ENDPOINTS } from '@/config/constants/apis';
import ROUTES from '@/config/constants/routes';

// Shared
import { useAppStore } from '@/shared/stores/appStore';
import Navbar from '@/shared/components/Navbar';

// Features - ViewModels
import { loginUser } from '@/features/auth/viewmodel/authViewModel';
import { getProperties } from '@/features/properties/viewmodel/propertyViewModel';

// Features - Views
import LoginView from '@/features/auth/views/LoginView';

// Utils
import { fetchImageUrl } from '@/utils/imageHelpers';
```

## Key Principles

- **Views** are pure UI - no API calls or complex logic
- **ViewModels** handle all business logic and API orchestration
- **Repositories** manage API communication
- **Models** define data structures
- **Shared** contains reusable components and global state
- **Config** centralizes all configuration and constants
- App routes simply re-export views: `export { default } from '@/features/.../views/XxxView';`

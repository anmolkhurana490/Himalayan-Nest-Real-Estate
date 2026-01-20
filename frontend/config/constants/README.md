# Application Constants

This directory contains centralized constants used throughout the application to ensure consistency and maintainability.

## Structure

Constants are organized into focused modules for better maintainability:

### `app.js` - Central Export Point
Re-exports all constants from specialized modules. Import from here for convenience.

### `property.js` - Property-Related Constants
- Property categories and subtypes
- Property statuses and features
- Area units and transaction types
- Sort options

### `user.js` - User & Authentication Constants
- User roles
- Enquiry statuses and priorities
- Contact preferences
- Subscription plans and features
- Verification statuses

### `validation.js` - Validation Rules
- Validation limits (lengths, sizes, counts)
- Regular expressions (email, phone, etc.)
- Allowed file types

### `messages.js` - User Messages
- Error messages
- Success messages

### `ui.js` - UI & Display Constants
- Amenities (residential/commercial)
- Popular locations
- Price ranges
- Pagination settings
- Date formats

## Usage Examples

### Import from app.js (recommended)
```javascript
// Import specific constants
import { USER_ROLES, PROPERTY_CATEGORIES_LIST } from '@/config/constants/app';

// Import multiple constants
import { 
  VALIDATION_LIMITS, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES 
} from '@/config/constants/app';
```

### Import from specific module (for better tree-shaking)
```javascript
import { USER_ROLES } from '@/config/constants/user';
import { RESIDENTIAL_AMENITIES } from '@/config/constants/ui';
import { REGEX } from '@/config/constants/validation';
```

### Using in Components

```javascript
// User role checking
if (user.role === USER_ROLES.ADMIN) {
  // Admin-specific logic
}

// Property category dropdown
<select>
  {PROPERTY_CATEGORIES_LIST.map(cat => (
    <option key={cat} value={cat}>{cat}</option>
  ))}
</select>

// Validation
if (file.size > VALIDATION_LIMITS.IMAGE_MAX_SIZE) {
  alert(ERROR_MESSAGES.FILE_TOO_LARGE(5));
}

// Success messages
alert(SUCCESS_MESSAGES.PROPERTY_CREATED);
```

## Files Currently Using Constants

### Components
- `features/dashboard/views/CreatePropertyView.js`
- `features/dashboard/components/EditProperty.js`
- `shared/components/SearchFilterBar.js`
- `shared/components/EnquiryForm.js`
- `features/properties/views/PropertyDetailView.js`
- `features/home/views/HomeView.js`

### Models
- `features/auth/model/userModel.js`

## Best Practices

1. **Import from app.js** for convenience, or from specific modules for better tree-shaking
2. **Always use constants** instead of hardcoded strings
3. **Add new constants** to the appropriate module (property, user, validation, messages, or ui)
4. **Never modify constant values** without checking all usages

## Adding New Constants

1. Identify the right module (property, user, validation, messages, or ui)
2. Add constant to that module's file
3. Constants are automatically available via app.js re-exports
4. Update this README if needed

## Module Responsibilities

| Module | Contains | Examples |
|--------|----------|----------|
| `property.js` | Property business logic | Categories, statuses, features, sort options |
| `user.js` | User management | Roles, enquiries, subscriptions |
| `validation.js` | Input validation | Limits, regex patterns, file types |
| `messages.js` | User feedback | Error and success messages |
| `ui.js` | Display elements | Amenities, locations, pagination |

## Migration Notes

- Original `app.js` (364 lines) split into 5 focused modules (~60-100 lines each)
- All existing imports continue to work via re-exports
- No breaking changes to consuming code
- Better organization for future maintenance

// Auth Model - Data model for authentication
// Defines the structure and validation for user authentication data

import { USER_ROLES } from '@/config/constants/app';

export class User {
    constructor(data = {}) {
        this.id = data.id || data._id || null;
        this.email = data.email || '';
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.name = data.name || '';
        this.phone = data.phone || '';
        this.role = data.role || USER_ROLES.USER;
        this.createdAt = data.createdAt || null;
        this.updatedAt = data.updatedAt || null;
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`.trim() || this.name;
    }

    isAdmin() {
        return this.role === USER_ROLES.ADMIN;
    }

    isOwner() {
        return this.role === USER_ROLES.OWNER;
    }
}

export class LoginCredentials {
    constructor(email = '', password = '') {
        this.email = email;
        this.password = password;
    }
}

export class RegisterData {
    constructor(data = {}) {
        this.email = data.email || '';
        this.password = data.password || '';
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.phone = data.phone || '';
    }
}

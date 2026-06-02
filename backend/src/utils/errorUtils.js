export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Invalid input, malformed/expired tokens
export class BadRequestError extends AppError {
    constructor(msg) { super(msg, 400); }
}

// Wrong credentials, invalid/revoked auth tokens
export class UnauthorizedError extends AppError {
    constructor(msg) { super(msg, 401); }
}

// Authenticated but not allowed (ownership, role)
export class ForbiddenError extends AppError {
    constructor(msg) { super(msg, 403); }
}

// Resource doesn't exist
export class NotFoundError extends AppError {
    constructor(msg) { super(msg, 404); }
}

// Duplicate resource (email, username already taken)
export class ConflictError extends AppError {
    constructor(msg) { super(msg, 409); }
}

// Valid request but violates business rules
export class UnprocessableEntityError extends AppError {
    constructor(msg) { super(msg, 422); }
}

// Rate Limit Exceeded
export class TooManyRequestsError extends AppError {
    constructor(msg) { super(msg, 429); }
}

// Internal Server Error
export class InternalServerError extends AppError {
    constructor(msg) { super(msg, 500); }
}
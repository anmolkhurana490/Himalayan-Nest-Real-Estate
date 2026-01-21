// Middleware Configuration
// Centralized middleware setup for Express app

import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

/**
 * Configure and apply all middlewares to Express app
 * @param {Express} app - Express application instance
 */
export const setupAppMiddlewares = (app) => {
    // CORS configuration
    app.use(cors({
        origin: [process.env.FRONTEND_URL].filter(Boolean),
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With', 'Access-Control-Allow-Origin'],
        credentials: true
    }));

    // Cookie parser
    app.use(cookieParser());

    // Body parsers
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
};

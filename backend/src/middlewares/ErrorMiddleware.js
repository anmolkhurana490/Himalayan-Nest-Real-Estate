import { AppError } from '../utils/errorUtils.js';
import logger from '../config/logger.js';
import multer from 'multer';

export const errorHandler = (err, req, res, next) => {
    // Custom Error (in api routes)
    if (err instanceof AppError) {
        logger.debug(`[${req.method}] ${req.path} → ${err.message}`);
        return res.status(err.statusCode).json({ message: err.message });
    }

    // Multer Error
    if (err instanceof multer.MulterError) {
        logger.debug(`[${req.method}] ${req.path} → ${err.message}`);
        return res.status(400).json({ message: err.message });
    }

    // Unexpected Error
    logger.error(`[${req.method}] ${req.path} → ${err.message}`);

    return res.status(500).json({ message: 'Internal server error' });
}
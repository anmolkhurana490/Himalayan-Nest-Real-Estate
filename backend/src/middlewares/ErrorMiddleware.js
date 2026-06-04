import { AppError } from '../utils/errorUtils.js';
import multer from 'multer';

export const errorHandler = (err, req, res, next) => {
    // Custom Error (in api routes)
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    // Multer Error
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    }

    // Unexpected Error
    console.error(`[${req.method}] ${req.path} →`, err.message);
    
    return res.status(500).json({ message: 'Internal server error' });
}
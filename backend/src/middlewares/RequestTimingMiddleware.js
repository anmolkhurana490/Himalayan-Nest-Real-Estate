// Middleware for measuring API response time and logging route performance.
// Captures the request start time, waits until the response finishes, and logs a structured event with route, status, and duration.

import logger from "../config/logger.js";

const RequestTimingMiddleware = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;

        logger.info({
            type: "api",
            route: req.originalUrl,
            status: res.statusCode,
            duration
        });
    });

    next();
};

export default RequestTimingMiddleware;
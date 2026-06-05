import FormData from "form-data";
import fs from 'fs';

import { config } from "dotenv";
config({ quiet: true });

// Prepares a multipart/form-data request for file upload.
const setupFormRequest = (req, bodyData, filePath) => {
    // Create FormData with file and additional body data
    const form = new FormData();

    const fileBuffer = fs.readFileSync(filePath);
    form.append("file", fileBuffer, { filename: path.basename(filePath) });

    Object.entries(bodyData).forEach(([key, value]) => {
        form.append(key, String(value));
    });

    req.headers = {
        ...req.headers,
        ...form.getHeaders()
    };
    req.body = form.getBuffer();

    return req;
}

// ============================================
// FILE UPLOAD REQUEST FUNCTION
// ============================================
export const createFileUploadRequestTest = (options = {}) => {
    const {
        method = 'POST',
        path = '/upload',
        filePath = './test.jpg',
        bodyBuilder = () => { },
        connections = 50,
        duration = 30
    } = options;

    const bodyData = bodyBuilder();

    return {
        url: process.env.API_BASE_URL,
        connections,
        duration,
        requests: [{
            method: method,
            path: path,
            setupRequest: (req) => setupFormRequest(req, bodyData, filePath),
        }]
    };
};

// ============================================
// REGULAR REQUEST FUNCTION (body, query, params)
// ============================================
export const createRegularRequestTest = (options = {}) => {
    const {
        method = 'POST',
        path = '',
        bodyBuilder = () => { },
        queryParams = {},
        headers = { 'Content-Type': 'application/json' },
        connections = 50,
        duration = 30
    } = options;

    // Build query string
    const queryString = new URLSearchParams(queryParams).toString();
    const fullPath = queryString ? `${path}?${queryString}` : path;

    return {
        url: process.env.API_BASE_URL,
        connections,
        duration,
        requests: [{
            method: method,
            path: fullPath,
            headers: headers,
            setupContext: (context) => {
                context.body = bodyBuilder();
                return context;
            }
        }]
    };
};
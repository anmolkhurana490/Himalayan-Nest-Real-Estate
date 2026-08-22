import { createFileUploadRequestTest, createRegularRequestTest } from './utils/requestSetupUtils.js';
import { runLoadTest } from "./utils/runnerUtils.js";

// Run load test
const runTest = async (testOptions, testName) => {
    // file upload test
    const config = testOptions.filePath ?
        createFileUploadRequestTest(testOptions)
        : createRegularRequestTest(testOptions);

    await runLoadTest(config, testName);
}

const testName = "Login API";

const generateBodyData = () => {
    // const uniqueId = Math.random().toString(36).substring(2, 10);
    const uniqueId = 123456;

    // Login/Register Body Data
    return {
        // name: `Anmol ${uniqueId}`,
        email: `anmol${uniqueId}@gmail.com`,
        password: 'anmol@1234',
        // userType: 'customer'
    };

    // // Property Data
    // return {
    //     title: `Property ${uniqueId}`,
    //     description: `Property Description ${uniqueId}`,
    //     category: 'residential',
    //     purpose: 'sale',
    //     price: Math.ceil(Math.random() * 100) * 1000,
    //     location: 'Haridwar Noida Delhi Uttarakhand'
    // }
}

const testOptions = {
    method: 'POST',
    path: 'auth/login',
    bodyBuilder: generateBodyData,
    // queryParams: { userId: '456', source: 'web' },
    // filePath: 'C:\\Users\\hp\\OneDrive\\Desktop\\Ritvik\\Images\\photo-1502672260266-1c1ef2d93688.avif',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123'
    },
    connections: 5,
    duration: 10
}

// Execute
runTest(testOptions, testName).catch(console.error);
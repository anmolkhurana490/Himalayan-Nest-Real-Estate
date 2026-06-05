import autocannon from "autocannon";
import fs from 'fs';

// ============================================
// RUNNER FUNCTION
// ============================================
export const runLoadTest = async (testConfig, testName = 'Load Test') => {
    try {
        console.log(`\n🚀 Starting ${testName}...\n`);
        const results = await autocannon(testConfig);

        const formatted = formatResult(testConfig, results);
        saveResult(formatted, testName);

    } catch (error) {
        console.error(`❌ ${testName} failed:`, error);
        process.exit(1);
    }
};

function formatResult(testConfig, r) {
    return {
        timestamp: new Date().toISOString(),

        request: {
            method: testConfig.requests[0].method,
            path: testConfig.requests[0].path,
            connections: testConfig.connections,
            duration: testConfig.duration
        },

        summary: {
            totalRequests: r.requests.total,
            totalBytes: r.throughput.total,
            errors: r.errors,
            timeouts: r.timeouts
        },

        latency: {
            avg: r.latency.average,
            min: r.latency.min,
            max: r.latency.max,
            p50: r.latency.p50,
            p90: r.latency.p90,
            p97_5: r.latency.p97_5,
            p99: r.latency.p99
        },

        throughput: {
            avgReqPerSec: r.requests.average,
            maxReqPerSec: r.requests.max,
            avgBytesPerSec: r.throughput.average
        }
    };
}

function saveResult(data, testName) {
    const filename = 'results/load_results.txt';

    const content = `
============== Test - ${testName} ==============
${JSON.stringify(data, null, 2)}
    `;

    fs.appendFileSync(filename, content);
    console.log(`✅ Results saved to ${filename}`);
}
const BASE_URL = 'http://localhost:3001/api';

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m'
};

async function testEndpoint(name, url, method = 'GET', body = null) {
    console.log(`${colors.blue}Testing ${name}...${colors.reset}`);
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (body) options.body = JSON.stringify(body);

        const startTime = Date.now();
        const response = await fetch(`${BASE_URL}${url}`, options);
        const duration = Date.now() - startTime;

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`${colors.green}✓ Success (${duration}ms)${colors.reset}`);
        return true;
    } catch (error) {
        console.log(`${colors.red}✗ Failed: ${error.message}${colors.reset}`);
        return false;
    }
}

async function runTests() {
    console.log(`\n${colors.yellow}Starting ASOLAA Backend Tests...${colors.reset}\n`);

    // 1. Health Check
    await testEndpoint('Health Check', '/health');

    // 2. App Store Scraper
    await testEndpoint('iOS Search (Fitness)', '/appstore/search?term=fitness&num=3');
    // detailed app check can be added if we parse an ID from search results, 
    // but for now let's just check search to confirm scraper works.

    // 3. Play Store Scraper
    await testEndpoint('Android Search (Fitness)', '/playstore/search?term=fitness&num=3');

    // 4. AI Endpoints (These might fail if no keys are set in backend env, which is expected as keys are in frontend)
    // However, the backend routes expect keys to be passed in headers 'x-gemini-api-key' etc.
    // We will skip testing AI endpoints here as they require valid keys from client.
    console.log(`${colors.yellow}\nSkipping AI tests (requires Client API Keys)${colors.reset}`);

    console.log(`\n${colors.yellow}Test Suite Completed.${colors.reset}\n`);
}

runTests();

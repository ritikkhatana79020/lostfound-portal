/**
 * Lost & Found Portal - Integration Tests
 * Tests for BE-FE integration and component interactions
 */

class IntegrationTests {
    constructor() {
        this.testResults = [];
        this.passedTests = 0;
        this.failedTests = 0;
    }

    /**
     * Run all integration tests
     */
    async runAllTests() {
        console.log('Starting Integration Tests...');
        console.log('================================');

        await this.testAPIIntegration();
        await this.testPageNavigation();
        await this.testDataFlow();
        await this.testErrorHandling();
        await this.testCaching();
        await this.testXSSProtection();

        this.printResults();
    }

    /**
     * Test API Integration
     */
    async testAPIIntegration() {
        console.log('\n📡 Testing API Integration...');

        // Test API base URL
        await this.test('API Base URL configured', () => {
            return Config.API.BASE_URL.length > 0;
        });

        // Test API client exists
        await this.test('API Client instance exists', () => {
            return window.api instanceof APIClient;
        });

        // Test GET request
        await this.test('GET request - Fetch lost items', async () => {
            try {
                const items = await api.get(Config.ENDPOINTS.LOST_ITEMS);
                return Array.isArray(items);
            } catch (error) {
                console.warn('Backend may not be running:', error.message);
                return false;
            }
        });

        // Test GET request with search
        await this.test('GET request - Search items', async () => {
            try {
                const results = await api.get(`${Config.ENDPOINTS.SEARCH_ITEMS}?keyword=test`);
                return Array.isArray(results);
            } catch (error) {
                console.warn('Search may not have results');
                return false;
            }
        });

        // Test timeout handling
        await this.test('Request timeout configured', () => {
            return Config.API.TIMEOUT > 0;
        });

        // Test retry logic
        await this.test('Retry attempts configured', () => {
            return Config.API.RETRY_ATTEMPTS >= 1;
        });
    }

    /**
     * Test Page Navigation
     */
    async testPageNavigation() {
        console.log('\n🗺️  Testing Page Navigation...');

        // Test route definitions
        await this.test('All routes defined', () => {
            return Object.keys(Config.ROUTES).length >= 3;
        });

        // Test navigation links exist
        await this.test('Home navigation link exists', () => {
            const links = document.querySelectorAll('a[href="/"]');
            return links.length > 0;
        });

        await this.test('Lost items link exists', () => {
            const links = document.querySelectorAll('a[href="/lost.html"]');
            return links.length > 0;
        });

        await this.test('Found items link exists', () => {
            const links = document.querySelectorAll('a[href="/found.html"]');
            return links.length > 0;
        });

        await this.test('Admin link exists', () => {
            const links = document.querySelectorAll('a[href="/admin.html"]');
            return links.length > 0;
        });
    }

    /**
     * Test Data Flow
     */
    async testDataFlow() {
        console.log('\n📊 Testing Data Flow...');

        // Test config values
        await this.test('Config has correct endpoints', () => {
            return Config.ENDPOINTS.LOST_ITEMS === '/items/lost' &&
                   Config.ENDPOINTS.FOUND_ITEMS === '/items/found';
        });

        // Test status values
        await this.test('All item statuses defined', () => {
            return Object.keys(Config.ITEM_STATUS).length >= 4;
        });

        // Test item types
        await this.test('All item types defined', () => {
            return Config.ITEM_TYPE.LOST === 'LOST' &&
                   Config.ITEM_TYPE.FOUND === 'FOUND';
        });

        // Test message constants
        await this.test('All messages defined', () => {
            return Object.keys(Config.MESSAGES).length >= 8;
        });
    }

    /**
     * Test Error Handling
     */
    async testErrorHandling() {
        console.log('\n❌ Testing Error Handling...');

        // Test error messages
        await this.test('Error messages defined', () => {
            return Config.MESSAGES.ERROR_FETCH &&
                   Config.MESSAGES.ERROR_CREATE &&
                   Config.MESSAGES.ERROR_UPDATE;
        });

        // Test Utils notification
        await this.test('Utils.showNotification exists', () => {
            return typeof Utils.showNotification === 'function';
        });

        // Test error UI components exist
        await this.test('Error handling components available', () => {
            return typeof UIComponents !== 'undefined' &&
                   typeof UIComponents.escapeHtml === 'function';
        });
    }

    /**
     * Test Caching
     */
    async testCaching() {
        console.log('\n💾 Testing Caching...');

        // Test cache configuration
        await this.test('Cache enabled', () => {
            return Config.CACHE.ENABLED === true;
        });

        // Test cache TTL
        await this.test('Cache TTL configured', () => {
            return Config.CACHE.TTL > 0;
        });

        // Test API client cache
        await this.test('API client has cache methods', () => {
            return typeof api.getFromCache === 'function' &&
                   typeof api.setInCache === 'function' &&
                   typeof api.clearCache === 'function';
        });
    }

    /**
     * Test XSS Protection
     */
    async testXSSProtection() {
        console.log('\n🔒 Testing Security...');

        // Test HTML escaping
        await this.test('HTML escaping available', () => {
            return typeof UIComponents.escapeHtml === 'function';
        });

        // Test XSS protection
        await this.test('XSS protection - escape malicious HTML', () => {
            const malicious = '<img src=x onerror=alert("xss")>';
            const escaped = UIComponents.escapeHtml(malicious);
            return !escaped.includes('onerror') && escaped.includes('&lt;');
        });

        // Test Content Security
        await this.test('API validation present', () => {
            return Config.ENDPOINTS.CREATE_ITEM === '/admin/items';
        });
    }

    /**
     * Helper: Run a single test
     */
    async test(name, testFn) {
        try {
            const result = await Promise.resolve(testFn());
            if (result) {
                this.passedTests++;
                console.log(`  ✅ ${name}`);
            } else {
                this.failedTests++;
                console.log(`  ❌ ${name}`);
            }
            this.testResults.push({ name, passed: result });
        } catch (error) {
            this.failedTests++;
            console.log(`  ❌ ${name} (Error: ${error.message})`);
            this.testResults.push({ name, passed: false, error: error.message });
        }
    }

    /**
     * Print test results summary
     */
    printResults() {
        console.log('\n================================');
        console.log('📋 Test Results Summary');
        console.log('================================');
        console.log(`✅ Passed: ${this.passedTests}`);
        console.log(`❌ Failed: ${this.failedTests}`);
        console.log(`📊 Total: ${this.testResults.length}`);
        console.log(`✨ Success Rate: ${((this.passedTests / this.testResults.length) * 100).toFixed(2)}%`);
        console.log('================================\n');

        return {
            total: this.testResults.length,
            passed: this.passedTests,
            failed: this.failedTests,
            successRate: (this.passedTests / this.testResults.length) * 100
        };
    }
}

// Export for use in console
window.IntegrationTests = IntegrationTests;

// Run tests in console
window.runIntegrationTests = async function() {
    const tester = new IntegrationTests();
    return await tester.runAllTests();
};

console.log(`
╔════════════════════════════════════╗
║  Lost & Found Portal Integration  ║
║  Run tests with: runIntegrationTests()  ║
╚════════════════════════════════════╝
`);


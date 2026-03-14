/**
 * Lost & Found Portal - API Client
 * Centralized API communication layer with retry logic and error handling
 */

class APIClient {
    constructor(config = {}) {
        this.baseURL = config.baseURL || Config.API.BASE_URL;
        this.timeout = config.timeout || Config.API.TIMEOUT;
        this.retryAttempts = config.retryAttempts || Config.API.RETRY_ATTEMPTS;
        this.retryDelay = config.retryDelay || Config.API.RETRY_DELAY;
        this.cache = new Map();
        this.cacheEnabled = Config.CACHE.ENABLED;
        this.cacheTTL = Config.CACHE.TTL;
    }

    /**
     * Make API request with retry logic
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const method = options.method || 'GET';
        let lastError;

        // Check cache for GET requests
        if (method === 'GET' && this.cacheEnabled) {
            const cached = this.getFromCache(url);
            if (cached) {
                console.log(`Cache hit for ${url}`);
                return cached;
            }
        }

        // Retry logic
        for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
            try {
                const response = await this._makeRequest(url, method, options);

                // Cache successful GET requests
                if (method === 'GET' && this.cacheEnabled) {
                    this.setInCache(url, response);
                }

                return response;
            } catch (error) {
                lastError = error;

                // Don't retry on client errors (4xx)
                if (error.statusCode >= 400 && error.statusCode < 500) {
                    throw error;
                }

                // Retry on server errors or network errors
                if (attempt < this.retryAttempts) {
                    console.warn(`Request failed, retrying... (Attempt ${attempt + 1}/${this.retryAttempts})`);
                    await this._delay(this.retryDelay * (attempt + 1)); // Exponential backoff
                }
            }
        }

        throw lastError;
    }

    /**
     * Make actual HTTP request
     */
    async _makeRequest(url, method, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        const fetchOptions = {
            method,
            headers,
            ...options
        };

        if (options.body && typeof options.body === 'object') {
            fetchOptions.body = JSON.stringify(options.body);
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                ...fetchOptions,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
                error.statusCode = response.status;
                error.response = response;
                throw error;
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }

            return response;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error(`Request timeout after ${this.timeout}ms`);
            }
            throw error;
        }
    }

    /**
     * Delay utility for retry backoff
     */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Cache management
     */
    getFromCache(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    setInCache(key, data) {
        this.cache.set(key, {
            data,
            expiry: Date.now() + this.cacheTTL
        });
    }

    clearCache() {
        this.cache.clear();
    }

    /**
     * GET request
     */
    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    /**
     * POST request
     */
    async post(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'POST', body });
    }

    /**
     * PUT request
     */
    async put(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'PUT', body });
    }

    /**
     * DELETE request
     */
    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
}

// Create global API client instance
const api = new APIClient();

// Export for use in other modules
window.APIClient = APIClient;
window.api = api;


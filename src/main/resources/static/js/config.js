/**
 * Lost & Found Portal - Global Configuration
 * Central configuration for API endpoints, constants, and settings
 */

const Config = {
    // API Configuration
    API: {
        BASE_URL: window.location.origin + '/api',
        TIMEOUT: 10000, // 10 seconds
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000 // 1 second
    },

    // Routes
    ROUTES: {
        HOME: '/',
        LOST_ITEMS: '/lost.html',
        FOUND_ITEMS: '/found.html',
        ADMIN: '/admin.html'
    },

    // API Endpoints
    ENDPOINTS: {
        // Public endpoints
        LOST_ITEMS: '/items/lost',
        FOUND_ITEMS: '/items/found',
        SEARCH_ITEMS: '/items/search',
        GET_ITEM: (id) => `/items/${id}`,

        // Admin endpoints
        CREATE_ITEM: '/admin/items',
        UPDATE_ITEM: (id) => `/admin/items/${id}`,
        DELETE_ITEM: (id) => `/admin/items/${id}`,
        MATCH_ITEMS: '/admin/match-items'
    },

    // Pagination
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 10,
        MAX_PAGE_SIZE: 100
    },

    // Cache settings
    CACHE: {
        ENABLED: true,
        TTL: 5 * 60 * 1000 // 5 minutes
    },

    // Status options
    ITEM_STATUS: {
        LOST: 'LOST',
        FOUND: 'FOUND',
        CLAIMED: 'CLAIMED',
        NOT_CLAIMED: 'NOT_CLAIMED'
    },

    // Item types
    ITEM_TYPE: {
        LOST: 'LOST',
        FOUND: 'FOUND'
    },

    // Messages
    MESSAGES: {
        SUCCESS_CREATED: 'Item created successfully!',
        SUCCESS_UPDATED: 'Item updated successfully!',
        SUCCESS_DELETED: 'Item deleted successfully!',
        SUCCESS_MATCHED: 'Items matched successfully!',
        ERROR_CREATE: 'Failed to create item',
        ERROR_UPDATE: 'Failed to update item',
        ERROR_DELETE: 'Failed to delete item',
        ERROR_MATCH: 'Failed to match items',
        ERROR_FETCH: 'Failed to fetch data',
        ERROR_SEARCH: 'Search failed',
        ERROR_VALIDATION: 'Please fill in all required fields',
        NO_RESULTS: 'No results found'
    }
};

// Export for use in other modules
window.Config = Config;


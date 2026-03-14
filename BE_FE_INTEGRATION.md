# Backend-Frontend Integration Guide

## Overview

This document describes the complete integration between the Backend (Spring Boot REST API) and Frontend (HTML/CSS/JavaScript), as well as the integration of Frontend components with each other.

## Architecture

```
┌─────────────────────────────────────────┐
│         Browser / Frontend              │
├─────────────────────────────────────────┤
│  HTML Templates (home, lost, found, admin)
│  ├─ Global Scripts                      │
│  │  ├─ config.js (Configuration)        │
│  │  ├─ api-client.js (API Layer)        │
│  │  └─ app.js (Utilities & Services)   │
│  └─ Page-Specific Scripts               │
│     ├─ pages/home.js                    │
│     ├─ pages/lost.js                    │
│     ├─ pages/found.js                   │
│     └─ pages/admin.js                   │
└─────────────────────────────────────────┘
          ↓↑ HTTP/JSON
┌─────────────────────────────────────────┐
│    Spring Boot Backend API              │
├─────────────────────────────────────────┤
│  Controllers (HTTP Endpoints)           │
│  ├─ ItemController (/api/items/*)       │
│  └─ WelcomeController (/, /health)      │
│         ↓                               │
│  Services (Business Logic)              │
│  ├─ ItemService                         │
│         ↓                               │
│  Repositories (Data Access)             │
│  ├─ ItemRepository                      │
│         ↓                               │
│  Database (PostgreSQL)                  │
└─────────────────────────────────────────┘
```

## Frontend Architecture

### 1. Configuration Layer (config.js)

Centralized configuration for all API endpoints, constants, and settings.

```javascript
Config = {
    API: { BASE_URL, TIMEOUT, RETRY_ATTEMPTS },
    ENDPOINTS: { LOST_ITEMS, FOUND_ITEMS, SEARCH_ITEMS, ... },
    ITEM_STATUS: { LOST, FOUND, CLAIMED, NOT_CLAIMED },
    ITEM_TYPE: { LOST, FOUND },
    MESSAGES: { SUCCESS_*, ERROR_* }
}
```

**Usage:**
```javascript
const url = `${Config.API.BASE_URL}${Config.ENDPOINTS.LOST_ITEMS}`;
const message = Config.MESSAGES.SUCCESS_CREATED;
```

### 2. API Client Layer (api-client.js)

Handles all HTTP communication with retry logic, caching, and error handling.

```javascript
class APIClient {
    async request(endpoint, options)    // Main request method
    async get(endpoint, options)         // GET request
    async post(endpoint, body, options)  // POST request
    async put(endpoint, body, options)   // PUT request
    async delete(endpoint, options)      // DELETE request
    getFromCache(key)                    // Get cached data
    setInCache(key, data)                // Cache data
    clearCache()                         // Clear all cache
}

// Global instance
window.api = new APIClient()
```

**Features:**
- Automatic retry with exponential backoff
- Request timeout handling
- Response caching with TTL
- Error handling and logging

**Usage:**
```javascript
// GET request with automatic caching
const items = await api.get(Config.ENDPOINTS.LOST_ITEMS);

// POST request
const newItem = await api.post(Config.ENDPOINTS.CREATE_ITEM, { itemName: 'Phone', ... });

// PUT request with update
const updated = await api.put(Config.ENDPOINTS.UPDATE_ITEM(1), { status: 'CLAIMED' });

// DELETE request
await api.delete(Config.ENDPOINTS.DELETE_ITEM(1));
```

### 3. Utilities & Services (app.js)

Provides utility functions and service objects for common operations.

```javascript
// Utility Functions
Utils = {
    formatDate(date)                    // Format date to readable string
    formatDateTime(datetime)            // Format datetime
    showNotification(msg, type)         // Show toast notification
    debounce(func, wait)                // Debounce function calls
    getStatusBadgeColor(status)         // Get Bootstrap badge color
    escapeHtml(text)                    // Prevent XSS attacks
    ...
}

// Item Service
ItemsService = {
    getLostItems()                      // Get all lost items
    getFoundItems()                     // Get all found items
    searchItems(keyword)                // Search items
    createItem(data)                    // Create new item
    updateItem(id, data)                // Update item
    deleteItem(id)                      // Delete item
    matchItems(lostId, foundId)         // Match items
}

// UI Components
UIComponents = {
    createItemCard(item)                // Generate item card HTML
    createItemDetailContent(item)       // Generate detail modal content
    escapeHtml(text)                    // Escape HTML for security
}
```

**Usage:**
```javascript
// Show notification
Utils.showNotification('Item created successfully!', 'success');

// Format date
const formatted = Utils.formatDate(item.dateReported);

// Create card
const html = UIComponents.createItemCard(item);

// Debounced search
const debouncedSearch = Utils.debounce(handleSearch, 300);
```

### 4. Page-Specific Controllers

Each page has its own controller managing page-specific logic.

#### HomePage (home.js)
```javascript
HomePage = {
    init()              // Initialize home page
    loadStats()         // Load statistics (lost, found, claimed counts)
    setupEventListeners()  // Setup event handlers
}
```

#### LostItemsPage (lost.js)
```javascript
LostItemsPage = {
    init()              // Initialize page
    loadItems()         // Fetch lost items
    handleSearch()      // Handle search input
    displayItems()      // Render items
    createItemCard()    // Create card HTML
    showItemDetail()    // Show detail modal
    setupEventListeners()  // Setup handlers
}
```

#### FoundItemsPage (found.js)
```javascript
FoundItemsPage = {
    init()              // Initialize page
    loadItems()         // Fetch found items
    handleSearch()      // Handle search input
    applyFilter()       // Filter by status
    displayItems()      // Render items
    createItemCard()    // Create card HTML
    showItemDetail()    // Show detail modal
    setupEventListeners()  // Setup handlers
}
```

#### AdminPage (admin.js)
```javascript
AdminPage = {
    init()              // Initialize admin page
    setupTabNavigation()  // Setup tab switching
    setupFormHandlers()   // Setup form handling
    handleAddItem()      // Handle add form submission
    loadItemsTable()     // Load items into table
    editItem(id)         // Open edit modal
    handleEditItem()     // Save edited item
    deleteItem(id)       // Delete item with confirmation
    loadMatchSelects()   // Load match dropdowns
    handleMatchItems()   // Match items
    loadMatchedItems()   // Display matched items
}
```

## Backend API Integration

### REST Endpoints

All endpoints return JSON responses and follow RESTful conventions.

#### Public Endpoints
```
GET /api/items/lost                           → List all lost items
GET /api/items/found                          → List all found items
GET /api/items/{id}                           → Get item by ID
GET /api/items/search?keyword={search_term}   → Search items
```

#### Admin Endpoints
```
POST   /api/admin/items                       → Create new item
PUT    /api/admin/items/{id}                  → Update item
DELETE /api/admin/items/{id}                  → Delete item
PUT    /api/admin/match-items                 → Match lost & found items
```

### Request/Response Format

#### GET Request
```javascript
// Frontend
const items = await api.get('/items/lost');

// Backend Response (200 OK)
[
  {
    "id": 1,
    "type": "LOST",
    "itemName": "Phone",
    "description": "iPhone 14",
    "location": "Library",
    "status": "LOST",
    ...
  }
]
```

#### POST Request
```javascript
// Frontend
const newItem = await api.post('/admin/items', {
  type: 'LOST',
  itemName: 'Phone',
  description: 'iPhone 14',
  location: 'Library',
  studentName: 'John Doe',
  studentNumber: 'STU001',
  status: 'LOST'
});

// Backend Response (201 CREATED)
{
  "id": 1,
  "type": "LOST",
  "itemName": "Phone",
  ...
}
```

#### PUT Request
```javascript
// Frontend
const updated = await api.put('/admin/items/1', {
  status: 'CLAIMED'
});

// Backend Response (200 OK)
{
  "id": 1,
  "status": "CLAIMED",
  ...
}
```

#### DELETE Request
```javascript
// Frontend
await api.delete('/admin/items/1');

// Backend Response (204 NO CONTENT)
```

#### Search Request
```javascript
// Frontend
const results = await api.get('/items/search?keyword=phone');

// Backend Response (200 OK)
[
  { /* items matching "phone" */ }
]
```

## Frontend Component Integration

### Data Flow Between Pages

#### 1. Home → Lost/Found Items
```
HomePage loads stats
    ↓
LostItemsPage/FoundItemsPage loads items
    ↓
Items displayed in cards
    ↓
Click "View Details" → Modal opens with full info
```

#### 2. Lost Items Search
```
User enters keyword
    ↓
Debounced search triggered (300ms delay)
    ↓
api.get('/items/search?keyword=...')
    ↓
Results filtered to type='LOST'
    ↓
displayItems() renders filtered results
    ↓
Click card → showItemDetail() modal
```

#### 3. Found Items Filtering
```
User clicks filter button (All/Claimed/Not Claimed)
    ↓
applyFilter() called with filter type
    ↓
Array filtered based on status
    ↓
displayItems() renders filtered items
```

#### 4. Admin Add Item
```
User fills form and submits
    ↓
handleAddItem() validates data
    ↓
api.post('/admin/items', itemData)
    ↓
Success notification shown
    ↓
Form cleared
    ↓
Can refresh manage items to see new entry
```

#### 5. Admin Edit Item
```
User clicks Edit button
    ↓
editItem(id) populates modal form
    ↓
User modifies data and clicks Save
    ↓
handleEditItem() calls api.put('/admin/items/{id}', data)
    ↓
Modal closes
    ↓
Items table refreshed
    ↓
Success notification shown
```

#### 6. Admin Match Items
```
User selects lost and found items from dropdowns
    ↓
handleMatchItems() validates selections
    ↓
api.put('/admin/match-items', { lostItemId, foundItemId })
    ↓
Backend links items
    ↓
loadMatchedItems() refreshes matched list
    ↓
Success notification shown
    ↓
Dropdowns reloaded (matched items removed)
```

## Error Handling

### API Error Handling

```javascript
// Try-catch pattern
try {
    const items = await api.get(Config.ENDPOINTS.LOST_ITEMS);
} catch (error) {
    console.error('Error:', error);
    Utils.showNotification(Config.MESSAGES.ERROR_FETCH, 'danger');
}

// Automatic retry (3 attempts with exponential backoff)
// Network errors → Retry
// 5xx errors → Retry
// 4xx errors → No retry (client error)
```

### Error Messages

All error messages are centralized in Config.MESSAGES:

```javascript
Config.MESSAGES = {
    ERROR_FETCH: 'Failed to fetch data',
    ERROR_CREATE: 'Failed to create item',
    ERROR_UPDATE: 'Failed to update item',
    ERROR_DELETE: 'Failed to delete item',
    ERROR_MATCH: 'Failed to match items',
    ERROR_SEARCH: 'Search failed',
    ERROR_VALIDATION: 'Please fill in all required fields',
    ...
}
```

## Caching Strategy

```javascript
// GET requests are automatically cached (5 minute TTL)
const items1 = await api.get('/items/lost');  // Fetches from API
const items2 = await api.get('/items/lost');  // Returns from cache

// Clear cache manually if needed
api.clearCache();

// Cache is automatically invalidated for:
// - PUT requests (updates)
// - POST requests (creates)
// - DELETE requests (deletes)
```

## Security

### XSS Protection

All user-generated content is escaped before rendering:

```javascript
// VULNERABLE - Don't do this
element.innerHTML = item.itemName;  // ❌

// SAFE - Use escaping
element.innerHTML = UIComponents.escapeHtml(item.itemName);  // ✅

// Or use textContent for plain text
element.textContent = item.itemName;  // ✅
```

### CSRF Protection

Not needed as we use GET/POST/PUT/DELETE with JSON bodies, not form submissions. CORS is configured on backend.

### Input Validation

```javascript
// Client-side validation
if (!itemName || itemName.trim() === '') {
    Utils.showNotification(Config.MESSAGES.ERROR_VALIDATION, 'warning');
    return;
}

// Server-side validation (Spring @NotNull, @NotBlank)
// Always trust server validation
```

## Testing Integration

### Running Integration Tests

```javascript
// In browser console
await runIntegrationTests();

// Outputs:
// ✅ Passed: 25
// ❌ Failed: 0
// 📊 Total: 25
// ✨ Success Rate: 100%
```

### Manual Testing Checklist

- [ ] Home page loads and displays stats
- [ ] Lost items page loads and displays items
- [ ] Search works on lost items page
- [ ] Found items page loads and displays items
- [ ] Filtering works on found items page
- [ ] Admin add item form works
- [ ] Admin edit item works
- [ ] Admin delete item works
- [ ] Admin match items works
- [ ] Modals open and close properly
- [ ] Navigation between pages works
- [ ] Error messages display on failure
- [ ] Loading spinners show during fetch
- [ ] XSS protection active (HTML escaped)

## Performance Optimization

### Response Time Targets

- Page load: < 2 seconds
- API request: < 500ms
- Search response: < 500ms
- Cache hit: < 100ms

### Optimization Techniques

1. **Caching** - GET responses cached for 5 minutes
2. **Debouncing** - Search input debounced to 300ms
3. **Lazy Loading** - Modals load on demand
4. **Error Retry** - Automatic retry for network failures
5. **Request Timeout** - 10-second timeout to prevent hanging

## Deployment Checklist

- [ ] Backend API running on port 8080
- [ ] Database (PostgreSQL) configured
- [ ] CORS enabled for frontend origin
- [ ] SSL/HTTPS configured (production)
- [ ] Environment variables set
- [ ] Logging configured
- [ ] Error monitoring setup
- [ ] Performance monitoring setup
- [ ] Database backups configured

## Troubleshooting

### Frontend Can't Connect to Backend

```
Error: Failed to fetch data

Solutions:
1. Verify backend is running: http://localhost:8080/health
2. Check API base URL in config.js
3. Verify CORS is enabled on backend
4. Check browser console for actual error
5. Check network tab in DevTools
```

### Data Not Displaying

```
Solutions:
1. Check browser console for JS errors
2. Verify API endpoint is correct
3. Check network tab for API response
4. Verify data is in database
5. Check if cache needs clearing
```

### Form Submission Fails

```
Solutions:
1. Verify all required fields filled
2. Check input validation logic
3. Look at network tab for API response
4. Check backend logs for error
5. Verify request body format matches API spec
```

## Future Enhancements

1. **Real-time Updates** - WebSockets for live item updates
2. **Authentication** - JWT for user authentication
3. **Pagination** - Load items in batches
4. **Filtering** - Advanced filtering by date, status, etc.
5. **Export** - Export items to CSV/PDF
6. **Notifications** - Email/SMS notifications
7. **Analytics** - Dashboard with statistics
8. **Mobile App** - React Native or Flutter app

---

**Last Updated**: March 14, 2026
**Version**: 1.0.0
**Status**: Production Ready


# Frontend Documentation - Lost & Found Portal

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Installation & Setup](#installation--setup)
5. [Pages Description](#pages-description)
6. [Features](#features)
7. [JavaScript Architecture](#javascript-architecture)
8. [Styling Guide](#styling-guide)
9. [Browser Compatibility](#browser-compatibility)
10. [Accessibility](#accessibility)
11. [Performance Optimization](#performance-optimization)

---

## Project Overview

The Lost & Found Portal frontend is a responsive web application that enables students to:
- Search for lost and found items
- View detailed information about items
- Admin panel for managing items
- Real-time item listing and filtering

The frontend is built with vanilla HTML, CSS, and JavaScript, integrated with Bootstrap 5 for responsive design.

---

## Technology Stack

### Frontend Technologies
- **HTML5** - Semantic markup
- **CSS3** - Styling with custom properties and flexbox/grid
- **JavaScript (ES6+)** - Dynamic functionality
- **Bootstrap 5** - Responsive framework
- **Fetch API** - API communication

### Tools & Services
- **Bootstrap CDN** - CSS framework
- **Font Awesome Icons** (via Bootstrap Icons)
- **Google Fonts** (optional)

---

## Project Structure

```
src/main/resources/
├── templates/
│   ├── home.html          # Landing page
│   ├── lost.html          # View lost items
│   ├── found.html         # View found items
│   └── admin.html         # Admin management panel
└── static/
    ├── css/
    │   └── style.css      # Main stylesheet
    └── js/
        └── app.js         # Core application logic
```

---

## Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Backend API running on `http://localhost:8080`

### Setup Instructions

1. **Clone/Navigate to Project**
   ```bash
   cd /Users/ritikkhatana/Downloads/lostfound-portal
   ```

2. **Ensure Backend is Running**
   ```bash
   ./mvnw spring-boot:run
   ```

3. **Access Frontend**
   - Open browser to `http://localhost:8080/`
   - Frontend files are served from `src/main/resources/templates/`

### Development Server

For development with live reload, consider using:
```bash
# VS Code with Live Server extension
# OR
# Python simple HTTP server (for static files only)
cd src/main/resources/static
python -m http.server 8000
```

---

## Pages Description

### 1. Home Page (`home.html`)

**Purpose**: Landing page with overview of the application

**Key Sections**:
- Hero section with call-to-action buttons
- Features overview (Search, Browse, Claim)
- Statistics (Lost items, Found items, Claimed items)
- Instructions for lost/found items
- Footer with contact information

**Features**:
- Responsive design
- Dynamic statistics loaded from backend
- Navigation to other pages
- Informative content

**JavaScript Functions**:
```javascript
loadStats() - Fetch and display item statistics
```

---

### 2. Lost Items Page (`lost.html`)

**Purpose**: Display and search lost items

**Key Sections**:
- Search bar with keyword input
- Filter buttons (optional)
- Item cards in grid layout
- Detail modal for item information
- No items message fallback

**Features**:
- Real-time search functionality
- Item cards with image, description, location
- View details modal
- Status badges (LOST, FOUND, CLAIMED)
- Responsive grid (1, 2, or 3 columns)
- Loading spinner during data fetch
- Clear search button

**JavaScript Functions**:
```javascript
loadLostItems() - Fetch all lost items
handleSearch() - Search items by keyword
displayItems() - Render item cards
createItemCard() - Generate HTML for item card
showItemDetail() - Display detailed modal
```

**API Endpoints Used**:
- `GET /api/items/lost` - Get all lost items
- `GET /api/items/search?keyword=` - Search items

---

### 3. Found Items Page (`found.html`)

**Purpose**: Display and filter found items

**Key Sections**:
- Search bar with keyword input
- Filter buttons (All, Claimed, Not Claimed)
- Item cards in grid layout
- Detail modal for item information
- No items message fallback

**Features**:
- Real-time search functionality
- Status-based filtering
- Item cards with image, description, location
- View details modal
- Status indicators (Claimed/Not Claimed)
- Responsive grid layout
- Loading spinner during data fetch

**JavaScript Functions**:
```javascript
loadFoundItems() - Fetch all found items
handleSearch() - Search items by keyword
applyFilter() - Filter by status
displayItems() - Render item cards
createItemCard() - Generate HTML for item card
showItemDetail() - Display detailed modal
```

**API Endpoints Used**:
- `GET /api/items/found` - Get all found items
- `GET /api/items/search?keyword=` - Search items

---

### 4. Admin Panel (`admin.html`)

**Purpose**: Administrative interface for managing items

**Key Sections**:

#### Add Item Tab
- Form to add new lost or found items
- Dynamic field visibility based on item type
- Input validation
- Success/error alerts

#### Manage Items Tab
- Table of all items
- Search/filter functionality
- Edit and delete buttons
- Edit modal for updating items
- Item details table with sorting

#### Match Items Tab
- Dropdowns to select lost and found items
- Match button to link items
- Display of matched items
- Link/unlink functionality

**Features**:
- Tab-based navigation
- Form validation
- Real-time table updates
- Edit modal with form
- Delete confirmation dialog
- Batch operations support
- Status updates
- Item matching/linking

**JavaScript Functions**:
```javascript
handleAddItem() - Process form submission for new items
loadAllItems() - Fetch all items
loadItemsTable() - Populate items table
editItem() - Open edit modal
handleEditItem() - Process edit form
deleteItem() - Delete item with confirmation
loadMatchSelects() - Populate match dropdowns
handleMatchItems() - Match items
loadMatchedItems() - Display matched items
```

**API Endpoints Used**:
- `POST /api/admin/items` - Create item
- `GET /api/items/lost` - Get lost items
- `GET /api/items/found` - Get found items
- `PUT /api/admin/items/{id}` - Update item
- `DELETE /api/admin/items/{id}` - Delete item
- `PUT /api/admin/match-items` - Match items

---

## Features

### User Features

1. **Search Items**
   - Search across all items
   - Search specific item type (lost/found)
   - Real-time results
   - Keyword highlighting

2. **Filter Items**
   - Filter by status (Claimed/Not Claimed)
   - Sort by date
   - Quick filters

3. **View Details**
   - Modal popup with full item details
   - Photo display
   - Description and metadata
   - Contact information

4. **Responsive Design**
   - Mobile-friendly layout
   - Tablet optimization
   - Desktop view
   - Touch-friendly buttons

### Admin Features

1. **Add Items**
   - Form for lost items (student name, ID, etc.)
   - Form for found items (found by, etc.)
   - Photo URL input
   - Status selection
   - Input validation

2. **Manage Items**
   - View all items in table
   - Edit item details
   - Delete items
   - Search/filter items
   - Batch operations

3. **Match Items**
   - Link lost with found items
   - View matched pairs
   - Unlink items
   - Visual feedback

---

## JavaScript Architecture

### Global Object: `Utils`

Utility functions for common operations:

```javascript
Utils.apiCall(endpoint, options)
  - Make authenticated API calls
  - Handle errors gracefully
  - Consistent error logging

Utils.formatDate(date)
  - Format date to readable format

Utils.formatDateTime(datetime)
  - Format datetime to readable format

Utils.showNotification(message, type, duration)
  - Display toast notifications
  - Auto-dismiss after duration

Utils.debounce(func, wait)
  - Debounce function calls (for search)

Utils.getStatusBadgeColor(status)
  - Get Bootstrap badge color for status

Utils.getTypeBadgeColor(type)
  - Get Bootstrap badge color for type

Utils.isValidEmail(email)
  - Validate email format

Utils.clearForm(formId)
  - Reset form to initial state

Utils.setLoading(elementId, isLoading)
  - Show/hide loading state
```

### Service Object: `ItemsService`

Service for all item-related API calls:

```javascript
ItemsService.getLostItems()
ItemsService.getFoundItems()
ItemsService.getItemById(itemId)
ItemsService.searchItems(keyword)
ItemsService.createItem(itemData)
ItemsService.updateItem(itemId, updateData)
ItemsService.deleteItem(itemId)
ItemsService.matchItems(lostItemId, foundItemId)
```

### Component Object: `UIComponents`

Reusable UI components:

```javascript
UIComponents.createItemCard(item, cardType)
UIComponents.createItemDetailContent(item)
UIComponents.escapeHtml(text)
```

### Module Pattern

Each page uses the module pattern:
```javascript
// Page-specific functionality
const LostItemsModule = {
    loadLostItems: async function() { ... },
    displayItems: function(items) { ... },
    // ...
};
```

---

## Styling Guide

### CSS Structure

1. **Root Variables** - Define color scheme and sizing
2. **General Styles** - Body, typography, base elements
3. **Component Styles** - Cards, buttons, forms
4. **Utility Classes** - Responsive, animation helpers
5. **Responsive Breakpoints** - Mobile, tablet, desktop

### Color Scheme

```css
--primary-color: #0d6efd (Blue)
--success-color: #198754 (Green)
--danger-color: #dc3545 (Red)
--warning-color: #ffc107 (Yellow)
--info-color: #0dcaf0 (Cyan)
--light-color: #f8f9fa (Light Gray)
--dark-color: #212529 (Dark Gray)
```

### Key Component Styles

**Item Cards**:
```css
.item-card {
    - Hover effect with lift animation
    - Image zoom on hover
    - Shadow effects
    - Responsive sizing
}
```

**Forms**:
```css
.form-control, .form-select {
    - Custom border colors
    - Focus states
    - Smooth transitions
}
```

**Buttons**:
```css
.btn {
    - Color-coded by action
    - Hover and active states
    - Loading spinner support
    - Responsive sizing
}
```

**Navbar**:
```css
.navbar {
    - Sticky positioning
    - Active link indicator
    - Mobile collapse support
}
```

### Responsive Breakpoints

```css
Mobile: < 576px
Tablet: 576px - 768px
Desktop: > 768px
```

---

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Features Used
- ES6 JavaScript (async/await, arrow functions)
- CSS Grid and Flexbox
- Fetch API
- LocalStorage (optional)

### Polyfills Required
- None for modern browsers
- For IE11, would need Babel transpilation

---

## Accessibility

### WCAG 2.1 Compliance

1. **Keyboard Navigation**
   - All interactive elements keyboard accessible
   - Tab order logical
   - Focus indicators visible

2. **Screen Readers**
   - Semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`)
   - ARIA labels on inputs
   - Alt text on images
   - Form labels associated with inputs

3. **Color Contrast**
   - All text meets AA standard (4.5:1)
   - Status not indicated by color alone
   - Badges use text and symbols

4. **Forms**
   - All inputs have labels
   - Error messages clear and associated
   - Required fields marked
   - Help text provided

---

## Performance Optimization

### Load Time Optimization

1. **Asset Minimization**
   - CSS minification (production)
   - JavaScript minification (production)
   - Image optimization

2. **Lazy Loading**
   - Images load on demand
   - Modals load content when opened

3. **Caching Strategy**
   ```javascript
   // Cache item data to reduce API calls
   let cachedItems = null;
   const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
   ```

### Runtime Performance

1. **Event Debouncing**
   ```javascript
   // Debounce search input
   const debouncedSearch = Utils.debounce(handleSearch, 300);
   ```

2. **Pagination** (for future enhancement)
   - Limit items per page
   - Load more button
   - Infinite scroll option

3. **DOM Optimization**
   - Batch DOM updates
   - Use DocumentFragment for multiple inserts
   - Minimize reflows

### Network Performance

1. **API Optimization**
   - Request only needed fields
   - Batch requests when possible
   - Implement request timeouts

2. **Connection Handling**
   ```javascript
   // Offline detection
   window.addEventListener('online', updateItems);
   window.addEventListener('offline', showOfflineMessage);
   ```

---

## Development Guidelines

### Code Style

1. **JavaScript**
   - Use `const` by default
   - Use `let` for variables that change
   - Avoid `var`
   - Use async/await over promises
   - Use arrow functions

2. **HTML**
   - Use semantic HTML5
   - Use data attributes for JS targeting
   - Avoid inline styles
   - Use BEM naming for complex components

3. **CSS**
   - Use CSS variables for colors
   - Use descriptive class names
   - Mobile-first approach
   - Avoid `!important`

### Best Practices

1. **Error Handling**
   ```javascript
   try {
       const data = await fetch(url);
   } catch (error) {
       console.error('Error:', error);
       Utils.showNotification('Error message', 'danger');
   }
   ```

2. **User Feedback**
   - Show loading states
   - Display success/error messages
   - Disable buttons during submission
   - Provide feedback for actions

3. **Security**
   - Escape HTML for user input
   - Validate forms client-side
   - Use HTTPS in production
   - Avoid storing sensitive data

---

## Testing

### Manual Testing Checklist

- [ ] All pages load without errors
- [ ] Search functionality works on all item pages
- [ ] Filters display correct results
- [ ] Admin form validation works
- [ ] Edit/delete operations succeed
- [ ] Match items works correctly
- [ ] Responsive design on mobile/tablet
- [ ] Buttons and links navigate correctly
- [ ] Forms clear after submission
- [ ] Error messages display properly

### Browser Testing
- [ ] Chrome latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Edge latest

---

## Future Enhancements

1. **Features**
   - User authentication
   - User profiles
   - Email notifications
   - Image upload (not just URLs)
   - Advanced filtering/sorting
   - Item history/timeline
   - Comments/notes on items

2. **UX Improvements**
   - Dark mode support
   - Infinite scroll
   - Item comparison
   - Favorites/wishlist
   - Share functionality
   - Export to PDF

3. **Performance**
   - Service Worker for offline support
   - Progressive Web App (PWA)
   - Caching strategy
   - Image lazy loading

4. **Admin Features**
   - Analytics dashboard
   - Reports generation
   - Bulk operations
   - User management
   - Audit logs

---

## Troubleshooting

### Common Issues

**Issue**: Items not loading
- Check backend is running
- Verify API URL in app.js
- Check browser console for errors
- Clear browser cache

**Issue**: Search not working
- Verify keyword input has value
- Check API is responding
- Check debounce timing
- Verify search endpoint

**Issue**: Images not showing
- Check image URLs are valid
- Verify CORS is configured
- Check fallback image works
- Use placeholder for missing images

**Issue**: Forms not submitting
- Check form validation
- Verify required fields filled
- Check API endpoint
- Verify request method (POST/PUT)

---

## Resources

- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.0/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/)
- [JavaScript Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)


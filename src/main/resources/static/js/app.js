/**
 * Lost & Found Portal - Main Application JavaScript
 * Handles common functionality across all pages
 */

const API_BASE_URL = '/api';
const APP_NAME = 'Lost & Found Portal';

// Utility Functions
const Utils = {
    /**
     * Make API call with error handling
     */
    async apiCall(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }

            return response;
        } catch (error) {
            console.error(`API Call Error at ${endpoint}:`, error);
            throw error;
        }
    },

    /**
     * Format date to readable format
     */
    formatDate(date) {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    /**
     * Format datetime to readable format
     */
    formatDateTime(datetime) {
        if (!datetime) return 'N/A';
        return new Date(datetime).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Show notification toast
     */
    showNotification(message, type = 'info', duration = 3000) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alertDiv);

        if (duration > 0) {
            setTimeout(() => {
                alertDiv.remove();
            }, duration);
        }

        return alertDiv;
    },

    /**
     * Debounce function for search input
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Get status badge color
     */
    getStatusBadgeColor(status) {
        const statusColors = {
            'LOST': 'danger',
            'FOUND': 'success',
            'CLAIMED': 'success',
            'NOT_CLAIMED': 'warning'
        };
        return statusColors[status] || 'secondary';
    },

    /**
     * Get type badge color
     */
    getTypeBadgeColor(type) {
        return type === 'LOST' ? 'danger' : 'success';
    },

    /**
     * Validate email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Generate unique ID
     */
    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Clear form
     */
    clearForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    },

    /**
     * Show loading state
     */
    setLoading(elementId, isLoading) {
        const element = document.getElementById(elementId);
        if (!element) return;

        if (isLoading) {
            element.disabled = true;
            element.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Loading...
            `;
        } else {
            element.disabled = false;
            element.textContent = 'Submit';
        }
    }
};

/**
 * Items Service - Handle all item-related API calls
 */
const ItemsService = {
    /**
     * Get all lost items
     */
    async getLostItems() {
        try {
            return await Utils.apiCall('/items/lost');
        } catch (error) {
            console.error('Error fetching lost items:', error);
            throw error;
        }
    },

    /**
     * Get all found items
     */
    async getFoundItems() {
        try {
            return await Utils.apiCall('/items/found');
        } catch (error) {
            console.error('Error fetching found items:', error);
            throw error;
        }
    },

    /**
     * Get item by ID
     */
    async getItemById(itemId) {
        try {
            return await Utils.apiCall(`/items/${itemId}`);
        } catch (error) {
            console.error(`Error fetching item ${itemId}:`, error);
            throw error;
        }
    },

    /**
     * Search items by keyword
     */
    async searchItems(keyword) {
        if (!keyword || keyword.trim() === '') {
            return [];
        }
        try {
            return await Utils.apiCall(`/items/search?keyword=${encodeURIComponent(keyword)}`);
        } catch (error) {
            console.error('Error searching items:', error);
            throw error;
        }
    },

    /**
     * Create new item (Admin)
     */
    async createItem(itemData) {
        try {
            return await Utils.apiCall('/admin/items', {
                method: 'POST',
                body: JSON.stringify(itemData)
            });
        } catch (error) {
            console.error('Error creating item:', error);
            throw error;
        }
    },

    /**
     * Update item (Admin)
     */
    async updateItem(itemId, updateData) {
        try {
            return await Utils.apiCall(`/admin/items/${itemId}`, {
                method: 'PUT',
                body: JSON.stringify(updateData)
            });
        } catch (error) {
            console.error(`Error updating item ${itemId}:`, error);
            throw error;
        }
    },

    /**
     * Delete item (Admin)
     */
    async deleteItem(itemId) {
        try {
            return await Utils.apiCall(`/admin/items/${itemId}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error(`Error deleting item ${itemId}:`, error);
            throw error;
        }
    },

    /**
     * Match lost and found items (Admin)
     */
    async matchItems(lostItemId, foundItemId) {
        try {
            return await Utils.apiCall('/admin/match-items', {
                method: 'PUT',
                body: JSON.stringify({
                    lostItemId: parseInt(lostItemId),
                    foundItemId: parseInt(foundItemId)
                })
            });
        } catch (error) {
            console.error('Error matching items:', error);
            throw error;
        }
    }
};

/**
 * UI Components - Reusable UI functions
 */
const UIComponents = {
    /**
     * Create item card HTML
     */
    createItemCard(item, cardType = 'default') {
        const date = Utils.formatDate(item.dateReported || item.dateFound);
        const statusBadgeColor = Utils.getStatusBadgeColor(item.status);
        const typeBadgeColor = Utils.getTypeBadgeColor(item.type);

        const photoHtml = item.photoUrl
            ? `<img src="${item.photoUrl}" class="card-img-top" alt="${item.itemName}" onerror="this.src='/images/placeholder.png'">`
            : `<div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px;">
                <i class="bi bi-image" style="font-size: 3rem; color: #ccc;"></i>
               </div>`;

        return `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 item-card shadow-sm">
                    ${photoHtml}
                    <div class="card-body">
                        <h5 class="card-title">${this.escapeHtml(item.itemName)}</h5>
                        <p class="card-text text-muted">${this.escapeHtml(item.description || 'No description provided')}</p>
                        <div class="mb-3">
                            <span class="badge bg-${typeBadgeColor}">${item.type}</span>
                            <span class="badge bg-${statusBadgeColor} ${statusBadgeColor === 'warning' ? 'text-dark' : ''}">${item.status}</span>
                        </div>
                        <div class="small mb-2">
                            <strong>Location:</strong> ${this.escapeHtml(item.location)}<br>
                            <strong>Date:</strong> ${date}
                        </div>
                        ${item.studentName ? `<div class="small mb-2"><strong>Reported by:</strong> ${this.escapeHtml(item.studentName)}</div>` : ''}
                        ${item.foundBy ? `<div class="small mb-2"><strong>Found by:</strong> ${this.escapeHtml(item.foundBy)}</div>` : ''}
                    </div>
                    <div class="card-footer bg-white border-top">
                        <button class="btn btn-sm btn-primary w-100 btn-view-details" data-item-id="${item.id}">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Create detailed item modal content
     */
    createItemDetailContent(item) {
        const datetime = Utils.formatDateTime(item.dateReported || item.dateFound);
        const photoHtml = item.photoUrl
            ? `<div class="col-md-6 mb-3"><img src="${item.photoUrl}" class="img-fluid rounded" alt="${item.itemName}" onerror="this.src='/images/placeholder.png'"></div>`
            : '';
        const colSize = item.photoUrl ? '6' : '12';

        return `
            <div class="row">
                ${photoHtml}
                <div class="col-md-${colSize}">
                    <h5 class="mb-3">${this.escapeHtml(item.itemName)}</h5>

                    <div class="mb-3">
                        <strong>Status:</strong>
                        <span class="badge bg-${Utils.getStatusBadgeColor(item.status)} ${Utils.getStatusBadgeColor(item.status) === 'warning' ? 'text-dark' : ''}">
                            ${item.status}
                        </span>
                    </div>

                    <div class="mb-3">
                        <strong>Type:</strong>
                        <span class="badge bg-${Utils.getTypeBadgeColor(item.type)}">
                            ${item.type}
                        </span>
                    </div>

                    <div class="mb-3">
                        <strong>Description:</strong><br>
                        ${this.escapeHtml(item.description || 'Not provided')}
                    </div>

                    <div class="mb-3">
                        <strong>Location:</strong><br>
                        ${this.escapeHtml(item.location)}
                    </div>

                    <div class="mb-3">
                        <strong>Date:</strong><br>
                        ${datetime}
                    </div>

                    ${item.studentName ? `
                    <div class="mb-3">
                        <strong>Student Name:</strong><br>
                        ${this.escapeHtml(item.studentName)}
                    </div>
                    ` : ''}

                    ${item.studentNumber ? `
                    <div class="mb-3">
                        <strong>Student Number:</strong><br>
                        ${this.escapeHtml(item.studentNumber)}
                    </div>
                    ` : ''}

                    ${item.foundBy ? `
                    <div class="mb-3">
                        <strong>Found by:</strong><br>
                        ${this.escapeHtml(item.foundBy)}
                    </div>
                    ` : ''}
                </div>
            </div>

            <div class="alert alert-${item.type === 'LOST' ? 'info' : 'success'} mt-4" role="alert">
                ${item.type === 'LOST'
                    ? '<strong>Have you found this item?</strong><br>If you see this item or have any information, please contact the Lost & Found Desk immediately!'
                    : '<strong>Is this your item?</strong><br>If this is your item, please visit the Lost & Found Desk with your ID and description of the item to claim it!'
                }
            </div>
        `;
    },

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

/**
 * Initialize app on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Add data-bs-toggle support for tooltips if needed
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Add any global event listeners here
    setupGlobalEventListeners();
}

function setupGlobalEventListeners() {
    // Add any global event listeners that should work across all pages
    document.addEventListener('keydown', function(e) {
        // Add keyboard shortcuts if needed
        // e.g., Ctrl+K for search, Ctrl+/ for help, etc.
    });
}

// Export for use in other modules
window.Utils = Utils;
window.ItemsService = ItemsService;
window.UIComponents = UIComponents;

console.log(`${APP_NAME} initialized successfully`);


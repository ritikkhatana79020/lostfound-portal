/**
 * Lost Items Page Controller
 * Handles all functionality for the lost items page
 */

const LostItemsPage = {
    allItems: [],
    itemDetailModal: null,

    async init() {
        console.log('Initializing Lost Items Page');
        this.itemDetailModal = new bootstrap.Modal(document.getElementById('itemDetailModal'));
        await this.loadItems();
        this.setupEventListeners();
    },

    async loadItems() {
        try {
            this.showLoading(true);
            this.allItems = await api.get(Config.ENDPOINTS.LOST_ITEMS);
            this.displayItems(this.allItems);
            document.getElementById('searchInput').value = '';
            console.log('Lost items loaded:', this.allItems.length);
        } catch (error) {
            console.error('Error loading lost items:', error);
            Utils.showNotification(Config.MESSAGES.ERROR_FETCH, 'danger');
            this.showError(Config.MESSAGES.ERROR_FETCH);
        } finally {
            this.showLoading(false);
        }
    },

    async handleSearch() {
        const keyword = document.getElementById('searchInput').value.trim();

        if (!keyword) {
            this.loadItems();
            return;
        }

        try {
            this.showLoading(true);
            let results = await api.get(`${Config.ENDPOINTS.SEARCH_ITEMS}?keyword=${encodeURIComponent(keyword)}`);

            // Filter to only lost items
            results = results.filter(item => item.type === Config.ITEM_TYPE.LOST);

            console.log('Search results:', results.length);
            this.displayItems(results);
        } catch (error) {
            console.error('Error searching items:', error);
            Utils.showNotification(Config.MESSAGES.ERROR_SEARCH, 'danger');
            this.showError(Config.MESSAGES.ERROR_SEARCH);
        } finally {
            this.showLoading(false);
        }
    },

    displayItems(items) {
        const container = document.getElementById('itemsContainer');
        const noItemsMsg = document.getElementById('noItemsMessage');

        if (!items || items.length === 0) {
            container.innerHTML = '';
            noItemsMsg.style.display = 'block';
            return;
        }

        noItemsMsg.style.display = 'none';
        container.innerHTML = items.map(item => this.createItemCard(item)).join('');

        // Add click listeners to view buttons
        document.querySelectorAll('.btn-view-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.closest('button').dataset.itemId;
                const item = items.find(i => i.id == itemId);
                if (item) {
                    this.showItemDetail(item);
                }
            });
        });
    },

    createItemCard(item) {
        const dateReported = Utils.formatDate(item.dateReported);
        const escapedName = UIComponents.escapeHtml(item.itemName);
        const escapedDesc = UIComponents.escapeHtml(item.description || 'No description provided');
        const escapedLocation = UIComponents.escapeHtml(item.location);
        const escapedStudent = UIComponents.escapeHtml(item.studentName || '');

        const photoHtml = item.photoUrl
            ? `<img src="${item.photoUrl}" class="card-img-top" alt="${escapedName}" onerror="this.src='/images/placeholder.png'">`
            : `<div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px;">
                <i class="bi bi-image" style="font-size: 3rem; color: #ccc;"></i>
               </div>`;

        return `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 item-card shadow-sm">
                    ${photoHtml}
                    <div class="card-body">
                        <h5 class="card-title">${escapedName}</h5>
                        <p class="card-text text-muted">${escapedDesc}</p>
                        <div class="mb-3">
                            <span class="badge bg-danger">Lost</span>
                            <span class="badge bg-${Utils.getStatusBadgeColor(item.status)} ${Utils.getStatusBadgeColor(item.status) === 'warning' ? 'text-dark' : ''}">${item.status}</span>
                        </div>
                        <div class="small mb-2">
                            <strong>Location:</strong> ${escapedLocation}<br>
                            <strong>Date:</strong> ${dateReported}
                        </div>
                        ${item.studentName ? `<div class="small mb-2"><strong>Reported by:</strong> ${escapedStudent}</div>` : ''}
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

    showItemDetail(item) {
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = UIComponents.createItemDetailContent(item);
        this.itemDetailModal.show();
    },

    setupEventListeners() {
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        const clearBtn = document.getElementById('clearSearch');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch());
        }

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });

            // Debounced search as user types
            searchInput.addEventListener('input', Utils.debounce(() => {
                if (searchInput.value.length > 0) {
                    this.handleSearch();
                }
            }, 500));
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.loadItems());
        }
    },

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.style.display = show ? 'block' : 'none';
        }
    },

    showError(message) {
        const container = document.getElementById('itemsContainer');
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    <i class="bi bi-exclamation-circle"></i> ${UIComponents.escapeHtml(message)}
                </div>
            </div>
        `;
    }
};


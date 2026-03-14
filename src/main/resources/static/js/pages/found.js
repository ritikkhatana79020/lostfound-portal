/**
 * Found Items Page Controller
 * Handles all functionality for the found items page
 */

const FoundItemsPage = {
    allItems: [],
    currentFilter: 'all',
    itemDetailModal: null,

    async init() {
        console.log('Initializing Found Items Page');
        this.itemDetailModal = new bootstrap.Modal(document.getElementById('itemDetailModal'));
        await this.loadItems();
        this.setupEventListeners();
    },

    async loadItems() {
        try {
            this.showLoading(true);
            this.allItems = await api.get(Config.ENDPOINTS.FOUND_ITEMS);
            this.currentFilter = 'all';
            this.displayItems(this.allItems);
            document.getElementById('searchInput').value = '';
            console.log('Found items loaded:', this.allItems.length);
        } catch (error) {
            console.error('Error loading found items:', error);
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

            // Filter to only found items
            results = results.filter(item => item.type === Config.ITEM_TYPE.FOUND);

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

    applyFilter(filter) {
        this.currentFilter = filter;
        let filteredItems = this.allItems;

        if (filter === 'claimed') {
            filteredItems = this.allItems.filter(item => item.status === Config.ITEM_STATUS.CLAIMED);
        } else if (filter === 'notclaimed') {
            filteredItems = this.allItems.filter(item => item.status === Config.ITEM_STATUS.NOT_CLAIMED);
        }

        this.displayItems(filteredItems);
        this.updateFilterButtons(filter);
    },

    updateFilterButtons(activeFilter) {
        document.getElementById('filterAll').classList.toggle('active', activeFilter === 'all');
        document.getElementById('filterClaimed').classList.toggle('active', activeFilter === 'claimed');
        document.getElementById('filterNotClaimed').classList.toggle('active', activeFilter === 'notclaimed');
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
        const dateFound = Utils.formatDate(item.dateFound || item.dateReported);
        const statusBadgeColor = item.status === Config.ITEM_STATUS.CLAIMED ? 'success' : 'warning';
        const textColor = item.status === Config.ITEM_STATUS.CLAIMED ? '' : 'text-dark';
        const escapedName = UIComponents.escapeHtml(item.itemName);
        const escapedDesc = UIComponents.escapeHtml(item.description || 'No description provided');
        const escapedLocation = UIComponents.escapeHtml(item.location);
        const escapedFoundBy = UIComponents.escapeHtml(item.foundBy || '');

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
                            <span class="badge bg-success">Found</span>
                            <span class="badge bg-${statusBadgeColor} ${textColor}">${item.status}</span>
                        </div>
                        <div class="small mb-2">
                            <strong>Location:</strong> ${escapedLocation}<br>
                            <strong>Date:</strong> ${dateFound}
                        </div>
                        ${item.foundBy ? `<div class="small mb-2"><strong>Found by:</strong> ${escapedFoundBy}</div>` : ''}
                    </div>
                    <div class="card-footer bg-white border-top">
                        <button class="btn btn-sm btn-success w-100 btn-view-details" data-item-id="${item.id}">
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

        // Filter buttons
        document.getElementById('filterAll')?.addEventListener('click', () => this.applyFilter('all'));
        document.getElementById('filterClaimed')?.addEventListener('click', () => this.applyFilter('claimed'));
        document.getElementById('filterNotClaimed')?.addEventListener('click', () => this.applyFilter('notclaimed'));

        // Set initial button styles
        this.updateFilterButtons('all');
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


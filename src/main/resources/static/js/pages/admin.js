/**
 * Admin Page Controller
 * Handles all admin functionality for managing items
 */

const AdminPage = {
    allItems: [],
    allLostItems: [],
    allFoundItems: [],
    editModal: null,

    async init() {
        console.log('Initializing Admin Page');
        this.editModal = new bootstrap.Modal(document.getElementById('editItemModal'));
        this.setupTabNavigation();
        this.setupFormHandlers();
        await this.loadAllItems();
    },

    setupTabNavigation() {
        document.querySelectorAll('[data-tab]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.showTab(tabName);

                // Update active button
                document.querySelectorAll('[data-tab]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    },

    showTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.style.display = 'none';
        });
        document.getElementById(tabName).style.display = 'block';

        if (tabName === 'manage-items') {
            this.loadItemsTable();
        } else if (tabName === 'match-items') {
            this.loadMatchSelects();
            this.loadMatchedItems();
        }
    },

    setupFormHandlers() {
        // Add Item Type Change
        document.getElementById('itemType').addEventListener('change', (e) => {
            const isLost = e.target.value === Config.ITEM_TYPE.LOST;
            document.querySelectorAll('.lost-fields')[0].style.display = isLost ? 'block' : 'none';
            document.querySelectorAll('.found-fields')[0].style.display = !isLost ? 'block' : 'none';
        });

        // Add Item Form Submit
        document.getElementById('addItemForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleAddItem();
        });

        // Edit Item Form
        document.getElementById('saveEditBtn').addEventListener('click', async () => {
            await this.handleEditItem();
        });

        // Match Items Form
        document.getElementById('matchItemsForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleMatchItems();
        });

        // Manage items search
        document.getElementById('manageSearchInput').addEventListener('keyup', () => this.filterItemsTable());
    },

    async handleAddItem() {
        const itemType = document.getElementById('itemType').value;

        // Validate required fields
        if (!itemType) {
            Utils.showNotification(Config.MESSAGES.ERROR_VALIDATION, 'warning');
            return;
        }

        const itemData = {
            type: itemType,
            itemName: document.getElementById('itemName').value,
            description: document.getElementById('itemDescription').value,
            location: document.getElementById('itemLocation').value,
            photoUrl: document.getElementById('photoUrl').value,
            status: document.getElementById('itemStatus').value
        };

        if (itemType === Config.ITEM_TYPE.LOST) {
            itemData.studentName = document.getElementById('studentName').value;
            itemData.studentNumber = document.getElementById('studentNumber').value;
        } else {
            itemData.foundBy = document.getElementById('foundBy').value;
        }

        try {
            const response = await api.post(Config.ENDPOINTS.CREATE_ITEM, itemData);
            Utils.showNotification(Config.MESSAGES.SUCCESS_CREATED, 'success');
            document.getElementById('addItemForm').reset();
            document.querySelectorAll('.lost-fields')[0].style.display = 'none';
            document.querySelectorAll('.found-fields')[0].style.display = 'none';
        } catch (error) {
            console.error('Error adding item:', error);
            Utils.showNotification(Config.MESSAGES.ERROR_CREATE, 'danger');
        }
    },

    async loadAllItems() {
        try {
            const [lost, found] = await Promise.all([
                api.get(Config.ENDPOINTS.LOST_ITEMS),
                api.get(Config.ENDPOINTS.FOUND_ITEMS)
            ]);

            this.allItems = [...lost, ...found];
            this.allLostItems = lost;
            this.allFoundItems = found;

            console.log('All items loaded:', { lost: lost.length, found: found.length });
        } catch (error) {
            console.error('Error loading items:', error);
            Utils.showNotification(Config.MESSAGES.ERROR_FETCH, 'danger');
        }
    },

    async loadItemsTable() {
        await this.loadAllItems();
        const tbody = document.getElementById('itemsTableBody');

        tbody.innerHTML = this.allItems.map(item => `
            <tr>
                <td>#${item.id}</td>
                <td>
                    <span class="badge bg-${Utils.getTypeBadgeColor(item.type)}">
                        ${item.type}
                    </span>
                </td>
                <td>${UIComponents.escapeHtml(item.itemName)}</td>
                <td>${UIComponents.escapeHtml(item.location)}</td>
                <td>
                    <span class="badge bg-${Utils.getStatusBadgeColor(item.status)} ${Utils.getStatusBadgeColor(item.status) === 'warning' ? 'text-dark' : ''}">
                        ${item.status}
                    </span>
                </td>
                <td>${Utils.formatDate(item.dateReported)}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-2" onclick="AdminPage.editItem(${item.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="AdminPage.deleteItem(${item.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    },

    filterItemsTable() {
        const keyword = document.getElementById('manageSearchInput').value.toLowerCase();
        document.querySelectorAll('#itemsTableBody tr').forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(keyword) ? '' : 'none';
        });
    },

    async editItem(itemId) {
        const item = this.allItems.find(i => i.id === itemId);
        if (!item) {
            Utils.showNotification('Item not found', 'danger');
            return;
        }

        document.getElementById('editItemId').value = itemId;
        document.getElementById('editItemName').value = item.itemName;
        document.getElementById('editItemDescription').value = item.description || '';
        document.getElementById('editItemLocation').value = item.location;
        document.getElementById('editItemStatus').value = item.status;

        this.editModal.show();
    },

    async handleEditItem() {
        const itemId = document.getElementById('editItemId').value;
        const itemData = {
            description: document.getElementById('editItemDescription').value,
            location: document.getElementById('editItemLocation').value,
            status: document.getElementById('editItemStatus').value
        };

        try {
            await api.put(Config.ENDPOINTS.UPDATE_ITEM(itemId), itemData);
            Utils.showNotification(Config.MESSAGES.SUCCESS_UPDATED, 'success');
            this.editModal.hide();
            await this.loadItemsTable();
        } catch (error) {
            console.error('Error updating item:', error);
            Utils.showNotification(Config.MESSAGES.ERROR_UPDATE, 'danger');
        }
    },

    async deleteItem(itemId) {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            await api.delete(Config.ENDPOINTS.DELETE_ITEM(itemId));
            Utils.showNotification(Config.MESSAGES.SUCCESS_DELETED, 'success');
            await this.loadItemsTable();
        } catch (error) {
            console.error('Error deleting item:', error);
            Utils.showNotification(Config.MESSAGES.ERROR_DELETE, 'danger');
        }
    },

    async loadMatchSelects() {
        await this.loadAllItems();

        const lostSelect = document.getElementById('lostItemSelect');
        const foundSelect = document.getElementById('foundItemSelect');

        lostSelect.innerHTML = '<option value="">Select Lost Item</option>' +
            this.allLostItems
                .filter(i => !i.matchedWith)
                .map(item => `<option value="${item.id}">${UIComponents.escapeHtml(item.itemName)} - ${UIComponents.escapeHtml(item.location)}</option>`)
                .join('');

        foundSelect.innerHTML = '<option value="">Select Found Item</option>' +
            this.allFoundItems
                .filter(i => !i.matchedWith)
                .map(item => `<option value="${item.id}">${UIComponents.escapeHtml(item.itemName)} - ${UIComponents.escapeHtml(item.location)}</option>`)
                .join('');
    },

    async handleMatchItems() {
        const lostItemId = document.getElementById('lostItemSelect').value;
        const foundItemId = document.getElementById('foundItemSelect').value;

        if (!lostItemId || !foundItemId) {
            Utils.showNotification('Please select both items', 'warning');
            return;
        }

        try {
            await api.put(Config.ENDPOINTS.MATCH_ITEMS, {
                lostItemId: parseInt(lostItemId),
                foundItemId: parseInt(foundItemId)
            });

            Utils.showNotification(Config.MESSAGES.SUCCESS_MATCHED, 'success');
            document.getElementById('matchItemsForm').reset();
            await this.loadMatchSelects();
            await this.loadMatchedItems();
        } catch (error) {
            console.error('Error matching items:', error);
            Utils.showNotification(Config.MESSAGES.ERROR_MATCH, 'danger');
        }
    },

    async loadMatchedItems() {
        const matchedList = document.getElementById('matchedItemsList');
        const matched = this.allItems.filter(item => item.matchedWith);

        if (matched.length === 0) {
            matchedList.innerHTML = '<p class="text-muted">No matched items yet</p>';
            return;
        }

        matchedList.innerHTML = matched.map(item => {
            const matchedItem = this.allItems.find(i => i.id === item.matchedWith);
            return `
                <div class="card mb-2">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-5">
                                <strong>${UIComponents.escapeHtml(item.itemName)}</strong><br>
                                <small class="text-muted">${UIComponents.escapeHtml(item.location)}</small>
                            </div>
                            <div class="col-md-2 text-center">
                                <i class="bi bi-arrow-left-right"></i>
                            </div>
                            <div class="col-md-5">
                                <strong>${UIComponents.escapeHtml(matchedItem?.itemName || '')}</strong><br>
                                <small class="text-muted">${UIComponents.escapeHtml(matchedItem?.location || '')}</small>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
};

// Make methods accessible globally for inline onclick handlers
window.AdminPage = AdminPage;


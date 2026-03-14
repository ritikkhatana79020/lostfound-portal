/**
 * Home Page Controller
 * Handles functionality specific to the home/index page
 */

const HomePage = {
    async init() {
        console.log('Initializing Home Page');
        await this.loadStats();
        this.setupEventListeners();
    },

    async loadStats() {
        try {
            const [lostItems, foundItems] = await Promise.all([
                api.get(Config.ENDPOINTS.LOST_ITEMS),
                api.get(Config.ENDPOINTS.FOUND_ITEMS)
            ]);

            document.getElementById('lostCount').textContent = lostItems.length;
            document.getElementById('foundCount').textContent = foundItems.length;

            const claimedCount = foundItems.filter(item => item.status === Config.ITEM_STATUS.CLAIMED).length;
            document.getElementById('claimedCount').textContent = claimedCount;

            console.log('Stats loaded successfully', { lost: lostItems.length, found: foundItems.length, claimed: claimedCount });
        } catch (error) {
            console.error('Error loading stats:', error);
            Utils.showNotification('Failed to load statistics', 'warning');

            // Show fallback values
            document.getElementById('lostCount').textContent = '-';
            document.getElementById('foundCount').textContent = '-';
            document.getElementById('claimedCount').textContent = '-';
        }
    },

    setupEventListeners() {
        // Add any home page event listeners here
        const lostBtn = document.querySelector('a[href="/lost.html"]');
        const foundBtn = document.querySelector('a[href="/found.html"]');

        if (lostBtn) {
            lostBtn.addEventListener('click', () => {
                console.log('Navigating to Lost Items');
            });
        }

        if (foundBtn) {
            foundBtn.addEventListener('click', () => {
                console.log('Navigating to Found Items');
            });
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => HomePage.init());


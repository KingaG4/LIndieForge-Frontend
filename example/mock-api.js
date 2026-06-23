/**
 * Mock API Service
 * Simulates backend API for demonstration purposes
 */

// Sample data
const mockData = {
    items: [
        {
            id: 1,
            name: "Laptop",
            description: "High performance laptop with 16GB RAM and SSD storage",
            price: 1299.99,
            category: "Electronics",
            inStock: true,
            rating: 4.5,
            createdDate: "2025-04-10T10:30:00Z",
            lastUpdated: "2025-05-01T14:22:00Z",
            active: true
        },
        {
            id: 2,
            name: "Office Chair",
            description: "Ergonomic office chair with lumbar support and adjustable height",
            price: 249.99,
            category: "Furniture",
            inStock: true,
            rating: 4.2,
            createdDate: "2025-03-15T09:45:00Z",
            lastUpdated: "2025-03-15T09:45:00Z",
            active: true
        },
        {
            id: 3,
            name: "Coffee Maker",
            description: "Automatic coffee maker with timer and multiple brewing options",
            price: 89.99,
            category: "Kitchen",
            inStock: false,
            rating: 3.8,
            createdDate: "2025-02-20T11:15:00Z",
            lastUpdated: "2025-04-22T16:10:00Z",
            active: false
        },
        {
            id: 4,
            name: "Wireless Headphones",
            description: "Noise-cancelling wireless headphones with 20-hour battery life",
            price: 149.99,
            category: "Electronics",
            inStock: true,
            rating: 4.7,
            createdDate: "2025-04-05T13:20:00Z",
            lastUpdated: "2025-04-05T13:20:00Z",
            active: true
        },
        {
            id: 5,
            name: "Desk Lamp",
            description: "Adjustable LED desk lamp with multiple brightness levels",
            price: 39.99,
            category: "Lighting",
            inStock: true,
            rating: 4.0,
            createdDate: "2025-01-30T15:45:00Z",
            lastUpdated: "2025-03-10T09:30:00Z",
            active: true
        }
    ]
};

// Helper to simulate network delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper to deep clone objects to avoid reference issues
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Helper to simulate random response errors (for demonstration)
function simulateRandomError() {
    // 10% chance of error for demo purposes
    if (Math.random() < 0.1) {
        throw new Error("Simulated server error. Try again!");
    }
}

/**
 * Mock API Service object
 */
const MockApiService = {
    /**
     * Simulated GET request
     * @param {string} endpoint - API endpoint
     * @returns {Promise} - Promise that resolves with response data
     */
    get: async function(endpoint) {
        // Simulate network delay
        await delay(300 + Math.random() * 500);

        // Try to simulate errors occasionally
        try {
            simulateRandomError();

            // Parse endpoint to determine what data to return
            if (endpoint === '/items') {
                return deepClone(mockData.items);
            } else if (endpoint.startsWith('/items/')) {
                const id = parseInt(endpoint.split('/')[2]);
                const item = mockData.items.find(item => item.id === id);

                if (!item) {
                    throw new Error(`Item with ID ${id} not found`);
                }

                return deepClone(item);
            } else {
                throw new Error(`Endpoint ${endpoint} not supported`);
            }
        } catch (error) {
            console.error('Mock API Request Failed:', error);
            throw error;
        }
    },

    /**
     * Simulated POST request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Data to send
     * @returns {Promise} - Promise that resolves with response data
     */
    post: async function(endpoint, data) {
        // Simulate network delay
        await delay(400 + Math.random() * 600);

        try {
            simulateRandomError();

            if (endpoint === '/items') {
                // Create new item
                const newItem = {
                    ...data,
                    id: Math.max(...mockData.items.map(item => item.id), 0) + 1,
                    createdDate: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                };

                // Add to mock data
                mockData.items.push(newItem);

                return deepClone(newItem);
            } else {
                throw new Error(`Endpoint ${endpoint} not supported`);
            }
        } catch (error) {
            console.error('Mock API Request Failed:', error);
            throw error;
        }
    },

    /**
     * Simulated PUT request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Data to send
     * @returns {Promise} - Promise that resolves with response data
     */
    put: async function(endpoint, data) {
        // Simulate network delay
        await delay(350 + Math.random() * 550);

        try {
            simulateRandomError();

            if (endpoint.startsWith('/items/')) {
                const id = parseInt(endpoint.split('/')[2]);
                const itemIndex = mockData.items.findIndex(item => item.id === id);

                if (itemIndex === -1) {
                    throw new Error(`Item with ID ${id} not found`);
                }

                // Update the item
                const updatedItem = {
                    ...data,
                    id: id, // Ensure ID doesn't change
                    createdDate: mockData.items[itemIndex].createdDate, // Preserve created date
                    lastUpdated: new Date().toISOString() // Update last updated date
                };

                mockData.items[itemIndex] = updatedItem;

                return deepClone(updatedItem);
            } else {
                throw new Error(`Endpoint ${endpoint} not supported`);
            }
        } catch (error) {
            console.error('Mock API Request Failed:', error);
            throw error;
        }
    },

    /**
     * Simulated DELETE request
     * @param {string} endpoint - API endpoint
     * @returns {Promise} - Promise that resolves with response data
     */
    delete: async function(endpoint) {
        // Simulate network delay
        await delay(300 + Math.random() * 400);

        try {
            simulateRandomError();

            if (endpoint.startsWith('/items/')) {
                const id = parseInt(endpoint.split('/')[2]);
                const itemIndex = mockData.items.findIndex(item => item.id === id);

                if (itemIndex === -1) {
                    throw new Error(`Item with ID ${id} not found`);
                }

                // Remove the item
                mockData.items.splice(itemIndex, 1);

                return true;
            } else {
                throw new Error(`Endpoint ${endpoint} not supported`);
            }
        } catch (error) {
            console.error('Mock API Request Failed:', error);
            throw error;
        }
    },

    // Specific API operations - Same as ApiService but using mock data

    /**
     * Get all items
     * @returns {Promise} - Promise that resolves with all items
     */
    getAllItems: function() {
        return this.get('/items');
    },

    /**
     * Get item by ID
     * @param {number} id - Item ID
     * @returns {Promise} - Promise that resolves with item data
     */
    getItemById: function(id) {
        return this.get(`/items/${id}`);
    },

    /**
     * Create a new item
     * @param {Object} item - Item data
     * @returns {Promise} - Promise that resolves with created item
     */
    createItem: function(item) {
        return this.post('/items', item);
    },

    /**
     * Update an existing item
     * @param {number} id - Item ID
     * @param {Object} item - Updated item data
     * @returns {Promise} - Promise that resolves with updated item
     */
    updateItem: function(id, item) {
        return this.put(`/items/${id}`, item);
    },

    /**
     * Delete an item
     * @param {number} id - Item ID
     * @returns {Promise} - Promise that resolves when item is deleted
     */
    deleteItem: function(id) {
        return this.delete(`/items/${id}`);
    }
};
/**
 * API Service
 * Handles all communication with the backend REST API
 */

// Configuration - CHANGE THIS TO MATCH YOUR BACKEND
const API_CONFIG = {
    baseUrl: 'http://localhost:8080/api',
    endpoints: {
        items: '/items'
    }
};

/**
 * API Service object
 */
const ApiService = {
    /**
     * Perform a GET request
     * @param {string} endpoint - API endpoint
     * @returns {Promise} - Promise that resolves with response data
     */
    get: async function(endpoint) {
        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        }
    },

    /**
     * Perform a POST request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Data to send
     * @returns {Promise} - Promise that resolves with response data
     */
    post: async function(endpoint, data) {
        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        }
    },

    /**
     * Perform a PUT request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Data to send
     * @returns {Promise} - Promise that resolves with response data
     */
    put: async function(endpoint, data) {
        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        }
    },

    /**
     * Perform a DELETE request
     * @param {string} endpoint - API endpoint
     * @returns {Promise} - Promise that resolves with response data
     */
    delete: async function(endpoint) {
        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            return true;
        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        }
    },

    // Specific API operations - CUSTOMIZE THESE FOR YOUR ENTITY

    /**
     * Get all items
     * @returns {Promise} - Promise that resolves with all items
     */
    getAllItems: function() {
        return this.get(API_CONFIG.endpoints.items);
    },

    /**
     * Get item by ID
     * @param {number} id - Item ID
     * @returns {Promise} - Promise that resolves with item data
     */
    getItemById: function(id) {
        return this.get(`${API_CONFIG.endpoints.items}/${id}`);
    },

    /**
     * Create a new item
     * @param {Object} item - Item data
     * @returns {Promise} - Promise that resolves with created item
     */
    createItem: function(item) {
        return this.post(API_CONFIG.endpoints.items, item);
    },

    /**
     * Update an existing item
     * @param {number} id - Item ID
     * @param {Object} item - Updated item data
     * @returns {Promise} - Promise that resolves with updated item
     */
    updateItem: function(id, item) {
        return this.put(`${API_CONFIG.endpoints.items}/${id}`, item);
    },

    /**
     * Delete an item
     * @param {number} id - Item ID
     * @returns {Promise} - Promise that resolves when item is deleted
     */
    deleteItem: function(id) {
        return this.delete(`${API_CONFIG.endpoints.items}/${id}`);
    }
};
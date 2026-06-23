/**
 * LIndieForge - API Service
 * Obsługuje komunikację z Waszym backendem Spring Boot
 */

// Konfiguracja zgodna z Waszym plikiem application.properties
const API_CONFIG = {
    baseUrl: 'http://localhost:8765/api', // Port 8765 z application.properties
    endpoints: {
        games: '/games',
        tasks: '/tasks',
        users: '/users',
        comments: '/comments'
    }
};

const ApiService = {
    // Uniwersalna metoda GET
    get: async function(endpoint) {
        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`);
            if (!response.ok) throw new Error(`Błąd API: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API GET Failed:', error);
            throw error;
        }
    },

    // Uniwersalna metoda POST
    post: async function(endpoint, data) {
        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            // Spring z Waszych kontrolerów zwraca zwykły tekst np. "Game added", więc używamy .text() zamiast .json()
            if (!response.ok) throw new Error(`Błąd API: ${response.status}`);
            return await response.text();
        } catch (error) {
            console.error('API POST Failed:', error);
            throw error;
        }
    },

    // POBIERANIE DANYCH Z BAZY
    getAllGames: function() {
        return this.get(API_CONFIG.endpoints.games);
    },

    getAllTasks: function() {
        return this.get(API_CONFIG.endpoints.tasks);
    },

    // ZAPISYWANIE DANYCH DO BAZY
    createGame: function(gameDto) {
        return this.post(API_CONFIG.endpoints.games, gameDto);
    },

    createTask: function(taskDto) {
        return this.post(API_CONFIG.endpoints.tasks, taskDto);
    }
};
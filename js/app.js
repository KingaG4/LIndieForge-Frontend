/**
 * Main application script
 * Handles routing and application initialization
 */

// Application state
const appState = {
    currentRoute: 'home',
    params: {},
};

// DOM elements
const appContainer = document.getElementById('app-container');

/**
 * Simple router implementation
 * @param {string} route - Route name to navigate to
 * @param {Object} params - Route parameters
 */
function navigateTo(route, params = {}) {
    appState.currentRoute = route;
    appState.params = params;
    renderCurrentRoute();

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-route') === route) {
            link.classList.add('active');
        }
    });
}

/**
 * Renders the current route content
 */
function renderCurrentRoute() {
    // Show loading indicator
    appContainer.innerHTML = `
        <div class="text-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;

    // Render content based on route
    switch (appState.currentRoute) {
        case 'home':
            renderHomePage();
            break;
        case 'list':
            renderListPage();
            break;
        case 'details':
            renderDetailsPage(appState.params.id);
            break;
        case 'edit':
            renderEditPage(appState.params.id);
            break;
        case 'create':
            renderEditPage();
            break;
        case 'example':
            renderExamplePage();
            break;
        default:
            renderNotFoundPage();
    }
}

/**
 * Shows an error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    Swal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        confirmButtonText: 'OK'
    });
}

/**
 * Shows a success message
 * @param {string} message - Success message to display
 */
function showSuccess(message) {
    Swal.fire({
        title: 'Success!',
        text: message,
        icon: 'success',
        confirmButtonText: 'OK'
    });
}

/**
 * Confirms an action
 * @param {string} message - Confirmation message
 * @returns {Promise} - Resolves to true if confirmed, false otherwise
 */
function confirmAction(message) {
    return Swal.fire({
        title: 'Are you sure?',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
    }).then(result => {
        return result.isConfirmed;
    });
}

/**
 * Initialize the application
 */
function initApp() {
    // Set up navigation event listeners
    document.querySelectorAll('[data-route]').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            const route = e.target.getAttribute('data-route');
            navigateTo(route);
        });
    });

    // Initial route render
    renderCurrentRoute();
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);
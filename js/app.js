/**
 * Main application script - LIndieForge
 * Handles routing and application initialization
 */

// Application state
const appState = {
    currentRoute: 'dashboard', // domyślnie po zalogowaniu
    params: {},
};

// DOM elements
const appContainer = document.getElementById('app-container');
const breadcrumbContainer = document.getElementById('breadcrumb-container');

/**
 * Zmienia ścieżkę w okruszkach (Breadcrumbs)
 */
function updateBreadcrumbs(route, params) {
    let html = '';
    switch(route) {
        case 'dashboard':
            html = '<li class="breadcrumb-item active">Dashboard</li>';
            break;
        case 'games':
            html = '<li class="breadcrumb-item"><a href="#" data-route="dashboard">Dashboard</a></li>' +
                '<li class="breadcrumb-item active">Games</li>';
            break;
        // Tutaj będziemy dodawać kolejne ścieżki (np. dla detali gry i zadań) w miarę rozwoju kodu
        default:
            html = `<li class="breadcrumb-item active">${route}</li>`;
    }
    breadcrumbContainer.innerHTML = html;

    // Ponowne podpięcie eventów dla linków w breadcrumbs
    breadcrumbContainer.querySelectorAll('[data-route]').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(e.target.getAttribute('data-route'));
        });
    });
}

/**
 * Simple router implementation
 */
function navigateTo(route, params = {}) {
    appState.currentRoute = route;
    appState.params = params;

    updateBreadcrumbs(route, params);
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
    appContainer.innerHTML = `
        <div class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;

    // Tutaj na razie używamy starych funkcji (home, list) z kodu startowego.
    // W kolejnym kroku podmienimy to np. na renderDashboardPage().
    switch (appState.currentRoute) {
        case 'dashboard':
            // Na razie ładuje 'home', dopóki nie napiszemy pliku dashboard.js
            if(typeof renderHomePage === 'function') renderHomePage();
            break;
        case 'games':
            // Na razie ładuje 'list', dopóki nie napiszemy games.js
            if(typeof renderListPage === 'function') renderListPage();
            break;
        case 'details':
            if(typeof renderDetailsPage === 'function') renderDetailsPage(appState.params.id);
            break;
        case 'edit':
            if(typeof renderEditPage === 'function') renderEditPage(appState.params.id);
            break;
        case 'create':
            if(typeof renderEditPage === 'function') renderEditPage();
            break;
        default:
            appContainer.innerHTML = '<div class="alert alert-warning">Page not found 404</div>';
    }
}

/**
 * Zmienione zgodnie ze specyfikacją: Pokazuje błąd w prawym rogu jako Toast
 */
function showError(message) {
    Toastify({
        text: "Error: " + message,
        duration: 4000,
        close: true,
        gravity: "bottom",
        position: "right",
        style: {
            background: "#dc3545", // Bootstrap danger
        }
    }).showToast();
}

/**
 * Zmienione zgodnie ze specyfikacją: Pokazuje sukces w prawym rogu jako Toast
 */
function showSuccess(message) {
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "right",
        style: {
            background: "#198754", // Bootstrap success
        }
    }).showToast();
}

/**
 * Confirms an action (Zostaje SweetAlert2, bo do potwierdzeń usunięcia jest dużo lepszy)
 */
function confirmAction(message) {
    return Swal.fire({
        title: 'Are you sure?',
        text: message,
        icon: 'warning',
        background: '#1e1e1e',
        color: '#fff',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
    }).then(result => {
        return result.isConfirmed;
    });
}

function initApp() {
    // Set up navigation event listeners
    document.querySelectorAll('[data-route]').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            // Obsługa kliknięcia na ikonę wewnątrz linku
            const route = e.target.closest('[data-route]').getAttribute('data-route');
            navigateTo(route);
        });
    });

    navigateTo('dashboard');
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);

// ==========================================
// SYSTEM PRZEŁĄCZANIA UŻYTKOWNIKÓW I WYLOGOWANIA
// ==========================================

window.currentUser = JSON.parse(localStorage.getItem('currentUser'));

document.addEventListener('DOMContentLoaded', () => {
    ApiService.getAllUsers().then(users => {
        // Ustawiamy napis w prawym górnym rogu
        const userNameSpan = document.getElementById('current-user-name');
        if (userNameSpan) {
            userNameSpan.innerText = window.currentUser ? window.currentUser.name : 'Zaloguj się (Wybierz profil)';
        }

        // Budujemy rozwijaną listę
        const dropdownList = document.getElementById('user-switcher-list');
        if (dropdownList) {
            dropdownList.innerHTML = '';
            users.forEach(user => {
                const isActive = (window.currentUser && window.currentUser.id === user.id) ? 'active bg-primary' : '';
                dropdownList.innerHTML += `
                    <li>
                        <a class="dropdown-item ${isActive}" href="#" onclick="switchUser(${user.id}, '${user.name}')">
                            <i class="bi bi-person"></i> ${user.name}
                        </a>
                    </li>
                `;
            });
        }
    }).catch(err => console.error("Nie udało się pobrać użytkowników", err));
});

window.switchUser = function(id, name) {
    const user = { id: id, name: name };
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.currentUser = user;
    window.location.reload();
};

// NOWA FUNKCJA: WYLOGOWANIE
window.logout = function() {
    if(!window.currentUser) {
        showError("Już jesteś wylogowana!");
        return;
    }

    // 1. Czyścimy pamięć (sesję)
    localStorage.removeItem('currentUser');
    window.currentUser = null;

    // 2. Wyświetlamy piękny komunikat na środku ekranu
    Swal.fire({
        title: 'Wylogowano się!',
        text: 'Wybierz profil z menu na górze, aby zalogować się ponownie i kontynuować pracę.',
        icon: 'info',
        background: '#212529',
        color: '#fff',
        confirmButtonText: 'Rozumiem',
        confirmButtonColor: '#0d6efd'
    }).then(() => {
        // 3. Po kliknięciu "Rozumiem", odświeżamy stronę
        window.location.reload();
    });
};
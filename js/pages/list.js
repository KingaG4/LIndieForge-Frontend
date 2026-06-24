/**
 * LIndieForge - Games List Controller
 * Obsługuje listę gier, wyszukiwarkę na żywo, filtry i prawdziwe paski postępu
 */

// Zmienne globalne dla tego widoku, aby nie obciążać bazy danych przy każdej literce
let allFetchedGames = [];
let allFetchedTasks = [];

function renderListPage() {
    const appContainer = document.getElementById('app-container');

    // 1. Renderowanie szkieletu strony
    appContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-light"><i class="bi bi-controller"></i> Games</h2>
            <button class="btn btn-primary" id="btn-new-game">
                <i class="bi bi-plus-lg"></i> New Game
            </button>
        </div>

        <div class="card bg-dark border-secondary mb-4 shadow-sm">
            <div class="card-body p-3 d-flex flex-wrap gap-3">
                <div class="d-flex align-items-center gap-2">
                    <label for="filter-phase" class="text-muted text-nowrap mb-0">Phase:</label>
                    <select class="form-select form-select-sm bg-dark text-light border-secondary" id="filter-phase" style="width: 150px;">
                        <option value="All">All Phases</option>
                        <option value="Concept">Concept</option>
                        <option value="Production">Production</option>
                        <option value="Alpha">Alpha</option>
                        <option value="Beta">Beta</option>
                        <option value="Released">Released</option>
                    </select>
                </div>
                <div class="d-flex align-items-center gap-2 flex-grow-1">
                    <label for="search-game" class="text-muted text-nowrap mb-0"><i class="bi bi-search"></i> Search:</label>
                    <input type="text" class="form-control form-control-sm bg-dark text-light border-secondary" id="search-game" placeholder="Search by game name...">
                </div>
            </div>
        </div>

        <div class="row" id="games-container">
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
            </div>
        </div>
    `;

    // 2. Podpięcie zdarzeń (Events)
    document.getElementById('btn-new-game').addEventListener('click', () => {
        navigateTo('create', { entity: 'game' });
    });

    // Nasłuchujemy zmiany w dropdownie (Faza produkcji)
    document.getElementById('filter-phase').addEventListener('change', () => {
        filterAndRenderGames();
    });

    // Nasłuchujemy każdego wpisanego znaku w wyszukiwarkę
    document.getElementById('search-game').addEventListener('input', () => {
        filterAndRenderGames();
    });

    // 3. Uruchamiamy pobieranie danych
    loadGamesFromDatabase();
}

/**
 * Pobiera gry oraz zadania z bazy (aby policzyć paski postępu)
 */
function loadGamesFromDatabase() {
    Promise.all([
        ApiService.getAllGames(),
        ApiService.getAllTasks()
    ])
        .then(([games, tasks]) => {
            allFetchedGames = games || [];
            allFetchedTasks = tasks || [];

            // Renderujemy gry po raz pierwszy (bez filtrów)
            filterAndRenderGames();
        })
        .catch(error => {
            document.getElementById('games-container').innerHTML = `
            <div class="col-12 text-center text-danger mt-5">
                <i class="bi bi-exclamation-triangle" style="font-size: 2rem;"></i>
                <p class="mt-2">Błąd połączenia z serwerem: ${error.message}</p>
            </div>`;
        });
}

/**
 * Filtruje pobrane gry i rysuje je na ekranie
 */
function filterAndRenderGames() {
    const container = document.getElementById('games-container');

    // Odczytujemy, co wpisała użytkowniczka i co wybrała w filtrze
    const searchQuery = document.getElementById('search-game').value.toLowerCase();
    const selectedPhase = document.getElementById('filter-phase').value;

    // FILTROWANIE
    const filteredGames = allFetchedGames.filter(game => {
        const matchesPhase = (selectedPhase === 'All') || (game.phase === selectedPhase);
        const gameName = game.name ? game.name.toLowerCase() : '';
        const matchesSearch = gameName.includes(searchQuery);

        // Zostawiamy grę tylko wtedy, gdy pasuje i do fazy, i do wyszukiwarki
        return matchesPhase && matchesSearch;
    });

    // RENDEROWANIE (Rysowanie na ekranie)
    container.innerHTML = '';

    if (filteredGames.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center text-muted mt-5">
                <i class="bi bi-search" style="font-size: 3rem;"></i>
                <p class="mt-3">Nie znaleziono gier spełniających kryteria.</p>
            </div>`;
        return;
    }

    filteredGames.forEach(game => {
        // OBLICZANIE PRAWDZIWEGO POSTĘPU GRY
        const gameTasks = allFetchedTasks.filter(t => t.game && t.game.id === game.id);
        const totalTasks = gameTasks.length;
        const doneTasks = gameTasks.filter(t => t.status === 'Done').length;

        const progress = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);
        let progressColor = progress === 100 ? "bg-success" : "bg-primary";

        // KARTA GRY
        container.innerHTML += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card card-hover h-100 bg-dark border-secondary" style="cursor: pointer;" onclick="goToGameDetails(${game.id}, '${game.name}')">
                    <div class="card-header border-secondary d-flex justify-content-between align-items-center">
                        <h5 class="mb-0 text-light text-truncate" title="${game.name}">${game.name}</h5>
                        <span class="badge bg-dark border border-secondary text-muted">${game.engine}</span>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="mb-3">
                            <span class="badge bg-secondary">${game.genre}</span>
                            <span class="badge bg-info text-dark">${game.phase}</span>
                        </div>
                        <p class="text-muted small mb-4"><i class="bi bi-display"></i> Platforms: ${game.platform}</p>
                        
                        <div class="mt-auto">
                            <div class="d-flex justify-content-between small mb-1">
                                <span class="text-muted">Completion</span>
                                <span class="text-light fw-bold">${progress}%</span>
                            </div>
                            <div class="progress bg-dark border border-secondary" style="height: 10px;">
                                <div class="progress-bar ${progressColor}" role="progressbar" style="width: ${progress}%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

function goToGameDetails(id, name) {
    navigateTo('details', { id: id, name: name });
}
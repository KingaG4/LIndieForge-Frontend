/**
 * LIndieForge - Games List Controller
 * Wyświetla listę gier w formie kafelków (kart) z paskami postępu
 */

function renderListPage() {
    const appContainer = document.getElementById('app-container');

    // Struktura strony: Nagłówek z przyciskiem, filtry i kontener na karty gier
    appContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-light"><i class="bi bi-controller"></i> Games</h2>
            <button class="btn btn-primary" id="btn-new-game">
                <i class="bi bi-plus-lg"></i> New Game
            </button>
        </div>

        <div class="card bg-dark border-secondary mb-4">
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
                    <label for="search-game" class="text-muted text-nowrap mb-0">Search:</label>
                    <input type="text" class="form-control form-control-sm bg-dark text-light border-secondary" id="search-game" placeholder="Search by game name...">
                </div>
            </div>
        </div>

        <div class="row" id="games-container">
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    `;

    // Podpięcie eventów
    document.getElementById('btn-new-game').addEventListener('click', () => {
        showSuccess("Tu otworzymy formularz tworzenia nowej gry!");
        // W przyszłości: navigateTo('create');
    });

    document.getElementById('filter-phase').addEventListener('change', (e) => {
        showSuccess("Filtrowanie gier po fazie: " + e.target.value);
    });

    document.getElementById('search-game').addEventListener('input', (e) => {
        // Wyszukiwanie "na żywo" bez przeładowania (Live Search)
    });

    // Rozpoczęcie ładowania danych
    loadGamesData();
}

/**
 * Pobiera dane gier i renderuje je jako Karty
 */
function loadGamesData() {
    // Tymczasowe Mocki (symulacja danych z bazy)
    setTimeout(() => {
        const mockGames = [
            { id: 1, name: "Dungeon Quest", genre: "RPG", platform: "PC, Console", phase: "Alpha", progress: 65, engine: "Unity" },
            { id: 2, name: "Space Miner", genre: "Puzzle", platform: "Mobile", phase: "Production", progress: 30, engine: "Godot" },
            { id: 3, name: "Neon Nights", genre: "Platformer", platform: "PC", phase: "Concept", progress: 5, engine: "Unreal" },
            { id: 4, name: "Horror House", genre: "Horror", platform: "PC, VR", phase: "Beta", progress: 90, engine: "Unity" }
        ];

        const container = document.getElementById('games-container');
        container.innerHTML = ''; // Usuwamy spinner ładowania

        mockGames.forEach(game => {
            // Kolor paska postępu zależny od procentu ukończenia
            let progressColor = "bg-primary";
            if(game.progress >= 90) progressColor = "bg-success";
            else if(game.progress < 20) progressColor = "bg-secondary";

            // Renderowanie karty
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
                                    <span class="text-light fw-bold">${game.progress}%</span>
                                </div>
                                <div class="progress bg-dark border border-secondary" style="height: 10px;">
                                    <div class="progress-bar ${progressColor}" role="progressbar" style="width: ${game.progress}%;" aria-valuenow="${game.progress}" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }, 400); // 0.4s opóźnienia
}

/**
 * Funkcja nawigująca do szczegółów konkretnej gry
 */
function goToGameDetails(id, name) {
    showSuccess(`Ładowanie szczegółów gry: ${name} (ID: ${id})`);
    // Gdy zrobimy details.js odkomentujemy to:
    // navigateTo('details', { id: id, name: name });
}
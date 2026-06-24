/**
 * LIndieForge - Edit/Create Page Controller
 * Obsługuje formularze dla Gier (Create & Update) oraz Zadań (Create)
 */

function renderEditPage(id) {
    const appContainer = document.getElementById('app-container');
    const isCreateMode = !id; // Jeśli nie ma przekazanego ID, to znaczy, że tworzymy nowe
    const entityType = appState.params.entity || 'game';
    const entityName = entityType === 'game' ? 'Game' : 'Task';

    const breadcrumb = document.getElementById('breadcrumb-container');
    if(breadcrumb) {
        breadcrumb.innerHTML = `
            <li class="breadcrumb-item"><a href="#" data-route="dashboard" class="text-decoration-none">Dashboard</a></li>
            <li class="breadcrumb-item"><a href="#" data-route="games" class="text-decoration-none">Games</a></li>
            <li class="breadcrumb-item active text-primary">${isCreateMode ? 'New' : 'Edit'} ${entityName}</li>
        `;
    }

    appContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-light"><i class="bi bi-pencil-square"></i> ${isCreateMode ? 'Create New' : 'Edit'} ${entityName}</h2>
            <button class="btn btn-outline-secondary" id="back-btn"><i class="bi bi-arrow-left"></i> Back</button>
        </div>
        
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card bg-dark border-secondary shadow">
                    <div class="card-body" id="edit-form-container">
                        <div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('back-btn').addEventListener('click', () => {
        if(entityType === 'task' && appState.params.gameId) {
            navigateTo('details', { id: appState.params.gameId });
        } else if (!isCreateMode && entityType === 'game') {
            navigateTo('details', { id: id }); // Wraca do edytowanej gry
        } else {
            navigateTo('games');
        }
    });

    if (entityType === 'game') {
        if (isCreateMode) {
            renderGameForm(true, null);
        } else {
            // TRYB EDYCJI: Pobieramy starą grę z bazy!
            ApiService.getAllGames().then(games => {
                const gameToEdit = games.find(g => g.id == id);
                renderGameForm(false, gameToEdit);
            }).catch(err => showError("Błąd pobierania danych gry"));
        }
    } else {
        renderTaskForm(isCreateMode);
    }
}

function renderGameForm(isCreateMode, gameData) {
    const formContainer = document.getElementById('edit-form-container');
    formContainer.innerHTML = ''; // Usuwamy kółko ładowania

    const fields = [
        { id: 'name', name: 'name', label: 'Game Name', type: 'text', placeholder: 'e.g. Dungeon Quest', required: true },
        { id: 'description', name: 'description', label: 'Description', type: 'textarea', placeholder: 'Short description of the project...', rows: 3 },
        {
            id: 'genre', name: 'genre', label: 'Genre', type: 'select', required: true,
            options: [
                { value: 'RPG', label: 'RPG' }, { value: 'Platformer', label: 'Platformer' },
                { value: 'Puzzle', label: 'Puzzle' }, { value: 'Horror', label: 'Horror' },
                { value: 'Other', label: 'Other' }
            ]
        },
        {
            id: 'engine', name: 'engine', label: 'Engine', type: 'select', required: true,
            options: [
                { value: 'Unity', label: 'Unity' }, { value: 'Godot', label: 'Godot' },
                { value: 'Unreal', label: 'Unreal' }, { value: 'Custom', label: 'Custom' }
            ]
        },
        {
            id: 'phase', name: 'phase', label: 'Production Phase', type: 'select', required: true,
            options: [
                { value: 'Concept', label: 'Concept' }, { value: 'Production', label: 'Production' },
                { value: 'Alpha', label: 'Alpha' }, { value: 'Beta', label: 'Beta' },
                { value: 'Released', label: 'Released' }
            ]
        },
        { id: 'releaseDate', name: 'releaseDate', label: 'Planned Release Date', type: 'date', required: true }
    ];

    const form = createForm(fields, {
        id: 'game-form',
        submitLabel: isCreateMode ? 'Create Game' : 'Save Changes',
        showCancel: false,
        onSubmit: (formData) => {
            if (isCreateMode) {
                // TWORZENIE NOWEJ GRY (POST)
                ApiService.createGame(formData)
                    .then(() => {
                        showSuccess("SUKCES! Gra została utworzona!");
                        setTimeout(() => navigateTo('games'), 1500);
                    })
                    .catch(error => showError("Błąd zapisu gry: " + error.message));
            } else {
                // EDYCJA ISTNIEJĄCEJ GRY (PUT)
                ApiService.updateGame(gameData.id, formData)
                    .then(() => {
                        showSuccess("SUKCES! Zmiany zostały nadpisane!");
                        setTimeout(() => navigateTo('details', { id: gameData.id }), 1500);
                    })
                    .catch(error => showError("Błąd aktualizacji gry: " + error.message));
            }
        }
    });

    formContainer.appendChild(form);

    // BARDZO WAŻNE: Wypełniamy okienka formularza starymi danymi!
    if (!isCreateMode && gameData) {
        document.getElementById('name').value = gameData.name || '';
        document.getElementById('description').value = gameData.description || '';
        document.getElementById('genre').value = gameData.genre || 'RPG';
        document.getElementById('engine').value = gameData.engine || 'Unity';
        document.getElementById('phase').value = gameData.phase || 'Concept';
        document.getElementById('releaseDate').value = gameData.releaseDate || '';
    }
}

function renderTaskForm(isCreateMode) {
    const formContainer = document.getElementById('edit-form-container');
    formContainer.innerHTML = '';

    const fields = [
        { id: 'title', name: 'title', label: 'Task Title', type: 'text', placeholder: 'e.g. Fix audio bug', required: true },
        { id: 'description', name: 'description', label: 'Description', type: 'textarea', rows: 3 },
        {
            id: 'type', name: 'type', label: 'Task Type', type: 'select', required: true,
            options: [
                { value: 'Programming', label: 'Programming' }, { value: 'Art', label: 'Art' },
                { value: 'Audio', label: 'Audio' }, { value: 'Testing', label: 'Testing' },
                { value: 'Other', label: 'Other' }
            ]
        },
        {
            id: 'priority', name: 'priority', label: 'Priority', type: 'select', required: true,
            options: [
                { value: 'High', label: 'High' }, { value: 'Medium', label: 'Medium' }, { value: 'Low', label: 'Low' }
            ]
        },
        {
            id: 'status', name: 'status', label: 'Status', type: 'select', required: true,
            options: [
                { value: 'To Do', label: 'To Do' }, { value: 'In Progress', label: 'In Progress' },
                { value: 'In Review', label: 'In Review' }, { value: 'Done', label: 'Done' }
            ]
        },
        { id: 'deadline', name: 'deadline', label: 'Deadline', type: 'date', required: true },
        {
            id: 'assignedUserId', name: 'assignedUserId', label: 'Assignee', type: 'select', required: true,
            options: [
                { value: '1', label: 'Kinga Głowacka' },
                { value: '2', label: 'Natalia Michalak' },
                { value: '3', label: 'Jan Kowalski' }
            ]
        }
    ];

    const form = createForm(fields, {
        id: 'task-form',
        submitLabel: isCreateMode ? 'Create Task' : 'Save Changes',
        showCancel: false,
        onSubmit: (formData) => {
            formData.gameId = appState.params.gameId || 1;

            ApiService.createTask(formData)
                .then(() => {
                    showSuccess("SUKCES! Zadanie pomyślnie dodane!");
                    setTimeout(() => navigateTo('details', { id: formData.gameId }), 1500);
                })
                .catch(error => showError("Błąd zapisu zadania: " + error.message));
        }
    });

    formContainer.appendChild(form);
}
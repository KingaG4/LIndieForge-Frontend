/**
 * LIndieForge - Edit/Create Page Controller
 * Obsługuje formularze dla Gier (Games) i Zadań (Tasks)
 */

function renderEditPage(id) {
    const appContainer = document.getElementById('app-container');
    const isCreateMode = !id;

    // Odczytujemy typ encji przekazany z routera (game lub task)
    const entityType = appState.params.entity || 'game';
    const entityName = entityType === 'game' ? 'Game' : 'Task';

    // Aktualizacja okruszków (Breadcrumbs)
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
                        </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('back-btn').addEventListener('click', () => {
        if(entityType === 'task' && appState.params.gameId) {
            navigateTo('details', { id: appState.params.gameId });
        } else {
            navigateTo('games');
        }
    });

    if (entityType === 'game') {
        renderGameForm(isCreateMode);
    } else {
        renderTaskForm(isCreateMode);
    }
}

/**
 * Renderuje formularz dla Gry wg Specyfikacji
 */
function renderGameForm(isCreateMode) {
    const formContainer = document.getElementById('edit-form-container');

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
            // W przyszłości: ApiService.post('/games', formData)
            showSuccess("Game saved successfully! (Simulation)");
            setTimeout(() => navigateTo('games'), 1000);
        }
    });

    formContainer.appendChild(form);
}

/**
 * Renderuje formularz dla Zadania wg Specyfikacji
 */
function renderTaskForm(isCreateMode) {
    const formContainer = document.getElementById('edit-form-container');

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
            id: 'assignee', name: 'assignee', label: 'Assignee', type: 'select', required: true,
            options: [
                { value: 'Kinga Głowacka', label: 'Kinga Głowacka' }, { value: 'Natalia Michalak', label: 'Natalia Michalak' },
                { value: 'Jan Kowalski', label: 'Jan Kowalski' }
            ]
        }
    ];

    const form = createForm(fields, {
        id: 'task-form',
        submitLabel: isCreateMode ? 'Create Task' : 'Save Changes',
        showCancel: false,
        onSubmit: (formData) => {
            showSuccess("Task saved successfully! (Simulation)");
            const gameId = appState.params.gameId || 1;
            setTimeout(() => navigateTo('details', { id: gameId }), 1000);
        }
    });

    formContainer.appendChild(form);
}
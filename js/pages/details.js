/**
 * LIndieForge - Game Details Controller
 * Wyświetla szczegóły gry z podziałem na zakładki: Overview, Tasks, Kanban
 */

function renderDetailsPage(id, name = "Game Details") {
    const appContainer = document.getElementById('app-container');

    // Aktualizacja Breadcrumbs ręcznie, by uwzględniała nazwę gry
    const breadcrumb = document.getElementById('breadcrumb-container');
    if(breadcrumb) {
        breadcrumb.innerHTML = `
            <li class="breadcrumb-item"><a href="#" data-route="dashboard" class="text-decoration-none">Dashboard</a></li>
            <li class="breadcrumb-item"><a href="#" data-route="games" class="text-decoration-none">Games</a></li>
            <li class="breadcrumb-item active text-primary">${name}</li>
        `;

        // Podpinamy eventy do nowych linków w breadcrumb
        breadcrumb.querySelectorAll('[data-route]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo(e.target.getAttribute('data-route'));
            });
        });
    }

    // Szkielet strony z systemem zakładek (Tabs) Bootstrapa
    appContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-light"><i class="bi bi-joystick"></i> <span id="game-title">Loading...</span></h2>
            <div>
                <button class="btn btn-outline-secondary me-2" id="btn-edit-game"><i class="bi bi-pencil"></i> Edit Game</button>
                <button class="btn btn-primary" id="btn-add-task"><i class="bi bi-plus-lg"></i> Add Task</button>
            </div>
        </div>

        <ul class="nav nav-tabs border-secondary mb-4" id="gameDetailsTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active bg-dark text-light border-secondary" id="overview-tab" data-bs-toggle="tab" data-bs-target="#overview-pane" type="button" role="tab">Overview</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link bg-dark text-light border-secondary" id="tasks-tab" data-bs-toggle="tab" data-bs-target="#tasks-pane" type="button" role="tab">Tasks</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link bg-dark text-light border-secondary" id="kanban-tab" data-bs-toggle="tab" data-bs-target="#kanban-pane" type="button" role="tab">Kanban Board</button>
            </li>
        </ul>

        <div class="tab-content" id="gameDetailsTabsContent">
            
            <div class="tab-pane fade show active" id="overview-pane" role="tabpanel" tabindex="0">
                <div class="row" id="overview-container">
                    <div class="col-12 text-center py-5"><div class="spinner-border text-primary" role="status"></div></div>
                </div>
            </div>

            <div class="tab-pane fade" id="tasks-pane" role="tabpanel" tabindex="0">
                <div class="card bg-dark border-secondary">
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Title</th>
                                        <th>Assignee</th>
                                        <th>Priority</th>
                                        <th>Deadline</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody id="game-tasks-table">
                                    </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="tab-pane fade" id="kanban-pane" role="tabpanel" tabindex="0">
                <div class="row h-100" id="kanban-board">
                    <div class="col-md-3">
                        <div class="card bg-dark border-secondary h-100">
                            <div class="card-header border-secondary bg-secondary text-light fw-bold">To Do</div>
                            <div class="card-body p-2 kanban-column" id="kanban-todo" ondrop="drop(event, 'To Do')" ondragover="allowDrop(event)">
                                </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card bg-dark border-secondary h-100">
                            <div class="card-header border-secondary bg-primary text-light fw-bold">In Progress</div>
                            <div class="card-body p-2 kanban-column" id="kanban-progress" ondrop="drop(event, 'In Progress')" ondragover="allowDrop(event)">
                                </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card bg-dark border-secondary h-100">
                            <div class="card-header border-secondary bg-warning text-dark fw-bold">In Review</div>
                            <div class="card-body p-2 kanban-column" id="kanban-review" ondrop="drop(event, 'In Review')" ondragover="allowDrop(event)">
                                </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card bg-dark border-secondary h-100">
                            <div class="card-header border-secondary bg-success text-light fw-bold">Done</div>
                            <div class="card-body p-2 kanban-column" id="kanban-done" ondrop="drop(event, 'Done')" ondragover="allowDrop(event)">
                                </div>
                        </div>
                    </div>

                </div>
            </div>
            
        </div>
    `;

    // Podpięcie styli CSS ułatwiających zrzucanie do pustych kolumn Kanban
    const style = document.createElement('style');
    style.innerHTML = `.kanban-column { min-height: 400px; } .kanban-card { cursor: grab; } .kanban-card:active { cursor: grabbing; }`;
    document.head.appendChild(style);

    // Eventy dla przycisków
    document.getElementById('btn-edit-game').addEventListener('click', () => showSuccess("Otwarcie formularza edycji gry."));
    document.getElementById('btn-add-task').addEventListener('click', () => {
        navigateTo('create', { entity: 'task', gameId: id });
    });

    loadGameDetailsData(id);
}

/**
 * Pobiera dane szczegółowe gry i jej zadań
 */
function loadGameDetailsData(id) {
    // Symulacja danych
    setTimeout(() => {
        const mockGame = {
            id: id || 1, name: "Dungeon Quest", description: "A dark fantasy RPG game with rogue-like elements.",
            genre: "RPG", platform: "PC, Console", engine: "Unity", phase: "Alpha", releaseDate: "2026-11-15",
            progress: 65, team: ["Kinga Głowacka", "Natalia Michalak", "Jan Kowalski"]
        };

        const mockTasks = [
            { id: 101, title: "Design UI", assignee: "Kinga Głowacka", priority: "High", deadline: "2026-06-25", status: "In Progress", daysLeft: 2 },
            { id: 102, title: "Fix audio bug", assignee: "Jan Kowalski", priority: "Medium", deadline: "2026-06-20", status: "To Do", daysLeft: -3 },
            { id: 103, title: "Write lore", assignee: "Natalia Michalak", priority: "Low", deadline: "2026-07-05", status: "Done", daysLeft: 12 },
            { id: 104, title: "Test combat", assignee: "Jan Kowalski", priority: "High", deadline: "2026-06-28", status: "In Review", daysLeft: 5 }
        ];

        document.getElementById('game-title').innerText = mockGame.name;

        // 1. Renderowanie zakładki OVERVIEW
        document.getElementById('overview-container').innerHTML = `
            <div class="col-md-8 mb-4">
                <div class="card bg-dark border-secondary h-100">
                    <div class="card-body">
                        <h5 class="card-title text-light mb-3">About the Game</h5>
                        <p class="text-muted">${mockGame.description}</p>
                        
                        <div class="row mt-4">
                            <div class="col-sm-6 mb-3"><span class="detail-label">Genre:</span> <span class="text-light">${mockGame.genre}</span></div>
                            <div class="col-sm-6 mb-3"><span class="detail-label">Engine:</span> <span class="badge bg-secondary">${mockGame.engine}</span></div>
                            <div class="col-sm-6 mb-3"><span class="detail-label">Platforms:</span> <span class="text-light">${mockGame.platform}</span></div>
                            <div class="col-sm-6 mb-3"><span class="detail-label">Phase:</span> <span class="badge bg-info text-dark">${mockGame.phase}</span></div>
                            <div class="col-sm-6 mb-3"><span class="detail-label">Release Date:</span> <span class="text-light">${mockGame.releaseDate}</span></div>
                        </div>

                        <div class="mt-4">
                            <div class="d-flex justify-content-between small mb-1">
                                <span class="text-muted">Overall Completion</span>
                                <span class="text-light fw-bold">${mockGame.progress}%</span>
                            </div>
                            <div class="progress bg-dark border border-secondary" style="height: 15px;">
                                <div class="progress-bar bg-primary" role="progressbar" style="width: ${mockGame.progress}%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card bg-dark border-secondary h-100">
                    <div class="card-body">
                        <h5 class="card-title text-light mb-3"><i class="bi bi-people"></i> Team Members</h5>
                        <ul class="list-group list-group-flush">
                            ${mockGame.team.map(member => `<li class="list-group-item bg-dark text-muted border-secondary"><i class="bi bi-person-fill text-primary me-2"></i>${member}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;

        // 2. Renderowanie zakładki TASKS (Tabela) oraz KANBAN BOARD
        const tableBody = document.getElementById('game-tasks-table');
        const kanbanTodo = document.getElementById('kanban-todo');
        const kanbanProgress = document.getElementById('kanban-progress');
        const kanbanReview = document.getElementById('kanban-review');
        const kanbanDone = document.getElementById('kanban-done');

        tableBody.innerHTML = '';
        kanbanTodo.innerHTML = ''; kanbanProgress.innerHTML = ''; kanbanReview.innerHTML = ''; kanbanDone.innerHTML = '';

        mockTasks.forEach(task => {
            // Kolorowanie dla Tabeli
            let deadlineClass = "deadline-safe";
            if (task.daysLeft < 0) deadlineClass = "deadline-danger";
            else if (task.daysLeft <= 3) deadlineClass = "deadline-warn";

            let statusClass = "status-todo";
            if (task.status === "In Progress") statusClass = "status-progress";
            if (task.status === "In Review") statusClass = "status-review";
            if (task.status === "Done") statusClass = "status-done";

            // Dodanie wiersza do Tabeli
            tableBody.innerHTML += `
                <tr style="cursor: pointer;" onclick="showSuccess('Szczegóły zadania #${task.id}')">
                    <td class="text-muted">#${task.id}</td>
                    <td class="fw-bold text-light">${task.title}</td>
                    <td>${task.assignee}</td>
                    <td>${task.priority}</td>
                    <td class="${deadlineClass}">${task.deadline}</td>
                    <td><span class="status-badge ${statusClass}">${task.status}</span></td>
                </tr>
            `;

            // Dodanie karty do Kanban Boarda z atrybutem draggable="true"
            const kanbanCardHTML = `
                <div class="card bg-dark border-secondary mb-2 kanban-card p-2" id="task-${task.id}" draggable="true" ondragstart="drag(event)">
                    <div class="d-flex justify-content-between mb-1">
                        <small class="text-muted">#${task.id}</small>
                        <small class="${deadlineClass}"><i class="bi bi-calendar"></i> ${task.deadline}</small>
                    </div>
                    <h6 class="text-light mb-2">${task.title}</h6>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <span class="badge bg-secondary">${task.priority}</span>
                        <small class="text-muted" title="${task.assignee}"><i class="bi bi-person"></i> ${task.assignee.split(' ')[0]}</small>
                    </div>
                </div>
            `;

            if (task.status === "To Do") kanbanTodo.innerHTML += kanbanCardHTML;
            else if (task.status === "In Progress") kanbanProgress.innerHTML += kanbanCardHTML;
            else if (task.status === "In Review") kanbanReview.innerHTML += kanbanCardHTML;
            else if (task.status === "Done") kanbanDone.innerHTML += kanbanCardHTML;
        });

    }, 500);
}

/* =========================================
   Natywny system Drag & Drop dla Kanban
   ========================================= */

function allowDrop(ev) {
    ev.preventDefault(); // Wymagane, by pozwolić na upuszczenie
}

function drag(ev) {
    // Zapisuje ID przeciąganej karty
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev, newStatus) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text"); // ID karty
    const draggedElement = document.getElementById(data);

    // Szuka najbliższego kontenera kolumny
    const dropzone = ev.target.closest('.kanban-column');

    if (dropzone && draggedElement) {
        dropzone.appendChild(draggedElement);
        // Wyświetla Toasta z informacją o nowym statusie
        showSuccess(`Zmieniono status zadania na: ${newStatus}`);

        // W przyszłości wyślemy tu zapytanie do serwera:
        // ApiService.put('/tasks/' + taskId + '/status', { status: newStatus });
    }
}
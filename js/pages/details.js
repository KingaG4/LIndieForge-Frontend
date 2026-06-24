/**
 * LIndieForge - Game Details Controller
 * Obsługuje szczegóły gry, tablicę Kanban, system Drag&Drop i komentarze do zadań
 */

// Zmienna globalna dla tego widoku (przechowuje zadania aktualnie otwartej gry)
let currentGameTasks = [];

function renderDetailsPage(id, name = "Game Details") {
    const appContainer = document.getElementById('app-container');

    const breadcrumb = document.getElementById('breadcrumb-container');
    if(breadcrumb) {
        breadcrumb.innerHTML = `
            <li class="breadcrumb-item"><a href="#" data-route="dashboard" class="text-decoration-none">Dashboard</a></li>
            <li class="breadcrumb-item"><a href="#" data-route="games" class="text-decoration-none">Games</a></li>
            <li class="breadcrumb-item active text-primary">${name}</li>
        `;
        breadcrumb.querySelectorAll('[data-route]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo(e.target.getAttribute('data-route'));
            });
        });
    }

    appContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-light"><i class="bi bi-joystick"></i> <span id="game-title">Loading...</span></h2>
            <div>
                <button class="btn btn-outline-secondary me-2" id="btn-edit-game"><i class="bi bi-pencil"></i> Edit Game</button>
                <button class="btn btn-primary" id="btn-add-task"><i class="bi bi-plus-lg"></i> Add Task</button>
            </div>
        </div>

        <ul class="nav nav-tabs border-secondary mb-4" id="gameDetailsTabs" role="tablist">
            <li class="nav-item" role="presentation"><button class="nav-link active bg-dark text-light border-secondary" id="overview-tab" data-bs-toggle="tab" data-bs-target="#overview-pane" type="button" role="tab">Overview</button></li>
            <li class="nav-item" role="presentation"><button class="nav-link bg-dark text-light border-secondary" id="tasks-tab" data-bs-toggle="tab" data-bs-target="#tasks-pane" type="button" role="tab">Tasks</button></li>
            <li class="nav-item" role="presentation"><button class="nav-link bg-dark text-light border-secondary" id="kanban-tab" data-bs-toggle="tab" data-bs-target="#kanban-pane" type="button" role="tab">Kanban Board</button></li>
        </ul>

        <div class="tab-content" id="gameDetailsTabsContent">
            <div class="tab-pane fade show active" id="overview-pane" role="tabpanel" tabindex="0">
                <div class="row" id="overview-container"><div class="col-12 text-center py-5"><div class="spinner-border text-primary" role="status"></div></div></div>
            </div>

            <div class="tab-pane fade" id="tasks-pane" role="tabpanel" tabindex="0">
                <div class="card bg-dark border-secondary">
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0">
                                <thead><tr><th>ID</th><th>Title</th><th>Assignee</th><th>Priority</th><th>Deadline</th><th>Status</th></tr></thead>
                                <tbody id="game-tasks-table"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="tab-pane fade" id="kanban-pane" role="tabpanel" tabindex="0">
                <div class="row h-100" id="kanban-board">
                    <div class="col-md-3"><div class="card bg-dark border-secondary h-100"><div class="card-header border-secondary text-light fw-bold" style="background-color: #6a0695;">To Do</div><div class="card-body p-2 kanban-column" id="kanban-todo" ondrop="drop(event, 'To Do')" ondragover="allowDrop(event)"></div></div></div>
                    <div class="col-md-3"><div class="card bg-dark border-secondary h-100"><div class="card-header border-secondary bg-primary text-light fw-bold">In Progress</div><div class="card-body p-2 kanban-column" id="kanban-progress" ondrop="drop(event, 'In Progress')" ondragover="allowDrop(event)"></div></div></div>
                    <div class="col-md-3"><div class="card bg-dark border-secondary h-100"><div class="card-header border-secondary bg-warning text-dark fw-bold">In Review</div><div class="card-body p-2 kanban-column" id="kanban-review" ondrop="drop(event, 'In Review')" ondragover="allowDrop(event)"></div></div></div>
                    <div class="col-md-3"><div class="card bg-dark border-secondary h-100"><div class="card-header border-secondary bg-success text-light fw-bold">Done</div><div class="card-body p-2 kanban-column" id="kanban-done" ondrop="drop(event, 'Done')" ondragover="allowDrop(event)"></div></div></div>
                </div>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.innerHTML = `.kanban-column { min-height: 400px; } .kanban-card { cursor: grab; } .kanban-card:active { cursor: grabbing; }`;
    document.head.appendChild(style);

    document.getElementById('btn-edit-game').addEventListener('click', () => navigateTo('edit', { entity: 'game', id: id }));
    document.getElementById('btn-add-task').addEventListener('click', () => navigateTo('create', { entity: 'task', gameId: id }));

    loadGameDetailsData(id);
}

function loadGameDetailsData(id) {
    Promise.all([
        ApiService.getAllGames(),
        ApiService.getAllTasks()
    ])
        .then(([allGames, allTasks]) => {
            const game = allGames.find(g => g.id == id);
            if (!game) {
                document.getElementById('overview-container').innerHTML = '<div class="alert alert-danger text-center mt-4">Gra nie istnieje w bazie danych!</div>';
                return;
            }

            document.getElementById('game-title').innerText = game.name;
            currentGameTasks = allTasks.filter(t => t.game && t.game.id == id);

            const totalTasks = currentGameTasks.length;
            const doneTasks = currentGameTasks.filter(t => t.status === 'Done').length;

            // Tylko jedna deklaracja postępu
            const progress = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

            // ==========================================
            // DYNAMICZNA LISTA ZESPOŁU
            // ==========================================
            const uniqueTeamMembers = [];
            const memberIds = new Set();

            // Przeszukujemy zadania i wyciągamy unikalnych użytkowników
            currentGameTasks.forEach(task => {
                if (task.assignedUser && !memberIds.has(task.assignedUser.id)) {
                    memberIds.add(task.assignedUser.id);
                    uniqueTeamMembers.push(task.assignedUser);
                }
            });

            // Generujemy kod HTML dla listy zespołu
            let teamHTML = '';
            if (uniqueTeamMembers.length === 0) {
                teamHTML = '<li class="list-group-item bg-dark text-muted border-secondary small px-0"><i class="bi bi-info-circle me-2"></i>Brak członków zespołu. Dodaj pierwsze zadania!</li>';
            } else {
                uniqueTeamMembers.forEach(member => {
                    teamHTML += `
                        <li class="list-group-item bg-dark text-light border-secondary d-flex align-items-center px-0 py-2">
                            <i class="bi bi-person-circle text-primary me-3 fs-4"></i> 
                            <span class="fw-bold">${member.name}</span>
                        </li>`;
                });
            }

            // 1. OVERVIEW
            document.getElementById('overview-container').innerHTML = `
            <div class="col-md-8 mb-4">
                <div class="card bg-dark border-secondary h-100">
                    <div class="card-body">
                        <h5 class="card-title text-light mb-3">About the Game</h5>
                        <p class="text-muted">${game.description || 'Brak opisu.'}</p>
                        <div class="row mt-4">
                            <div class="col-sm-6 mb-3"><span class="detail-label">Genre:</span> <span class="text-light">${game.genre || '-'}</span></div>
                            <div class="col-sm-6 mb-3"><span class="detail-label">Engine:</span> <span class="badge bg-secondary">${game.engine || '-'}</span></div>
                            <div class="col-sm-6 mb-3"><span class="detail-label">Phase:</span> <span class="badge bg-info text-dark">${game.phase || '-'}</span></div>
                        </div>
                        <div class="mt-4">
                            <div class="d-flex justify-content-between small mb-1"><span class="text-muted">Overall Completion</span><span class="text-light fw-bold">${progress}%</span></div>
                            <div class="progress bg-dark border border-secondary" style="height: 15px;"><div class="progress-bar bg-primary" role="progressbar" style="width: ${progress}%;"></div></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card bg-dark border-secondary h-100">
                    <div class="card-body">
                        <h5 class="card-title text-light mb-3"><i class="bi bi-people"></i> Team</h5>
                        <ul class="list-group list-group-flush">
                            ${teamHTML}
                        </ul>
                    </div>
                </div>
            </div>
        `;

            // 2. TASKS & KANBAN
            const tableBody = document.getElementById('game-tasks-table');
            const kanbanTodo = document.getElementById('kanban-todo');
            const kanbanProgress = document.getElementById('kanban-progress');
            const kanbanReview = document.getElementById('kanban-review');
            const kanbanDone = document.getElementById('kanban-done');

            tableBody.innerHTML = '';
            kanbanTodo.innerHTML = ''; kanbanProgress.innerHTML = ''; kanbanReview.innerHTML = ''; kanbanDone.innerHTML = '';

            currentGameTasks.forEach(task => {
                let daysLeft = 999;
                if(task.deadline) {
                    const today = new Date();
                    today.setHours(0,0,0,0);
                    daysLeft = Math.ceil((new Date(task.deadline) - today) / (1000 * 60 * 60 * 24));
                }

                let deadlineClass = "deadline-safe";
                if (daysLeft < 0) deadlineClass = "deadline-danger";
                else if (daysLeft <= 3) deadlineClass = "deadline-warn";

                let statusClass = "status-todo";
                if (task.status === "In Progress") statusClass = "status-progress";
                if (task.status === "In Review") statusClass = "status-review";
                if (task.status === "Done") statusClass = "status-done";

                const assigneeName = task.assignedUser ? task.assignedUser.name : "Unassigned";

                // Tabela
                tableBody.innerHTML += `
                <tr style="cursor: pointer;" onclick="openTaskModal(${task.id})">
                    <td class="text-muted">#${task.id}</td>
                    <td class="fw-bold text-light">${task.title}</td>
                    <td>${assigneeName}</td>
                    <td>${task.priority}</td>
                    <td class="${deadlineClass}">${task.deadline || '-'}</td>
                    <td><span class="status-badge ${statusClass}">${task.status}</span></td>
                </tr>
            `;

                // Kanban
                const kanbanCardHTML = `
                <div class="card bg-dark border-secondary mb-2 kanban-card p-2" id="task-${task.id}" draggable="true" ondragstart="drag(event)" onclick="openTaskModal(${task.id})">
                    <div class="d-flex justify-content-between mb-1">
                        <small class="text-muted">#${task.id}</small>
                        <small class="${deadlineClass}"><i class="bi bi-calendar"></i> ${task.deadline || '-'}</small>
                    </div>
                    <h6 class="text-light mb-2">${task.title}</h6>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <span class="badge bg-secondary">${task.priority}</span>
                        <small class="text-muted" title="${assigneeName}"><i class="bi bi-person"></i> ${assigneeName.split(' ')[0]}</small>
                    </div>
                </div>
            `;

                if (task.status === "To Do") kanbanTodo.innerHTML += kanbanCardHTML;
                else if (task.status === "In Progress") kanbanProgress.innerHTML += kanbanCardHTML;
                else if (task.status === "In Review") kanbanReview.innerHTML += kanbanCardHTML;
                else kanbanDone.innerHTML += kanbanCardHTML;
            });
        })
        .catch(error => {
            document.getElementById('overview-container').innerHTML = `<div class="alert alert-danger text-center mt-4">Błąd połączenia: ${error.message}</div>`;
        });
}

/* =========================================
   SYSTEM MODALA I KOMENTARZY (NOWOŚĆ!)
   ========================================= */

window.openTaskModal = function(taskId) {
    const task = currentGameTasks.find(t => t.id === taskId);
    if(!task) return;

    // Pobieramy na żywo komentarze do tego zadania
    ApiService.getAllComments().then(allComments => {
        const taskComments = allComments.filter(c => c.task && c.task.id === taskId);

        let commentsHTML = '';
        if (taskComments.length === 0) {
            commentsHTML = '<p class="text-muted small">Brak komentarzy. Rozpocznij dyskusję!</p>';
        } else {
            taskComments.forEach(c => {
                const author = c.user ? c.user.name : "System";
                commentsHTML += `
                    <div class="bg-dark border border-secondary p-2 mb-2 rounded">
                        <small class="text-primary fw-bold">${author}</small>
                        <p class="mb-0 text-light small">${c.content}</p>
                    </div>
                `;
            });
        }

        const assigneeName = task.assignedUser ? task.assignedUser.name : "Unassigned";

        // Dynamiczne generowanie kodu HTML Modala Bootstrapowego
        const modalHTML = `
        <div class="modal fade" id="taskModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content bg-dark border-secondary">
                    <div class="modal-header border-secondary">
                        <h5 class="modal-title text-light"><i class="bi bi-card-text text-primary"></i> ${task.title}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3 d-flex gap-2">
                            <span class="badge bg-secondary">Priority: ${task.priority}</span>
                            <span class="badge bg-info text-dark">Type: ${task.type || 'Zadanie'}</span>
                            <span class="badge bg-light text-dark">Status: ${task.status}</span>
                        </div>
                        <p class="text-light mb-1 fw-bold">Description:</p>
                        <p class="text-muted small mb-3">${task.description || 'Brak opisu zadania.'}</p>
                        
                        <div class="d-flex justify-content-between border-top border-secondary pt-2 mb-3">
                            <small class="text-muted"><i class="bi bi-person"></i> Assignee: <span class="text-light">${assigneeName}</span></small>
                            <small class="text-muted"><i class="bi bi-calendar"></i> Deadline: <span class="text-light">${task.deadline}</span></small>
                        </div>
                        
                        <hr class="border-secondary">
                        <h6 class="text-light mb-3"><i class="bi bi-chat-dots"></i> Team Comments</h6>
                        
                        <div class="comments-container mb-3 px-1" style="max-height: 250px; overflow-y: auto;">
                            ${commentsHTML}
                        </div>
                        
                        <div class="d-flex gap-2 mt-auto">
                            <input type="text" id="new-comment-input" class="form-control bg-dark text-light border-secondary" placeholder="Wpisz komentarz...">
                            <button class="btn btn-primary" onclick="addCommentToTask(${task.id})"><i class="bi bi-send"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        const oldModal = document.getElementById('taskModal');
        if (oldModal) oldModal.remove();


        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Uruchomienie okienka za pomocą biblioteki Bootstrap
        const modalElement = new bootstrap.Modal(document.getElementById('taskModal'));
        modalElement.show();
    }).catch(err => {
        showError("Błąd pobierania komentarzy!");
    });
}

window.addCommentToTask = function(taskId) {
    //Sprawdzanie, czy ktoś jest zalogowany
    if (!window.currentUser) {
        showError("Musisz być zalogowana (wybierz profil w prawym górnym rogu), aby dodawać komentarze!");
        return;
    }

    const input = document.getElementById('new-comment-input');
    const content = input.value.trim();

    if(!content) {
        showError("Komentarz nie może być pusty!");
        return;
    }

    const commentDto = {
        content: content,
        taskId: taskId,
        userId: window.currentUser ? window.currentUser.id : 1
    };

    ApiService.createComment(commentDto).then(() => {
        showSuccess("Wysłano komentarz!");
        // Zamykamy stary modal i otwieramy nowy z odświeżonymi danymi
        const modalElement = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modalElement.hide();
        setTimeout(() => openTaskModal(taskId), 300); // 300ms opóźnienia na animację Bootstrapa
    }).catch(err => {
        showError("Błąd zapisu komentarza do bazy!");
    });
}

/* =========================================
   DRAG & DROP KANBAN BOARD
   ========================================= */

function allowDrop(ev) { ev.preventDefault(); }
function drag(ev) { ev.dataTransfer.setData("text", ev.target.id); }

function drop(ev, newStatus) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    const dropzone = ev.target.closest('.kanban-column');

    if (dropzone && draggedElement) {
        dropzone.appendChild(draggedElement);

        const taskId = data.replace('task-', '');

        // ZAPIS NOWEGO STATUSU DO BAZY MYSQL
        ApiService.updateTaskStatus(taskId, newStatus)
            .then(() => {
                showSuccess(`Zapisano zmianę: ${newStatus}`);
            })
            .catch(err => {
                showError("Błąd! Zmiana statusu nie zapisała się w bazie!");
            });
    }
}
/**
 * LIndieForge - Dashboard Controller
 * Wyświetla główny ekran ze statystykami i zadaniami
 */

function renderHomePage() {
    const appContainer = document.getElementById('app-container');

    // Renderowanie szkieletu Dashboardu
    appContainer.innerHTML = `
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card card-hover bg-dark border-primary mb-3 h-100">
                    <div class="card-body text-center d-flex flex-column justify-content-center">
                        <h6 class="text-muted">Active Games</h6>
                        <h2 class="text-primary fw-bold" id="stat-games">--</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-hover bg-dark border-danger mb-3 h-100">
                    <div class="card-body text-center d-flex flex-column justify-content-center">
                        <h6 class="text-muted">Overdue Tasks</h6>
                        <h2 class="text-danger fw-bold" id="stat-overdue">--</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-hover bg-dark border-info mb-3 h-100">
                    <div class="card-body text-center d-flex flex-column justify-content-center">
                        <h6 class="text-muted">My Tasks</h6>
                        <h2 class="text-info fw-bold" id="stat-mytasks">--</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-hover bg-dark border-warning mb-3 h-100">
                    <div class="card-body text-center d-flex flex-column justify-content-center">
                        <h6 class="text-muted">In Progress</h6>
                        <h2 class="text-warning fw-bold" id="stat-inprogress">--</h2>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-8 mb-4">
                <div class="card h-100">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0"><i class="bi bi-list-task"></i> My Tasks (Upcoming)</h5>
                        <button class="btn btn-sm btn-outline-primary" id="btn-new-task">
                            <i class="bi bi-plus-lg"></i> New Task
                        </button>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Task</th>
                                        <th>Game</th>
                                        <th>Priority</th>
                                        <th>Deadline</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody id="dashboard-tasks-table">
                                    <tr><td colspan="5" class="text-center py-4">Loading tasks...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-header">
                        <h5 class="mb-0"><i class="bi bi-pie-chart"></i> Task Status</h5>
                    </div>
                    <div class="card-body d-flex justify-content-center align-items-center">
                        <canvas id="taskStatusChart" style="max-height: 250px;"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Testowe podpięcie Toasta pod przycisk
    document.getElementById('btn-new-task').addEventListener('click', () => {
        showSuccess("W przyszłości ten przycisk otworzy formularz!");
    });

    // Rozpoczęcie ładowania danych
    loadDashboardData();
}

/**
 * Pobiera dane i wstrzykuje je do widoku
 */
/**
 * Pobiera prawdziwe dane z bazy (Spring Boot) i wstrzykuje je do Dashboardu
 */
function loadDashboardData() {
    // Pobieramy naraz wszystkie gry i wszystkie zadania z API
    Promise.all([
        ApiService.getAllGames(),
        ApiService.getAllTasks()
    ])
        .then(([games, tasks]) => {
            // 1. ZMIENNE DO STATYSTYK
            const activeGamesCount = games.length;
            let overdueCount = 0;
            let myTasksCount = 0;
            let inProgressCount = 0;

            let chartTodo = 0;
            let chartProgress = 0;
            let chartDone = 0;

            const today = new Date();
            today.setHours(0,0,0,0);

            // 2. PRZELICZANIE ZADAŃ
            tasks.forEach(task => {
                // Zliczanie do wykresu kołowego
                if (task.status === "To Do") chartTodo++;
                if (task.status === "In Progress") {
                    chartProgress++;
                    inProgressCount++; // do kafelka
                }
                if (task.status === "Done") chartDone++;

                // Zliczanie "My Tasks" - zakładamy, że zalogowana jest Kinga (ID = 1)
                if (task.assignedUser && task.assignedUser.id === 1 && task.status !== "Done") {
                    myTasksCount++;
                }

                // Zliczanie zaległych (Overdue)
                if (task.deadline && task.status !== "Done") {
                    const deadlineDate = new Date(task.deadline);
                    if (deadlineDate < today) overdueCount++;
                }
            });

            // 3. AKTUALIZACJA 4 KAFELKÓW
            document.getElementById('stat-games').innerText = activeGamesCount;
            document.getElementById('stat-overdue').innerText = overdueCount;
            document.getElementById('stat-mytasks').innerText = myTasksCount;
            document.getElementById('stat-inprogress').innerText = inProgressCount;

            // 4. RENDEROWANIE WYKRESU KOŁOWEGO (Doughnut)
            const ctx = document.getElementById('taskStatusChart').getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['To Do', 'In Progress', 'Done'],
                    datasets: [{
                        data: [chartTodo, chartProgress, chartDone],
                        backgroundColor: ['#6c757d', '#0d6efd', '#198754'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'bottom', labels: { color: '#e0e0e0' } }
                    }
                }
            });

            // 5. TABELA: NADCHODZĄCE ZADANIA
            const tbody = document.getElementById('dashboard-tasks-table');
            tbody.innerHTML = '';

            // Wybieramy tylko zadania, które nie są Done i mają deadline, sortujemy od najbliższego
            const upcomingTasks = tasks
                .filter(t => t.status !== 'Done' && t.deadline)
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                .slice(0, 5); // Pobieramy maksymalnie 5 pierwszych

            if (upcomingTasks.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">Brak nadchodzących zadań</td></tr>';
            } else {
                upcomingTasks.forEach(task => {
                    // Obliczanie kolorów terminów
                    let daysLeft = 999;
                    if(task.deadline) {
                        const dDate = new Date(task.deadline);
                        daysLeft = Math.ceil((dDate - new Date()) / (1000 * 60 * 60 * 24));
                    }

                    let deadlineClass = "deadline-safe";
                    if (daysLeft < 0) deadlineClass = "deadline-danger";
                    else if (daysLeft <= 3) deadlineClass = "deadline-warn";

                    // Obliczanie kolorów statusów
                    let statusClass = "status-todo";
                    if (task.status === "In Progress") statusClass = "status-progress";
                    if (task.status === "In Review") statusClass = "status-review";

                    const gameName = task.game ? task.game.name : 'Usunięta gra';
                    const gameId = task.game ? task.game.id : 1;

                    tbody.innerHTML += `
                    <tr style="cursor: pointer;" onclick="navigateTo('details', {id: ${gameId}})">
                        <td class="fw-bold text-light">${task.title}</td>
                        <td class="text-muted">${gameName}</td>
                        <td>${task.priority}</td>
                        <td class="${deadlineClass}">${task.deadline}</td>
                        <td><span class="status-badge ${statusClass}">${task.status}</span></td>
                    </tr>
                `;
                });
            }
        })
        .catch(error => {
            console.error("Dashboard data load error:", error);
            document.getElementById('dashboard-tasks-table').innerHTML =
                `<tr><td colspan="5" class="text-center text-danger py-4">Błąd połączenia z serwerem bazy danych.</td></tr>`;
        });
}
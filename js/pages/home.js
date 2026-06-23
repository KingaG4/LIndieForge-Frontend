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
function loadDashboardData() {
    // W przyszłości zamienimy to na odpytanie Waszego Spring Backendu np:
    // ApiService.get('/dashboard/stats').then(...)

    // Tymczasowa symulacja opóźnienia i sztucznych danych
    setTimeout(() => {
        const mockStats = { activeGames: 3, overdueTasks: 1, myTasks: 8, inProgress: 4 };
        const mockChart = { todo: 3, inProgress: 4, done: 1 };
        const mockTasks = [
            { id: 1, title: "Design UI for main menu", game: "Dungeon Quest", priority: "High", deadline: "2026-06-25", status: "In Progress", daysLeft: 2 },
            { id: 2, title: "Fix audio bug", game: "Space Miner", priority: "Medium", deadline: "2026-06-20", status: "To Do", daysLeft: -3 },
            { id: 3, title: "Write lore text", game: "Dungeon Quest", priority: "Low", deadline: "2026-07-05", status: "Done", daysLeft: 12 }
        ];

        // 1. Aktualizacja Kafelków
        document.getElementById('stat-games').innerText = mockStats.activeGames;
        document.getElementById('stat-overdue').innerText = mockStats.overdueTasks;
        document.getElementById('stat-mytasks').innerText = mockStats.myTasks;
        document.getElementById('stat-inprogress').innerText = mockStats.inProgress;

        // 2. Renderowanie Tabeli
        const tbody = document.getElementById('dashboard-tasks-table');
        tbody.innerHTML = '';

        mockTasks.forEach(task => {
            // Logika kolorowania deadline'ów wg specyfikacji
            let deadlineClass = "deadline-safe";
            if (task.daysLeft < 0) deadlineClass = "deadline-danger";
            else if (task.daysLeft <= 3) deadlineClass = "deadline-warn";

            // Logika kolorowania statusów
            let statusClass = "status-todo";
            if (task.status === "In Progress") statusClass = "status-progress";
            if (task.status === "Done") statusClass = "status-done";

            tbody.innerHTML += `
                <tr style="cursor: pointer;" onclick="showSuccess('Clicked task #${task.id}')">
                    <td class="fw-bold text-light">${task.title}</td>
                    <td class="text-muted">${task.game}</td>
                    <td>${task.priority}</td>
                    <td class="${deadlineClass}">${task.deadline}</td>
                    <td><span class="status-badge ${statusClass}">${task.status}</span></td>
                </tr>
            `;
        });

        // 3. Renderowanie Wykresu
        const ctx = document.getElementById('taskStatusChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut', // doughnut wygląda nowocześniej niż zwykły pie
            data: {
                labels: ['To Do', 'In Progress', 'Done'],
                datasets: [{
                    data: [mockChart.todo, mockChart.inProgress, mockChart.done],
                    backgroundColor: ['#6c757d', '#0d6efd', '#198754'], // Zgodne z Bootstrap
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

    }, 600); // 0.6s sztucznego ładowania dla dobrego efektu
}
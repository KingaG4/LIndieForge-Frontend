/**
 * Home Page Controller
 * Renders the home/welcome page of the application
 */

/**
 * Render the home page
 */
function renderHomePage() {
    const appContainer = document.getElementById('app-container');

    appContainer.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-body text-center">
                        <h1 class="card-title mb-4">Welcome to Web Application Starter</h1>
                        
                        <p class="card-text">
                            This is a starter template for building web applications that connect 
                            to a Spring REST API backend. It provides basic CRUD functionality 
                            and a simple structure to build upon.
                        </p>
                        
                        <hr>
                        
                        <div class="row mt-4">
                            <div class="col-md-6">
                                <div class="card mb-3 card-hover">
                                    <div class="card-body">
                                        <h5 class="card-title">View Items</h5>
                                        <p class="card-text">Browse and manage your items</p>
                                        <button class="btn btn-primary" data-action="view-items">
                                            Go to Items
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <div class="card mb-3 card-hover">
                                    <div class="card-body">
                                        <h5 class="card-title">Create New Item</h5>
                                        <p class="card-text">Add a new item to the system</p>
                                        <button class="btn btn-success" data-action="create-item">
                                            Create Item
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row mt-2">
                            <div class="col-md-12">
                                <div class="card card-hover">
                                    <div class="card-body">
                                        <h5 class="card-title">About This Template</h5>
                                        <p class="card-text">
                                            This template is designed to help students quickly get started with 
                                            frontend development that connects to their Spring REST API backend.
                                            It uses plain JavaScript with minimal dependencies to keep things simple.
                                        </p>
                                        <p>
                                            Key features:
                                        </p>
                                        <ul class="text-start">
                                            <li>View, create, edit and delete items through a REST API</li>
                                            <li>Reusable components for forms, tables and modals</li>
                                            <li>Simple routing system for navigation between pages</li>
                                            <li>Bootstrap for responsive styling</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add event listeners to buttons
    document.querySelector('[data-action="view-items"]').addEventListener('click', () => {
        navigateTo('list');
    });

    document.querySelector('[data-action="create-item"]').addEventListener('click', () => {
        navigateTo('create');
    });
}
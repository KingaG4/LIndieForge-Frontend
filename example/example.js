/**
 * Example Page Controller
 * Demonstrates a custom implementation of a page using the components
 */

/**
 * Render the example page
 */
function renderExamplePage() {
    const appContainer = document.getElementById('app-container');

    // Set initial page structure
    appContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Product Catalog Example</h2>
            <div>
                <button class="btn btn-success" id="add-product-btn">
                    <i class="bi bi-plus-circle"></i> Add New Product
                </button>
            </div>
        </div>
        
        <div class="row mb-4">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">Statistics</h5>
                    </div>
                    <div class="card-body">
                        <div id="stats-container">Loading statistics...</div>
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header bg-info text-white">
                        <h5 class="mb-0">Product Categories</h5>
                    </div>
                    <div class="card-body">
                        <div id="categories-container">Loading categories...</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="card mb-4">
            <div class="card-header bg-success text-white">
                <h5 class="mb-0">Products</h5>
            </div>
            <div class="card-body">
                <div id="products-table-container">
                    <div class="text-center py-5">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p>Loading products...</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header bg-warning">
                <h5 class="mb-0">Product Ratings</h5>
            </div>
            <div class="card-body">
                <div id="ratings-container">Loading ratings chart...</div>
            </div>
        </div>
    `;

    // Add event listeners
    document.getElementById('add-product-btn').addEventListener('click', () => {
        showAddProductModal();
    });

    // Load data
    loadExampleData();
}

/**
 * Load all example data
 */
function loadExampleData() {
    // Use the mock API service
    MockApiService.getAllItems()
        .then(items => {
            renderStatistics(items);
            renderCategories(items);
            renderProductsTable(items);
            renderRatingsChart(items);
        })
        .catch(error => {
            showError(`Failed to load data: ${error.message}`);
        });
}

/**
 * Render statistics based on products data
 * @param {Object[]} items - Array of products
 */
function renderStatistics(items) {
    const statsContainer = document.getElementById('stats-container');

    // Calculate statistics
    const totalProducts = items.length;
    const inStockProducts = items.filter(item => item.inStock).length;
    const activeProducts = items.filter(item => item.active).length;
    const averagePrice = items.reduce((sum, item) => sum + item.price, 0) / totalProducts;

    // Render statistics
    statsContainer.innerHTML = `
        <div class="row">
            <div class="col-6 mb-3">
                <div class="d-flex align-items-center">
                    <div class="bg-primary text-white rounded p-2 me-2">
                        <i class="bi bi-box-seam"></i>
                    </div>
                    <div>
                        <div class="text-muted small">Total Products</div>
                        <div class="fw-bold">${totalProducts}</div>
                    </div>
                </div>
            </div>
            <div class="col-6 mb-3">
                <div class="d-flex align-items-center">
                    <div class="bg-success text-white rounded p-2 me-2">
                        <i class="bi bi-check-circle"></i>
                    </div>
                    <div>
                        <div class="text-muted small">In Stock</div>
                        <div class="fw-bold">${inStockProducts}</div>
                    </div>
                </div>
            </div>
            <div class="col-6 mb-3">
                <div class="d-flex align-items-center">
                    <div class="bg-info text-white rounded p-2 me-2">
                        <i class="bi bi-toggle-on"></i>
                    </div>
                    <div>
                        <div class="text-muted small">Active</div>
                        <div class="fw-bold">${activeProducts}</div>
                    </div>
                </div>
            </div>
            <div class="col-6 mb-3">
                <div class="d-flex align-items-center">
                    <div class="bg-warning text-white rounded p-2 me-2">
                        <i class="bi bi-currency-dollar"></i>
                    </div>
                    <div>
                        <div class="text-muted small">Avg Price</div>
                        <div class="fw-bold">$${averagePrice.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render category information
 * @param {Object[]} items - Array of products
 */
function renderCategories(items) {
    const categoriesContainer = document.getElementById('categories-container');

    // Get unique categories and count products
    const categories = {};
    items.forEach(item => {
        if (!categories[item.category]) {
            categories[item.category] = 0;
        }
        categories[item.category]++;
    });

    // Sort categories by count
    const sortedCategories = Object.entries(categories)
        .sort((a, b) => b[1] - a[1]);

    // Render categories
    let categoryHTML = '<div class="row">';

    sortedCategories.forEach(([category, count]) => {
        categoryHTML += `
            <div class="col-md-4 mb-3">
                <div class="card card-hover">
                    <div class="card-body py-2">
                        <h6 class="mb-0 d-flex justify-content-between">
                            <span>${category}</span>
                            <span class="badge bg-primary rounded-pill">${count}</span>
                        </h6>
                    </div>
                </div>
            </div>
        `;
    });

    categoryHTML += '</div>';
    categoriesContainer.innerHTML = categoryHTML;
}

/**
 * Render products table
 * @param {Object[]} items - Array of products
 */
function renderProductsTable(items) {
    const tableContainer = document.getElementById('products-table-container');

    // Define table columns
    const columns = [
        {
            field: 'id',
            title: 'ID',
            width: '5%'
        },
        {
            field: 'name',
            title: 'Product Name',
            render: (value, item) => {
                return `<strong>${value}</strong>`;
            }
        },
        {
            field: 'price',
            title: 'Price',
            width: '10%',
            render: (value) => {
                return `$${value.toFixed(2)}`;
            }
        },
        {
            field: 'category',
            title: 'Category',
            width: '15%'
        },
        {
            field: 'inStock',
            title: 'Stock Status',
            width: '10%',
            render: (value) => {
                return value ?
                    '<span class="badge bg-success">In Stock</span>' :
                    '<span class="badge bg-danger">Out of Stock</span>';
            }
        },
        {
            field: 'rating',
            title: 'Rating',
            width: '15%',
            render: (value) => {
                const fullStars = Math.floor(value);
                const halfStar = value - fullStars >= 0.5;
                const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

                let stars = '';
                for (let i = 0; i < fullStars; i++) {
                    stars += '<i class="bi bi-star-fill text-warning"></i>';
                }
                if (halfStar) {
                    stars += '<i class="bi bi-star-half text-warning"></i>';
                }
                for (let i = 0; i < emptyStars; i++) {
                    stars += '<i class="bi bi-star text-warning"></i>';
                }

                return `<div>${stars} <span class="ms-1">(${value.toFixed(1)})</span></div>`;
            }
        }
    ];

    // Create table with products
    const table = createTable(items, {
        columns: columns,
        onView: (id) => {
            showProductDetailsModal(id);
        },
        onEdit: (id) => {
            showEditProductModal(id);
        },
        onDelete: (id, item) => {
            confirmDeleteProduct(id, item.name);
        }
    });

    // Clear loading indicator and show table
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
}

/**
 * Render ratings chart
 * @param {Object[]} items - Array of products
 */
function renderRatingsChart(items) {
    const ratingsContainer = document.getElementById('ratings-container');

    // Group ratings by category
    const categoryRatings = {};
    items.forEach(item => {
        if (!categoryRatings[item.category]) {
            categoryRatings[item.category] = [];
        }
        categoryRatings[item.category].push(item.rating);
    });

    // Calculate average rating per category
    const averageRatings = Object.entries(categoryRatings).map(([category, ratings]) => {
        const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
        return { category, average };
    });

    // Sort by average rating
    averageRatings.sort((a, b) => b.average - a.average);

    // Create chart
    const chartHTML = `
        <div class="chart-container">
            <div class="row">
                ${averageRatings.map(item => `
                    <div class="col-md-6 mb-3">
                        <div class="card">
                            <div class="card-body">
                                <h6 class="card-title">${item.category}</h6>
                                <div class="progress" style="height: 24px;">
                                    <div class="progress-bar bg-warning" 
                                         role="progressbar" 
                                         style="width: ${(item.average / 5) * 100}%;"
                                         aria-valuenow="${item.average}" 
                                         aria-valuemin="0" 
                                         aria-valuemax="5">
                                        ${item.average.toFixed(1)} / 5
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    ratingsContainer.innerHTML = chartHTML;
}

/**
 * Show modal with product details
 * @param {number} id - Product ID
 */
function showProductDetailsModal(id) {
    // Fetch product
    MockApiService.getItemById(id)
        .then(product => {
            // Create modal content
            const modalContent = `
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <strong>ID:</strong> ${product.id}
                        </div>
                        <div class="mb-3">
                            <strong>Name:</strong> ${product.name}
                        </div>
                        <div class="mb-3">
                            <strong>Price:</strong> $${product.price.toFixed(2)}
                        </div>
                        <div class="mb-3">
                            <strong>Category:</strong> ${product.category}
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <strong>Stock Status:</strong> ${product.inStock ?
                '<span class="badge bg-success">In Stock</span>' :
                '<span class="badge bg-danger">Out of Stock</span>'}
                        </div>
                        <div class="mb-3">
                            <strong>Rating:</strong> ${product.rating.toFixed(1)} / 5
                        </div>
                        <div class="mb-3">
                            <strong>Status:</strong> ${product.active ?
                '<span class="badge bg-success">Active</span>' :
                '<span class="badge bg-secondary">Inactive</span>'}
                        </div>
                        <div class="mb-3">
                            <strong>Created:</strong> ${formatDate(product.createdDate)}
                        </div>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <strong>Description:</strong>
                        <p>${product.description}</p>
                    </div>
                </div>
            `;

            // Create and show modal
            const modal = createModal({
                title: `Product Details: ${product.name}`,
                content: modalContent,
                size: 'large',
                primaryButton: 'Edit',
                secondaryButton: 'Close',
                onPrimary: () => {
                    modal.hide();
                    showEditProductModal(id);
                }
            });

            modal.show();
        })
        .catch(error => {
            showError(`Failed to load product: ${error.message}`);
        });
}

/**
 * Show modal to add a new product
 */
function showAddProductModal() {
    // Create form fields
    const fields = [
        {
            id: 'name',
            name: 'name',
            label: 'Product Name',
            type: 'text',
            placeholder: 'Enter product name',
            required: true
        },
        {
            id: 'description',
            name: 'description',
            label: 'Description',
            type: 'textarea',
            placeholder: 'Enter product description',
            rows: 3
        },
        {
            id: 'price',
            name: 'price',
            label: 'Price ($)',
            type: 'number',
            placeholder: 'Enter price',
            required: true,
            attributes: {
                step: '0.01',
                min: '0'
            }
        },
        {
            id: 'category',
            name: 'category',
            label: 'Category',
            type: 'select',
            required: true,
            options: [
                { value: 'Electronics', label: 'Electronics' },
                { value: 'Furniture', label: 'Furniture' },
                { value: 'Kitchen', label: 'Kitchen' },
                { value: 'Lighting', label: 'Lighting' },
                { value: 'Office', label: 'Office Supplies' }
            ]
        },
        {
            id: 'rating',
            name: 'rating',
            label: 'Rating',
            type: 'number',
            placeholder: 'Enter rating (0-5)',
            attributes: {
                step: '0.1',
                min: '0',
                max: '5'
            }
        },
        {
            id: 'inStock',
            name: 'inStock',
            label: 'Stock Status',
            type: 'checkbox',
            checkboxLabel: 'In Stock'
        },
        {
            id: 'active',
            name: 'active',
            label: 'Product Status',
            type: 'checkbox',
            checkboxLabel: 'Active'
        }
    ];

    // Create form
    const form = createForm(fields, {
        id: 'add-product-form',
        submitLabel: 'Add Product',
        initialValues: {
            active: true,
            inStock: true,
            rating: 4.0
        },
        onSubmit: (formData) => {
            // Convert string values to appropriate types
            formData.price = parseFloat(formData.price);
            formData.rating = parseFloat(formData.rating);

            // Create product
            modal.hide();
            createProduct(formData);
        }
    });

    // Create and show modal
    const modal = createModal({
        title: 'Add New Product',
        content: form,
        size: 'large',
        footer: false
    });

    modal.show();
}

/**
 * Show modal to edit a product
 * @param {number} id - Product ID
 */
function showEditProductModal(id) {
    // Fetch product
    MockApiService.getItemById(id)
        .then(product => {
            // Create form fields (same as add product)
            const fields = [
                {
                    id: 'name',
                    name: 'name',
                    label: 'Product Name',
                    type: 'text',
                    placeholder: 'Enter product name',
                    required: true
                },
                {
                    id: 'description',
                    name: 'description',
                    label: 'Description',
                    type: 'textarea',
                    placeholder: 'Enter product description',
                    rows: 3
                },
                {
                    id: 'price',
                    name: 'price',
                    label: 'Price ($)',
                    type: 'number',
                    placeholder: 'Enter price',
                    required: true,
                    attributes: {
                        step: '0.01',
                        min: '0'
                    }
                },
                {
                    id: 'category',
                    name: 'category',
                    label: 'Category',
                    type: 'select',
                    required: true,
                    options: [
                        { value: 'Electronics', label: 'Electronics' },
                        { value: 'Furniture', label: 'Furniture' },
                        { value: 'Kitchen', label: 'Kitchen' },
                        { value: 'Lighting', label: 'Lighting' },
                        { value: 'Office', label: 'Office Supplies' }
                    ]
                },
                {
                    id: 'rating',
                    name: 'rating',
                    label: 'Rating',
                    type: 'number',
                    placeholder: 'Enter rating (0-5)',
                    attributes: {
                        step: '0.1',
                        min: '0',
                        max: '5'
                    }
                },
                {
                    id: 'inStock',
                    name: 'inStock',
                    label: 'Stock Status',
                    type: 'checkbox',
                    checkboxLabel: 'In Stock'
                },
                {
                    id: 'active',
                    name: 'active',
                    label: 'Product Status',
                    type: 'checkbox',
                    checkboxLabel: 'Active'
                }
            ];

            // Create form with product data
            const form = createForm(fields, {
                id: 'edit-product-form',
                submitLabel: 'Save Changes',
                initialValues: product,
                onSubmit: (formData) => {
                    // Convert string values to appropriate types
                    formData.price = parseFloat(formData.price);
                    formData.rating = parseFloat(formData.rating);

                    // Update product
                    modal.hide();
                    updateProduct(id, formData);
                }
            });

            // Create and show modal
            const modal = createModal({
                title: `Edit Product: ${product.name}`,
                content: form,
                size: 'large',
                footer: false
            });

            modal.show();
        })
        .catch(error => {
            showError(`Failed to load product: ${error.message}`);
        });
}

/**
 * Confirm and delete a product
 * @param {number} id - Product ID
 * @param {string} productName - Product name
 */
function confirmDeleteProduct(id, productName) {
    confirmAction(`Are you sure you want to delete "${productName}"?`)
        .then(confirmed => {
            if (confirmed) {
                MockApiService.deleteItem(id)
                    .then(() => {
                        showSuccess('Product deleted successfully');
                        loadExampleData(); // Reload all data
                    })
                    .catch(error => {
                        showError(`Failed to delete product: ${error.message}`);
                    });
            }
        });
}

/**
 * Create a new product
 * @param {Object} productData - Product data
 */
function createProduct(productData) {
    MockApiService.createItem(productData)
        .then(() => {
            showSuccess('Product created successfully');
            loadExampleData(); // Reload all data
        })
        .catch(error => {
            showError(`Failed to create product: ${error.message}`);
        });
}

/**
 * Update a product
 * @param {number} id - Product ID
 * @param {Object} productData - Updated product data
 */
function updateProduct(id, productData) {
    MockApiService.updateItem(id, productData)
        .then(() => {
            showSuccess('Product updated successfully');
            loadExampleData(); // Reload all data
        })
        .catch(error => {
            showError(`Failed to update product: ${error.message}`);
        });
}
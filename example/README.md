# Example Module

This folder contains example implementations that demonstrate how to use the Web Application Starter components with a mock API service. These examples are for demonstration purposes only and can be removed when you implement your own application.

## Files in this folder:

1. **mock-api.js** - A JavaScript module that simulates a REST API with sample product data. It includes artificial delays and random errors to demonstrate error handling.

2. **example.js** - A complete example page implementation that showcases:
    - Statistics dashboard
    - Category visualization
    - Data tables with custom rendering
    - Charts using CSS
    - CRUD operations with forms and modals

## How to Use These Examples:

1. Click on the "Example" link in the navigation bar to see the example page in action.
2. Explore the code to see how the components are used to create a complete interface.
3. Interact with the page to see how CRUD operations are implemented.
4. Use these examples as a reference for implementing your own pages.

## Learning Points:

- **Component Usage**: See how to use the table, form, and modal components for real-world scenarios.
- **Data Visualization**: Simple approaches to visualize data without complex libraries.
- **API Integration**: How to connect UI components to API endpoints.
- **Form Handling**: Examples of form validation and data submission.
- **Error Handling**: Handling API errors and showing user feedback.

## Removing the Example:

When you're ready to implement your own application:

1. Remove the "Example" link from the navigation in `index.html`.
2. Remove the script tags for `mock-api.js` and `example.js` from `index.html`.
3. Remove the `case 'example':` routing from `app.js`.
4. Delete the entire `example` folder.

This will clean up the starter application without affecting your own implementation.
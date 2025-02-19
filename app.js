const express = require('express')
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')

// Define the port for the server
const port = process.env.PORT || 3000

// Initialize the Express app
const app = express()

// Serve static files from the public directory
app.use(express.static(__dirname + '/public'))

// Middleware for parsing JSON request bodies
app.use(bodyParser.json())

// Apply custom CORS middleware
app.use(middleware.cors)

// Define the root route that serves the home page
app.get('/', api.handleRoot)

// Define routes for managing products
app.get('/products', api.listProducts)        // Fetch the list of products
app.get('/products/:id', api.getProduct)      // Fetch a single product by its ID
app.put('/products/:id', api.editProduct)     // Update a product by its ID
app.delete('/products/:id', api.deleteProduct) // Delete a product by its ID
app.post('/products', api.createProduct)      // Create a new product

// Define routes for managing orders
app.get('/orders', api.listOrders)            // Fetch the list of orders
app.post('/orders/', api.createOrder)         // Create a new order

app.put('/orders/:id', api.editOrder)         // Update an order by its ID
app.delete('/orders/:id', api.deleteOrder)    // Delete an order by its ID

// Start the server and listen on the defined port
app.listen(port, () => console.log(`Server listening on port ${port}`))

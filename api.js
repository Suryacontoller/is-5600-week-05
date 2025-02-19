const path = require('path')
const Products = require('./products')
const Orders = require('./orders');
const autoCatch = require('./lib/auto-catch')

/**
 * Serve the root HTML page.
 * @param {object} req - The incoming request object.
 * @param {object} res - The response object.
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * Fetch a list of all products with optional filters and pagination.
 * @param {object} req - The incoming request object.
 * @param {object} res - The response object.
 */
async function listProducts(req, res) {
  // Extract query parameters for pagination and optional tag filter
  const { offset = 0, limit = 25, tag } = req.query
  // Retrieve the list of products based on the query parameters
  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }))
}

/**
 * Get a single product by its ID.
 * @param {object} req - The incoming request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
async function getProduct(req, res, next) {
  const { id } = req.params

  // Retrieve the product with the given ID
  const product = await Products.get(id)
  if (!product) {
    return next() // If product not found, pass control to the next middleware
  }

  return res.json(product)
}

/**
 * Create a new product.
 * @param {object} req - The incoming request object containing product data.
 * @param {object} res - The response object.
 */
async function createProduct(req, res) {
  // Create a new product using the data from the request body
  const product = await Products.create(req.body)
  res.json(product) // Send the created product in the response
}

/**
 * Update an existing product by its ID.
 * @param {object} req - The incoming request object containing updated product data.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
async function editProduct(req, res, next) {
  const change = req.body
  // Update the product with the given ID using the changes provided
  const product = await Products.edit(req.params.id, change)
  res.json(product) // Send the updated product in the response
}

/**
 * Delete a product by its ID.
 * @param {object} req - The incoming request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
async function deleteProduct(req, res, next) {
  // Delete the product with the given ID
  const response = await Products.destroy(req.params.id)
  res.json(response) // Send the deletion response in the response body
}

/**
 * Create a new order.
 * @param {object} req - The incoming request object containing order data.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
async function createOrder(req, res, next) {
  // Create a new order using the data from the request body
  const order = await Orders.create(req.body)
  res.json(order) // Send the created order in the response
}

/**
 * List orders with optional filters and pagination.
 * @param {object} req - The incoming request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
async function listOrders(req, res, next) {
  const { offset = 0, limit = 25, productId, status } = req.query
  // Retrieve the list of orders based on the query parameters
  const orders = await Orders.list({
    offset: Number(offset),
    limit: Number(limit),
    productId,
    status
  })
  res.json(orders) // Send the list of orders in the response
}

/**
 * Update an existing order by its ID.
 * @param {object} req - The incoming request object containing updated order data.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
async function editOrder(req, res, next) {
  const change = req.body
  // Update the order with the given ID using the changes provided
  const order = await Orders.edit(req.params.id, change)
  res.json(order) // Send the updated order in the response
}

/**
 * Delete an order by its ID.
 * @param {object} req - The incoming request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
async function deleteOrder(req, res, next) {
  // Delete the order with the given ID
  await Orders.destroy(req.params.id)
  res.json({ success: true }) // Send a success message in the response
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
  createOrder,
  listOrders,
  editOrder,
  deleteOrder
});


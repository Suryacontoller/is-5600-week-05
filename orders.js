// orders.js
const cuid = require('cuid')

const db = require('./db')

// Define the Order model schema
const Order = db.model('Order', {
  _id: { type: String, default: cuid }, // Unique ID for the order
  buyerEmail: { type: String, required: true }, // Email of the buyer
  products: [{
    type: String, 
    ref: 'Product', // Ref to the Product model; will automatically fetch associated products
    index: true, // Index the products field for performance
    required: true // Ensure that the order has products
  }],
  status: {
    type: String, 
    index: true, // Index the status field for performance
    default: 'CREATED', // Default status of the order
    enum: ['CREATED', 'PENDING', 'COMPLETED'] // Valid status values
  }
})

/**
 * List orders with optional filters for pagination, product, and status.
 * @param {Object} options - Filter options for listing orders.
 * @param {number} options.offset - The offset for pagination.
 * @param {number} options.limit - The limit for the number of orders to fetch.
 * @param {string} options.productId - Optional product ID to filter orders by product.
 * @param {string} options.status - Optional status to filter orders by.
 * @returns {Promise<Array>} - A list of orders matching the filters.
 */
async function list(options = {}) {

  const { offset = 0, limit = 25, productId, status } = options;

  // Build queries for filtering by product and status
  const productQuery = productId ? {
    products: productId
  } : {}

  const statusQuery = status ? {
    status: status
  } : {}

  // Combine the filters into a single query object
  const query = {
    ...productQuery,
    ...statusQuery
  }

  // Fetch orders from the database with pagination and filtering
  const orders = await Order.find(query)
    .sort({ _id: 1 }) // Sort orders by ID
    .skip(offset) // Skip the specified number of orders
    .limit(limit) // Limit the number of orders returned

  return orders
}

/**
 * Retrieve a single order by its ID, including associated product details.
 * @param {string} _id - The ID of the order to retrieve.
 * @returns {Promise<Object>} - The order object, populated with product details.
 */
async function get(_id) {
  // Use populate to automatically fetch associated product details
  const order = await Order.findById(_id)
    .populate('products') // Populate the products field with actual product data
    .exec()

  return order
}

/**
 * Create a new order with the specified fields.
 * @param {Object} fields - The data to create the new order.
 * @returns {Promise<Object>} - The created order object.
 */
async function create(fields) {
  // Create and save the new order
  const order = await new Order(fields).save()
  
  // Populate the order's products with actual product data
  await order.populate('products')
  
  return order
}

/**
 * Edit an existing order by applying changes to its fields.
 * @param {string} _id - The ID of the order to edit.
 * @param {Object} change - The fields to update on the order.
 * @returns {Promise<Object>} - The updated order object.
 */
async function edit(_id, change) {
  // Fetch the existing order
  const order = await get(_id)
  
  // Apply changes to the order's fields
  Object.keys(change).forEach(function(key) {
    order[key] = change[key]
  })

  // Save the updated order to the database
  await order.save()
  
  return order
}

/**
 * Delete an order by its ID.
 * @param {string} _id - The ID of the order to delete.
 * @returns {Promise<void>} - A promise that resolves when the order is deleted.
 */
async function destroy(_id) {
  // Delete the order with the specified ID
  await Order.deleteOne({ _id })
}

module.exports = {
  create,
  get,
  list,
  edit,
  destroy
}

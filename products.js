const fs = require('fs').promises
const path = require('path')
const cuid = require('cuid')
const db = require('./db')

const productsFile = path.join(__dirname, 'data/full-products.json')

// Define the Product Model schema
const Product = db.model('Product', {
  _id: { type: String, default: cuid }, // Unique ID for the product
  description: { type: String }, // Product description
  alt_description: { type: String }, // Alternative description
  likes: { type: Number, required: true }, // Number of likes
  urls: {
    regular: { type: String, required: true }, // Regular size image URL
    small: { type: String, required: true }, // Small size image URL
    thumb: { type: String, required: true }, // Thumbnail image URL
  },
  links: {
    self: { type: String, required: true }, // Self link to the product
    html: { type: String, required: true }, // HTML link for the product
  },
  user: {
    id: { type: String, required: true }, // User ID
    first_name: { type: String, required: true }, // User's first name
    last_name: { type: String }, // User's last name
    portfolio_url: { type: String }, // User's portfolio URL
    username: { type: String, required: true }, // User's username
  },
  tags: [{
    title: { type: String, required: true }, // Tags associated with the product
  }],
})

/**
 * Fetch a list of products, with optional filtering by tag and pagination.
 * @param {Object} options - Options for pagination and tag filtering.
 * @param {number} options.offset - The offset for pagination.
 * @param {number} options.limit - The limit for pagination.
 * @param {string} options.tag - Optional tag to filter products by.
 * @returns {Promise<Array>} - A list of products.
 */
async function list(options = {}) {

  const { offset = 0, limit = 25, tag } = options;

  // Build query to filter products by tag if specified
  const query = tag ? {
    tags: {
      $elemMatch: {
        title: tag
      }
    }
  } : {}

  // Fetch products from the database with pagination
  const products = await Product.find(query)
    .sort({ _id: 1 }) // Sort products by ID
    .skip(offset) // Skip the specified number of products
    .limit(limit) // Limit the number of products returned

  return products
}

/**
 * Retrieve a single product by its ID.
 * @param {string} _id - The ID of the product to retrieve.
 * @returns {Promise<Object>} - The product object.
 */
async function get(_id) {
  // Fetch a product by its unique ID
  const product = await Product.findById(_id)
  return product
}

/**
 * Create a new product with the specified fields.
 * @param {Object} fields - The data to create the new product.
 * @returns {Promise<Object>} - The created product object.
 */
async function create(fields) {
  // Create a new product instance and save it to the database
  const product = await new Product(fields).save()
  return product
}

/**
 * Update an existing product's information by its ID.
 * @param {string} _id - The ID of the product to update.
 * @param {Object} change - The fields to update on the product.
 * @returns {Promise<Object>} - The updated product object.
 */
async function edit(_id, change) {
  // Fetch the product to be updated
  const product = await get(_id)

  // Apply the changes to the product fields
  Object.keys(change).forEach(function(key) {
    product[key] = change[key]
  })

  // Save the updated product
  await product.save()
  return product
}

/**
 * Delete a product by its ID.
 * @param {string} _id - The ID of the product to delete.
 * @returns {Promise<Object>} - The result of the deletion operation.
 */
async function destroy(_id) {
  // Delete the product with the specified ID
  return await Product.deleteOne({ _id })
}

module.exports = {
  list,
  create,
  edit,
  destroy,
  get
}

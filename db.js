const mongoose = require('mongoose')

// Connect to MongoDB using the connection string from environment variables or a default URI
mongoose.connect(
  process.env.MONGODB_URI || mongodb+srv://myUser:myPassword@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority',,
  {
    useNewUrlParser: true, // Use the new URL parser for MongoDB connections
  }
)

// Export the mongoose instance to be used in other modules
module.exports = mongoose

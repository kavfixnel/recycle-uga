// Require the dependencies
const mongoose = require('mongoose')
const debug = require('debug')('recycle-uga:database');
require('dotenv').config()

// Import the environmental variables
const URLSTRING = process.env.URLSTRING
debug(URLSTRING);

/* Create a new database connection to MongoDB Atlas */
class Database {
  // Constructor for the database
  constructor() {
    this._connect()
  }
  _connect() {
    mongoose.connect(URLSTRING, { useNewUrlParser: true })
      .then(() => {
        // Database successfully connected
        debug('Atlas database connection successful')
      })
      .catch(err => {
        // Database failed to connect
        debug('Database connection error: ' + err)
      })
  }
}

// Export the database singelton
module.exports = new Database()


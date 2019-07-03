let mongoose = require('mongoose')
require('dotenv').config()

const URLSTRING = process.env.URLSTRING
console.log(URLSTRING);

class Database {
  constructor() {
    this._connect()
  }
  _connect() {
     mongoose.connect(URLSTRING, { useNewUrlParser: true } )
       .then(() => {
        console.log('Atlas database connection successful')
       })
       .catch(err => {
        console.error('Database connection error: ' + err)
       })
  }
}

module.exports = new Database()


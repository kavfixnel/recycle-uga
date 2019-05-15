let mongoose = require('mongoose')
require('dotenv').config()

const server = process.env.SERVER; // REPLACE WITH YOUR DB SERVER
const database = process.env.DB;      // REPLACE WITH YOUR DB NAME
const user = process.env.USERNAME;
const passwd = process.env.PASSWD;

class Database {
  constructor() {
    this._connect()
  }
  _connect() {
     mongoose.connect(`mongodb://${user}:${passwd}@${server}/${database}`)
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }
}

module.exports = new Database()


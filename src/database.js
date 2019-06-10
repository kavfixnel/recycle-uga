let mongoose = require('mongoose')
require('dotenv').config()

const URLSTRING = process.env.URLSTRING

/*
const server = process.env.SERVER; // REPLACE WITH YOUR DB SERVER
const database = process.env.DB;      // REPLACE WITH YOUR DB NAME
const user = process.env.USERNAME;
const passwd = process.env.PASSWD;
*/

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
	 console.log(err)
         console.error('Database connection error')
       })
  }
}

module.exports = new Database()


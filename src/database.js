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
         if(process.env.DEVMODE == 'TRUE') {
          console.log('Atlas database connection successful')
         }
       })
       .catch(err => {
   console.log(err)
        console.error('Database connection error: ' + err)
       })
  }
}

module.exports = new Database()


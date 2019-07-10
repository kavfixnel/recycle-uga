// Import the required modules
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

// Connect to database
var db = require('./src/database')

// Initialize a new app object
var app = express()

// initialize the use middleware
app.use(logger('dev'))
app.use(express.json())
app.use(cookieParser())

// Import all the routers
var usersRouter = require('./routes/users.js')
var loginRouter = require('./routes/login.js')
var moduleRouter = require('./routes/module.js')

// set up all the routers
app.use('/users', usersRouter)
app.use('/login', loginRouter)
app.use('/module', moduleRouter)

app.use(express.static('public'))

if(process.env.DEVMODE == 'TRUE') {
    console.log('Server started!')
}

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, '/private/404Page.html'))
})

module.exports = app
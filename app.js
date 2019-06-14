var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var db = require('./src/database')

var usersRouter = require('./routes/users.js');
var loginRouter = require('./routes/login.js')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/users', usersRouter);
app.use('/login', loginRouter)

app.use(express.static('public'));

module.exports = app;

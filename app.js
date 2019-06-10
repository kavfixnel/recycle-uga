var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var db = require('./src/database')

//var indexRouter = require('./routes/index.js');
var usersRouter = require('./routes/users.js');

var app = express();

app.use(logger('dev'));
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static('public'));

//app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;

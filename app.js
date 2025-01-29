var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
var app = express();
const UserController = require('./controller/UserController');
var createError = require('http-errors');


// Routes
var indexRouter = require('./routes/index');


// Middleware for JSON requests
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/', indexRouter);

require('dotenv').config();
require('./config/dbconnection');

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Other middleware
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

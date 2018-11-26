var createError  = require('http-errors');
var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var logger       = require('morgan');

var { authJwt } = require('./controllers/auth/authController');

var userRouter   = require('./routes/user');
var caedRouter   = require('./routes/caed');
var authRouter   = require('./routes/auth');
var adminRouter  = require('./routes/admin');
var apiRouter    = require('./routes/api');
var testsRouter  = require('./routes/tests');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'www')));

app.use('/user', userRouter);
app.use('/caed', caedRouter)
app.use('/auth', authRouter);
app.use('/admin', authJwt, adminRouter);
app.use('/api', authJwt, apiRouter);
app.use('/tests', testsRouter);

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function (req, res, next) {
  console.log('cors');
  res.header("Access-Control-Allow-Origin", "*"); // TODO: change to app domain
  res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  var error_page = err.status ? err.status.toString() : '404';

  // render the error page
  res.status(err.status || 500);
  res.render('errors/error_template', { page: error_page });
});

module.exports = app;
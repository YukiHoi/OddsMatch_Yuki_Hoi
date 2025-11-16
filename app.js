let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

require('./app_api/models/db');

let apiRoutes = require('./app_api/routes/index');
let indexRouter = require('./app_server/routes/index');
let usersRouter = require('./app_server/routes/users');

let app = express();
const session = require('express-session');

app.use(session({
  secret: 'change-me',
  resave: false,
  saveUninitialized: false
}));

// expose user to templates if you set req.session.user later
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// =============================
// CORS: allow Angular dev (4200) to call API (3000)
// =============================
app.use('/api', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// =============================
// view engine setup
// =============================
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// =============================
// static folders  (IMPORTANT: add app_public here)
// =============================
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_public')));   //serves Angular build files

// =============================
// routes
// =============================
app.use('/api', apiRoutes);     // API routes (JSON)
app.use('/', indexRouter);      // server-rendered pages
app.use('/users', usersRouter); // user routes

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

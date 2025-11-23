let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

require('./app_api/models/db');

const session  = require('express-session');
const passport = require('passport');
const flash    = require('connect-flash');

// passport config (Account model is loaded in db.js)
require('./app_server/config/passport');

let apiRoutes = require('./app_api/routes/index');
let indexRouter = require('./app_server/routes/index');
let usersRouter = require('./app_server/routes/users');

let app = express();
// On Render, trust the first proxy so secure cookies work
app.set('trust proxy', 1);

// Passport Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production' // set secure cookies in production
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Expose authenticated user to templates
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// CORS: allow Angular dev (4200) to call API (3000)
app.use('/api', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// static folders  (add app_public here)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_public')));   //serves Angular build files

// routes
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

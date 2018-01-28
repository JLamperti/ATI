var express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  i18n = require('i18n'),
  bodyParser = require('body-parser');

//import the routers
var index = require('./routes/index'),
  user = require('./routes/user'),
  login = require('./routes/login'),
  form = require('./routes/form'),
  results = require('./routes/results'),
  db = require('./routes/db');

var app = express();
var sched = require('./custom_modules/sched');		//performs daily tasks

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

i18n.configure({
  // setup some locales - other locales default to en silently
  locales: ['en', 'de'],

  // sets a custom cookie name to parse locale settings from
  cookie: 'locale',

  // where to store json files - defaults to './locales'
  directory: __dirname + '/locales'
});


app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// i18n init parses req for language headers, cookies, etc.
app.use(i18n.init);

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: '#RandomSecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});

//set up routing
app.use('/', index);
app.use('/user', user);
app.use('/login', login)
app.use('/results', results);
app.use('/form', form);
app.use('/db', db);

// catch 404 and forward to error handler

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler

app.use(function (err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

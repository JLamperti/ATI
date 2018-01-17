var express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  i18n = require('i18n'),
  bodyParser = require('body-parser');

//import the routers
var index = require('./routes/index'),
  profile = require('./routes/profile'),
  form = require('./routes/form'),
  results = require('./routes/results'),
  db = require('./routes/db');

var app = express();

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

//set up routing
app.use('/', index);
app.use('/profile', profile);
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

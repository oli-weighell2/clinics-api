var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

// web app
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');

// logger
var logger = require('./middleware/logger');
logger.info('Starting app as %s', app.get('env'));
app.use(require('./middleware/request-logger'));

// routes
app.use('/healthcheck', require('./middleware/healthcheck'));
app.use('/ping', function (req, res, next) {
    res.status(200).end();
});
app.use('/stub', express.static(__dirname + '/tests/utils/data'));
app.use('/clinics', require('./routes'));

// 404s - catch and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
if (app.get('env') === 'development') {
  // dev - will print stacktrace
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('pages/error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  // production - no stacktraces leaked to user
  res.status(err.status || 500);
  res.render('pages/error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

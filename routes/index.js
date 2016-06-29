var app = require('express').Router();
var Controller = require('../controllers/clinic-search');

app.get('/postcode/:code', Controller.postcode);
app.get('/name/:name', Controller.name);
app.get('/city/:city', Controller.city);

module.exports = app;


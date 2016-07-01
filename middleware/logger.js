var winston = require('winston');

var config = require('../config');

var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({ colorize: true }),
        new winston.transports.File({ filename: config['app-log'], json: false })
    ],
    exceptionHandlers: [
        new winston.transports.Console({ colorize: true }),
        new winston.transports.File({ filename: config['error-log'], json: false })
    ]
});

module.exports = logger;
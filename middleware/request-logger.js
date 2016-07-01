var morgan = require('morgan');

var logger = require('./logger');

module.exports = function (req, res, next) {
    morgan('short', {
        stream: {
            write: function (line) {
                logger.info(line.replace(/\n$/, ''));
            }
        }
    })(req, res, next);
};
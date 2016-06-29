var fs = require('fs'),
    path = require('path'),
    _ = require('underscore');

var defaultConf = require('./default.json'),
    envConf = {},
    filePath = process.env.CONFIG;

if (fs.existsSync(filePath)) {
    envConf = require(filePath);
}

var config = _.extend({}, defaultConf, envConf);

config.APP_ROOT = path.resolve(__dirname, '../');

module.exports = config;

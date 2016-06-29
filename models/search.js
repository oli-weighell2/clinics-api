var rp = require('request-promise');
var _ = require('underscore');

class Search {

    constructor (options) {
        this.options = options;
    }

    fetch (cb) {
        rp(this.options)
            .then(function (data) {
                cb(null, data);
            })
            .catch(function (err) {
                cb(err);
            });
    }

    process (data) {
        return JSON.parse(data)
    }

    count (data, key, value) {
        return key == null
            ? _.size(data)
            : this.count(_.filter(data, function (item) { return item[key] === value; }));
    }

    group (data, attr) {
        return _.countBy(data, attr);
    }
}

module.exports = Search;
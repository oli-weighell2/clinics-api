var rp = require('request-promise');
var _ = require('underscore');

class Search {

    constructor (options) {
        if (!options) {
            throw new Error('Options must be defined');
        }
        this.options = options;
    }

    get reqOptions () {
        return this.options;
    }

    set newOptions (value) {
        this.options = value;
    };

    fetch (cb) {
        rp(this.options)
            .then(function(data) {
                cb(null, data);
            })
            .catch(function(err) {
                cb(err);
            });
    }

    process (data) {
        return JSON.parse(data)
    }

    count (data, key, value) {
        // use filter if supplied
        return key == null
            ? _.size(data)
            : this.count(_.filter(data, function(item) { return item[key] === value; }));
    }

    group (data, attr) {
        // @todo: replace with a custom recursive function that uses a memoizer
        return _.countBy(data, attr);
    }
}

module.exports = Search;
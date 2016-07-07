var rp = require('request-promise');
var _ = require('underscore');

class Search {

    get options () {
        return this.reqOptions;
    }

    set options (value) {
        this.reqOptions = value;
    };

    fetch (cb) {
        if (!this.reqOptions) {
            throw new Error('Options must be defined');
        } else {
            rp(this.options)
                .then(function(data) {
                    cb(null, data);
                })
                .catch(function(err) {
                    cb(err);
                });
        }
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
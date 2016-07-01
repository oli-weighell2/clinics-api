var Search = require('./search');
var Clinic = require('./clinic');
var _ = require('underscore');

class ClinicSearch extends Search {

    process (data) {
        return super.process(data).result;
    }

    format (data) {
        return _.map(data, this.formatter);
    }

    formatter (item) {
        return new Clinic(item).formatted;
    }

    filter (data, key, value) {
        return _.filter(data, (item)  => {
            return item[key] === value;
        });
    }
}

module.exports = ClinicSearch;
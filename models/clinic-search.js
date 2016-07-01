var Search = require('./search');
var Clinic = require('./clinic');

class ClinicSearch extends Search {

    process (data) {
        return super.process(data).result;
    }

    formatter (item) {
        return new Clinic(item).formatted;
    }
}

module.exports = ClinicSearch;
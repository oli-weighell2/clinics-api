var _ = require('underscore');
var utils = require('../lib/utils');

class Clinic {

    constructor (data) {
        this.raw = data;
        this.name = data.organisation_name;
        this.address = this.formatAddress();
        this.formatted = this.format();
    }

    formatAddress () {
        var addressElements = [
            this.raw.address1,
            this.raw.address2,
            this.raw.address3,
            this.raw.postcode,
            this.raw.city
        ];

        return utils.toList(addressElements);
    }

    format () {
        return _.extend(this.raw, { formatted: this.name + ' (' + this.address + ')' });
    }
}

module.exports = Clinic;


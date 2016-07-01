var Clinic = require(APP_ROOT + '/models/clinic');

describe('Clinic model: ', function () {

    var data, item, clinic;

    beforeEach(function () {
        data = require(APP_ROOT + '/tests/utils/data/city-search.json');
        item = data.result[0];
        clinic = new Clinic(item);
    });

    it('exports a constructor', function () {
        Clinic.should.be.a('function');
    });

    describe('Address', function () {

        it('is a string', function () {
            clinic.address.should.be.a('string');
        });

        it('is a comma separated list of address fields', function () {
            clinic.address.includes(',').should.equal(true);
        });

        it('skips empty fields', function () {
            clinic.address.includes(',,').should.equal(false);
            clinic.address.includes(', ,').should.equal(false);
        });

    });

    describe('Formatted', function () {

        it('is an object', function () {
            clinic.formatted.should.be.an('object');
        });

        it('includes an attribute called "formatted"', function() {
            var formattedClinic = clinic.formatted;
            formattedClinic.formatted.should.not.be.undefined;
        });

        it('includes "formatted" attribute containing clinic name and address', function() {
            var formattedClinic = clinic.formatted;
            formattedClinic.formatted.includes(clinic.name).should.equal(true);
            formattedClinic.formatted.includes(clinic.address).should.equal(true);
        });

    });

});
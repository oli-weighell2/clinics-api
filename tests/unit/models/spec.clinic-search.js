var Base = require(APP_ROOT + '/models/search');
var Model = require(APP_ROOT + '/models/clinic-search');
var Clinic = require(APP_ROOT + '/models/clinic');
var config = require(APP_ROOT + '/config');

describe('Clinic Search model: ', function () {

    var endpoint, testData, rawTestData, search;

    before(function () {
        endpoint = config.services.CLINICS_POSTCODE.mock;
        search = new Model(endpoint);
        rawTestData = require(APP_ROOT + '/tests/utils/data/postcode-search.json');
        testData = JSON.stringify(rawTestData);
    });

    it('exports a constructor', function () {
        Model.should.be.a('function');
    });

    it('is an instance of Search', function () {
        search.should.be.an.instanceOf(Base);
    });

    describe('Process', function() {

        var baseSearch;

        beforeEach(function () {
            sinon.stub(Base.prototype, 'process').returns(rawTestData);
        });

        afterEach(function () {
            Base.prototype.process.restore();
        });

        it('calls its parent', function () {
            search.process(testData);
            Base.prototype.process.should.have.been.calledOnce;
        });

        it('should return an array of clinics', function () {
            search = new Model(endpoint);
            search.process(testData).should.be.an('array');
        });

    });

    describe('Formatter', function() {

        var clinic;

        beforeEach(function () {
            clinic = rawTestData.result[0];
            sinon.spy(Clinic.prototype, 'format');
        });

        afterEach(function () {
            Clinic.prototype.format.restore();
        });

        it('calls the Clinic model to format items', function () {
            search.formatter(clinic);
            Clinic.prototype.format.should.have.been.calledOnce;
        });

    });

});

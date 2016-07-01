var Search = require(APP_ROOT + '/models/search');
var config = require(APP_ROOT + '/config');
var _ = require('underscore');

describe('Search model: ', function () {

    var search
    var endpoint;

    beforeEach(function () {
        endpoint = config.services.CLINICS_POSTCODE.mock;
        search = new Search(endpoint);
    });

    it('exports a constructor', function () {
        Search.should.be.a('function');
    });

    it('has `fetch`, `process`, `count`, and `group` methods', function () {
        search.fetch.should.be.a('function');
        search.process.should.be.a('function');
        search.count.should.be.a('function');
        search.group.should.be.a('function');
    });

    it('sets an options property', function () {
        search.options.should.equal(endpoint);
    });

    describe('Process', function () {

        it('should parse data as JSON', function () {
            search.process('true').should.equal(true);
            search.process('"foo"').should.equal("foo");
            expect(search.process('null')).to.equal(null);
        });
    });

    describe('Count', function () {

        var testObject = {
            "sub_type": "UNKNOWN",
            "postcode": "SE1 8RT",
            "partial_postcode": "SE1"
        };

        it('should return a number', function () {
            search.count(testObject).should.be.a('number');
        });

        it('should return the number of items in a given object', function () {
            search.count(testObject).should.equal(3);
        });

        it('should return the number of items in a given array', function () {
            var testArray = _.map(testObject, (item) => { return item; });
            search.count(testObject).should.equal(3);
        });

        it('should apply a filter if supplied', function () {
            var testObject = [
                {
                    "sub_type": "UNKNOWN",
                    "postcode": "SE1 8RT",
                    "partial_postcode": "SE2"
                }, {
                    "sub_type": "UNKNOWN",
                    "postcode": "SE1 8RT",
                    "partial_postcode": "SE1"
                }
            ];

            var filter = "partial_postcode";
            var value = "SE1";

            search.count(testObject, filter, value).should.equal(1);
        });
    });

    describe('Group', function () {

        var testObject, groupBy, grouped;

        beforeEach(function () {
            testObject = [
                {
                    "sub_type": "UNKNOWN",
                    "postcode": "SE1 8RT",
                    "partial_postcode": "SE2"
                }, {
                    "sub_type": "UNKNOWN",
                    "postcode": "SE1 8RT",
                    "partial_postcode": "SE1"
                }
            ];
            groupBy = "partial_postcode";
            grouped = search.group(testObject, groupBy);
        });

        it('should return an object', function() {
            grouped.should.be.an('object');
        });

        it('should return an item for each unique "groupBy" value', function() {
            _.size(grouped).should.equal(2);
        });

        it('should return the frequency of each unique "groupBy" value', function() {
            grouped.SE1.should.equal(1);
            grouped.SE2.should.equal(1);
        });

    });

    describe('Fetch', function () {

        var http = require('http');
        var https = require('https');
        var cb;

        beforeEach(function () {

            cb = sinon.stub();
            apiRequest = {
                on: sinon.stub(),
                write: sinon.stub(),
                end: sinon.stub()
            };
            sinon.stub(http, 'request').returns(apiRequest);
        });

        afterEach(function () {
            http.request.restore();
        });

        /*
        it('should callback', function () {
            endpoint = 'http://localhost:3000/stub/postcode-search.json';
            search = new Search(endpoint);
            search.fetch(cb);
            cb.should.have.been.calledOnce;
        });

        it('returns error if the requested service is unavailable', function() {
            endpoint = 'http://localhost:3000/missingapi';
            search = new Search(endpoint);
            search.fetch(function(err, response) {
                expect(err).to.not.be.undefined;
            });
        });
        */
    });
});

var Search = require(APP_ROOT + '/models/clinic-search');
var controller = require(APP_ROOT + '/controllers/clinic-search');
var config = require(APP_ROOT + '/config');

describe('Clinic Search controller: ', function() {

    var testData, rawTestData, total, req, res;

    it('exports an object', function () {
        controller.should.be.an('object');
    });

    describe('Postcode search', function() {

        beforeEach(function () {
            req = {
                params: {
                    code: 'testCode'
                }
            };
            res = {
                json: sinon.stub()
            };
            rawTestData = require(APP_ROOT + '/tests/utils/data/postcode-search.json');
            testData = JSON.stringify(rawTestData);
            total = rawTestData.result.length;
            sinon.stub(Search.prototype, 'fetch').yields(null, testData);
            sinon.spy(Search.prototype, 'formatter');
        });

        afterEach(function () {
            Search.prototype.fetch.restore();
            Search.prototype.formatter.restore();
        });

        it('should use the Search model to fetch data', function() {
            controller.postcode(req, res);
            Search.prototype.fetch.should.have.been.calledOnce;
        });

        it('should run each result through a formatter', function() {
            controller.postcode(req, res);
            Search.prototype.formatter.callCount.should.equal(total);
        });

        it('should respond with search results (in JSON)', function() {
            controller.postcode(req, res);
            res.json.should.have.been.calledOnce;
        });

        /*
        it('should use the configured endpoint', function() {
            controller.postcode(req, res);
            // reqOptions includes config.services.CLINICS_POSTCODE.url should equal true
        });

        it('should use the given area code parameter', function() {
            controller.postcode(req, res);
            // reqOptions includes req.params.code should equal true
        });

        it('should take the first part of a postcode as the area code parameter', function() {
            req.params.code = 'SE1%203PT';
            controller.postcode(req, res);
            // reqOptions includes 'SE1' should equal true
            // reqOptions includes '3PT' should equal false
        });
        */
    });

    describe('Name search', function() {

        beforeEach(function () {
            req = {
                params: {
                    name: 'Eye'
                }
            };
            res = {
                json: sinon.stub()
            };
            rawTestData = require(APP_ROOT + '/tests/utils/data/name-search.json');
            testData = JSON.stringify(rawTestData);
            total = rawTestData.result.length;
            sinon.stub(Search.prototype, 'fetch').yields(null, testData);
            sinon.spy(Search.prototype, 'formatter');
            sinon.spy(Search.prototype, 'count');
        });

        afterEach(function () {
            Search.prototype.fetch.restore();
            Search.prototype.formatter.restore();
            Search.prototype.count.restore();
        });

        it('should use the Search model to fetch data', function() {
            controller.name(req, res);
            Search.prototype.fetch.should.have.been.calledOnce;
        });

        it('should run each result through a formatter', function() {
            controller.name(req, res);
            Search.prototype.formatter.callCount.should.equal(total);
        });

        it('should count results that meet a filter condition', function() {
            controller.name(req, res);
            Search.prototype.count.should.have.been.called;
            Search.prototype.count.should.have.been.calledWith(sinon.match.any, 'is_pims_managed', 'True');
        });

        it('should respond with search results (in JSON)', function() {
            controller.name(req, res);
            res.json.should.have.been.calledOnce;
        });

        /*
        it('should use the configured endpoint', function() {
            controller.name(req, res);
            // reqOptions includes config.services.CLINICS_NAME.url should equal true
        });

        it('should use the given name parameter', function() {
            controller.name(req, res);
            // reqOptions includes req.params.name should equal true
        });
        */
    });

    describe('City search', function() {

        beforeEach(function () {
            req = {
                params: {
                    city: 'London'
                }
            };
            res = {
                json: sinon.stub()
            };
            rawTestData = require(APP_ROOT + '/tests/utils/data/city-search.json');
            testData = JSON.stringify(rawTestData);
            total = rawTestData.result.length;
            sinon.stub(Search.prototype, 'fetch').yields(null, testData);
            sinon.spy(Search.prototype, 'group');
            sinon.spy(Search.prototype, 'count');
        });

        afterEach(function () {
            Search.prototype.fetch.restore();
            Search.prototype.group.restore();
            Search.prototype.count.restore();
        });

        it('should use the Search model to fetch data', function() {
            controller.city(req, res);
            Search.prototype.fetch.should.have.been.calledOnce;
        });

        it('should group results based on area code', function() {
            controller.city(req, res);
            Search.prototype.group.should.have.been.calledOnce;
            Search.prototype.group.should.have.been.calledWith(sinon.match.any, 'partial_postcode');
        });

        it('should count results', function() {
            controller.city(req, res);
            Search.prototype.count.should.have.been.calledOnce;
        });

        it('should respond with search results (in JSON)', function() {
            controller.city(req, res);
            res.json.should.have.been.calledOnce;
        });

        /*
        it('should use the configured endpoint', function() {
            controller.city(req, res);
            // reqOptions includes config.services.CLINICS_CITY.url should equal true
        });

        it('should use the given areacode', function() {
            controller.city(req, res);
            // reqOptions includes req.params.city should equal true
        });
        */
    });

});
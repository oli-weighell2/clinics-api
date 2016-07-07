var config = require('../config');
var _ = require('underscore');
var utils = require('../lib/utils');
var Clinic = require('../models/clinic');
var Search = require('../models/clinic-search');
var search = new Search();

const POSTCODE_SERVICE = config.services.CLINICS_POSTCODE.url;
const NAME_SERVICE = config.services.CLINICS_NAME.url;
const CITY_SERVICE = config.services.CLINICS_CITY.url;

module.exports = {

    postcode: function(req, res, next) {
        // @todo: return a meaningful message if user enters postcode in the wrong format
        search.options = POSTCODE_SERVICE + '?partial_postcode=' + getAreaCode(req.params.code);
        search.fetch(function(err, response) {
            if (err) {
                next(err);
            } else {
                let processed = search.process(response);
                let filtered = search.filter(processed, 'postcode', decodeURIComponent(req.params.code).toUpperCase());
                let results = search.format(filtered);
                res.json(results);
            }
        });
    },

    name: function(req, res, next) {
        search.options = NAME_SERVICE + '?organisation_name=' + encodeURIComponent(req.params.name); // encode name in case not already
        search.fetch(function(err, response) {
            if (err) {
                next(err);
            } else {
                let results = _.map(search.process(response), search.formatter);
                let totalPims = search.count(results, 'is_pims_managed', 'True');
                res.json({
                    results,
                    pims_managed: totalPims
                });
            }
        });
    },

    city: function(req, res, next) {
        search.options = CITY_SERVICE + '?city=' + encodeURIComponent(utils.capitalFirstLetter(req.params.city)); // encode city in case not already
        search.fetch(function(err, response) {
            if (err) {
                next(err);
            } else {
                let groupedByArea = search.group(search.process(response), 'partial_postcode');
                let areaCount = search.count(groupedByArea);
                res.json({
                    results: groupedByArea,
                    total: areaCount
                });
            }
        });
    }
};

function getAreaCode(postcode) {
    let code = decodeURIComponent(postcode.trim());
    let areaCodeLength = code.length < 7 ? 3 : 4;
    return areaCode = utils.strChunk(code, 0, areaCodeLength);
}
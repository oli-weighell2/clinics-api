var config = require('../config');
var _ = require('underscore');
var utils = require('../lib/utils');
var Clinic = require('../models/clinic');
var Search = require('../models/clinic-search');

const POSTCODE_SERVICE = config.services.CLINICS_POSTCODE.url;
const NAME_SERVICE = config.services.CLINICS_NAME.url;
const CITY_SERVICE = config.services.CLINICS_CITY.url;

function getAreaCode(postcode) {
    let code = decodeURIComponent(postcode.trim());
    let areaCodeLength = code.length < 7 ? 3 : 4;
    return areaCode = utils.strChunk(code, 0, areaCodeLength);
}

module.exports = {

    postcode: function(req, res, next) {
        const url = POSTCODE_SERVICE + '?partial_postcode=' + getAreaCode(req.params.code);
        const search = new Search(url);
        search.fetch(function(err, response) {
            if (err) {
                next(err);
            } else {
                let results = _.map(search.process(response), search.formatter);
                res.json(results);
            }
        });
    },

    name: function(req, res, next) {
        const url = NAME_SERVICE + '?organisation_name=' + encodeURIComponent(req.params.name); // encode name in case not already
        const search = new Search(url);
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
        const url = CITY_SERVICE + '?city=' + encodeURIComponent(utils.capitalFirstLetter(req.params.city)); // encode city in case not already
        const search = new Search(url);
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

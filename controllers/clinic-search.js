var config = require('../config');
var _ = require('underscore');
var utils = require('../lib/utils');
var Search = require('../models/search');
var Clinic = require('../models/clinic');

const POSTCODE_SERVICE = config.services.CLINICS_POSTCODE.url;
const NAME_SERVICE = config.services.CLINICS_NAME.url;
const CITY_SERVICE = config.services.CLINICS_CITY.url;

class ClinicSearch extends Search {

    process (data) {
        return super.process(data).result;
    }

    formatter (item) {
        var clinic = new Clinic(item);
        return clinic.format();
    }
}

module.exports = {

    postcode: function(req, res) {
        const url = "http://localhost:3000/stub/postcode-search.json"; //POSTCODE_SERVICE + '?partial_postcode=' + utils.strSplit(req.params.code, 0);
        const search = new ClinicSearch(url);
        search.fetch(function (err, response) {
            let results = _.map(search.process(response), search.formatter);
            res.json(results);
        });
    },

    name: function(req, res) {
        const url = "http://localhost:3000/stub/name-search.json"; // NAME_SERVICE + '?organisation_name=' + req.params.name;
        const search = new ClinicSearch(url);
        search.fetch(function (err, response) {
            let results = _.map(search.process(response), search.formatter);
            let totalPims = search.count(results, 'is_pims_managed', 'True');
            res.json({
                results,
                pims_managed: totalPims
            });
        });
    },

    city: function(req, res) {
        const url = "http://localhost:3000/stub/city-search.json"; // CITY_SERVICE + '?city=' + req.params.city;
        const search = new ClinicSearch(url);
        search.fetch(function (err, response) {
            let groupedByArea = search.group(search.process(response), 'partial_postcode');
            let areaCount = search.count(groupedByArea);
            res.json({
                results: groupedByArea,
                total: areaCount
            });
        });
    }
};

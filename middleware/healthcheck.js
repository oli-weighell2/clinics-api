var config = require('../config');
var _ = require('underscore');
var url = require('url');
var rp = require('request-promise');
var Bluebird = require('bluebird');

const SERVICES = [
    config.services.CLINICS_POSTCODE.url,
    config.services.CLINICS_NAME.url,
    config.services.CLINICS_CITY.url
];

class ServiceChecks {

    constructor (urls) {
        this.options = urls.map((url) => {
            return {
                uri: url,
                resolveWithFullResponse: true,
                time : true,
                simple: false
            };
        });
    }

    init (cb) {
        const requests = this.options.map(service => rp(service));

        Bluebird.all(requests)
            .spread(function () {
                cb(null, arguments);
            })
            .catch(function(err) {
                cb(err);
            });
    }

    format (responses) {
        return _.map(responses, (response) => {
            let pass = this.isHealthy(response);
            let service = url.format(response.request.uri);
            return {
                service,
                isHealthy: pass,
                message: pass ? "" : "request to " + service + " failed, reason: " + response.body,
                time: response.elapsedTime
            };
        });
    }

    isHealthy (response) {
        return (response.statusCode < 399)
            ? true
            : false;
    }

    allHealthy (responses) {
        let fails = _.filter(responses, (response) => {
            return !this.isHealthy(response);
        });

        return fails.length > 0 ? false : true;
    }
}

module.exports = function (req, res, next) {
    const checks = new ServiceChecks(SERVICES);

    checks.init(function(err, responses) {
        if (err) {
            next(err);
        } else {
            res.json({
                isHealthy: checks.allHealthy(responses),
                healthchecks: checks.format(responses)
            });
        }
    });
};


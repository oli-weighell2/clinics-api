var chai = require('chai');

global.should = chai.should();
global.expect = chai.expect;
global.sinon = require('sinon');
global.APP_ROOT = require('path').resolve(__dirname, '../../../');

chai.use(require('sinon-chai'));

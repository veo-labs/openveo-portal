'use strict';

/**
 * @module passport-cas
 */

var util = require('util');
var CAS = process.require('app/server/passport/cas/CAS.js');

/**
 * Creates a cas client interfacing with cas protocol 3.0.
 *
 * @construct
 * @param {Object} options The list of cas strategy options
 */
function CAS3(options) {
  CAS.call(this, options);
}

module.exports = CAS3;
util.inherits(CAS3, CAS);

/**
 * Gets validate uri.
 *
 * It depends on cas server version.
 *
 * @method getValidateUri
 * @return {String} The validate uri
 */
CAS3.prototype.getValidateUri = function() {
  return '/p3/serviceValidate';
};

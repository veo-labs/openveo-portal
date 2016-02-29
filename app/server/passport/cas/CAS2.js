'use strict';

/**
 * @module passport-cas
 */

var util = require('util');
var CAS = process.require('app/server/passport/cas/CAS.js');

/**
 * Creates a cas client interfacing with cas protocol 2.0.
 *
 * @construct
 * @param {Object} options The list of cas strategy options
 */
function CAS2(options) {
  CAS.call(this, options);
}

module.exports = CAS2;
util.inherits(CAS2, CAS);

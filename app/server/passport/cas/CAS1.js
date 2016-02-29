'use strict';

/**
 * @module passport-cas
 */

var util = require('util');
var CAS = process.require('app/server/passport/cas/CAS.js');

/**
 * Creates a cas client interfacing with cas protocol 1.0.
 *
 * @construct
 * @param {Object} options The list of cas strategy options
 */
function CAS1(options) {
  CAS.call(this, options);
}

module.exports = CAS1;
util.inherits(CAS1, CAS);

/**
 * Gets validate uri.
 *
 * @method getValidateUri
 * @return {String} The validate uri
 */
CAS1.prototype.getValidateUri = function() {
  return '/validate';
};

/**
 * Analyzes the validate ticket response from cas server.
 *
 * @async
 * @method analyzeValidateTicketResponse
 * @param {String} response Validate ticket response from cas server
 * @param {Function} callback Function to call when analyzed with :
 *  - **Error** An error if authentication failed or something went wrong, null otherwise
 *  - **String** Success response content
 */
CAS1.prototype.analyzeValidateTicketResponse = function(response, callback) {
  var lines = response.split('\n');
  if (lines[0] === 'yes' && lines.length >= 2)
    return callback(null, lines[1]);
  else if (lines[0] === 'no')
    return callback(new Error('CAS authentication failed.'));
  else
    return callback(new Error('Response from CAS server was bad.'));
};


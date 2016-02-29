'use strict';

/**
 * @module passport-cas
 */

var fs = require('fs');
var path = require('path');
var url = require('url');
var xml2js = require('xml2js');
var http = require('http');
var https = require('https');

/**
 * Creates a cas client.
 *
 * A cas client is responsible of the protocol to communicate with the cas server.
 *
 * @example
 *     e.g. Configuration example
 *     // {
 *     //   "url": "https://openveo-cas.com:8443/cas", // CAS server url
 *     //   "version": "4", // CAS version (could be 1, 2, 3, 4)
 *     //   "certificate": "/home/test/cas.crt" // CAS certificate public key
 *     // }
 *
 * @construct
 * @param {Object} options The list of cas strategy options
 */
function CAS(options) {
  if (!options.url)
    throw new Error('Missing cas server url for cas client');

  if (!options.certificate)
    throw new Error('Missing cas certificate for cas client');

  var urlChunks = url.parse(options.url);

  /**
   * CAS server url.
   *
   * @property url
   * @type String
   */
  this.url = options.url;

  /**
   * Cas server certificate's public key.
   *
   * @property certificate
   * @type String
   */
  this.certificate = options.certificate;

  /**
   * CAS server host.
   *
   * @property host
   * @type String
   */
  this.host = urlChunks.hostname;

  /**
   * CAS server protocol, either http or https.
   *
   * @property protocol
   * @type String
   */
  this.protocol = urlChunks.protocol === 'http:' ? 'http' : 'https';

  /**
   * Either the http or https client of NodeJS.
   *
   * @property httpClient
   * @type Object
   */
  this.httpClient = urlChunks.protocol === 'http:' ? http : https;

  /**
   * CAS server port.
   *
   * @property port
   * @type Number
   */
  this.port = urlChunks.port || (this.protocol === 'http' ? 80 : 443);

  /**
   * CAS server uri (usally /cas).
   *
   * @property path
   * @type String
   */
  this.path = urlChunks.path;

  /**
   * CAS server login uri.
   *
   * @property loginUri
   * @type String
   */
  this.loginUri = this.getLoginUri();

  /**
   * CAS server validate uri.
   *
   * @property validateUri
   * @type String
   */
  this.validateUri = this.getValidateUri();

}

module.exports = CAS;

/**
 * Gets validate uri.
 *
 * @method getValidateUri
 * @return {String} The validate uri
 */
CAS.prototype.getValidateUri = function() {
  return '/serviceValidate';
};

/**
 * Gets login uri.
 *
 * @method getLoginUri
 * @return {String} The login uri
 */
CAS.prototype.getLoginUri = function() {
  return '/login';
};

/**
 * Gets logout uri.
 *
 * @method getLogoutUri
 * @return {String} The logout uri
 */
CAS.prototype.getLogoutUri = function() {
  return '/logout';
};

/**
 * Gets cas server url.
 *
 * @method getUrl
 * @return {String} Cas server url
 */
CAS.prototype.getUrl = function() {
  return this.url;
};

/**
 * Validates a ticket using cas.
 *
 * @async
 * @method validateTicket
 * @param {String} service Cas registered service
 * @param {String} ticket Ticket to validate
 * @return {Function} Function to call when its done with :
 *  - **Error** An error if authentication failed or something went wrong, null otherwise
 *  - **String** User name
 *  - **Object** User attributes
 */
CAS.prototype.validateTicket = function(service, ticket, callback) {
  var self = this;
  var options = {
    hostname: this.host,
    port: this.port,
    path: this.path + this.validateUri + '?service=' + service + '&ticket=' + ticket,
    method: 'GET',
    rejectUnauthorized: process.env.NODE_ENV === 'production',
    ca: fs.readFileSync(path.normalize(this.certificate))
  };

  var request = this.httpClient.request(options, function(response) {
    response.setEncoding('utf8');

    var body = '';
    response.on('data', function(chunk) {
      return body += chunk;
    });

    response.on('end', function() {
      self.analyzeValidateTicketResponse(body, callback);
    });

    response.on('error', function(error) {
      callback(error);
    });

  });

  request.on('error', function(error) {
    callback(error);
  });

  request.end();
};

/**
 * Analyzes the validate ticket response from cas server.
 *
 * @param {String} response Validate ticket response from cas server
 * @param {Function} callback Function to call when analyzed with :
 *  - **Error** An error if authentication failed or something went wrong, null otherwise
 *  - **String** User name
 *  - **Object** User attributes
 */
CAS.prototype.analyzeValidateTicketResponse = function(response, callback) {

  // Parse XML data from CAS server
  xml2js.parseString(response, {
    trim: true,
    mergeAttrs: true,
    normalize: true,
    explicitArray: false,
    tagNameProcessors: [xml2js.processors.firstCharLowerCase, xml2js.processors.stripPrefix]
  }, function(error, results) {
    if (error)
      return callback(error);

    if (!results)
      return callback(new Error('No response from cas server'));

    try {
      var failure = results.serviceResponse.authenticationFailure;
      var success = results.serviceResponse.authenticationSuccess;

      if (failure)
        return callback(new Error(failure.code));
      else if (success)
        return callback(null, success.user, success.attributes);

      return callback(new Error('Unknown error'));
    } catch (e) {
      return callback(e);
    }
  });

};

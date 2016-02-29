'use strict';

/**
 * Defines a passport cas strategy.
 *
 * @module passport-cas
 * @main passport-cas
 */

var util = require('util');
var url = require('url');
var Strategy = require('passport-strategy');

/**
 * Creates a passport cas strategy to authenticate requests using a cas server.
 *
 * @example
 *     e.g. Configuration example
 *     // {
 *     //   "service": "https://openveo-portal.com", // Application service
 *     //   "url": "https://openveo-cas.com:8443/cas", // CAS server url
 *     //   "version": "3", // CAS protocol version (could be 1, 2, 3)
 *     //   "certificate": "/home/test/cas.crt" // CAS certificate public key
 *     // }
 *
 * @construct
 * @param {Object} options The list of cas strategy options
 */
function CasStrategy(options) {
  Strategy.call(this);

  if (!options)
    throw new Error('Missing passport cas strategy options');

  if (!options.service)
    throw new Error('Missing cas service for cas strategy');

  /**
   * Passport cas strategy name.
   *
   * @property cas
   * @type String
   * @default "cas"
   */
  this.name = 'cas';

  /**
   * Application service registered in CAS.
   *
   * @property service
   * @type String
   */
  this.service = options.service;

  /**
   * CAS protocol version.
   *
   * @property version
   * @type String
   */
  this.version = options.version ? options.version : '3';

  try {

    /**
     * CAS client implementation.
     *
     * @property cas
     * @type CAS
     */
    var CAS = process.require('app/server/passport/cas/CAS' + this.version + '.js');
    this.cas = new CAS(options);

  } catch (error) {
    throw new Error('This version of cas is not implemented : ' + error.message);
  }

}

util.inherits(CasStrategy, Strategy);
module.exports = CasStrategy;

/**
 * Authenticates a request using cas.
 *
 * @method authenticate
 * @async
 * @param {Object} request The express authenticate request
 * @param {Object} options Passport authenticate options such as redirects
 */
CasStrategy.prototype.authenticate = function(request, options) {
  if (!request._passport) return this.error(new Error('passport.initialize() middleware not in use'));

  var self = this;

  // Parse request url and cas service urls
  var urlChunks = url.parse(request.originalUrl || request.url, true);
  var serviceChunks = url.parse(this.service);

  if (request.query && request.query.ticket) {

    // Got a ticket to validate

    // Interrogate cas to validate the ticket
    this.cas.validateTicket(url.format({
      protocol: serviceChunks.protocol,
      host: serviceChunks.host,
      pathname: urlChunks.pathname
    }), request.query.ticket, function(error, user, attributes) {
      if (error) {
        var message = 'Authentication failed with message : "' + error.message + '"';
        process.logger.error(message);
        return self.fail(message);
      }

      self.success(user, attributes);
    });

  } else {

    // No ticket, redirect to cas server login page

    // Build login url with service registered in cas server
    var loginUrl = this.cas.getUrl() + url.format({
      pathname: this.cas.getLoginUri(),
      query: {
        service: url.format({
          protocol: serviceChunks.protocol,
          host: serviceChunks.host,
          pathname: urlChunks.pathname,
          query: urlChunks.query
        })
      }
    });

    // Redirect to cas login page
    this.redirect(loginUrl, 307);
  }
};

/**
 * Logouts from cas.
 *
 * @method logout
 * @param {Object} request The express logout request
 * @param {Object} request The express response
 */
CasStrategy.prototype.logout = function(request, response) {
  var serviceChunks = url.parse(this.service);
  var service = url.format({
    protocol: serviceChunks.protocol,
    host: serviceChunks.host
  });

  // Build login url with service registered in cas server
  var logoutUrl = this.cas.getUrl() + url.format({
    pathname: this.cas.getLogoutUri(),
    query: {
      service: service,
      url: service
    }
  });

  // Logout from cas by redirecting to cas logout url
  response.statusCode = 307;
  response.setHeader('Location', logoutUrl);
  response.setHeader('Content-Length', '0');
  response.end();
};

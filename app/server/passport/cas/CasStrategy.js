'use strict';

/**
 * Defines a passport cas strategy.
 *
 * @module passport-cas
 * @main passport-cas
 */

const url = require('url');
const Strategy = require('passport-strategy');

class CasStrategy extends Strategy {

  /**
   * Defines a passport cas strategy to authenticate requests using a cas server.
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
   * @class CasStrategy
   * @constructor
   * @extends Strategy
   * @param {Object} options The list of cas strategy options
   * @param {String} options.service The service to use to authenticate to the CAS server
   * @param {String} options.version The version of the CAS server
   * @param {String} options.url The url of the CAS server
   * @param {String} options.certificate The absolute path to the CAS server certificate
   */
  constructor(options) {
    super();

    if (!options)
      throw new Error('Missing passport cas strategy options');

    if (!options.service)
      throw new Error('Missing cas service for cas strategy');

    const version = options.version ? options.version : '3';
    let cas = null;

    try {
      const CAS = process.require(`app/server/passport/cas/CAS${version}.js`);
      cas = new CAS(options);
    } catch (error) {
      throw new Error(`This version of cas is not implemented : ${error.message}`);
    }

    Object.defineProperties(this, {

      /**
       * Passport cas strategy name.
       *
       * @property cas
       * @type String
       * @default "cas"
       * @final
       */
      name: {
        value: 'cas'
      },

      /**
       * Application service registered in CAS.
       *
       * @property service
       * @type String
       * @final
       */
      service: {
        value: options.service
      },

      /**
       * CAS protocol version.
       *
       * @property version
       * @type String
       * @final
       */
      version: {
        value: version
      },

      /**
       * CAS client implementation.
       *
       * @property cas
       * @type CAS
       * @final
       */
      cas: {
        value: cas
      }

    });

  }

  /**
   * Authenticates a request using cas.
   *
   * @method authenticate
   * @async
   * @param {Object} request The express authenticate request
   * @param {Object} options Passport authenticate options such as redirects
   */
  authenticate(request, options) {
    if (!request._passport) return this.error(new Error('passport.initialize() middleware not in use'));

    const self = this;

    // Parse request url and cas service urls
    const urlChunks = url.parse(request.originalUrl || request.url, true);
    const serviceChunks = url.parse(this.service);

    if (request.query && request.query.ticket) {

      // Got a ticket to validate

      // Interrogate cas to validate the ticket
      this.cas.validateTicket(url.format({
        protocol: serviceChunks.protocol,
        host: serviceChunks.host,
        pathname: urlChunks.pathname
      }), request.query.ticket).then((user) => {
        self.success(user);
      }).catch((error) => {
        const message = `Authentication failed with message : "${error.message}"`;
        process.logger.error(message);
        return self.fail(message);
      });

    } else {

      // No ticket, redirect to cas server login page

      // Build login url with service registered in cas server
      const loginUrl = this.cas.getUrl() + url.format({
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
  }

  /**
   * Logouts from cas.
   *
   * @method logout
   * @param {Object} request The express logout request
   * @param {Object} request The express response
   */
  logout(request, response) {
    const serviceChunks = url.parse(this.service);
    const service = url.format({
      protocol: serviceChunks.protocol,
      host: serviceChunks.host
    });

    // Build login url with service registered in cas server
    const logoutUrl = this.cas.getUrl() + url.format({
      pathname: this.cas.getLogoutUri(),
      query: {
        service,
        url: service
      }
    });

    // Logout from cas by redirecting to cas logout url
    response.statusCode = 307;
    response.setHeader('Location', logoutUrl);
    response.setHeader('Content-Length', '0');
    response.end();
  }

}

module.exports = CasStrategy;

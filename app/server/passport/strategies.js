'use strict';

/**
 * Helps manipulate passport strategies.
 *
 * Strategies can be:
 * - External, which means the authentication is performed using a formular on a third party web site
 * - Internal, which means the authentication is performed using the portal login formular
 *
 * @module passport
 * @main passport
 */

/* eslint no-sync: 0 */
const fs = require('fs');
const passport = require('passport');
const errors = process.require('app/server/httpErrors.js');

/**
 * The list of supported strategies.
 *
 * @property STRATEGIES
 * @type Object
 * @final
 */
module.exports.STRATEGIES = {
  CAS: 'cas',
  LDAP: 'ldapauth'
};

Object.freeze(this.STRATEGIES);

/**
 * Gets an ExpressJS middleware to authenticate requests.
 *
 * @example
 *     // Usage:
 *     // For internal strategies it expects credentials in the request body with
 *     // property names as defined when instanciating the strategy
 *     app.post('/authenticate', function(request, response, next) {
 *       strategies.getAuthenticateMiddleware(strategies.STRATEGIES.LDAP)(request, response, next);
 *     });
 *
 * @method getAuthenticateMiddleware
 * @static
 * @param {String} name The name of the strategy which will perform the authentication
 * @return {Object} A middleware to authenticate requests using the given strategy
 * @throws {Error} An error if strategy has not been found
 */
module.exports.getAuthenticateMiddleware = (name) => {
  switch (name) {

    // CAS
    case this.STRATEGIES.CAS:
      return (request, response, next) => {
        passport.authenticate(name, (error, user) => {

          // An error occurred while authenticating
          // Dispatch the error
          if (error) {
            process.logger.error(error.message, {error: error});
            return next(errors.CAS_AUTHENTICATION_ERROR);
          }

          // No user was found for the given login / password
          // Send back a 401 Not Authorized
          if (!user)
            return next(errors.CAS_AUTHENTICATION_FAILED);

          // Establish a session, authenticate the request
          user = {
            name: user.name,
            groups: user.groups,
            strategy: this.STRATEGIES.CAS
          };
          request.login(user, (loginError) => {
            if (loginError) return next(loginError);
            return response.redirect('/');
          });

        })(request, response, next);
      };

    // LDAP
    case this.STRATEGIES.LDAP:
      return (request, response, next) => {
        passport.authenticate(name, (error, user) => {

          // An error occurred while authenticating
          // Dispatch the error
          if (error) {
            process.logger.error(error.message, {error: error});
            return next(errors.LDAP_AUTHENTICATION_ERROR);
          }

          // No user was found for the given login / password
          // Send back a 401 Not Authorized
          if (!user)
            return next(errors.LDAP_AUTHENTICATION_FAILED);

          // Establish a session, authenticate the request
          user = {
            name: user.cn,
            groups: user.groups || [],
            strategy: this.STRATEGIES.LDAP
          };
          request.login(user, (loginError) => {
            if (loginError) return next(loginError);
            return response.status(200).send(user);
          });

        })(request, response, next);
      };

    default:
      throw new Error(`Unkown strategy ${name}`);
  }
};

/**
 * Gets middleware to logout requests.
 *
 * @example
 *     // Usage:
 *     app.post('/authenticate', function(request, response, next) {
 *       strategies.getAuthenticateMiddleware(strategies.STRATEGIES.LDAP)(request, response, next);
 *     });
 *
 * @method getLogoutMiddleware
 * @static
 * @param {String} name The name of the strategy to use to logout requests
 * @return {Object} A middleware to logout requests using the given strategy
 */
module.exports.getLogoutMiddleware = (name) => {

  // Retrieve strategy from loaded strategies
  const strategyPrototype = passport._strategy(name);

  return (request, response, next) => {
    if (!request.isAuthenticated())
      return next();

    // Logout from passport
    request.logout();

    // Destroy session from session store
    request.session.destroy((error) => {
      if (error)
        process.logger.error(error.message, {error: error});

      const strategy = Object.create(strategyPrototype);

      // Logout from server
      if (strategy.logout)
        strategy.logout(request, response);

      if (name === this.STRATEGIES.LDAP)
        response.status(200).send();
    });
  };

};

/**
 * Gets an instance of a passport strategy.
 *
 * @method get
 * @static
 * @param {String} name The name of the strategy
 * @param {Object} configuration Strategy configuration, it depends on the strategy
 * @return {Object} A passport middleware
 */
module.exports.get = (name, configuration) => {
  if (name && configuration) {
    let Strategy; /* eslint prefer-const: 0*/

    switch (name) {

      // CAS strategy
      case this.STRATEGIES.CAS:
        Strategy = process.require('app/server/passport/cas/CasStrategy.js');
        return new Strategy({
          service: configuration.service,
          url: configuration.url,
          version: configuration.version,
          certificate: configuration.certificate
        });

      // LDAP strategy
      case this.STRATEGIES.LDAP: {
        Strategy = require('passport-ldapauth');
        const attributes = [];
        if (configuration.userNameAttribute) attributes.push(configuration.userNameAttribute);
        if (configuration.groupAttribute) attributes.push(configuration.groupAttribute);

        return new Strategy({
          server: {
            url: configuration.url,
            bindDN: configuration.bindDn,
            bindCredentials: configuration.bindPassword,
            searchBase: configuration.searchBase,
            searchScope: configuration.searchScope,
            searchFilter: configuration.searchFilter,
            searchAttributes: attributes.length ? attributes : null,
            bindProperty: configuration.bindAttribute,
            tlsOptions: {
              ca: configuration.certificate ? fs.readFileSync(configuration.certificate) : null
            }
          },
          usernameField: 'login',
          passwordField: 'password'
        });
      }

      default:
        throw new Error('Unknown authentication mechanism');

    }

  }

  return null;
};

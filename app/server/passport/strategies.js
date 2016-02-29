'use strict';

/**
 * Defines passport strategies.
 *
 * @module passport
 * @main passport
 */

var passport = require('passport');

/**
 * Gets an instance of a passport strategy.
 *
 * @static
 * @method get
 * @param {String} strategyName The name of the strategy
 * @param {Object} configuration Strategy configuration, it depends on the strategy
 * @return {Strategy} A passport strategy
 */
function get(strategyName, configuration) {
  if (strategyName && configuration) {

    // Add a logout method to passport, to be able to logout
    passport.logout = (function(name) {

      // Retrieve strategy from passport
      var strategyPrototype = passport._strategy(name);

      return function logout(request, response, next) {
        if (!request.isAuthenticated())
          return next();

        // Logout from passport
        request.logout();

        var strategy = Object.create(strategyPrototype);

        if (strategy.logout)
          strategy.logout(request, response);
      };
    });

    switch (strategyName) {

      // Cas strategy
      case 'cas':

        // Serialize user into passport session. For cas strategy, no user information is stored outside the
        // session, thus the whole user object can be stored into the session.
        passport.serializeUser(function(user, done) {
          done(null, user);
        });

        // Deserialize user from passport session. For cas strategy, the user information stored inside the
        // session is sufficient.
        passport.deserializeUser(function(user, done) {
          done(null, user);
        });

        var CasStrategy = process.require('app/server/passport/cas/CasStrategy.js');
        return new CasStrategy({
          service: configuration.service,
          url: configuration.url,
          version: configuration.version,
          certificate: configuration.certificate
        });

      default:
        throw new Error('Unknown authentication mechanism');

    }

  }

  return null;
}

module.exports = {
  get: get
};

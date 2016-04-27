'use strict';

/**
 * Defines passport strategies.
 *
 * @module passport
 * @main passport
 */

const path = require('path');
const passport = require('passport');
const openveoAPI = require('@openveo/api');
const configurationDirectoryPath = path.join(openveoAPI.fileSystem.getConfDir(), 'portal');
const conf = require(path.join(configurationDirectoryPath, 'conf.json'));

module.exports = {

  /**
   * Gets an instance of a passport strategy.
   *
   * @static
   * @method get
   * @param {String} strategyName The name of the strategy
   * @param {Object} configuration Strategy configuration, it depends on the strategy
   * @return {Strategy} A passport strategy
   */
  get(strategyName, configuration) {
    if (strategyName && configuration) {
      let Strategy; /* eslint prefer-const: 0*/

      // Add a logout method to passport, to be able to logout
      passport.logout = ((name) => {

        // Retrieve strategy from passport
        const strategyPrototype = passport._strategy(name);

        return (request, response, next) => {
          if (!request.isAuthenticated())
            return next();

          // Logout from passport
          request.logout();

          const strategy = Object.create(strategyPrototype);

          if (strategy.logout)
            strategy.logout(request, response);
        };
      });

      switch (strategyName) {

        // Cas strategy
        case 'cas':

          // Serialize user into passport session. For cas strategy, no user information is stored outside the
          // session, thus the whole user object can be stored into the session.
          passport.serializeUser((user, done) => {
            const usr = {name: user.name};
            usr['groups'] = conf.privateFilter;
            done(null, usr);
          });

          // Deserialize user from passport session. For cas strategy, the user information stored inside the
          // session is sufficient.
          passport.deserializeUser((user, done) => {
            done(null, user);
          });

          Strategy = process.require('app/server/passport/cas/CasStrategy.js');
          return new Strategy({
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
};

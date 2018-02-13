'use strict';

/**
 * @module controllers
 */

const passport = require('passport');
const openVeoApi = require('@openveo/api');
const errors = process.require('app/server/httpErrors.js');
const portalConf = process.require('app/server/conf.js');

class AuthenticationController extends openVeoApi.controllers.Controller {

  /**
   * Defines an AuthenticationController to deal with user authentication.
   *
   * @class AuthenticationController
   * @extends Controller
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Handles user authentication using internal providers (which do not require a redirection to a third party site).
   *
   * @method authenticateInternalAction
   * @async
   * @param {Request} request ExpressJS HTTP Request
   * @param {Object} request.body Request's body
   * @param {String} request.body.login The login
   * @param {String} request.body.password The password
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  authenticateInternalAction(request, response, next) {
    try {
      request.body = openVeoApi.util.shallowValidateObject(request.body, {
        login: {type: 'string', required: true},
        password: {type: 'string', required: true}
      });
    } catch (error) {
      process.logger.error(error.message);
      return next(errors.AUTHENTICATE_INTERNAL_WRONG_PARAMETERS);
    }

    // Get all internal strategies
    const internalStrategies = [];
    Object.keys(passport._strategies).forEach((strategy) => {
      if (passport._strategies[strategy].internal)
        internalStrategies.push(strategy);
    });

    passport.authenticate(internalStrategies, (error, user) => {

      // An error occurred while authenticating
      // Dispatch the error
      if (error) {
        process.logger.error(error.message, {error: error, method: 'authenticateInternalAction'});
        return next(errors.BACK_END_AUTHENTICATION_ERROR);
      }

      // No user was found for the given login / password
      // Send back a 401 Not Authorized
      if (!user)
        return next(errors.BACK_END_AUTHENTICATION_FAILED);

      // Establish a session, authenticate the request
      request.login(user, (loginError) => {
        if (loginError) {
          process.logger.error(loginError.message, {error: loginError, method: 'authenticateInternalAction'});
          return next(errors.BACK_END_AUTHENTICATION_ERROR);
        }

        return response.status(200).send(user);
      });

    })(request, response, next);
  }

  /**
   * Handles user authentication using external providers (which require a redirection on third party site).
   *
   * @method authenticateExternalAction
   * @static
   * @async
   * @param {Request} request ExpressJS HTTP Request
   * @param {Object} request.params Request's parameters
   * @param {String} request.params.type The authentication provider to use
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  authenticateExternalAction(request, response, next) {
    try {
      request.params = openVeoApi.util.shallowValidateObject(request.params, {
        type: {type: 'string', in: Object.values(openVeoApi.passport.STRATEGIES), required: true}
      });
    } catch (error) {
      process.logger.error(error.message);
      return next(errors.AUTHENTICATE_EXTERNAL_WRONG_PARAMETERS);
    }

    passport.authenticate(request.params.type, (error, user) => {

      // An error occurred while authenticating
      // Dispatch the error
      if (error) {
        process.logger.error(error.message, {error: error, method: 'authenticateExternalAction'});
        return next(errors.BACK_END_EXTERNAL_AUTHENTICATION_ERROR);
      }

      // No user was found for the given login / password
      if (!user)
        return next(errors.BACK_END_EXTERNAL_AUTHENTICATION_FAILED);

      // Establish a session, authenticate the request
      request.login(user, (loginError) => {
        if (loginError) {
          process.logger.error(loginError.message, {error: loginError, method: 'authenticateExternalAction'});
          return next(errors.BACK_END_EXTERNAL_AUTHENTICATION_ERROR);
        }

        return response.redirect('/be');
      });

    })(request, response, next);
  }

  /**
   * Logs out user.
   *
   * @method logoutAction
   * @param {Request} request ExpressJS HTTP Request
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  logoutAction(request, response, next) {
    if (!request.isAuthenticated()) return next();

    // Retrieve strategy from loaded strategies
    const strategyPrototype = passport._strategy(request.user.origin);

    // Logout from passport
    request.logout();

    // Destroy session from session store
    request.session.destroy((error) => {
      if (error)
        process.logger.error(error.message, {error: error, method: 'logoutAction'});

      const strategy = Object.create(strategyPrototype);

      // For internal strategies there is nothing more to do
      // For external strategies we have to logout the user from the third party provider
      if (!strategyPrototype.internal && strategy.logout)
        strategy.logout(request, response);
      else
        response.status(200).send();
    });
  }

  /**
   * Checks if current request is authenticated.
   *
   * If not send back an HTTP code 401 with appropriate page.
   * It just go to the next route action if permission is granted.
   *
   * @method restrictAction
   * @static
   * @param {Request} request ExpressJS HTTP Request
   * @param {String} request.url Request's url
   * @param {Object} request.user The connected user
   * @param {String} request.user.id The connected user id
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  restrictAction(request, response, next) {
    let error = errors.BACK_END_UNAUTHORIZED;

    // User is authenticated
    if (request.isAuthenticated()) {
      const superAdminId = portalConf.superAdminId;
      error = errors.BACK_END_FORBIDDEN;

      // Only the super administrator can access the back office
      const webServiceBasePath = portalConf.serverConf.webServiceBasePath;
      const escapedWebServiceBasePath = webServiceBasePath.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
      const logoutRegExp = new RegExp(`^\/be${escapedWebServiceBasePath}logout.*`);
      if (request.user.id === superAdminId || logoutRegExp.test(request.path))
        return next();

    }

    // Not authenticated
    return next(error);

  }

}

module.exports = AuthenticationController;

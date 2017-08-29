'use strict';

/**
 * @module controllers
 */

/**
 * Provides route action to deal with user authentication.
 *
 * @class authenticationController
 * @static
 */

const openVeoApi = require('@openveo/api');
const passportStrategies = process.require('app/server/passport/strategies.js');
const errors = process.require('app/server/httpErrors.js');

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
module.exports.authenticateExternalAction = (request, response, next) => {
  try {
    request.params = openVeoApi.util.shallowValidateObject(request.params, {
      type: {type: 'string', in: Object.values(passportStrategies.STRATEGIES), required: true}
    });
  } catch (error) {
    process.logger.error(error.message);
    return next(errors.AUTHENTICATE_EXTERNAL_WRONG_PARAMETERS);
  }

  passportStrategies.getAuthenticateMiddleware(
    request.params.type
  )(request, response, next);
};

/**
 * Handles user authentication using internal providers (which do not require a redirection to a third party site).
 *
 * @method authenticateInternalAction
 * @static
 * @async
 * @param {Request} request ExpressJS HTTP Request
 * @param {Object} request.body Request's body
 * @param {String} request.body.type The authentication provider to use
 * @param {String} request.body.login The login
 * @param {String} request.body.password The password
 * @param {Response} response ExpressJS HTTP Response
 * @param {Function} next Function to defer execution to the next registered middleware
 */
module.exports.authenticateInternalAction = (request, response, next) => {
  try {
    request.body = openVeoApi.util.shallowValidateObject(request.body, {
      type: {type: 'string', in: Object.values(passportStrategies.STRATEGIES), required: true},
      login: {type: 'string', required: true},
      password: {type: 'string', required: true}
    });
  } catch (error) {
    process.logger.error(error.message);
    return next(errors.AUTHENTICATE_INTERNAL_WRONG_PARAMETERS);
  }

  passportStrategies.getAuthenticateMiddleware(
    request.body.type
  )(request, response, next);
};

/**
 * Handles user logout.
 *
 * @method logoutAction
 * @static
 * @async
 * @param {Request} request ExpressJS HTTP Request
 * @param {Object} request.user Authenticated user
 * @param {String} request.user.strategy The provider which was used to authenticate the user
 * @param {Response} response ExpressJS HTTP Response
 * @param {Function} next Function to defer execution to the next registered middleware
 */
module.exports.logoutAction = (request, response, next) => {
  passportStrategies.getLogoutMiddleware(request.user && request.user.strategy)(request, response, next);
};

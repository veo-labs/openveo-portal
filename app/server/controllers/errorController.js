'use strict';

/**
 * @module controllers
 */

/**
 * Provides route actions to deal with errors.
 *
 * @class errorController
 * @static
 */

const errors = process.require('app/server/httpErrors.js');
const defaultController = process.require('app/server/controllers/defaultController.js');

/**
 * Handles requests which does not correspond to anything.
 *
 * @method notFoundAction
 * @static
 * @async
 * @param {Request} request ExpressJS HTTP Request
 * @param {Response} response ExpressJS HTTP Response
 * @param {Function} next Function to defer execution to the next registered middleware
 */
module.exports.notFoundAction = (request, response, next) => {
  next(errors.PATH_NOT_FOUND);
};

/**
 * Handles all errors.
 *
 * @example
 *     {
 *       "code" : 1,
 *       "httpCode" : 500
 *     }
 *
 * @method errorAction
 * @static
 * @async
 * @param {Object} error An error object with error code, HTTP code and error message
 * @param {Request} request ExpressJS HTTP Request
 * @param {Response} response ExpressJS HTTP Response
 * @param {Function} next Function to defer execution to the next registered middleware
 */
module.exports.errorAction = (error, request, response, next) => {
  if (!error)
    error = errors.UNKNOWN_ERROR;

  process.logger.error('Error', {
    code: error.code,
    method: request.method,
    path: request.url,
    headers: request.headers
  });

   // Send response with HTML content
  if (request.accepts('html') && (error.httpCode == '401' || error.httpCode == '403')) {
    response.status(error.httpCode);
    defaultController.defaultAction(request, response, next);
    return;
  }

  // Send response with JSON content
  response.status(error.httpCode);
  response.send({error: {
    code: error.code,
    message: error.message
  }});
};
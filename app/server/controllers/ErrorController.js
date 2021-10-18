'use strict';

/**
 * @module portal/controllers/ErrorController
 */

const openVeoApi = require('@openveo/api');
const errors = process.require('app/server/httpErrors.js');
const DefaultController = process.require('app/server/controllers/DefaultController.js');

class ErrorController extends openVeoApi.controllers.Controller {

  /**
   * Defines a ErrorController to deal with errors.
   *
   * @class ErrorController
   * @extends Controller
   * @constructor
   * @see {@link https://github.com/veo-labs/openveo-api|OpenVeo API documentation} for more information about Controller
   */
  constructor() {
    super();
  }

  /**
   * Handles requests which does not correspond to anything.
   *
   * @param {Request} request ExpressJS HTTP Request
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  notFoundAction(request, response, next) {
    next(errors.PATH_NOT_FOUND);
  }

  /**
   * Handles all errors.
   *
   * @example
   * {
   *   "code" : 1,
   *   "httpCode" : 500
   * }
   *
   * @param {Object} error An error object with error code, HTTP code and error message
   * @param {Request} request ExpressJS HTTP Request
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  errorAction(error, request, response, next) {
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
      const defaultController = new DefaultController();
      defaultController.defaultAction(request, response, next);
      return;
    }

    // Send response with JSON content
    response.status(error.httpCode);
    response.send({error: {
      code: error.code,
      message: error.message
    }});
  }

}

module.exports = ErrorController;

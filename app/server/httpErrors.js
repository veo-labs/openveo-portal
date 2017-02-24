'use strict';

/**
 * @module portal
 */

/**
 * The list of HTTP errors with, for each error, its associated hexadecimal code and HTTP return code.
 * HTTP errors are sent by {{#crossLinkModule 'controllers'}}{{/crossLinkModule}}.
 *
 * @example
 *     var httpErrors = process.require('app/server/httpErrors.js');
 *     console.log(httpErrors.UNKNOWN_ERROR);
 *
 * @class HTTP_ERRORS
 * @static
 */
var HTTP_ERRORS = {

  // General errors

  /**
   * A server error occurring when no error were specified.
   *
   * @property UNKNOWN_ERROR
   * @type Object
   * @final
   */
  UNKNOWN_ERROR: {
    code: 0x001,
    httpCode: 500
  },

  /**
   * A server error occurring when routes has not been found.
   *
   * @property PATH_NOT_FOUND
   * @type Object
   * @final
   */
  PATH_NOT_FOUND: {
    code: 0x002,
    httpCode: 404
  },

  /**
   * A server error occurring when server configuration is not valid.
   *
   * @property CONF_ERROR
   * @type Object
   * @final
   */
  CONF_ERROR: {
    code: 0x003,
    httpCode: 500,
    message: 'Portal configuration error'
  },

  // VIDEO errors

  /**
   * A server error occurring when getting a video from Web Service failed.
   *
   * @property GET_VIDEO_UNKNOWN
   * @type Object
   * @final
   */
  GET_VIDEO_UNKNOWN: {
    code: 0x101,
    httpCode: 500
  },

  /**
   * A server error occurring when user is not allowed to get a video.
   *
   * @property GET_VIDEO_NOT_ALLOWED
   * @type Object
   * @final
   */
  GET_VIDEO_NOT_ALLOWED: {
    code: 0x102,
    httpCode: 403
  },

  // SEARCH

  /**
   * A server error occurring when searching for videos, using the Web Service, failed.
   *
   * @property SEARCH_ERROR
   * @type Object
   * @final
   */
  SEARCH_ERROR: {
    code: 0x201,
    httpCode: 500
  }
};

Object.freeze(HTTP_ERRORS);
module.exports = HTTP_ERRORS;

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

  /**
   * A server error occurring when authenticating to external provider with wrong parameters.
   *
   * @property AUTHENTICATE_EXTERNAL_WRONG_PARAMETERS
   * @type Object
   * @final
   */
  AUTHENTICATE_EXTERNAL_WRONG_PARAMETERS: {
    code: 0x004,
    httpCode: 400
  },

  /**
   * A server error occurring when authenticating to internal provider with wrong parameters.
   *
   * @property AUTHENTICATE_INTERNAL_WRONG_PARAMETERS
   * @type Object
   * @final
   */
  AUTHENTICATE_INTERNAL_WRONG_PARAMETERS: {
    code: 0x005,
    httpCode: 400
  },

  /**
   * A server error occurring when authenticating the user to CAS.
   *
   * @property CAS_AUTHENTICATION_ERROR
   * @type Object
   * @final
   */
  CAS_AUTHENTICATION_ERROR: {
    code: 0x006,
    httpCode: 500
  },

  /**
   * A server error occurring when user authentication to CAS failed.
   *
   * @property CAS_AUTHENTICATION_FAILED
   * @type Object
   * @final
   */
  CAS_AUTHENTICATION_FAILED: {
    code: 0x007,
    httpCode: 401
  },

  /**
   * A server error occurring when authenticating the user to LDAP.
   *
   * @property LDAP_AUTHENTICATION_ERROR
   * @type Object
   * @final
   */
  LDAP_AUTHENTICATION_ERROR: {
    code: 0x008,
    httpCode: 500
  },

  /**
   * A server error occurring when user authentication to LDAP failed.
   *
   * @property LDAP_AUTHENTICATION_FAILED
   * @type Object
   * @final
   */
  LDAP_AUTHENTICATION_FAILED: {
    code: 0x009,
    httpCode: 401
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

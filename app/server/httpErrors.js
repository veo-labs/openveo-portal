'use strict';

/**
 * @module portal
 */

/**
 * The list of HTTP errors with, for each error, its associated hexadecimal code and HTTP return code.
 * HTTP errors are sent by {{#crossLinkModule 'controllers'}}{{/crossLinkModule}}.
 *
 * @example
 *     const httpErrors = process.require('app/server/httpErrors.js');
 *     console.log(httpErrors.UNKNOWN_ERROR);
 *
 * @class HTTP_ERRORS
 * @static
 */
const HTTP_ERRORS = {

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
   * A server error occurring when server configuration is not valid.
   *
   * @property CONF_ERROR
   * @type Object
   * @final
   */
  CONF_ERROR: {
    code: 0x002,
    httpCode: 500,
    message: 'Portal configuration error'
  },

  /**
   * A server error occurring when searching for videos, using the Web Service, failed.
   *
   * @property SEARCH_ERROR
   * @type Object
   * @final
   */
  SEARCH_ERROR: {
    code: 0x003,
    httpCode: 500
  },

  /**
   * A server error occurring when authenticating the user to the back end.
   *
   * @property BACK_END_AUTHENTICATION_ERROR
   * @type Object
   * @final
   */
  BACK_END_AUTHENTICATION_ERROR: {
    code: 0x004,
    httpCode: 500
  },

  /**
   * A server error occurring when authenticating using an external provider (which require redirection).
   *
   * @property BACK_END_EXTERNAL_AUTHENTICATION_ERROR
   * @type Object
   * @final
   */
  BACK_END_EXTERNAL_AUTHENTICATION_ERROR: {
    code: 0x005,
    httpCode: 500
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
   * A server error occurring when authenticating the user to LDAP.
   *
   * @property LDAP_AUTHENTICATION_ERROR
   * @type Object
   * @final
   */
  LDAP_AUTHENTICATION_ERROR: {
    code: 0x007,
    httpCode: 500
  },

  /**
   * A server error occurring when getting a video from OpenVeo failed.
   *
   * @property GET_VIDEO_ERROR
   * @type Object
   * @final
   */
  GET_VIDEO_ERROR: {
    code: 0x008,
    httpCode: 500
  },

  /**
   * A server error occurring when updating settings.
   *
   * @property UPDATE_SETTINGS_ERROR
   * @type Object
   * @final
   */
  UPDATE_SETTINGS_ERROR: {
    code: 0x009,
    httpCode: 500
  },

  /**
   * A server error occurring when getting a setting.
   *
   * @property GET_SETTING_ERROR
   * @type Object
   * @final
   */
  GET_SETTING_ERROR: {
    code: 0x00a,
    httpCode: 500
  },

  /**
   * A server error occurring when getting OpenVeo groups.
   *
   * @property GET_GROUPS_ERROR
   * @type Object
   * @final
   */
  GET_GROUPS_ERROR: {
    code: 0x00b,
    httpCode: 500
  },

  /**
   * A server error occurring when getting a setting while processing default action.
   *
   * @property DEFAULT_GET_SETTING_ERROR
   * @type Object
   * @final
   */
  DEFAULT_GET_SETTING_ERROR: {
    code: 0x00c,
    httpCode: 500
  },

  /**
   * A server error occurring when getting a setting while processing live action.
   *
   * @property LIVE_GET_SETTING_ERROR
   * @type Object
   * @final
   */
  LIVE_GET_SETTING_ERROR: {
    code: 0x00d,
    httpCode: 500
  },

  /**
   * Getting filters failed when getting custom properties.
   *
   * @property GET_FILTERS_PROPERTIES_ERROR
   * @type Object
   * @final
   */
  GET_FILTERS_PROPERTIES_ERROR: {
    code: 0x00e,
    httpCode: 500
  },

  /**
   * Getting filters failed when getting taxonomy "categories".
   *
   * @property GET_FILTERS_CATEGORIES_ERROR
   * @type Object
   * @final
   */
  GET_FILTERS_CATEGORIES_ERROR: {
    code: 0x00f,
    httpCode: 500
  },

  /**
   * Getting categories failed.
   *
   * @property GET_CATEGORIES_ERROR
   * @type Object
   * @final
   */
  GET_CATEGORIES_ERROR: {
    code: 0x010,
    httpCode: 500
  },

  /**
   * Modifying the number of views of a media failed when getting the media.
   *
   * @property STATISTICS_MEDIA_VIEWS_GET_ONE_ERROR
   * @type Object
   * @final
   */
  STATISTICS_MEDIA_VIEWS_GET_ONE_ERROR: {
    code: 0x011,
    httpCode: 500
  },

  /**
   * Modifying the number of views of a media failed.
   *
   * @property STATISTICS_MEDIA_VIEWS_INCREMENT_ERROR
   * @type Object
   * @final
   */
  STATISTICS_MEDIA_VIEWS_INCREMENT_ERROR: {
    code: 0x012,
    httpCode: 500
  },

  // Not found errors

  /**
   * A server error occurring when routes has not been found.
   *
   * @property PATH_NOT_FOUND
   * @type Object
   * @final
   */
  PATH_NOT_FOUND: {
    code: 0x100,
    httpCode: 404
  },

  /**
   * Getting video failed, video not found.
   *
   * @property GET_VIDEO_NOT_FOUND
   * @type Object
   * @final
   */
  GET_VIDEO_NOT_FOUND: {
    code: 0x101,
    httpCode: 404
  },

  // Authentication errors

  /**
   * A server error occurring when user authentication to CAS failed.
   *
   * @property CAS_AUTHENTICATION_FAILED
   * @type Object
   * @final
   */
  CAS_AUTHENTICATION_FAILED: {
    code: 0x200,
    httpCode: 401
  },

  /**
   * A server error occurring when user authentication to the back end failed using an external provider.
   *
   * @property BACK_END_EXTERNAL_AUTHENTICATION_FAILED
   * @type Object
   * @final
   */
  BACK_END_EXTERNAL_AUTHENTICATION_FAILED: {
    code: 0x201,
    httpCode: 401
  },

  /**
   * A server error occurring when user authentication to LDAP failed.
   *
   * @property LDAP_AUTHENTICATION_FAILED
   * @type Object
   * @final
   */
  LDAP_AUTHENTICATION_FAILED: {
    code: 0x202,
    httpCode: 401
  },

  /**
   * A server error occurring when user authentication to the back end failed.
   *
   * @property BACK_END_AUTHENTICATION_FAILED
   * @type Object
   * @final
   */
  BACK_END_AUTHENTICATION_FAILED: {
    code: 0x203,
    httpCode: 401
  },

  /**
   * A server error occurring when user is not allowed to get a video.
   *
   * @property GET_VIDEO_NOT_ALLOWED
   * @type Object
   * @final
   */
  GET_VIDEO_NOT_ALLOWED: {
    code: 0x204,
    httpCode: 403
  },

  /**
   * A server error occurring when a back office authentication is needed to perform the action.
   *
   * @property BACK_END_UNAUTHORIZED
   * @type Object
   * @final
   */
  BACK_END_UNAUTHORIZED: {
    code: 0x205,
    httpCode: 401
  },

  /**
   * A server error occurring when user connected to the back office is not authorized to perform an action.
   *
   * @property BACK_END_FORBIDDEN
   * @type Object
   * @final
   */
  BACK_END_FORBIDDEN: {
    code: 0x206,
    httpCode: 403
  },

  /**
   * A server error occurring when connected user is not authorized to access live.
   *
   * @property LIVE_FORBIDDEN
   * @type Object
   * @final
   */
  LIVE_FORBIDDEN: {
    code: 0x207,
    httpCode: 403
  },

  // Wrong parameters

  /**
   * A server error occurring when authenticating to external provider with wrong parameters.
   *
   * @property AUTHENTICATE_EXTERNAL_WRONG_PARAMETERS
   * @type Object
   * @final
   */
  AUTHENTICATE_EXTERNAL_WRONG_PARAMETERS: {
    code: 0x300,
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
    code: 0x301,
    httpCode: 400
  },

  /**
   * A server error occurring when getting a setting with missing parameters.
   *
   * @property GET_SETTING_MISSING_PARAMETERS
   * @type Object
   * @final
   */
  GET_SETTING_MISSING_PARAMETERS: {
    code: 0x302,
    httpCode: 400
  },

  /**
   * A server error occurring when updating settings with missing parameters.
   *
   * @property UPDATE_SETTINGS_MISSING_PARAMETERS
   * @type Object
   * @final
   */
  UPDATE_SETTINGS_MISSING_PARAMETERS: {
    code: 0x303,
    httpCode: 400
  },

  /**
   * A server error occurring when updating settings with wrong parameters.
   *
   * @property UPDATE_SETTINGS_WRONG_PARAMETERS
   * @type Object
   * @final
   */
  UPDATE_SETTINGS_WRONG_PARAMETERS: {
    code: 0x304,
    httpCode: 400
  },

  /**
   * Search failed, wrong parameters.
   *
   * @property SEARCH_WRONG_PARAMETERS
   * @type Object
   * @final
   */
  SEARCH_WRONG_PARAMETERS: {
    code: 0x305,
    httpCode: 400
  }

};

Object.freeze(HTTP_ERRORS);
module.exports = HTTP_ERRORS;

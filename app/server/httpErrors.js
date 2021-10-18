'use strict';

/**
 * @module portal/httpErrors
 */

/**
 * The list of HTTP errors with, for each error, its associated hexadecimal code and HTTP return code.
 * HTTP errors are sent by {{#crossLinkModule 'controllers'}}{{/crossLinkModule}}.
 *
 * @example
 * const httpErrors = process.require('app/server/httpErrors.js');
 * console.log(httpErrors.UNKNOWN_ERROR);
 *
 * @namespace
 */
const HTTP_ERRORS = {

  // General errors

  /**
   * A server error occurring when no error were specified.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  UNKNOWN_ERROR: {
    code: 0x001,
    httpCode: 500
  },

  /**
   * A server error occurring when server configuration is not valid.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  CONF_ERROR: {
    code: 0x002,
    httpCode: 500,
    message: 'Portal configuration error'
  },

  /**
   * A server error occurring when searching for videos, using the Web Service, failed.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  SEARCH_ERROR: {
    code: 0x003,
    httpCode: 500
  },

  /**
   * A server error occurring when authenticating the user to the back end.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  BACK_END_AUTHENTICATION_ERROR: {
    code: 0x004,
    httpCode: 500
  },

  /**
   * A server error occurring when authenticating using an external provider (which require redirection).
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  BACK_END_EXTERNAL_AUTHENTICATION_ERROR: {
    code: 0x005,
    httpCode: 500
  },

  /**
   * A server error occurring when authenticating the user to CAS.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  CAS_AUTHENTICATION_ERROR: {
    code: 0x006,
    httpCode: 500
  },

  /**
   * A server error occurring when authenticating the user to LDAP.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  LDAP_AUTHENTICATION_ERROR: {
    code: 0x007,
    httpCode: 500
  },

  /**
   * A server error occurring when getting a video from OpenVeo failed.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  GET_VIDEO_ERROR: {
    code: 0x008,
    httpCode: 500
  },

  /**
   * A server error occurring when updating settings.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  UPDATE_SETTINGS_ERROR: {
    code: 0x009,
    httpCode: 500
  },

  /**
   * A server error occurring when getting a setting.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  GET_SETTING_ERROR: {
    code: 0x00a,
    httpCode: 500
  },

  /**
   * A server error occurring when getting OpenVeo groups.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  GET_GROUPS_ERROR: {
    code: 0x00b,
    httpCode: 500
  },

  /**
   * A server error occurring when getting a setting while processing default action.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  DEFAULT_GET_SETTING_ERROR: {
    code: 0x00c,
    httpCode: 500
  },

  /**
   * A server error occurring when getting a setting while processing live action.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  LIVE_GET_SETTING_ERROR: {
    code: 0x00d,
    httpCode: 500
  },

  /**
   * Getting filters failed when getting custom properties.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  GET_FILTERS_PROPERTIES_ERROR: {
    code: 0x00e,
    httpCode: 500
  },

  /**
   * Getting filters failed when getting taxonomy "categories".
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  GET_FILTERS_CATEGORIES_ERROR: {
    code: 0x00f,
    httpCode: 500
  },

  /**
   * Getting categories failed.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  GET_CATEGORIES_ERROR: {
    code: 0x010,
    httpCode: 500
  },

  /**
   * Modifying the number of views of a media failed when getting the media.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  STATISTICS_MEDIA_VIEWS_GET_ONE_ERROR: {
    code: 0x011,
    httpCode: 500
  },

  /**
   * Modifying the number of views of a media failed.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  STATISTICS_MEDIA_VIEWS_INCREMENT_ERROR: {
    code: 0x012,
    httpCode: 500
  },

  /**
   * Getting promoted videos failed when getting promoted videos setting.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  GET_PROMOTED_VIDEOS_GET_SETTINGS_ERROR: {
    code: 0x013,
    httpCode: 500
  },

  /**
   * Getting promoted videos failed when getting promoted videos.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  GET_PROMOTED_VIDEOS_GET_ONE_ERROR: {
    code: 0x014,
    httpCode: 500
  },

  /**
   * Getting promoted videos failed.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  GET_PROMOTED_VIDEOS_ERROR: {
    code: 0x015,
    httpCode: 500
  },

  /**
   * Getting promoted videos failed when getting videos to fulfill empty slots.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  GET_PROMOTED_VIDEOS_GET_VIDEOS_ERROR: {
    code: 0x016,
    httpCode: 500
  },

  /**
   * Getting promoted videos failed when getting a video.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  GET_PROMOTED_VIDEOS_GET_VIDEO_ERROR: {
    code: 0x017,
    httpCode: 500
  },

  // Not found errors

  /**
   * A server error occurring when routes has not been found.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  PATH_NOT_FOUND: {
    code: 0x100,
    httpCode: 404
  },

  /**
   * Getting video failed, video not found.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  GET_VIDEO_NOT_FOUND: {
    code: 0x101,
    httpCode: 404
  },

  // Authentication errors

  /**
   * A server error occurring when user authentication to CAS failed.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  CAS_AUTHENTICATION_FAILED: {
    code: 0x200,
    httpCode: 401
  },

  /**
   * A server error occurring when user authentication to the back end failed using an external provider.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  BACK_END_EXTERNAL_AUTHENTICATION_FAILED: {
    code: 0x201,
    httpCode: 401
  },

  /**
   * A server error occurring when user authentication to LDAP failed.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  LDAP_AUTHENTICATION_FAILED: {
    code: 0x202,
    httpCode: 401
  },

  /**
   * A server error occurring when user authentication to the back end failed.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  BACK_END_AUTHENTICATION_FAILED: {
    code: 0x203,
    httpCode: 401
  },

  /**
   * A server error occurring when user is not allowed to get a video.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  GET_VIDEO_NOT_ALLOWED: {
    code: 0x204,
    httpCode: 403
  },

  /**
   * A server error occurring when a back office authentication is needed to perform the action.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  BACK_END_UNAUTHORIZED: {
    code: 0x205,
    httpCode: 401
  },

  /**
   * A server error occurring when user connected to the back office is not authorized to perform an action.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  BACK_END_FORBIDDEN: {
    code: 0x206,
    httpCode: 403
  },

  /**
   * A server error occurring when connected user is not authorized to access live.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  LIVE_FORBIDDEN: {
    code: 0x207,
    httpCode: 403
  },

  // Wrong parameters

  /**
   * A server error occurring when authenticating to external provider with wrong parameters.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  AUTHENTICATE_EXTERNAL_WRONG_PARAMETERS: {
    code: 0x300,
    httpCode: 400
  },

  /**
   * A server error occurring when authenticating to internal provider with wrong parameters.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  AUTHENTICATE_INTERNAL_WRONG_PARAMETERS: {
    code: 0x301,
    httpCode: 400
  },

  /**
   * A server error occurring when getting a setting with missing parameters.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  GET_SETTING_MISSING_PARAMETERS: {
    code: 0x302,
    httpCode: 400
  },

  /**
   * A server error occurring when updating settings with missing parameters.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  UPDATE_SETTINGS_MISSING_PARAMETERS: {
    code: 0x303,
    httpCode: 400
  },

  /**
   * A server error occurring when updating settings with wrong parameters.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  UPDATE_SETTINGS_WRONG_PARAMETERS: {
    code: 0x304,
    httpCode: 400
  },

  /**
   * Search failed, wrong parameters.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  SEARCH_WRONG_PARAMETERS: {
    code: 0x305,
    httpCode: 400
  },

  /**
   * Getting promoted videos failed, wrong parameters.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  GET_PROMOTED_VIDEOS_WRONG_PARAMETERS: {
    code: 0x306,
    httpCode: 400
  },

  /**
   * Converting video points of interest failed, wrong parameters.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  CONVERT_VIDEO_POI_WRONG_PARAMETERS: {
    code: 0x307,
    httpCode: 400
  },

  /**
   * A server error occurring when converting video points of interests.
   *
   * @const
   * @type {Object}
   * @inner
   * @default
   */
  CONVERT_VIDEO_POI_ERROR: {
    code: 0x308,
    httpCode: 400
  }

};

Object.freeze(HTTP_ERRORS);
module.exports = HTTP_ERRORS;

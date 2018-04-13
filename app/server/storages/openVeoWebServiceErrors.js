'use strict';

/**
 * @module storages
 */

/**
 * The list of OpenVeo web service errors with, for each error, its associated hexadecimal code.
 *
 * @class openveo-web-service-errors
 * @static
 */
const OPENVEO_ERRORS = {

  /**
   * An error occurring when an unsupported ResourceFilter operation is used.
   *
   * @property BUILD_FILTERS_UNKNOWN_OPERATION_ERROR
   * @type Object
   * @final
   */
  BUILD_FILTERS_UNKNOWN_OPERATION_ERROR: {
    code: 0x001
  }

};

Object.freeze(OPENVEO_ERRORS);
module.exports = OPENVEO_ERRORS;

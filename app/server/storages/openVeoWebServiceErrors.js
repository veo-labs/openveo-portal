'use strict';

/**
 * @module portal/storages/openveVeoWebServiceErrors
 */

/**
 * The list of OpenVeo web service errors with, for each error, its associated hexadecimal code.
 *
 * @namespace
 */
const OPENVEO_ERRORS = {

  /**
   * An error occurring when an unsupported ResourceFilter operation is used.
   *
   * @type {Object}
   * @instance
   * @readonly
   */
  BUILD_FILTERS_UNKNOWN_OPERATION_ERROR: {
    code: 0x001
  }

};

Object.freeze(OPENVEO_ERRORS);
module.exports = OPENVEO_ERRORS;

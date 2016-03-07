'use strict';

/**
 * @module passport-cas
 */

const CAS = process.require('app/server/passport/cas/CAS.js');

/**
 * Defines a cas client interfacing with cas protocol 3.0.
 *
 * @class CAS3
 * @constructor
 * @param {Object} options The list of cas strategy options
 */
class CAS3 extends CAS {

  /**
   * Gets validate uri.
   *
   * It depends on cas server version.
   *
   * @method getValidateUri
   * @return {String} The validate uri
   */
  getValidateUri() {
    return '/p3/serviceValidate';
  }

}

module.exports = CAS3;

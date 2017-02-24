'use strict';

/**
 * @module portal
 */

const OpenVeoClient = require('@openveo/rest-nodejs-client').OpenVeoClient;

/**
 * OpenVeo Web Service client singleton.
 *
 * @property openVeoClient
 * @type OpenVeoClient
 * @private
 */
let openVeoClient = null;

/**
 * Defines a unique OpenVeo Web Service client.
 *
 * @class WebserviceClient
 * @static
 */

/**
 * Creates an OpenVeo Web Service client singleton.
 *
 * @method create
 * @param {Object} [webservicesConf] Web Service configuration
 * @param {String} webservicesConf.path Web Service url
 * @param {String} webservicesConf.clientID Web Service client id
 * @param {String} webservicesConf.secretID Web Service secret id
 */
module.exports.create = function(webservicesConf) {
  if (!openVeoClient) {
    openVeoClient = new OpenVeoClient(
      webservicesConf.path,
      webservicesConf.clientID,
      webservicesConf.secretID
    );
  }
};

/**
 * Gets OpenVeo Web Service client singleton.
 *
 * @method get
 * @return {OpenVeoClient|Null} The Web Service client or null if not created yet
 */
module.exports.get = function() {
  return openVeoClient;
};

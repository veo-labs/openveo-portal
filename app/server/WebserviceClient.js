'use strict';

/**
 * @module core-loaders
 */

/**
 * Provides functions to load migration script.
 *
 * @class migrationLoader
 */

const path = require('path');
const openveoAPI = require('@openveo/api');
const OpenVeoClient = require('@openveo/rest-nodejs-client').OpenVeoClient;
const configurationDirectoryPath = path.join(openveoAPI.fileSystem.getConfDir(), 'portal');

const webservicesConf = require(path.join(configurationDirectoryPath, 'webservicesConf.json'));

// TODO Must verify if certificate file exist or not empty before initialize OpenVeoCLient
// const OPENVEO_CERT = webservicesConf.certificate;
const OPENVEO_URL = webservicesConf.path;
const CLIENT_ID = webservicesConf.clientID;
const CLIENT_SECRET = webservicesConf.secretID;

let openVeoClient;

module.exports.getClient = function() {
  if (!openVeoClient) openVeoClient = new OpenVeoClient(OPENVEO_URL, CLIENT_ID, CLIENT_SECRET);
  return openVeoClient;
};


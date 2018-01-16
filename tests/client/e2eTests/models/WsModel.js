'use strict';

const path = require('path');

const openVeoApi = require('@openveo/api');
const OpenVeoClient = require('@openveo/rest-nodejs-client').OpenVeoClient;
const configurationDirectoryPath = path.join(openVeoApi.fileSystem.getConfDir(), 'portal');

const webservicesConf = require(path.join(configurationDirectoryPath, 'webservicesTestConf.json'));

const OPENVEO_URL = webservicesConf.path;
const CLIENT_ID = webservicesConf.clientID;
const CLIENT_SECRET = webservicesConf.secretID;

class WsModel {
  constructor(type) {
    this.type = type;
    this.openVeoClient = new OpenVeoClient(OPENVEO_URL, CLIENT_ID, CLIENT_SECRET);
  }

  get(entityId, callback) {
    const url = !entityId ? `/publish/${this.type}` : `/publish/${this.type}/${entityId}`;

    this.openVeoClient.get(url)
    .then((response) => {
      callback(null, response.entities);
    })
    .catch((error) => {
      callback(error);
    });
  }

  add(entity, callback) {
    this.openVeoClient.put(`/publish/${this.type}`, entity)
    .then((response) => {
      callback(null, response);
    })
    .catch((error) => {
      callback(error);
    });
  }

  remove(entityIds, callback) {
    const allIds = entityIds.join(',');

    // remove entity
    this.openVeoClient.delete(`/publish/${this.type}/${allIds}`)
    .then((response) => {
      callback(null, response);
    })
    .catch((error) => {
      callback(error);
    });
  }
}

module.exports = WsModel;

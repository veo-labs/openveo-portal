'use strict';

/**
 * @module portal-cache
 */

/**
 * Provides route actions for all requests relative to statistics.
 *
 * @class filterCache
 */

const path = require('path');
const JSONPath = require('jsonpath-plus');

const errors = process.require('app/server/httpErrors.js');
const openveoAPI = require('@openveo/api');
const OpenVeoClient = require('@openveo/openveo-rest-nodejs-client').OpenVeoClient;
const configurationDirectoryPath = path.join(openveoAPI.fileSystem.getConfDir(), 'portal');

const webservicesConf = require(path.join(configurationDirectoryPath, 'webservicesConf.json'));

const OPENVEO_CERT = webservicesConf.certificate;
const OPENVEO_URL = webservicesConf.path;
const CLIENT_ID = webservicesConf.clientID;
const CLIENT_SECRET = webservicesConf.secretID;

const openVeoClient = new OpenVeoClient(OPENVEO_URL, CLIENT_ID, CLIENT_SECRET, OPENVEO_CERT);

const NodeCache = require('node-cache');

// filter are deleted by cache expiration
const filterCache = new NodeCache({stdTTL: 600}); // default ttl: 1mn

// When a cached filter has expired, send count to openveo
filterCache.on('expired', (key, value) => {
  filterCache.del(key);
});

// Get A filter from cache or call the entity from Openveo
module.exports.getFilter = (title, callback) => {
  filterCache.get(`${title}`, (error, filter) => {
    if (error) {
      return callback(error);
    }

    if (filter) { // is cached
      return callback(null, filter);
    }

    openVeoClient.get(`publish/properties?query=${title}`).then((result) => {
      // cache result
      filterCache.set(`${title}`, result);
      callback(null, result);
    }).catch((error) => {
      callback(errors.GET_PROPERTY_UNKNOWN);
    });
  });
};

module.exports.getCategories = (callback) => {
  const key = 'publish-taxo-categories';
  filterCache.get(key, (error, filter) => {
    if (error) {
      return callback(error);
    }

    if (filter) { // is cached
      return callback(null, filter);
    }

    openVeoClient.get('publish/categories').then((result) => {

      const categoriesByKey = {};
      const categoriesIds = JSONPath({json: result, path: '$..*[?(@.id)]'});
      if (categoriesIds && categoriesIds.length != 0)
        categoriesIds.map((obj) => {
          categoriesByKey[obj.id] = obj.title;
          return obj;
        });

        // cache result
      const categories = {
        type: 'list',
        name: 'categories',
        values: categoriesByKey
      };
      filterCache.set(key, categories);
      callback(null, categories);
    }).catch((error) => {
      callback(errors.GET_PROPERTY_UNKNOWN);
    });
  });
};

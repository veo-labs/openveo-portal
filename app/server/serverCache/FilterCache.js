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
const configurationDirectoryPath = path.join(openveoAPI.fileSystem.getConfDir(), 'portal');
const conf = require(path.join(configurationDirectoryPath, 'conf.json'));

const webserviceClient = process.require('/app/server/WebserviceClient');
const openVeoClient = webserviceClient.getClient();

const NodeCache = require('node-cache');

// filter are deleted by cache expiration
const filterCache = new NodeCache({stdTTL: conf.cache.filterTTL}); // default ttl: 1mn

// When a cached filter has expired, send count to openveo
filterCache.on('expired', (key, value) => {
  filterCache.del(key);
});

// Get A filter from cache or call the entity from Openveo
module.exports.getFilter = (id, callback) => {
  filterCache.get(id, (error, filter) => {
    if (error) {
      return callback(error);
    }

    if (filter) { // is cached
      return callback(null, filter);
    }

    openVeoClient.get(`/publish/properties/${id}`).then((result) => {
      // cache result
      filterCache.set(id, result.entity);
      callback(null, result.entity);
    }).catch((error) => {
      process.logger.error(error.message, {error, method: 'FilterCache.getFilter'});
      callback(errors.GET_PROPERTY_UNKNOWN);
    });
  });
};

module.exports.getCategories = (id, callback) => {
  const key = 'publish-taxo-categories-${id}';
  filterCache.get(key, (error, filter) => {
    if (error) {
      return callback(error);
    }

    if (filter) { // is cached
      return callback(null, filter);
    }


    openVeoClient.get(`/taxonomies/${id}`).then((result) => {
      const categoriesByKey = {};
      const categoriesIds = JSONPath({json: result.entity, path: '$..*[?(@.id)]'});
      if (categoriesIds && categoriesIds.length != 0)
        categoriesIds.map((obj) => {
          categoriesByKey[obj.id] = obj.title;
          return obj;
        });

        // cache result
      const categories = {
        id: 'categories',
        type: 'list',
        name: 'categories',
        values: categoriesByKey
      };
      filterCache.set(key, categories);
      callback(null, categories);
    }).catch((error) => {
      process.logger.error(error.message, {error, method: 'FilterCache.getCategories'});
      callback(errors.GET_PROPERTY_UNKNOWN);
    });
  });
};

'use strict';

/**
 * @module serverCache
 */

const JSONPath = require('jsonpath-plus');

const errors = process.require('app/server/httpErrors.js');
const conf = process.require('app/server/conf.js');

const webserviceClient = process.require('/app/server/WebserviceClient');
const openVeoClient = webserviceClient.getClient();

const NodeCache = require('node-cache');

let filterCacheInstance;

/**
 * Provides all caches relative to filter.
 *
 * @class FilterCache
 */
class FilterCache {

  /**
   * Creates a new FilterCache.
   */
  constructor() {
    Object.defineProperties(this, {
      filterCache: {
        value: new NodeCache({stdTTL: conf.data.cache.filterTTL}) // default ttl: 1mn
      }
    });

    // When a cached filter has expired, send count to openveo
    this.filterCache.on('expired', (key, value) => {
      this.filterCache.del(key);
    });
  }

   /**
   * FilterCache singleton getter.
   *
   * @return {FilterCache} filterCacheInstance the FilterCache Singleton
   */
  static getFilterCache() {
    if (!filterCacheInstance)
      filterCacheInstance = new FilterCache();
    return filterCacheInstance;
  }


  // Get A filter from cache or call the entity from Openveo
  getFilter(id, callback) {
    this.filterCache.get(id, (error, filter) => {
      if (error) {
        return callback(error);
      }

      if (filter) { // is cached
        return callback(null, filter);
      }

      openVeoClient.get(`/publish/properties/${id}`).then((result) => {
        // cache result
        this.filterCache.set(id, result.entity);
        callback(null, result.entity);
      }).catch((error) => {
        process.logger.error(error.message, {error, method: 'FilterCache.getFilter'});
        callback(errors.GET_PROPERTY_UNKNOWN);
      });
    });
  }

  getCategories(id, callback) {
    const key = 'publish-taxo-categories-${id}';
    this.filterCache.get(key, (error, filter) => {
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
        this.filterCache.set(key, categories);
        callback(null, categories);
      }).catch((error) => {
        process.logger.error(error.message, {error, method: 'FilterCache.getCategories'});
        callback(errors.GET_PROPERTY_UNKNOWN);
      });
    });
  }

}

module.exports = FilterCache;

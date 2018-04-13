'use strict';

const NodeCache = require('node-cache');

class Cache extends NodeCache {

  /**
   * Defines a cache based on NodeCache.
   *
   * Cache adds the possibility to use wildcards when getting / deleting cache entries.
   *
   * @extends NodeCache
   * @constructor
   * @param {Object} options NodeCache options
   */
  constructor(options) {
    super(options);
  }

  /**
   * Removes cache entries.
   *
   * Override NodeCache.del to implement wildcards to be able to remove all cache entries corresponding to a wildcard.
   * Only wildcard at the end of the entry id is supported, it is not possible to add a wildcard at the beginning of
   * the id.
   *
   * @example
   *     cache.del('entry-id-with-wildcard-*');
   *
   * @method del
   * @param {Array|String} keys The list of keys to delete
   * @param {Function} callback The function to call when its done with:
   * - **Error** An error if something went wrong
   * - **Number** The number of delete entries
   * @return {String} The number of deleted entries
   */
  del(keys, callback) {
    if (Object.prototype.toString.call(keys) !== '[object Array]') keys = [keys];

    let deleteCount = 0;

    for (let key of keys) {

      if (key[key.length - 1] === '*') {

        // Wildcard detected
        key = key.substring(0, key.length - 1);

        // Find all entries with an id starting by the key
        const cacheKeys = this.keys();
        for (let cacheKey of cacheKeys) {
          if (cacheKey.indexOf(key) === 0)
            deleteCount += super.del(cacheKey);
        }

      } else
        deleteCount += super.del(key);

    }

    if (callback) callback(null, deleteCount);
    return deleteCount;
  }

  /**
   * Gets cache entry.
   *
   * Override NodeCache.get to implement wildcards to be able to get all cache entries corresponding to a wildcard.
   * Only wildcard at the end of the entry id is supported, it is not possible to add a wildcard at the beginning of
   * the id.
   *
   * @example
   *     cache.get('entry-id-with-wildcard-*');
   *
   * @method get
   * @param {String} key The key to look for
   * @param {Function} callback The function to call when its done with:
   * - **Error** An error if something went wrong
   * - **Mixed** The value of the cache entry if no wildcard used or the values of the cache entries when a wildcard is
   * used
   * @param {Boolean} errorOnMissing true to throw an error if no cache entry is not found
   * @return {String|Array|Undefined} The value of the cache entry if no wildcard used or the values of the cache
   * entries when a wildcard is used
   * @throws {Error} If entry is not found and errorOnMissing is set to true
   */
  get(key, callback, errorOnMissing) {
    if (typeof callback === 'boolean' && arguments.length === 2)
      errorOnMissing = callback;

    if (key[key.length - 1] === '*') {
      let values = [];

      // Wildcard detected
      key = key.substring(0, key.length - 1);

      // Find all entries with an id starting by the key
      const cacheKeys = this.keys();
      for (let cacheKey of cacheKeys) {
        if (cacheKey.indexOf(key) === 0)
          values.push(super.get(cacheKey));
      }

      if (callback) callback(null, values);
      return values;
    } else {
      let value = super.get(key);

      if (callback) callback(null, value);
      return value;
    }
  }

  /**
   * Gets cache entries.
   *
   * Override NodeCache.mget to implement wildcards to be able to get all cache entries corresponding to a wildcard.
   * Only wildcard at the end of the entry id is supported, it is not possible to add a wildcard at the beginning of
   * the id.
   *
   * @example
   *     cache.mget(['entry-id-with-wildcard-*']);
   *
   * @method mget
   * @param {Array} keys The list of cache entries to fetch
   * @param {Function} callback The function to call when its done with:
   * - **Error** An error if something went wrong
   * - **Object** The values of the cache entries with cache id as the key and cache value as the value
   * @return {Object} The values of the cache entries with cache id as the key and cache value as the value
   */
  mget(keys, callback) {
    const keysToSearch = [];

    for (let key of keys) {
      if (key[key.length - 1] === '*') {

        // Wildcard detected
        key = key.substring(0, key.length - 1);

        // Find all entries with an id starting by the key
        const cacheKeys = this.keys();
        for (let cacheKey of cacheKeys) {
          if (cacheKey.indexOf(key) === 0)
            keysToSearch.push(cacheKey);
        }

      } else
        keysToSearch.push(key);
    }

    return super.mget(keysToSearch, callback);
  }

}

module.exports = Cache;

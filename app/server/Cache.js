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
   * @return {String} The number of deleted entries
   */
  del(keys) {
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
   * @return {String|Array|Undefined} The value of the cache entry if no wildcard used or the values of the cache
   * entries when a wildcard is used
   * @throws {Error} If entry is not found
   */
  get(key) {
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

      return values;
    } else
      return super.get(key);
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
   * @return {Object} The values of the cache entries with cache id as the key and cache value as the value
   */
  mget(keys) {
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

    return super.mget(keysToSearch);
  }

}

module.exports = Cache;

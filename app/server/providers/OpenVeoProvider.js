'use strict';

/**
 * @module portal/providers/OpenVeoProvider
 */

const querystring = require('querystring');
const openVeoApi = require('@openveo/api');
const Cache = process.require('app/server/Cache.js');
const ResourceFilter = openVeoApi.storages.ResourceFilter;

class OpenVeoProvider extends openVeoApi.providers.Provider {

  /**
   * Defines an OpenVeoProvider to interact with OpenVeo web service.
   *
   * @extends OpenVeoProvider
   * @constructor
   * @param {Storage} storage The storage to interact with
   * @param {Cache} [cache] The cache to use. If not specified a 10 seconds cache is created
   * @see {@link https://github.com/veo-labs/openveo-api|OpenVeo API documentation} for more information about Storage
   */
  constructor(storage, cache) {
    super(storage);

    Object.defineProperties(this,

      /** @lends module:portal/providers/OpenVeoProvider~OpenVeoProvider */
      {

        /**
         * The OpenVeo cache.
         *
         * @type {Cache}
         * @instance
         */
        cache: {
          value: cache || new Cache({stdTTL: 10, checkperiod: 10})
        }

      }

    );

    this.cache.on('expired', (key, value) => {
      this.cache.del(key);
    });
  }

  /**
   * Fetches a document.
   *
   * @param {String} location The location of the documents in the storage
   * @param {String} id The id of the document to fetch
   * @param {Object} [fields] Fields to be included or excluded from the resulting documents, by default all
   * fields are returned. Only "exclude" or "include" can be specified, not both
   * @param {Array} [fields.include] The list of fields to include in the response, all other fields are excluded
   * @param {Array} [fields.exclude] The list of fields to exclude from response, all other fields are included. Ignored
   * if include is also specified.
   * @param {Number} [ttl] The duration of the cache for this request (in seconds)
   * @param {module:portal/providers/OpenVeoProvider~OpenVeoProvider~getOneCallback} callback The function to call when
   * it's done
   */
  getOne(location, id, fields, ttl, callback) {
    new Promise((resolve, reject) => {
      let cacheId = `getOne-${location}-${id}-${querystring.stringify(fields)}`;
      let document = this.cache.get(cacheId);
      if (document) return resolve(document);

      this.storage.getOne(location, new ResourceFilter().equal('id', id), fields, (error, fetchedDocument) => {
        if (error) return reject(error);
        this.cache.set(cacheId, fetchedDocument, (ttl === null || ttl === undefined) ? undefined : ttl);
        resolve(fetchedDocument);
      });
    }).then((document) => {
      callback(null, document);
    }).catch((error) => {
      callback(error);
    });
  }

  /**
   * Fetches documents.
   *
   * @param {String} location The location of the documents in the storage
   * @param {ResourceFilter} [filter] Rules to filter documents
   * @param {Object} [fields] Fields to be included or excluded from the resulting documents, by default all
   * fields are returned. Only "exclude" or "include" can be specified, not both
   * @param {Array} [fields.include] The list of fields to include in the response, all other fields are excluded
   * @param {Array} [fields.exclude] The list of fields to exclude from response, all other fields are included. Ignored
   * if include is also specified.
   * @param {Number} [limit] A limit number of documents to retrieve (10 by default)
   * @param {Number} [page] The page number started at 0 for the first page
   * @param {Object} sort The list of fields to sort by with the field name as key and the sort order as
   * value (e.g. {field1: 'asc'}). Sort can be made only on one field
   * @param {Number} [ttl] The duration of the cache for this request (in seconds)
   * @param {module:portal/providers/OpenVeoProvider~OpenVeoProvider~getCallback} callback The function to call when
   * it's done
   */
  get(location, filter, fields, limit, page, sort, ttl, callback) {
    new Promise((resolve, reject) => {
      let fieldsString = querystring.stringify(fields);
      let operationsString = querystring.stringify(this.storage.buildFilter(filter));
      let sortString = querystring.stringify(sort || {});
      let cacheId = `get-${location}-${operationsString}-${fieldsString}-${limit}-${page}-${sortString}`;
      let cacheValue = this.cache.get(cacheId);
      if (cacheValue) return resolve(cacheValue);

      this.storage.get(location, filter, fields, limit, page, sort, (error, fetchedDocuments, pagination) => {
        if (error) return reject(error);

        let result = {
          documents: fetchedDocuments,
          pagination: pagination
        };

        this.cache.set(cacheId, result, (ttl === null || ttl === undefined) ? undefined : ttl);
        resolve(result);
      });

    }).then((result) => {
      callback(null, result.documents, result.pagination);
    }).catch((error) => {
      callback(error);
    });
  }

  /**
   * Gets all documents from storage iterating on all pages.
   *
   * @param {String} location The location of the documents in the storage
   * @param {ResourceFilter} [filter] Rules to filter documents
   * @param {Object} [fields] Fields to be included or excluded from the resulting documents, by default all
   * fields are returned. Only "exclude" or "include" can be specified, not both
   * @param {Array} [fields.include] The list of fields to include in the response, all other fields are excluded
   * @param {Array} [fields.exclude] The list of fields to exclude from response, all other fields are included. Ignored
   * if include is also specified.
   * @param {Object} sort The list of fields to sort by with the field name as key and the sort order as
   * value (e.g. {field1: 'asc'}). Sort can be made only on one field
   * @param {Number} [ttl] The duration of the cache for this request (in seconds)
   * @param {module:portal/providers/OpenVeoProvider~OpenVeoProvider~getAllCallback} callback The function to call when
   * it's done
   */
  getAll(location, filter, fields, sort, ttl, callback) {
    let allDocuments = [];
    let page = 0;

    const getDocuments = (callback) => {
      this.get(location, filter, fields, null, page, sort, ttl, function(error, documents, pagination) {
        if (error) return callback(error);

        allDocuments = allDocuments.concat(documents);

        if (page < pagination.pages - 1) {

          // There are other pages
          // Get next page
          page++;
          getDocuments(callback);

        } else {

          // No more pages
          // End it
          callback(null);

        }
      });
    };

    getDocuments(function(error) {
      callback(error, allDocuments);
    });
  }

  /**
   * Updates a document.
   *
   * @param {String} location The location of the document in the storage
   * @param {String} id The id of the document to update
   * @param {Object} data The modifications to perform
   * @param {module:portal/providers/OpenVeoProvider~OpenVeoProvider~updateOneCallback} callback The function to call
   * when it's done
   */
  updateOne(location, id, data, callback) {
    this.storage.updateOne(location, new ResourceFilter().equal('id', id), data, (error, total) => {
      this.executeCallback(callback, error, total);
    });
  }

  /**
   * Convert a video Point of Interest
   *
   * @param {String} videoId The id of the video to convert
   * @param {Number} duration The duration of the video in ms
   * @param {module:portal/providers/OpenVeoProvider~OpenVeoProvider~convertVideoPoiCallback} callback The function to
   * call when it's done
   */
  convertVideoPoi(videoId, duration, callback) {
    this.storage.convertVideoPoi(videoId, duration, (error, video) => {
      this.executeCallback(callback, error, video);
    });
  }

  /**
   * Deletes cache of a document.
   *
   * @param {String} location The location of the document in the storage
   * @param {String} id The id of the document to remove from cache
   * @param {Boolean} alsoRemoveFromPages Also remove cache entries containing the document (paginated results)
   * @return {Number} The number of removed entries
   */
  deleteDocumentCache(location, id, alsoRemoveFromPages) {
    let deleteCount = 0;

    if (!location || !id) return deleteCount;

    deleteCount += this.cache.del(`getOne-${location}-${id}-*`);

    if (alsoRemoveFromPages) {

      // Find cache entries referencing the document
      const cacheValues = this.cache.mget([`get-${location}-*`]);

      for (let cacheId in cacheValues) {
        let result = cacheValues[cacheId];

        for (let document of result.documents) {
          if (document.id === id)
            deleteCount += this.cache.del(cacheId);
        }
      }

    }

    return deleteCount;
  }

  /**
   * Deletes all cache entries associated to a location.
   *
   * @param {String} location The location of the documents in the storage
   * @return {Number} The number of removed entries
   */
  deleteLocationCache(location) {
    let deleteCount = 0;

    if (!location) return deleteCount;

    deleteCount += this.cache.del(`get-${location}-*`);
    deleteCount += this.cache.del(`getOne-${location}-*`);

    return deleteCount;
  }

}

module.exports = OpenVeoProvider;

/**
 * @callback module:portal/providers/OpenVeoProvider~OpenVeoProvider~getOneCallback
 * @param {(Error|undefined)} error The error if an error occurred
 * @param {Object} result The document
 */

/**
 * @callback module:portal/providers/OpenVeoProvider~OpenVeoProvider~getCallback
 * @param {(Error|undefined)} error The error if an error occurred
 * @param {Array} result The list of retrieved documents
 * @param {Object} pagination Pagination information
 * @param {Number} pagination.limit The specified limit
 * @param {Number} pagination.page The actual page
 * @param {Number} pagination.pages The total number of pages
 * @param {Number} pagination.size The total number of documents
 */

/**
 * @callback module:portal/providers/OpenVeoProvider~OpenVeoProvider~getAllCallback
 * @param {(Error|undefined)} error The error if an error occurred
 * @param {Array} result The list of documents
 */

/**
 * @callback module:portal/providers/OpenVeoProvider~OpenVeoProvider~updateOneCallback
 * @param {(Error|undefined)} error The error if an error occurred
 * @param {Number} total 1 if everything went fine
 */

/**
 * @callback module:portal/providers/OpenVeoProvider~OpenVeoProvider~convertVideoPoiCallback
 * @param {(Error|undefined)} error The error if an error occurred
 * @param {Object} video The video with converted POI
 */

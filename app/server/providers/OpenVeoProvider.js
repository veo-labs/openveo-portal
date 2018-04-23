'use strict';

/**
 * @module providers
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
   */
  constructor(storage, cache) {
    super(storage);

    Object.defineProperties(this, {

      /**
       * The OpenVeo cache.
       *
       * @property cache
       * @type Cache
       * @final
       */
      cache: {
        value: cache || new Cache({stdTTL: 10, checkperiod: 10})
      }

    });

    this.cache.on('expired', (key, value) => {
      this.cache.del(key);
    });
  }

  /**
   * Fetches a document.
   *
   * @method getOne
   * @async
   * @param {String} location The location of the documents in the storage
   * @param {String} id The id of the document to fetch
   * @param {Object} [fields] Fields to be included or excluded from the resulting documents, by default all
   * fields are returned. Only "exclude" or "include" can be specified, not both
   * @param {Array} [fields.include] The list of fields to include in the response, all other fields are excluded
   * @param {Array} [fields.exclude] The list of fields to exclude from response, all other fields are included. Ignored
   * if include is also specified.
   * @param {Number} [ttl] The duration of the cache for this request (in seconds)
   * @param {Function} callback The function to call when it's done
   *   - **Error** The error if an error occurred, null otherwise
   *   - **Object** The document
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
   * @method get
   * @async
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
   * @param {Function} callback The function to call when it's done
   *   - **Error** The error if an error occurred, null otherwise
   *   - **Array** The list of retrieved documents
   *   - **Object** Pagination information
   *     - **Number** limit The specified limit
   *     - **Number** page The actual page
   *     - **Number** pages The total number of pages
   *     - **Number** size The total number of documents
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
   * @method getAll
   * @async
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
   * @param {Function} callback Function to call when it's done with:
   *  - **Error** An error if something went wrong, null otherwise
   *  - **Array** The list of documents
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
   * @method updateOne
   * @async
   * @param {String} location The location of the document in the storage
   * @param {String} id The id of the document to update
   * @param {Object} data The modifications to perform
   * @param {Function} [callback] The function to call when it's done
   *   - **Error** The error if an error occurred, null otherwise
   *   - **Number** 1 if everything went fine
   */
  updateOne(location, id, data, callback) {
    this.storage.updateOne(location, new ResourceFilter().equal('id', id), data, (error, total) => {
      this.executeCallback(callback, error, total);
    });
  }

  /**
   * Convert a video Point of Interest
   *
   * @method convertVideoPoi
   * @async
   * @param {String} videoId The id of the video to convert
   * @param {Number} duration The duration of the video in ms
   * @param {Function} [callback] The function to call when it's done
   *   - **Error** The error if an error occured, null otherwise
   *   - **Video** The video with converted POI
   */
  convertVideoPoi(videoId, duration, callback) {
    this.storage.convertVideoPoi(videoId, duration, (error, video) => {
      this.executeCallback(callback, error, video);
    });
  }

  /**
   * Deletes cache of a document.
   *
   * @method deleteDocumentCache
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
   * @method deleteLocationCache
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

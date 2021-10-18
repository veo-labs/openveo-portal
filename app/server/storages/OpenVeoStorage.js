'use strict';

/**
 * @module portal/storages/OpenVeoStorage
 */

const querystring = require('querystring');
const openVeoApi = require('@openveo/api');
const OpenVeoClient = require('@openveo/rest-nodejs-client').OpenVeoClient;
const OPENVEO_ERRORS = process.require('app/server/storages/openVeoWebServiceErrors.js');
const ResourceFilter = openVeoApi.storages.ResourceFilter;
const StorageError = openVeoApi.storages.StorageError;

class OpenVeoStorage extends openVeoApi.storages.Storage {

  /**
   * Defines an OpenVeo web service storage.
   *
   * @class Storage
   * @extends Storage
   * @constructor
   * @param {Object} configuration OpenVeo web service configuration
   * @param {String} configuration.path OpenVeo web service server URL
   * @param {String} configuration.clientId OpenVeo web service client id
   * @param {String} configuration.secretId OpenVeo web service client secret
   * @param {String} [configuration.certificate] Path to OpenVeo web service full chain certificate if the root
   * authority is not part of system well known authorities
   * @see {@link https://github.com/veo-labs/openveo-api|OpenVeo API documentation} for more information about Storage
   */
  constructor(configuration) {
    super(configuration);

    Object.defineProperties(this,

      /** @lends module:portal/storages/OpenVeoStorage~OpenVeoStorage */
      {

        /**
         * The OpenVeo web service client.
         *
         * @type {OpenVeoClient}
         * @instance
         * @readonly
         */
        client: {
          value: new OpenVeoClient(
            configuration.path,
            configuration.clientID,
            configuration.secretID,
            configuration.certificate
          )
        }

      }

    );
  }

  /**
   * Builds OpenVeo web service filter from a ResourceFilter.
   *
   * @param {ResourceFilter} [resourceFilter] The filter
   * @return {Object} The filter with fields as keys and fields values as values
   * @throws {TypeError} If an operation is not supported
   */
  buildFilter(resourceFilter) {
    let filter = {};

    if (!resourceFilter) return filter;

    for (let operation of resourceFilter.operations) {
      switch (operation.type) {
        case ResourceFilter.OPERATORS.EQUAL:
          filter[operation.field] = operation.value;
          break;
        case ResourceFilter.OPERATORS.IN:
          filter[operation.field] = operation.value;
          break;
        case ResourceFilter.OPERATORS.SEARCH:
          filter['query'] = operation.value;
          break;
        default:
          throw new StorageError(
            `Operation ${operation.type} not supported`,
            OPENVEO_ERRORS.BUILD_FILTERS_UNKNOWN_OPERATION_ERROR
          );
      }
    }

    return filter;
  }

  /**
   * Builds OpenVeo web service sort.
   *
   * Only the first found field will we used as a sort field.
   *
   * @param {Object} [sort] The list of fields to sort by with the field name as key and the sort order as
   * value (e.g. {field1: 'asc'})
   * @return {Object} The sort descriptor with sortBy and sortOrder properties
   */
  buildSort(sort) {
    let sortDescription = {};

    if (!sort) return sortDescription;

    for (let field in sort) {
      sortDescription.sortBy = field;
      sortDescription.sortOrder = sort[field];
      break;
    }

    return sortDescription;
  }

  /**
   * Fetches documents from the collection.
   *
   * @param {String} collection The endpoint to work on
   * @param {ResourceFilter} [filter] Rules to filter documents
   * @param {Object} [fields] Expected resource fields to be included or excluded from the response, by default all
   * fields are returned. Only "exclude" or "include" can be specified, not both
   * @param {Array} [fields.include] The list of fields to include in the response, all other fields are excluded
   * @param {Array} [fields.exclude] The list of fields to exclude from response, all other fields are included. Ignored
   * if include is also specified.
   * @param {Number} [limit] A limit number of documents to retrieve (10 by default)
   * @param {Number} [page] The page number started at 0 for the first page
   * @param {Object} sort The list of fields to sort by with the field name as key and the sort order as
   * value (e.g. {field1: 'asc'})
   * @param {module:portal/storages/OpenVeoStorage~OpenVeoStorage~getCallback} callback The function to call when it's
   * done
   */
  get(collection, filter, fields, limit, page, sort, callback) {
    let queryString;
    limit = limit || 10;
    fields = fields || {};
    page = page || 0;

    let query = {
      page,
      limit
    };
    openVeoApi.util.merge(query, this.buildFilter(filter));
    openVeoApi.util.merge(query, this.buildSort(sort));
    openVeoApi.util.merge(query, fields);
    queryString = querystring.stringify(query);
    queryString = queryString ? `?${queryString}` : queryString;

    this.client.get(`${collection}${queryString}`).then((response) => {
      callback(null, response.entities, response.pagination);
    }).catch(callback);
  }

  /**
   * Convert video Points Of Interests
   *
   * @param {String} videoId The id of the video to convert
   * @param {Number} duration The duration in milliseconds of the video
   * @param {module:portal/storages/OpenVeoStorage~OpenVeoStorage~convertVideoPoiCallback} callback The function to
   * call when it's done
   */
  convertVideoPoi(videoId, duration, callback) {
    this.client
      .post(`publish/videos/${videoId}/poi/convert`, {duration: duration})
      .then((response) => {
        callback(null, response.entity);
      })
      .catch(callback);
  }

  /**
   * Updates a document from collection.
   *
   * @param {String} collection The endpoint to work on
   * @param {ResourceFilter} [filter] Rules to filter document to update. Must contain an equal operation with a field
   * "id"
   * @param {Object} data The modifications to perform
   * @param {module:portal/storages/OpenVeoStorage~OpenVeoStorage~updateOneCallback} callback The function to call when
   * it's done
   */
  updateOne(collection, filter, data, callback) {
    let id = filter.getComparisonOperation(ResourceFilter.OPERATORS.EQUAL, 'id').value;

    this.client
      .post(`${collection}/${id}`, data)
      .then((response) => {
        callback(null, response.total);
      })
      .catch(callback);
  }

  /**
   * Fetches a single document from the collection.
   *
   * @param {String} collection The endpoint to work on
   * @param {ResourceFilter} [filter] Rules to filter documents
   * @param {Object} [fields] Expected document fields to be included or excluded from the response, by default all
   * fields are returned. Only "exclude" or "include" can be specified, not both
   * @param {Array} [fields.include] The list of fields to include in the response, all other fields are excluded
   * @param {Array} [fields.exclude] The list of fields to exclude from response, all other fields are included. Ignored
   * if include is also specified.
   * @param {module:portal/storages/OpenVeoStorage~OpenVeoStorage~getOneCallback} callback The function to call when
   * it's done
   */
  getOne(collection, filter, fields, callback) {
    let id = filter.getComparisonOperation(ResourceFilter.OPERATORS.EQUAL, 'id').value;
    let query = {};
    let queryString;
    fields = fields || {};

    openVeoApi.util.merge(query, fields);
    queryString = querystring.stringify(query);
    queryString = queryString ? `?${queryString}` : queryString;

    this.client.get(`${collection}/${id}${queryString}`).then((response) => {
      callback(null, response.entity);
    }).catch(callback);
  }

}

module.exports = OpenVeoStorage;

/**
 * @callback module:portal/storages/OpenVeoStorage~OpenVeoStorage~getCallback
 * @param {(Error|undefined)} error The error if an error occurred
 * @param {Array} results The list of retrieved documents
 * @param {Object} pagination Pagination information
 * @param {Number} pagination.limit The specified limit
 * @param {Number} pagination.page The actual page
 * @param {Number} pagination.pages The total number of pages
 * @param {Number} pagination.size The total number of documents
 */

/**
 * @callback module:portal/storages/OpenVeoStorage~OpenVeoStorage~convertVideoPoiCallback
 * @param {(Error|undefined)} error The error if an error occurred
 * @param {Object} result The video with converted POI
 */

/**
 * @callback module:portal/storages/OpenVeoStorage~OpenVeoStorage~updateOneCallback
 * @param {(Error|undefined)} error The error if an error occurred
 * @param {Number} total 1 if everything went fine
 */

/**
 * @callback module:portal/storages/OpenVeoStorage~OpenVeoStorage~getOneCallback
 * @param {(Error|undefined)} error The error if an error occurred
 * @param {Object} result The document
 */

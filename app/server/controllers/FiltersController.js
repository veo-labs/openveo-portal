'use strict';

/**
 * @module controllers
 */

const async = require('async');
const JSONPath = require('jsonpath-plus');
const openVeoApi = require('@openveo/api');
const context = process.require('/app/server/context.js');
const portalConf = process.require('app/server/conf.js');
const HTTP_ERRORS = process.require('app/server/httpErrors.js');

class FiltersController extends openVeoApi.controllers.Controller {

  /**
   * Defines a FiltersController to deal with video filters.
   *
   * @class FiltersController
   * @extends Controller
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Gets the list of available video filters (both custom properties and categories).
   *
   * @method getFiltersAction
   * @async
   * @param {Request} request ExpressJS HTTP Request
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  getFiltersAction(request, response, next) {
    const filters = [];
    const asyncFunctions = [];
    const filtersId = portalConf.conf.exposedFilter;
    const categoriesId = portalConf.conf.categoriesFilter;

    if (categoriesId) {
      asyncFunctions.push((callback) => {

        context.openVeoProvider.getOne(
          '/taxonomies',
          categoriesId,
          null,
          portalConf.conf.cache.filterTTL,
          (error, taxonomy) => {
            if (error) {
              process.logger.error(error.message, {error, method: 'getFiltersAction'});
              return callback(HTTP_ERRORS.GET_FILTERS_CATEGORIES_ERROR);
            }

            if (taxonomy) {
              const categories = {};
              const categoriesIds = JSONPath({json: taxonomy, path: '$..*[?(@.id)]'});
              if (categoriesIds && categoriesIds.length) {
                categoriesIds.map((obj) => {
                  categories[obj.id] = obj.title;
                  return obj;
                });

                filters.push({
                  id: 'categories',
                  type: 'list',
                  name: 'categories',
                  values: categories
                });
              }
            }
            callback();
          }
        );
      });
    }

    for (let id of filtersId) {
      asyncFunctions.push((callback) => {
        context.openVeoProvider.getOne(
          '/publish/properties',
          id,
          null,
          portalConf.conf.cache.filterTTL,
          (error, property) => {
            if (error) {
              process.logger.error(error.message, {error: error, method: 'getFiltersAction'});
              return callback(HTTP_ERRORS.GET_FILTERS_PROPERTIES_ERROR);
            }

            if (property && property.type !== 'boolean') filters.push(property);
            callback();
          }
        );
      });
    }

    async.parallel(asyncFunctions, (error) => {
      if (error) return next(error);
      response.send(filters);
    });
  }

}

module.exports = FiltersController;

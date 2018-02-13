'use strict';

/**
 * @module controllers
 */

const async = require('async');
const openVeoApi = require('@openveo/api');
const filterCache = process.require('/app/server/serverCache/FilterCache.js');
const portalConf = process.require('app/server/conf.js');

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
   * Gets the list of available video filters.
   *
   * @method getFiltersAction
   * @async
   * @param {Request} request ExpressJS HTTP Request
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  getFiltersAction(request, response, next) {
    const filterCacheInstance = filterCache.getFilterCache();
    const filters = [];
    const series = [];
    const filtersId = portalConf.conf.exposedFilter;
    const categoriesId = portalConf.conf.categoriesFilter;
    if (categoriesId && categoriesId != '')
      series.push((callback) => {
        filterCacheInstance.getCategories(categoriesId, (error, categories) => {
          if (categories) {
            filters.push(categories);
          }
          callback();
        });
      });

    for (let i = 0; i < filtersId.length; i++) {
      series.push((callback) => {
        filterCacheInstance.getFilter(filtersId[i], (error, filter) => {
          if (filter && filter.type !== 'boolean') {
            filters.push(filter);
          }
          callback();
        });
      });
    }

    async.series(series, () => {
      response.send(filters);
    });
  }

}

module.exports = FiltersController;

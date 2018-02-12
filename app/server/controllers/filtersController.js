'use strict';

/**
 * @module controllers
 */

/**
 * Provides route actions about video filters.
 *
 * @class filtersController
 * @static
 */

const async = require('async');
const filterCache = process.require('/app/server/serverCache/FilterCache.js');
const portalConf = process.require('app/server/conf.js');

/**
 * Gets the list of available video filters.
 *
 * @method getFiltersAction
 * @static
 * @async
 * @param {Request} request ExpressJS HTTP Request
 * @param {Response} response ExpressJS HTTP Response
 * @param {Function} next Function to defer execution to the next registered middleware
 */
module.exports.getFiltersAction = (request, response, next) => {
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
};

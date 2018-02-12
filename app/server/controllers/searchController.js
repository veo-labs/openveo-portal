'use strict';

/**
 * @module controllers
 */

/**
 * Provides route actions for the search engine.
 *
 * @class searchController
 * @static
 */

const async = require('async');
const portalConf = process.require('app/server/conf.js');
const filterCache = process.require('/app/server/serverCache/FilterCache');

module.exports.getSearchFiltersAction = (request, response, next) => {
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

module.exports.getCategoriesAction = (request, response, next) => {
  const filterCacheInstance = filterCache.getFilterCache();
  filterCacheInstance.getCategories(portalConf.conf.categoriesFilter, (error, categories) => {
    if (error) {
      next(error);
      return;
    } else {
      response.send(categories);
    }
  });
};

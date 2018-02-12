'use strict';

/**
 * @module controllers
 */

/**
 * Provides route actions about OpenVeo Publish categories.
 *
 * @class categoriesController
 * @static
 */

const filterCache = process.require('app/server/serverCache/FilterCache.js');
const portalConf = process.require('app/server/conf.js');

/**
 * Gets OpenVeo Publish categories.
 *
 * @method getCategoriesAction
 * @static
 * @async
 * @param {Request} request ExpressJS HTTP Request
 * @param {Response} response ExpressJS HTTP Response
 * @param {Function} next Function to defer execution to the next registered middleware
 */
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

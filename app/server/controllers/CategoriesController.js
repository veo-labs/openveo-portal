'use strict';

/**
 * @module controllers
 */

const openVeoApi = require('@openveo/api');
const filterCache = process.require('app/server/serverCache/FilterCache.js');
const portalConf = process.require('app/server/conf.js');

class CategoriesController extends openVeoApi.controllers.Controller {

  /**
   * Defines a CategoriesController to deal with OpenVeo Publish categories.
   *
   * @class CategoriesController
   * @extends Controller
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Gets OpenVeo Publish categories.
   *
   * @method getCategoriesAction
   * @async
   * @param {Request} request ExpressJS HTTP Request
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  getCategoriesAction(request, response, next) {
    const filterCacheInstance = filterCache.getFilterCache();
    filterCacheInstance.getCategories(portalConf.conf.categoriesFilter, (error, categories) => {
      if (error) {
        next(error);
        return;
      } else {
        response.send(categories);
      }
    });
  }

}

module.exports = CategoriesController;

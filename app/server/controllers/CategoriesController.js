'use strict';

/**
 * @module portal/controllers/CategoriesController
 */

const JSONPath = require('jsonpath-plus').JSONPath;
const openVeoApi = require('@openveo/api');
const portalConf = process.require('app/server/conf.js');
const context = process.require('app/server/context.js');
const HTTP_ERRORS = process.require('app/server/httpErrors.js');

class CategoriesController extends openVeoApi.controllers.Controller {

  /**
   * Defines a CategoriesController to deal with OpenVeo Publish categories.
   *
   * @class CategoriesController
   * @extends Controller
   * @constructor
   * @see {@link https://github.com/veo-labs/openveo-api|OpenVeo API documentation} for more information about Controller
   */
  constructor() {
    super();
  }

  /**
   * Gets OpenVeo Publish categories.
   *
   * @param {Request} request ExpressJS HTTP Request
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  getCategoriesAction(request, response, next) {
    context.openVeoProvider.getOne(
      '/taxonomies',
      portalConf.conf.categoriesFilter,
      null,
      portalConf.conf.cache.filterTTL,
      (error, taxonomy) => {
        if (error) {
          process.logger.error(error.message, {error, method: 'getCategoriesAction'});
          return next(HTTP_ERRORS.GET_CATEGORIES_ERROR);
        }

        const categories = {};
        if (taxonomy) {
          const categoriesIds = JSONPath({json: taxonomy, path: '$..*[?(@.id)]'});
          if (categoriesIds && categoriesIds.length) {
            categoriesIds.map((obj) => {
              categories[obj.id] = obj.title;
              return obj;
            });
          }
        }
        response.send(categories);
      }
    );
  }

}

module.exports = CategoriesController;

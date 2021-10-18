'use strict';

/**
 * @module portal/controllers/GroupsController
 */

const openVeoApi = require('@openveo/api');
const errors = process.require('app/server/httpErrors.js');
const context = process.require('app/server/context.js');

class GroupsController extends openVeoApi.controllers.Controller {

  /**
   * Defines a GroupsController to deal with OpenVeo groups.
   *
   * @class GroupsController
   * @extends Controller
   * @constructor
   * @see {@link https://github.com/veo-labs/openveo-api|OpenVeo API documentation} for more information about Controller
   */
  constructor() {
    super();
  }

  /**
   * Handles groups action to get OpenVeo groups.
   *
   * @param {Request} request ExpressJS HTTP Request
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  getGroupsAction(request, response, next) {
    context.openVeoProvider.getAll(
      '/groups',
      null,
      null,
      null,
      null,
      (error, groups) => {
        if (error) {
          process.logger.error(error.message, {error, method: 'getGroupsAction'});
          return next(errors.GET_GROUPS_ERROR);
        }

        response.send({
          entities: groups
        });
      }
    );
  }

}

module.exports = GroupsController;

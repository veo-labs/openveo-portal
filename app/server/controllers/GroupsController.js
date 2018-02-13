'use strict';

/**
 * @module controllers
 */

const openVeoApi = require('@openveo/api');
const errors = process.require('app/server/httpErrors.js');
const webServiceClient = process.require('/app/server/WebserviceClient');

class GroupsController extends openVeoApi.controllers.Controller {

  /**
   * Defines a GroupsController to deal with OpenVeo groups.
   *
   * @class GroupsController
   * @extends Controller
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Handles groups action to get OpenVeo groups.
   *
   * @method getGroupsAction
   * @async
   * @param {Request} request ExpressJS HTTP Request
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  getGroupsAction(request, response, next) {
    const openVeoClient = webServiceClient.get();

    // Get the list of groups
    openVeoClient.get('/groups').then((result) => {
      response.send(result);
    }).catch((error) => {
      process.logger.error(error.message, {error, method: 'getGroupsAction'});
      return next(errors.GET_GROUPS_ERROR);
    });
  }

}

module.exports = GroupsController;

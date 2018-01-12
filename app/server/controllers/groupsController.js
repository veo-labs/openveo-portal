'use strict';

/**
 * @module controllers
 */

const errors = process.require('app/server/httpErrors.js');
const webServiceClient = process.require('/app/server/WebserviceClient');

/**
 * Provides route actions to manipulate OpenVeo groups.
 *
 * @class groupsController
 * @static
 */

/**
 * Handles groups action to get OpenVeo groups.
 *
 * @method getGroupsAction
 * @static
 * @async
 * @param {Request} request ExpressJS HTTP Request
 * @param {Response} response ExpressJS HTTP Response
 * @param {Function} next Function to defer execution to the next registered middleware
 */
module.exports.getGroupsAction = (request, response, next) => {
  const openVeoClient = webServiceClient.get();

  // Get the list of groups
  openVeoClient.get('/groups').then((result) => {
    response.send(result);
  }).catch((error) => {
    process.logger.error(error.message, {error, method: 'getGroupsAction'});
    return next(errors.GET_GROUPS_ERROR);
  });
};

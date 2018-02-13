'use strict';

/**
 * @module controllers
 */

const querystring = require('querystring');
const openVeoApi = require('@openveo/api');
const webServiceClient = process.require('/app/server/WebserviceClient.js');
const errors = process.require('app/server/httpErrors.js');
const videoCache = process.require('/app/server/serverCache/VideoCache.js');
const portalConf = process.require('app/server/conf.js');

class VideosController extends openVeoApi.controllers.Controller {

  /**
   * Defines a VideosController to deal with videos.
   *
   * @class VideosController
   * @extends Controller
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Searches OpenVeo Publish videos.
   *
   * @method searchAction
   * @async
   * @param {Request} request ExpressJS HTTP Request
   * @param {Object} request.body Request's body
   * @param {Object} request.body.filter Web service endpoint filters
   * @param {String} [request.body.filter.query] Filter to get only videos which contain the query
   * inside the title or description
   * @param {String} [request.body.filter.dateStart] Filter to get only videos after a particular date
   * @param {String} [request.body.filter.dateEnd] Filter to get only videos before a particular date
   * @param {String} [request.body.filter.sortBy] The name of the property to sort by (either "views" or "date")
   * @param {String} [request.body.filter.sortOrder] The order of the sort (either "asc" or "desc")
   * @param {Object} request.body.pagination Pagination to set limit and page
   * @param {Object} [request.body.pagination.limit] Maximum number of videos to retreive
   * @param {Object} [request.body.pagination.page] The number of the page to retrieve
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  searchAction(request, response, next) {
    const VIDEO_PUBLISH_STATES = 12;
    const body = request.body || {};
    const openVeoClient = webServiceClient.get();
    let params;
    let paginate;

    // Parse Filters
    try {
      params = openVeoApi.util.shallowValidateObject(body.filter, {
        query: {type: 'string'},
        dateStart: {type: 'string'},
        dateEnd: {type: 'string'},
        categories: {type: 'array<string>'},
        sortBy: {type: 'string', in: ['views', 'date'], default: 'date'},
        sortOrder: {type: 'string', in: ['asc', 'desc'], default: 'desc'}
      });
    } catch (error) {
      return response.status(500).send({
        error: {
          message: error.message
        }
      });
    }

    // Public group filter not defined
    if (!portalConf.conf.publicFilter.length) {
      process.logger.error(errors.CONF_ERROR.message, {error: errors.CONF_ERROR, method: 'searchAction'});
      return next(errors.CONF_ERROR);
    }

    // Add group filter
    if (!request.isAuthenticated()) {

      // Anonymous user (not authenticated)
      // Add public groups
      params['groups'] = portalConf.conf.publicFilter || [];

    } else if (request.user.id !== portalConf.superAdminId) {

      // User authenticated and not the super administrator
      // Add public groups
      params['groups'] = portalConf.conf.publicFilter || [];

      // Add private groups
      if (portalConf.conf.privateFilter)
        params['groups'] = params['groups'].concat(portalConf.conf.privateFilter);

      // Add user groups
      if (request.user.groups && request.user.groups.length)
        params['groups'] = params['groups'].concat(request.user.groups);

    }

    // Add published states
    params['states'] = VIDEO_PUBLISH_STATES;

    // Add properties
    Object.keys(body.filter).forEach((key) => {
      // if filter key is allready set thanks to shallowValidateObject
      if (!params[key] && params[key] !== '') {
        params[`properties[${key}]`] = body.filter[key];
      }
    });

    // Parse pagination
    try {
      paginate = openVeoApi.util.shallowValidateObject(body.pagination, {
        limit: {type: 'number', gt: 0, default: 9},
        page: {type: 'number', gte: 0, default: 0}
      });
    } catch (error) {
      return response.status(500).send({
        error: {
          message: error.message
        }
      });
    }

    // Add pagination
    Object.keys(paginate).forEach((key) => {
      params[key] = paginate[key];
    });

    const query = querystring.stringify(params);

    // Get the list of videos
    openVeoClient.get(`/publish/videos?${query}`).then((result) => {
      response.send(result);
    }).catch((error) => {
      process.logger.error(error.message, {error, method: 'searchAction'});
      return next(errors.SEARCH_ERROR);
    });
  }

  /**
   * Gets details about an OpenVeo Publish video.
   *
   * @method getVideoAction
   * @async
   * @param {Request} request ExpressJS HTTP Request
   * @param {Object} request.params Request's parameters
   * @param {Object} request.params.id The id of the video to fetch
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  getVideoAction(request, response, next) {
    const videoCacheInstance = videoCache.getVideoCache();

    videoCacheInstance.getVideo(request.params.id, (error, video) => {
      if (error) return next(error);

      const isInPublicGroups = openVeoApi.util.intersectArray(
        video.entity.metadata.groups,
        portalConf.conf.publicFilter
      ).length;

      if (isInPublicGroups) {

        // Video is public
        response.send(video);

      } else if (!request.isAuthenticated()) {

        // User is not authenticated
        // Send need authent
        response.send({needAuth: true});

      } else {

        // User is authenticated

        // Super administrator can see all videos
        if (request.user.id === portalConf.superAdminId)
          return response.send(video);

        // Find out if video is part of private groups or its groups
        // If video is part of these groups user is allowed to access the video
        const isInPrivateGroups = openVeoApi.util.intersectArray(
          video.entity.metadata.groups, portalConf.conf.privateFilter
        ).length;
        const isInUserGroups = openVeoApi.util.intersectArray(
          video.entity.metadata.groups, request.user.groups
        ).length;

        if (isInPrivateGroups || isInUserGroups) response.send(video);
        else next(errors.GET_VIDEO_NOT_ALLOWED);
      }
    });
  }

}

module.exports = VideosController;
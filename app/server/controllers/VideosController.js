'use strict';

/**
 * @module controllers
 */

const openVeoApi = require('@openveo/api');
const errors = process.require('app/server/httpErrors.js');
const portalConf = process.require('app/server/conf.js');
const context = process.require('app/server/context.js');
const ResourceFilter = openVeoApi.storages.ResourceFilter;

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
    const filter = new ResourceFilter();
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
      paginate = openVeoApi.util.shallowValidateObject(body.pagination, {
        limit: {type: 'number', gt: 0, default: 9},
        page: {type: 'number', gte: 0, default: 0}
      });
    } catch (error) {
      return next(errors.SEARCH_WRONG_PARAMETERS);
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
      filter.in('groups', portalConf.conf.publicFilter || []);

    } else if (request.user.id !== portalConf.superAdminId) {

      // User authenticated and not the super administrator
      // Add public groups
      let groups = portalConf.conf.publicFilter || [];

      // Add private groups
      if (portalConf.conf.privateFilter)
        groups = groups.concat(portalConf.conf.privateFilter);

      // Add user groups
      if (request.user.groups && request.user.groups.length)
        groups = groups.concat(request.user.groups);

      filter.in('groups', groups);
    }

    // Add published states
    filter.equal('states', VIDEO_PUBLISH_STATES);

    // Add properties
    Object.keys(body.filter).forEach((key) => {
      if (!params[key] && params[key] !== '')
        filter.equal(`properties[${key}]`, body.filter[key]);
    });

    // Search query
    if (params['query']) filter.search(params['query']);

    // Date
    if (params['dateStart']) filter.equal('dateStart', params['dateStart']);
    if (params['dateEnd']) filter.equal('dateEnd', params['dateEnd']);

    // Category
    if (params['categories']) filter.in('categories', params['categories']);

    // Sort
    const sort = {};
    if (params['sortBy'] && params['sortOrder']) sort[params['sortBy']] = params['sortOrder'];

    context.openVeoProvider.get(
      '/publish/videos',
      filter,
      null,
      paginate['limit'],
      paginate['page'],
      sort,
      portalConf.conf.cache.videoTTL,
      (error, videos, pagination) => {
        if (error) {
          process.logger.error(error.message, {error, method: 'searchAction'});
          return next(errors.SEARCH_ERROR);
        }

        response.send({
          entities: videos,
          pagination
        });
      }
    );
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
    context.openVeoProvider.getOne(
      '/publish/videos',
      request.params.id,
      null,
      portalConf.conf.cache.videoTTL,
      (error, video) => {
        if (error) {
          process.logger.error(error.message, {error, method: 'getVideoAction'});
          return next(errors.GET_VIDEO_ERROR);
        }

        if (!video) return next(errors.GET_VIDEO_NOT_FOUND);

        const isInPublicGroups = video.metadata.groups && openVeoApi.util.intersectArray(
          video.metadata.groups,
          portalConf.conf.publicFilter
        ).length;

        if (isInPublicGroups) {

          // Video is public
          response.send({entity: video});

        } else if (!request.isAuthenticated()) {

          // User is not authenticated
          // Send need authent
          response.send({needAuth: true});

        } else {

          // User is authenticated

          // Super administrator can see all videos
          if (request.user.id === portalConf.superAdminId)
            return response.send({entity: video});

          // Find out if video is part of private groups or user groups
          // If video is part of these groups user is allowed to access the video
          const isInPrivateGroups = openVeoApi.util.intersectArray(
            video.metadata.groups, portalConf.conf.privateFilter
          ).length;
          const isInUserGroups = openVeoApi.util.intersectArray(
            video.metadata.groups, request.user.groups
          ).length;

          if (isInPrivateGroups || isInUserGroups) response.send({entity: video});
          else next(errors.GET_VIDEO_NOT_ALLOWED);
        }
      }
    );
  }

}

module.exports = VideosController;

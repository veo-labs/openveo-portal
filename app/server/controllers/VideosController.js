'use strict';

/**
 * @module portal/controllers/VideosController
 */

const openVeoApi = require('@openveo/api');
const errors = process.require('app/server/httpErrors.js');
const portalConf = process.require('app/server/conf.js');
const context = process.require('app/server/context.js');
const SettingsProvider = process.require('app/server/providers/SettingsProvider.js');
const ResourceFilter = openVeoApi.storages.ResourceFilter;

const VIDEO_PUBLISH_STATE = 12;

class VideosController extends openVeoApi.controllers.Controller {

  /**
   * Defines a VideosController to deal with videos.
   *
   * @class VideosController
   * @extends Controller
   * @constructor
   * @see {@link https://github.com/veo-labs/openveo-api|OpenVeo API documentation} for more information about Controller
   */
  constructor() {
    super();
  }

  /**
   * Checks if a user is authorized to see a video.
   *
   * @param {Object} [user] The user to test
   * @param {String} user.id The user id
   * @param {Array} user.groups The user groups
   * @param {Object} video The video to test
   * @param {Object} video.metadata Metadata of the video
   * @param {Array} video.metadata.groups The list of groups the video belongs to
   * @return {Boolean} true if the user if authorized, false otherwise
   */
  isUserAuthorized(user, video) {
    const isInPublicGroups = video.metadata.groups && openVeoApi.util.intersectArray(
      video.metadata.groups,
      portalConf.conf.publicFilter
    ).length;

    if (isInPublicGroups) {

      // Video is public
      return true;

    } else if (!user) {
      return false;
    } else {

      // User is authenticated

      // Super administrator can see all videos
      if (user.id === portalConf.superAdminId)
        return true;

      // Find out if video is part of private groups or user groups
      // If video is part of these groups user is allowed to access the video
      const isInPrivateGroups = openVeoApi.util.intersectArray(
        video.metadata.groups, portalConf.conf.privateFilter
      ).length;
      const isInUserGroups = openVeoApi.util.intersectArray(
        video.metadata.groups, user.groups
      ).length;

      return (isInPrivateGroups || isInUserGroups);
    }
  }

  /**
   * Adds operations to limit access to videos.
   *
   * @param {ResourceFilter} [filter] The filter to add access operations to, generated if not specified
   * @param {Object} [user] The user to limit
   * @param {Array} [user.groups] The user groups
   * @return {ResourceFilter} The filter
   */
  addAccessFilter(filter, user) {
    if (!filter) filter = new ResourceFilter();

    if (!user) {

      // Anonymous user (not authenticated)
      // Add public groups
      filter.in('groups', portalConf.conf.publicFilter || []);

    } else if (user.id !== portalConf.superAdminId) {

      // User authenticated and not the super administrator
      // Add public groups
      let groups = portalConf.conf.publicFilter || [];

      // Add private groups
      if (portalConf.conf.privateFilter)
        groups = groups.concat(portalConf.conf.privateFilter);

      // Add user groups
      if (user.groups && user.groups.length)
        groups = groups.concat(user.groups);

      filter.in('groups', groups);
    }

    return filter;
  }

  /**
   * Converts video points of interest
   *
   * @param {Request} request ExpressJS HTTP Request
   * @param {Object} request.body Request's body
   * @param {Number} request.body.duration The duration of the video
   */
  convertVideoPoiAction(request, response, next) {
    const videoId = request.params.id;
    const body = request.body;
    let params;

    // Parse Filters
    try {
      params = openVeoApi.util.shallowValidateObject(body, {
        duration: {type: 'number', gt: 0, required: true}
      });
    } catch (error) {
      return next(errors.CONVERT_VIDEO_POI_WRONG_PARAMETERS);
    }

    context.openVeoProvider.convertVideoPoi(
      videoId,
      params.duration,
      (error, video) => {
        if (error) {
          process.logger.error(error.message, {error, method: 'convertVideoPoiAction'});
          return next(errors.CONVERT_VIDEO_POI_ERROR);
        }

        response.send({
          entity: video
        });
      }
    );
  }

  /**
   * Searches OpenVeo Publish videos.
   *
   * @param {Request} request ExpressJS HTTP Request
   * @param {Object} request.body Request's body
   * @param {Object} request.body.filter Web service endpoint filters
   * @param {String} [request.body.filter.query] Filter to get only videos which contain the query
   * inside the title or description
   * @param {Number} [request.body.filter.searchInPois=0] 1 to also search in points of interest (tags / chapters)
   * titles and descriptions
   * @param {String} [request.body.filter.dateStart] Filter to get only videos after a particular date
   * @param {String} [request.body.filter.dateEnd] Filter to get only videos before a particular date
   * @param {String} [request.body.filter.sortBy] The name of the property to sort by (either "views" or "date")
   * @param {String} [request.body.filter.sortOrder] The order of the sort (either "asc" or "desc")
   * @param {Object} request.body.pagination Pagination to set limit and page
   * @param {Object} [request.body.pagination.limit] Maximum number of videos to retreive
   * @param {Object} [request.body.pagination.page] The number of the page to retrieve
   * @param {(String|Array)} [request.body.include] The list of fields to include from returned videos
   * @param {(String|Array)} [request.body.exclude] The list of fields to exclude from returned videos. Ignored if
   * include is also specified.
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  searchAction(request, response, next) {
    const body = request.body || {};
    const filter = new ResourceFilter();
    let params;
    let paginate;

    // Parse Filters
    try {
      params = openVeoApi.util.shallowValidateObject(body.filter, {
        query: {type: 'string'},
        searchInPois: {type: 'number', in: [0, 1], default: 0},
        dateStart: {type: 'date'},
        dateEnd: {type: 'date'},
        categories: {type: 'array<string>'},
        sortBy: {type: 'string', in: ['views', 'date'], default: 'date'},
        sortOrder: {type: 'string', in: ['asc', 'desc'], default: 'desc'},
        include: {type: 'array<string>'},
        exclude: {type: 'array<string>'}
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

    this.addAccessFilter(filter, request.isAuthenticated() && request.user);

    // Add published states
    filter.equal('states', VIDEO_PUBLISH_STATE);

    // Add properties
    Object.keys(body.filter).forEach((key) => {
      if (!params[key] && params[key] !== '')
        filter.equal(`properties[${key}]`, body.filter[key]);
    });

    // Search query
    if (params['query']) filter.search(params['query']);

    // Search in points of interest
    if (params['searchInPois'] !== undefined) filter.equal('searchInPois', params['searchInPois']);

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
      {
        exclude: params.exclude,
        include: params.include
      },
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

        if (!video || video.state !== VIDEO_PUBLISH_STATE) return next(errors.GET_VIDEO_NOT_FOUND);

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

        } else if (this.isUserAuthorized(request.user, video)) {

          // User is authenticated
          response.send({entity: video});

        } else
          next(errors.GET_VIDEO_NOT_ALLOWED);
      }
    );
  }

  /**
   * Fetches promoted videos.
   *
   * @param {Request} request ExpressJS HTTP Request
   * @param {Object} request.query Request query parameters
   * @param {Boolean} [request.query.auto=false] true to automatically fulfill empty slots when possible
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  async getPromotedVideosAction(request, response, next) {
    const NUMBER_OF_VIDEOS = 9;
    const settingsProvider = new SettingsProvider(context.database);
    let queryParameters;

    // Validate parameters
    try {
      queryParameters = openVeoApi.util.shallowValidateObject(request.query, {
        auto: {type: 'boolean'}
      });
    } catch (error) {
      return next(errors.GET_PROMOTED_VIDEOS_WRONG_PARAMETERS);
    }

    try {

      // Get ids of promoted videos which have been configured
      const videoIds = await new Promise((resolve, reject) => {
        settingsProvider.getOne(new ResourceFilter().equal('id', 'promoted-videos'), null, (error, setting) => {
          if (error) {
            process.logger.error(error.message, {error, method: 'getPromotedVideosAction'});
            return reject(errors.GET_PROMOTED_VIDEOS_GET_SETTINGS_ERROR);
          }

          resolve((setting && setting.value) || new Array(NUMBER_OF_VIDEOS));
        });
      });

      // Get information about promoted videos
      const promotedVideos = new Array(NUMBER_OF_VIDEOS);

      for (let i = 0; i < videoIds.length; i++) {
        const videoId = videoIds[i];
        if (!videoId) continue;

        const promotedVideo = await new Promise((resolve, reject) => {
          context.openVeoProvider.getOne(
            '/publish/videos',
            videoIds[i],
            {
              include: ['id', 'title', 'date', 'thumbnail', 'views', 'state']
            },
            portalConf.conf.cache.videoTTL,
            (error, video) => {
              if (error) {
                process.logger.error(error.message, {error, method: 'getPromotedVideosAction'});

                if (error.httpCode !== 404) {

                  // The video couldn't be fetched, maybe the video has been removed from OpenVeo
                  return reject(errors.GET_PROMOTED_VIDEOS_GET_VIDEO_ERROR);

                }
              }

              resolve(video);
            }
          );
        });

        if (
          promotedVideo &&
          promotedVideo.state === VIDEO_PUBLISH_STATE &&
          this.isUserAuthorized(request.user, promotedVideo)
        ) {
          promotedVideos[i] = promotedVideo;
        } else
          promotedVideos[i] = undefined;
      }

      if (!queryParameters.auto) return response.send(promotedVideos);

      // Some slots are empty, get videos to fulfill slots
      // Find the number of empty slots
      let emptySlotsNumbers = 0;
      for (let slot of promotedVideos) {
        if (!slot) emptySlotsNumbers++;
      }

      if (!emptySlotsNumbers) return response.send(promotedVideos);

      // Make sure user can access returned videos
      const filter = new ResourceFilter();
      this.addAccessFilter(filter, request.isAuthenticated() && request.user);
      filter.equal('states', VIDEO_PUBLISH_STATE);

      // Get as many videos as the number of promoted videos to be sure to have enough
      let extraVideos = await new Promise((resolve, reject) => {
        context.openVeoProvider.get(
          '/publish/videos',
          filter,
          {
            include: ['id', 'title', 'date', 'thumbnail', 'views']
          },
          NUMBER_OF_VIDEOS,
          0,
          {
            date: 'desc'
          },
          portalConf.conf.cache.videoTTL,
          (error, videos, pagination) => {
            if (error) return reject(errors.GET_PROMOTED_VIDEOS_GET_VIDEOS_ERROR);
            resolve(videos);
          }
        );
      });

      // Remove promotedVideos from extraVideos if any
      extraVideos = extraVideos.filter((video) => {
        for (let promotedVideo of promotedVideos) {
          if (promotedVideo && video.id === promotedVideo.id) return false;
        }
        return true;
      });

      // Fill empty slots with extra videos
      const extraVideosIterator = extraVideos[Symbol.iterator]();

      for (let i = 0; i < promotedVideos.length; i++) {
        const promotedVideo = promotedVideos[i];
        if (!promotedVideo)
          promotedVideos[i] = extraVideosIterator.next().value;
      }

      response.send(promotedVideos);
    } catch (error) {
      process.logger.error(error.message, {error, method: 'getPromotedVideosAction'});
      next(error);
    }
  }

}

module.exports = VideosController;

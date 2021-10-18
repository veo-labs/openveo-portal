'use strict';

/**
 * @module portal/controllers/StatisticsController
 */

const openVeoApi = require('@openveo/api');
const HTTP_ERRORS = process.require('app/server/httpErrors.js');
const context = process.require('/app/server/context.js');
const portalConf = process.require('app/server/conf.js');
const Cache = process.require('app/server/Cache.js');

class StatisticsController extends openVeoApi.controllers.Controller {

  /**
   * Defines a StatisticsController to deal with portal settings.
   *
   * @class StatisticsController
   * @extends Controller
   * @constructor
   * @see {@link https://github.com/veo-labs/openveo-api|OpenVeo API documentation} for more information about Controller
   */
  constructor() {
    super();

    Object.defineProperties(this,

      /** @lends module:portal/controllers/StatisticsController~StatisticsController */
      {

        /**
         * The cache holding the number of views by user and media.
         *
         * @type {Cache}
         * @instance
         * @readonly
         */
        viewsCache: {
          value: new Cache({checkperiod: 0})
        }

      }

    );

    this.viewsCache.on('expired', (key, value) => {
      this.viewsCache.del(key);
    });

  }

  /**
   * Sends statistics to OpenVeo.
   *
   * @param {Request} request ExpressJS HTTP Request
   * @param {Object} request.params Requests parameters
   * @param {String} request.params.entity The name of the OpenVeo entity receiving statistics
   * @param {String} request.params.type The type of statistic to update
   * @param {String} request.params.id The id of the entity
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  statisticsAction(request, response, next) {
    switch (request.params.entity) {

      // video
      case 'video':
        switch (request.params.type) {

          // views
          case 'views':
            context.openVeoProvider.getOne(
              '/publish/videos',
              request.params.id,
              null,
              portalConf.conf.cache.videoTTL,
              (error, media) => {
                if (error) {
                  process.logger.error(error.message, {error, method: 'statisticsAction'});
                  next(HTTP_ERRORS.STATISTICS_MEDIA_VIEWS_GET_ONE_ERROR);
                }

                if (media.private && !request.isAuthenticated())
                  next();
                else {

                  const duration = media.metadata && media.metadata.duration ? media.metadata.duration : 7200;
                  const cacheId = `${request.sessionID}-${media.id}`;

                  // Increment the number of views only once for the time of the media and for a user
                  if (this.viewsCache.get(cacheId)) return response.send();

                  // Increment the number of views
                  this.viewsCache.set(cacheId, true, duration);

                  context.openVeoProvider.updateOne(
                    '/publish/statistics/video/views',
                    media.id,
                    {
                      count: 1
                    },
                    (error, total) => {
                      if (error) {
                        process.logger.error(error.message, {error, method: 'statisticsAction'});
                        next(HTTP_ERRORS.STATISTICS_MEDIA_VIEWS_INCREMENT_ERROR);
                      }
                      context.openVeoProvider.deleteDocumentCache('/publish/videos', media.id, true);
                      response.send();
                    }
                  );
                }
              }
            );
            break;

          default:
            next();
        }

        break;

      default:
        next();
    }
  }

}

module.exports = StatisticsController;

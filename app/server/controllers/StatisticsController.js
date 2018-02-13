'use strict';

/**
 * @module controllers
 */

/**
 * Provides route actions for all requests relative to statistics.
 *
 * @class statisticsController
 * @static
 */

const openVeoApi = require('@openveo/api');
const videoCache = process.require('/app/server/serverCache/VideoCache.js');

/**
 * Verify that a user has not seen the video more than one time during the video duration
 */
function userCanIncrease(sesionID, entity, callback) {
  const videoCacheInstance = videoCache.getVideoCache();
  videoCacheInstance.getVideoViewByUser(sesionID, entity.id, (error, value) => {

    if (error || value) {
      callback(false);
      return;
    }

    const duration = entity.metadata && entity.metadata.duration ? entity.metadata.duration : 7200;

    // user has not view this video
    // This user will not be allowed to increase view number during video duration or at least 2hours
    videoCacheInstance.setVideoViewByUser(sesionID, entity.id, duration);
    callback(true);
  });
}

/**
 * Increase video count when needed
 */
function increaseViews(video, sesionID, callback) {
  const videoCacheInstance = videoCache.getVideoCache();
  userCanIncrease(sesionID, video, (canIncrease) => {
    if (canIncrease)
      videoCacheInstance.addVideoView(video.id);
    callback();
  });
}

class StatisticsController extends openVeoApi.controllers.Controller {

  /**
   * Defines a StatisticsController to deal with portal settings.
   *
   * @class StatisticsController
   * @extends Controller
   * @constructor
   */
  constructor() {
    super();
  }

  statisticsAction(request, response, next) {
    const videoCacheInstance = videoCache.getVideoCache();
    switch (request.params.entity) {
      case 'video':
        switch (request.params.type) {
          case 'views':
            videoCacheInstance.getVideo(request.params.id, (error, video) => {
              if (error) {
                next(error);
              } else if (video.entity.private && !request.isAuthenticated())
                next();
              else
                increaseViews(video.entity, request.sessionID, () => {
                  response.send();
                });
            });
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

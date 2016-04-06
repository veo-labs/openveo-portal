'use strict';

/**
 * @module portal-controllers
 */

/**
 * Provides route actions for all requests relative to statistics.
 *
 * @class StatisticsController
 */

const videoCache = process.require('/app/server/serverCache/VideoCache');

/**
 * Verify that a user has not seen the video more than one time during the video duration
 */
const userCanIncrease = (sesionID, entity, callback) => {
  videoCache.getVideoViewByUser(sesionID, entity.id, (error, value) => {

    if (error || value) {
      callback(false);
      return;
    }

    const duration = entity.metadata && entity.metadata.duration ? entity.metadata.duration : 7200;

    // user has not view this video
    // This user will not be allowed to increase view number during video duration or at least 2hours
    videoCache.setVideoViewByUser(sesionID, entity.id, duration);
    callback(true);
  });
};

/**
 * Increase video count when needed
 */
const increaseViews = (video, sesionID, callback) => {
  userCanIncrease(sesionID, video, (canIncrease) => {
    if (canIncrease)
      videoCache.addVideoView(video.id);
    callback();
  });
};

/**
 * Displays video player template.
 *
 * Checks first if the video id is valid and if the video is published
 * before returning the template.
 *
 * @method displayVideoAction
 * @static
 */
module.exports.statisticsAction = (request, response, next) => {

  switch (request.params.entity) {
    case 'video':
      switch (request.params.type) {
        case 'views':
          videoCache.getVideo(request.params.id, (error, entity) => {
            const video = entity.video;
            if (error) {
              next(error);
            } else if (video.private && !request.isAuthenticated())
              next();
            else
              increaseViews(video, request.sessionID, () => {
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
};

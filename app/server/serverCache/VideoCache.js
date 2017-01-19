'use strict';

/**
 * @module serverCache
 */

const errors = process.require('app/server/httpErrors.js');
const conf = process.require('app/server/conf.js');

const webserviceClient = process.require('/app/server/WebserviceClient');
const openVeoClient = webserviceClient.getClient();
const NodeCache = require('node-cache');

let videoCacheInstance;

/**
 * Provides all caches relative to videos.
 *
 * @class VideoCache
 */
class VideoCache {

  /**
   * Creates a new VideoCache.
   */
  constructor() {
    Object.defineProperties(this, {
      videoCache: {
        value: new NodeCache({stdTTL: conf.data.cache.videoTTL, checkperiod: conf.data.cache.videoTTL})
      },
      viewsCache: {
        value: new NodeCache({checkperiod: 0})
      },
      userCache: {
        value: new NodeCache({checkperiod: 0})
      }
    });

    // When a cached video has expired, send count to openveo
    this.videoCache.on('expired', (key, value) => {
      this.videoCache.del(key);
      this.getVideoViewCount(key, (error, viewCount) => {
        if (error || viewCount == undefined) {
          return;
        }

        // if a count need to be send to openveo, send it and reset the count
        openVeoClient
        .post(`/publish/statistics/video/views/${key}`, JSON.stringify({count: viewCount}))
        .then((response) => {
          if (response.done) {
            this.viewsCache.del(`${key}-views`);
          }
        })
        .catch((error) => {

          // do not clear anything
          process.logger.error(error.message, {error, method: 'videoCache.sendStatistics'});
        });
      });
    });

    this.userCache.on('expired', (key, value) => {
      this.userCache.del(key);
    });


  }

  /**
   * VideoCache singleton getter.
   *
   * @return {VideoCache} videoCacheInstance the VideoCache Singleton
   */
  static getVideoCache() {
    if (!videoCacheInstance)
      videoCacheInstance = new VideoCache();
    return videoCacheInstance;
  }

  // Get A video from cache or call the entity from Openveo
  getVideo(id, callback) {
    this.videoCache.get(id, (error, video) => {
      if (error) {
        return callback(error);
      }

      if (video) { // is cached
        return callback(null, video);
      }

      // not cached : Do call
      openVeoClient.get(`/publish/videos/${id}`).then((result) => {

        // cache result
        this.videoCache.set(id, result);
        callback(null, result);
      }).catch((error) => {
        process.logger.error(error.message, {error, method: 'videoCache.getVideo'});
        callback(errors.GET_VIDEO_UNKNOWN);
      });
    });
  }

  setVideoViewByUser(user, id, ttl) {
    this.userCache.set(`${user}-${id}`, true, ttl);
  }

  getVideoViewByUser(user, id, callback) {
    return this.userCache.get(`${user}-${id}`, callback);
  }

  // incrase count video or initialize it
  addVideoView(id) {
    const key = `${id}-views`;
    this.viewsCache.get(key, (error, count) => {
      if (error) {
        return;
      }

      if (count) { // is cached
        this.viewsCache.set(key, count + 1);
        return;
      }

      this.viewsCache.set(key, 1);
      return;
    });
  }

  getVideoViewCount(id, callback) {
    return this.viewsCache.get(`${id}-views`, callback);
  }
}

module.exports = VideoCache;

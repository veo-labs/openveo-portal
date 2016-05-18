'use strict';

/**
 * @module portal-cache
 */

/**
 * Provides route actions for all requests relative to statistics.
 *
 * @class VideoCache
 */

const path = require('path');

const errors = process.require('app/server/httpErrors.js');
const openveoAPI = require('@openveo/api');
const OpenVeoClient = require('@openveo/openveo-rest-nodejs-client').OpenVeoClient;
const configurationDirectoryPath = path.join(openveoAPI.fileSystem.getConfDir(), 'portal');

const webservicesConf = require(path.join(configurationDirectoryPath, 'webservicesConf.json'));
const conf = require(path.join(configurationDirectoryPath, 'conf.json'));

const OPENVEO_CERT = webservicesConf.certificate;
const OPENVEO_URL = webservicesConf.path;
const CLIENT_ID = webservicesConf.clientID;
const CLIENT_SECRET = webservicesConf.secretID;

const openVeoClient = new OpenVeoClient(OPENVEO_URL, CLIENT_ID, CLIENT_SECRET, OPENVEO_CERT);

const NodeCache = require('node-cache');


// video are deleted by cache expiration
const videoCache = new NodeCache({stdTTL: conf.cache.videoTTL, checkperiod: conf.cache.videoTTL}); // default ttl: 1mn

// views are deleted by videocache expiration
const viewsCache = new NodeCache({checkperiod: 0});

// users are deleted by cache expiration
const userCache = new NodeCache({checkperiod: 0}); // ttl corresponding to video duration

// When a cached video has expired, send count to openveo
videoCache.on('expired', (key, value) => {
  const self = this;
  videoCache.del(key);
  self.getVideoViewCount(key, (error, viewCount) => {
    if (error || viewCount == undefined) {
      return;
    }

    // if a count need to be send to openveo, send it and reset the count
    openVeoClient
            .post(`/publish/statistics/video/views/${key}`, JSON.stringify({count: viewCount}))
            .then((response) => {
              if (response.done) {
                viewsCache.del(`${key}-views`);
              }
            })
            .catch((error) => {

              // do not clear anything
            });
  });
});

userCache.on('expired', (key, value) => {
  userCache.del(key);
});

// Get A video from cache or call the entity from Openveo
module.exports.getVideo = (id, callback) => {
  videoCache.get(id, (error, video) => {
    if (error) {
      return callback(error);
    }

    if (video) { // is cached
      return callback(null, video);
    }

    // not cached : Do call
    openVeoClient.get(`/publish/videos/${id}`).then((result) => {

      // cache result
      videoCache.set(id, result);
      callback(null, result);
    }).catch((error) => {
      callback(errors.GET_VIDEO_UNKNOWN);
    });
  });
};

module.exports.setVideoViewByUser = (user, id, ttl) => {
  userCache.set(`${user}-${id}`, true, ttl);
};

module.exports.getVideoViewByUser = (user, id, callback) => {
  return userCache.get(`${user}-${id}`, callback);
};

// incrase count video or initialize it
module.exports.addVideoView = (id) => {
  const key = `${id}-views`;
  viewsCache.get(key, (error, count) => {
    if (error) {
      return;
    }

    if (count) { // is cached
      viewsCache.set(key, count + 1);
      return;
    }

    viewsCache.set(key, 1);
    return;
  });
};

module.exports.getVideoViewCount = (id, callback) => {
  return viewsCache.get(`${id}-views`, callback);
};

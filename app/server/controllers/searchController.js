'use strict';

/**
 * @module controllers
 */

/**
 * Provides default route action to deal with angularJS single page application.
 *
 * @class searchController
 */

const path = require('path');
const async = require('async');
const querystring = require('querystring');

const errors = process.require('app/server/httpErrors.js');
const openVeoAPI = require('@openveo/api');
const OpenVeoClient = require('@openveo/openveo-rest-nodejs-client').OpenVeoClient;
const configurationDirectoryPath = path.join(openVeoAPI.fileSystem.getConfDir(), 'portal');

const webservicesConf = require(path.join(configurationDirectoryPath, 'webservicesConf.json'));
const conf = require(path.join(configurationDirectoryPath, 'conf.json'));

const OPENVEO_CERT = webservicesConf.certificate;
const OPENVEO_URL = webservicesConf.path;
const CLIENT_ID = webservicesConf.clientID;
const CLIENT_SECRET = webservicesConf.secretID;

const openVeoClient = new OpenVeoClient(OPENVEO_URL, CLIENT_ID, CLIENT_SECRET, OPENVEO_CERT);

const videoCache = process.require('/app/server/serverCache/VideoCache');
const filterCache = process.require('/app/server/serverCache/FilterCache');
const VIDEO_PUBLISH_STATES = 12;

/**
 * Handles default action to display main HTML.
 *
 * If no other action were performed display the main template.
 * Main template loads libraries JavaScript files, Bootstrap CSS file and CSS file from the configured theme.
 *
 * @method defaultAction
 * @static
 */
module.exports.searchAction = (request, response, next) => {
  const body = request.body || {};
  const orderedProperties = ['views', 'date'];
  let params;
  let paginate;

  // Parse Filters
  try {
    params = openVeoAPI.util.shallowValidateObject(body.filter, {
      query: {type: 'string'},
      dateStart: {type: 'string'},
      dateEnd: {type: 'string'},
      categories: {type: 'array<string>'},
      sortBy: {type: 'string', in: orderedProperties, default: 'date'},
      sortOrder: {type: 'string', in: ['asc', 'desc'], default: 'desc'}
    });
  } catch (error) {
    return response.status(500).send({
      error: {
        message: error.message
      }
    });
  }

  // Add public group filter
  params['groups'] = conf.publicFilter;

  // Add visibility group filter
  if (request.isAuthenticated()) {

    // Add user filter
    if (request.user['groups'].length)
      params['groups'] = params['groups'].concat(request.user['groups']);
  }

  // Add published states
  params['states'] = VIDEO_PUBLISH_STATES;

  // Add properties
  Object.keys(body.filter).forEach((key) => {

    // if filter key is allready set thanks to shallowValidateObject
    if (params[key] == undefined) {
      params[`properties[${key}]`] = body.filter[key];
    }
  });

  // Parse pagination
  try {
    paginate = openVeoAPI.util.shallowValidateObject(body.pagination, {
      limit: {type: 'number', gt: 0, default: 9},
      page: {type: 'number', gt: 0, default: 1}
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

  Object.keys(params).forEach((key) => {
    if (params[key] === null) delete params[key];
  });

  const query = querystring.stringify(params);

  // Get the list of videos
  openVeoClient.get(`/publish/videos?${query}`).then((result) => {
    result.pagination.page--;
    response.send(result);
  }).catch((error) => {
    return next(errors.SEARCH_ERROR);
  });
};

module.exports.getSearchFiltersAction = (request, response, next) => {
  const filters = [];
  const series = [];
  const arrayId = conf.exposedFilter;
  for (let i = 0; i < arrayId.length; i++) {
    if (arrayId[i] == 'categories')
      series.push((callback) => {
        filterCache.getCategories((error, categories) => {
          if (categories) {
            filters.push(categories);
          }
          callback();
        });
      });
    else series.push((callback) => {
      filterCache.getFilter(arrayId[i], (error, filter) => {
        if (filter) {
          filters.push(filter);
        }
        callback();
      });
    });
  }

  async.series(series, () => {

    response.send(filters);
  });
};

module.exports.getCategoriesAction = (request, response, next) => {
  filterCache.getCategories((error, categories) => {
    if (error) {
      next(error);
      return;
    } else {
      response.send(categories);
    }
  });
};

module.exports.getVideoAction = (request, response, next) => {
  videoCache.getVideo(request.params.id, (error, res) => {
    if (error) {
      next(error);
      return;
    }

    const isInPublic = openVeoAPI.util.intersectArray(res.entity.metadata.groups, conf.publicFilter);
    const isInPrivate = openVeoAPI.util.intersectArray(res.entity.metadata.groups, conf.privateFilter);

    // return entity if entity is public
    if (isInPublic.length)
      response.send(res);

    // if video is private
    else if (isInPrivate.length) {

      // if user is not authentified, send need authent
      if (!request.isAuthenticated())
        response.send({needAuth: true});

      // if user is authentified
      else {
        const isAllowed = openVeoAPI.util.intersectArray(isInPrivate, request.user.groups);

        // if is allowed return authent else return error
        if (isAllowed.length) response.send(res);
        else next(errors.GET_VIDEO_NOT_ALLOWED);
      }

      // if no group corresponding to an entity
    } else {
      next(errors.GET_VIDEO_NOT_ALLOWED);
    }

  });
};

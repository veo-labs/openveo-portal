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

const errors = process.require('app/server/httpErrors.js');
const openveoAPI = require('@openveo/api');
const OpenVeoClient = require('@openveo/openveo-rest-nodejs-client').OpenVeoClient;
const configurationDirectoryPath = path.join(openveoAPI.fileSystem.getConfDir(), 'portal');

const webservicesConf = require(path.join(configurationDirectoryPath, 'webservicesConf.json'));

const OPENVEO_URL = `http://${webservicesConf.host}:${webservicesConf.port}`;
const CLIENT_ID = webservicesConf.clientID;
const CLIENT_SECRET = webservicesConf.secretId;

const openVeoClient = new OpenVeoClient(OPENVEO_URL, CLIENT_ID, CLIENT_SECRET);

const videoCache = process.require('/app/server/serverCache/VideoCache');

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
  const isAuthenticated = request.isAuthenticated();
  const body = request.body || {};

  const params = {
    count: 9,
    page: 1,
    sort: {
      date: 1
    },
    filter: {}
  };

  if (isAuthenticated) {
    params.filter['private'] = true;
  }

  Object.keys(body.filter).forEach((key) => {

    const value = body.filter[key];
    if (key == 'startDate') {
      const date = new Date(value);
      if (!params.filter.date) params['filter']['date'] = {};
      params.filter.date['$gte'] = date.getTime();
    } else if (key == 'endDate') {
      const date = new Date(value);
      if (!params.filter.date) params['filter']['date'] = {};
      params.filter.date['$lte'] = date.getTime();
    } else if (key == 'orderBy') {
      params.sort = {};
      params.sort[value ? 'views' : 'date'] = params.sort.orderAsc ? -1 : 1;
    } else if (key == 'orderAsc') {
      params.sort = {};
      params.sort[params.sort.orderBy ? 'views' : 'date'] = value ? -1 : 1;
    } else if (key == 'key') {
      params['filter']['title'] = {
        $regex: `.*${value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}.*`
      };
    }
  });

  if (body.pagination)
    Object.keys(body.pagination).forEach((key) => {
      const value = body.pagination[key];
      if (value != '') {
        if (key == 'limit') {
          params['count'] = value;
        } else if (key == 'page') {
          params['page'] = value + 1;
        }
      }
    });

  // Get the list of videos
  openVeoClient.post('/search/video', JSON.stringify(params), {}).then((result) => {
    result.pagination.page--;
    response.send(result);
  }).catch((error) => {
    return next(errors.SEARCH_ERROR);
  });
};

/**
 *
 */
module.exports.getSearchFiltersAction = (request, response, next) => {

  // Get list of filters with values
  openVeoClient.get('publish/property').then((filter) => {
    response.send(filter);
  }).catch((error) => {
//    let result = {origins: [], categories: [], names: []};
//
//      for (var i = 0; i < 12; i++) {
//        result.origins.push({label: 'origins' + i, 'id': i});
//        result.categories.push({label: 'categories' + i, 'id': i});
//        result.names.push({label: 'names' + i, 'id': i});
//      }
//       response.send(result);
    return next(errors.GET_SEARCH_FILTER_ERROR);
  });
};


module.exports.getVideoAction = (request, response, next) => {
  videoCache.getVideo(request.params.id, (error, video) => {
    if (error) {
      next(error);
      return;
    } else if (video.private && !request.isAuthenticated())
      response.send({needAuth: true});
    else
      response.send({entity: video});
  });
};

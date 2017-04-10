'use strict';

/**
 * @module controllers
 */

/**
 * Provides route actions for the search engine.
 *
 * @class searchController
 * @static
 */

const async = require('async');
const querystring = require('querystring');

const errors = process.require('app/server/httpErrors.js');
const openVeoApi = require('@openveo/api');
const conf = process.require('app/server/conf.js');

const webserviceClient = process.require('/app/server/WebserviceClient');

const videoCache = process.require('/app/server/serverCache/VideoCache');
const filterCache = process.require('/app/server/serverCache/FilterCache');
const VIDEO_PUBLISH_STATES = 12;

module.exports.searchAction = (request, response, next) => {
  const body = request.body || {};
  const orderedProperties = ['views', 'date'];
  const openVeoClient = webserviceClient.get();
  let params;
  let paginate;

  // Parse Filters
  try {
    params = openVeoApi.util.shallowValidateObject(body.filter, {
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

  // Public group filter not defined
  if (!conf.data.publicFilter.length || conf.data.publicFilter[0] == '') {
    process.logger.error(errors.CONF_ERROR.message, {error: errors.CONF_ERROR, method: 'searchAction'});
    return next(errors.CONF_ERROR);
  }

  // Add group filter

  // Add public groups
  params['groups'] = conf.data.publicFilter || [];

  if (request.isAuthenticated()) {

    // Add private groups
    if (conf.data.privateFilter)
      params['groups'] = params['groups'].concat(conf.data.privateFilter);

    // Add user groups
    if (request.user.groups.length)
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
};

module.exports.getSearchFiltersAction = (request, response, next) => {
  const filterCacheInstance = filterCache.getFilterCache();
  const filters = [];
  const series = [];
  const filtersId = conf.data.exposedFilter;
  const categoriesId = conf.data.categoriesFilter;
  if (categoriesId && categoriesId != '')
    series.push((callback) => {
      filterCacheInstance.getCategories(categoriesId, (error, categories) => {
        if (categories) {
          filters.push(categories);
        }
        callback();
      });
    });

  for (let i = 0; i < filtersId.length; i++) {
    series.push((callback) => {
      filterCacheInstance.getFilter(filtersId[i], (error, filter) => {
        if (filter && filter.type !== 'boolean') {
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
  const filterCacheInstance = filterCache.getFilterCache();
  filterCacheInstance.getCategories(conf.data.categoriesFilter, (error, categories) => {
    if (error) {
      next(error);
      return;
    } else {
      response.send(categories);
    }
  });
};

module.exports.getVideoAction = (request, response, next) => {
  const videoCacheInstance = videoCache.getVideoCache();
  videoCacheInstance.getVideo(request.params.id, (error, res) => {
    if (error) {
      next(error);
      return;
    }

    const isInPublicGroups = openVeoApi.util.intersectArray(res.entity.metadata.groups, conf.data.publicFilter).length;

    if (isInPublicGroups) {

      // Video is public
      response.send(res);

    } else if (!request.isAuthenticated()) {

      // User is not authenticated
      // Send need authent
      response.send({needAuth: true});

    } else {

      // User is authenticated
      // Find out if video is part of private groups or its groups
      // If video is part of these groups user is allowed to access the video

      const isInPrivateGroups = openVeoApi.util.intersectArray(
        res.entity.metadata.groups, conf.data.privateFilter
      ).length;
      const isInUserGroups = openVeoApi.util.intersectArray(
        res.entity.metadata.groups, request.user.groups
      ).length;

      if (isInPrivateGroups || isInUserGroups) response.send(res);
      else next(errors.GET_VIDEO_NOT_ALLOWED);
    }
  });
};

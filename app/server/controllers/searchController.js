'use strict';

/**
 * Provides default route action to deal with angularJS single page application.
 *
 * @module controllers
 * @class searchController
 */

const async = require('async');
const querystring = require('querystring');

const errors = process.require('app/server/httpErrors.js');
const openVeoApi = require('@openveo/api');
const conf = process.require('app/server/conf.js');

const webserviceClient = process.require('/app/server/WebserviceClient');
const openVeoClient = webserviceClient.getClient();

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

  // Add public group filter
  params['groups'] = conf.data.publicFilter;

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
    if (!params[key] && params[key] !== '') {
      params[`properties[${key}]`] = body.filter[key];
    }
  });

  // Parse pagination
  try {
    paginate = openVeoApi.util.shallowValidateObject(body.pagination, {
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

  const query = querystring.stringify(params);

  // Get the list of videos
  openVeoClient.get(`/publish/videos?${query}`).then((result) => {
    result.pagination.page--;
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

    const isInPublic = openVeoApi.util.intersectArray(res.entity.metadata.groups, conf.data.publicFilter);
    const isInPrivate = openVeoApi.util.intersectArray(res.entity.metadata.groups, conf.data.privateFilter);

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
        const isAllowed = openVeoApi.util.intersectArray(isInPrivate, request.user.groups);

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

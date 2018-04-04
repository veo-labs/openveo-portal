'use strict';

/**
 * @module controllers
 */

const openVeoApi = require('@openveo/api');
const portalConf = process.require('app/server/conf.js');
const SettingsProvider = process.require('app/server/providers/SettingsProvider.js');
const context = process.require('app/server/context.js');
const errors = process.require('app/server/httpErrors.js');
const ResourceFilter = openVeoApi.storages.ResourceFilter;

class LiveController extends openVeoApi.controllers.Controller {

  /**
   * Defines a LiveController to deal with the live page.
   *
   * @class LiveController
   * @extends Controller
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Handles default action to compute live page.
   *
   * @method defaultAction
   * @async
   * @param {Request} request ExpressJS HTTP Request
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  defaultAction(request, response, next) {
    const settingsProvider = new SettingsProvider(context.database);

    // Get live settings
    settingsProvider.getOne(new ResourceFilter().equal('id', 'live'), null, (error, settings) => {
      if (error) {
        process.logger.error(error.message, {error: error, method: 'defaultAction'});
        return next(errors.LIVE_GET_SETTING_ERROR);
      }

      if (settings.value.activated &&
          (!settings.value.private || ((request.user && request.user.hasLiveAccess) || false))
      ) {

        // Access to live granted

        response.locals.languages = ['"en"', '"fr"'];
        response.locals.error = false;
        response.locals.theme = portalConf.conf.theme;
        response.locals.live = settings ? JSON.stringify(settings.value) : JSON.stringify(null);
        response.render('live', response.locals);

      } else {

        // Access to live refused

        return next(errors.LIVE_FORBIDDEN);

      }

    });

  }

}

module.exports = LiveController;

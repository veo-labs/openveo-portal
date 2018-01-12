'use strict';

/**
 * @module controllers
 */

/**
 * Provides actions to deal with the live page.
 *
 * @class liveController
 * @static
 */

const portalConf = process.require('app/server/conf.js');
const SettingsModel = process.require('app/server/models/SettingsModel.js');
const SettingsProvider = process.require('app/server/providers/SettingsProvider.js');
const storage = process.require('app/server/storage.js');
const errors = process.require('app/server/httpErrors.js');

/**
 * Handles default action to compute live page.
 *
 * @method defaultAction
 * @static
 * @async
 * @param {Request} request ExpressJS HTTP Request
 * @param {Response} response ExpressJS HTTP Response
 * @param {Function} next Function to defer execution to the next registered middleware
 */
module.exports.defaultAction = (request, response, next) => {
  const settingsModel = new SettingsModel(new SettingsProvider(storage.getDatabase()));

  // Get live settings
  settingsModel.getOne('live', null, (error, settings) => {
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

};

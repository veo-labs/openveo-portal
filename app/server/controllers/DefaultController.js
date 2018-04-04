'use strict';

/**
 * @module controllers
 */

const path = require('path');
const cons = require('consolidate');
const openVeoApi = require('@openveo/api');
const portalConf = process.require('app/server/conf.js');
const SettingsProvider = process.require('app/server/providers/SettingsProvider.js');
const context = process.require('app/server/context.js');
const errors = process.require('app/server/httpErrors.js');
const applicationConf = process.require('conf.json');
const env = (process.env.NODE_ENV == 'production') ? 'prod' : 'dev';
const ResourceFilter = openVeoApi.storages.ResourceFilter;

class DefaultController extends openVeoApi.controllers.Controller {

  /**
   * Defines a DefaultController to deal with AngularJS single page application.
   *
   * @class DefaultController
   * @extends Controller
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Handles default action to display main HTML.
   *
   * If no other action were performed display the main template.
   * Main template loads libraries JavaScript files, Bootstrap CSS file and CSS file from the configured theme.
   *
   * @method defaultAction
   * @async
   * @param {Request} request ExpressJS HTTP Request
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  defaultAction(request, response, next) {
    const authConf = portalConf.serverConf.auth;
    const configuredAuth = (authConf && Object.keys(authConf)) || [];
    const settingsProvider = new SettingsProvider(context.database);

    // Get live settings
    settingsProvider.getOne(new ResourceFilter().equal('id', 'live'), null, (error, settings) => {
      if (error) {
        process.logger.error(error.message, {error: error, method: 'defaultAction'});
        return next(errors.DEFAULT_GET_SETTING_ERROR);
      }

      // Retrieve the list of scripts and css files from configuration
      response.locals.librariesScriptsBase = applicationConf['scriptLibFiles']['base'] || [];
      response.locals.librariesScripts = applicationConf['scriptLibFiles'][env] || [];
      response.locals.librariesScripts = response.locals.librariesScriptsBase.concat(response.locals.librariesScripts);
      response.locals.scriptsBase = applicationConf['scriptFiles']['base'] || [];
      response.locals.scripts = applicationConf['scriptFiles'][env] || [];
      response.locals.scripts = response.locals.scriptsBase.concat(response.locals.scripts);
      response.locals.css = Object.assign([], applicationConf['cssFiles']) || [];
      response.locals.languages = ['"en"', '"fr"'];
      response.locals.theme = portalConf.conf.theme;
      response.locals.useDialog = portalConf.conf.useDialog;
      response.locals.user = request.isAuthenticated() ? JSON.stringify(request.user) : JSON.stringify(null);
      response.locals.authenticationMechanisms = JSON.stringify(configuredAuth);
      response.locals.authenticationStrategies = JSON.stringify(openVeoApi.passport.STRATEGIES);
      response.locals.superAdminId = portalConf.superAdminId;
      response.locals.live = settings && settings.value.activated &&
        (
          !settings.value.private ||
          ((request.user && request.user.hasLiveAccess) || false)
        );
      response.locals.live = response.locals.live || false;

      // Add theme css file
      response.locals.css.push(`/themes/${portalConf.conf.theme}/style.css`);

      // Retrieve analytics template and render root with analytics
      const analyticsPath = path.join(process.root, '/assets/themes/', portalConf.conf.theme, 'analytics.html');
      cons.mustache(analyticsPath, {}, (err, html) => {
        if (err) response.render('root', response.locals);
        else {
          response.locals.analytics = html;
          response.render('root', response.locals);
        }
      });
    });

  }

  /**
   * Handles administration default action to display root HTML.
   *
   * @method defaultBackOfficeAction
   * @async
   * @param {Request} request ExpressJS HTTP Request
   * @param {Object} request.user The connected user
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  defaultBackOfficeAction(request, response) {
    response.locals.user = request.isAuthenticated() ? JSON.stringify(request.user) : JSON.stringify(null);
    response.render('index', response.locals);
  }

  /**
   * Handles default web service actions.
   *
   * Send back an HTTP code 404.
   *
   * @method defaultWebServiceAction
   * @async
   * @param {Request} request ExpressJS HTTP Request
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  defaultWebServiceAction(request, response, next) {
    next(errors.PATH_NOT_FOUND);
  }

}

module.exports = DefaultController;

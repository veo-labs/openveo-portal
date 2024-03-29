'use strict';

/**
 * @module portal/controllers/DefaultController
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
   * @see {@link https://github.com/veo-labs/openveo-api|OpenVeo API documentation} for more information about Controller
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
   * @param {Request} request ExpressJS HTTP Request
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  defaultAction(request, response, next) {
    const authConf = portalConf.serverConf.auth;
    const configuredAuth = (authConf && Object.keys(authConf)) || [];
    const settingsProvider = new SettingsProvider(context.database);

    // Get both live and search settings
    settingsProvider.getAll(
      new ResourceFilter().or([
        new ResourceFilter().equal('id', 'live'),
        new ResourceFilter().equal('id', 'search')
      ]),
      null,
      {id: 'desc'},
      (error, settings) => {
        if (error) {
          process.logger.error(error.message, {error: error, method: 'defaultAction'});
          return next(errors.DEFAULT_GET_SETTING_ERROR);
        }
        var liveSettings = null;
        var searchSettings = null;

        if (settings[0] && settings[0].id === 'live') liveSettings = settings[0].value;
        else if (settings[1] && settings[1].id === 'live') liveSettings = settings[1].value;
        if (settings[0] && settings[0].id === 'search') searchSettings = settings[0].value;
        else if (settings[1] && settings[1].id === 'search') searchSettings = settings[1].value;

        // Retrieve the list of scripts and css files from configuration
        response.locals.librariesScriptsBase = [];
        response.locals.css = [];

        if (applicationConf['libraries']) {
          response.locals.librariesScriptsBase.concat(applicationConf['libraries'].map((library) => {
            if (library.files) {
              library.files.forEach((filePath) => {
                const fileUri = path.join(library.mountPath, filePath);
                if (/.css$/.test(fileUri)) response.locals.css.push(fileUri);
                else if (/.js$/.test(fileUri)) response.locals.librariesScriptsBase.push(fileUri);
              });
            }
          }));
        }

        if (liveSettings) {
          liveSettings.activated = liveSettings.activated && (
            !liveSettings.private ||
            ((request.user && request.user.hasLiveAccess) || false)
          );
        } else {
          liveSettings = {activated: false};
        }

        response.locals.librariesScripts = applicationConf['scriptLibFiles'][env] || [];
        response.locals.librariesScripts =
          response.locals.librariesScriptsBase.concat(response.locals.librariesScripts);
        response.locals.scripts = applicationConf['scriptFiles'][env] || [];
        response.locals.css = response.locals.css.concat(applicationConf['cssFiles']);
        response.locals.languages = ['"en"', '"fr"'];
        response.locals.theme = portalConf.conf.theme;
        response.locals.useDialog = portalConf.conf.useDialog;
        response.locals.user = request.isAuthenticated() ? JSON.stringify(request.user) : JSON.stringify(null);
        response.locals.authenticationMechanisms = JSON.stringify(configuredAuth);
        response.locals.authenticationStrategies = JSON.stringify(openVeoApi.passport.STRATEGIES);
        response.locals.superAdminId = portalConf.superAdminId;
        response.locals.live = JSON.stringify(liveSettings);
        response.locals.search = JSON.stringify(searchSettings || {});

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
      }
    );

  }

  /**
   * Handles administration default action to display root HTML.
   *
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
   * @param {Request} request ExpressJS HTTP Request
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  defaultWebServiceAction(request, response, next) {
    next(errors.PATH_NOT_FOUND);
  }

}

module.exports = DefaultController;

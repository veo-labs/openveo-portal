'use strict';

/**
 * @module controllers
 */

/**
 * Provides default route action to deal with angularJS single page application.
 *
 * @class defaultController
 * @static
 */

const path = require('path');
const cons = require('consolidate');
const portalConf = process.require('app/server/conf.js');
const applicationConf = process.require('conf.json');
const env = (process.env.NODE_ENV == 'production') ? 'prod' : 'dev';

/**
 * Handles default action to display main HTML.
 *
 * If no other action were performed display the main template.
 * Main template loads libraries JavaScript files, Bootstrap CSS file and CSS file from the configured theme.
 *
 * @method defaultAction
 * @static
 * @async
 * @param {Request} request ExpressJS HTTP Request
 * @param {Response} response ExpressJS HTTP Response
 * @param {Function} next Function to defer execution to the next registered middleware
 */
module.exports.defaultAction = (request, response) => {

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

  // Add user information
  response.locals.user = request.isAuthenticated() ? JSON.stringify(request.user) : JSON.stringify(null);

  // Add available authentication mechanisms
  const authConf = portalConf.serverConf.auth;
  response.locals.authenticationMechanisms = authConf && JSON.stringify(Object.keys(authConf));

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
};

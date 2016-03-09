'use strict';

/**
 * @module controllers
 */

/**
 * Provides default route action to deal with angularJS single page application.
 *
 * @class defaultController
 */

const path = require('path');
const openveoAPI = require('@openveo/api');
const configurationDirectoryPath = path.join(openveoAPI.fileSystem.getConfDir(), 'portal');
const portalConf = require(path.join(configurationDirectoryPath, 'conf.json'));
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
  response.locals.theme = portalConf.theme;
  response.locals.user = request.isAuthenticated ? request.user : null;

  // Add theme css file
  response.locals.css.push(`/themes/${portalConf.theme}/style.css`);

  response.render('root', response.locals);
};

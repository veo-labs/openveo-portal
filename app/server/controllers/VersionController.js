'use strict';

/**
 * @module controllers
 */

const semver = require('semver');
const https = require('https');
const openVeoApi = require('@openveo/api');
const packageConf = process.require('package.json');

class VersionController extends openVeoApi.controllers.Controller {

  /**
   * Defines a VersionController to deal with project version.
   *
   * @class VersionController
   * @extends Controller
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Handles version action to get information about OpenVeo Portal version.
   *
   * It requests Github atom feed to get the latest available version of OpenVeo Portal.
   * Then version is compared to actual one using semver. Unstable versions (beta, alpha and release candidate are
   * ignored).
   *
   * @method getVersionAction
   * @async
   * @param {Request} request ExpressJS HTTP Request
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  getVersionAction(request, response, next) {
    const info = {
      version: packageConf.version
    };

    https.get(`${packageConf.homepage}/tags.atom`, (result) => {
      let error;
      const statusCode = result.statusCode;
      const contentType = result.headers['content-type'];

      if (statusCode !== 200)
        error = new Error(`Request Failed. Status Code: ${statusCode}`);
      else if (!/^application\/atom\+xml/.test(contentType))
        error = new Error(`Invalid content-type. Expected application/atom+xml but received ${contentType}`);

      if (error) {

        // Consume response data to free up memory
        process.logger.error(error.message, {error: error, method: 'versionController.getVersionAction'});
        result.resume();
        return response.send(info);

      }

      let rawData = '';
      result.setEncoding('utf8');
      result.on('data', (chunk) => {
        rawData += chunk;
      });
      result.on('end', () => {

        // Filter feed lines to keep only lines containing an XML "id" tag with a version number containing
        // exclusively numbers and dots to eliminate release candidate / alpha and beta versions
        let ids = rawData.match(/<id>.*\/([0-9.]*)<\/id>/gi);

        // Latest version is the first one
        info.latestVersion = /<id>.*\/([^<]*)<\/id>/.exec(ids[0])[1];
        info.latestVersionReleaseUrl = `${packageConf.homepage}/releases/${info.latestVersion}`;
        info.versionReleaseUrl = `${packageConf.homepage}/releases/${info.version}`;
        info.versionSourcesUrl = `${packageConf.homepage}/tree/${info.version}`;
        info.updateAvailable = semver.compare(info.version, info.latestVersion) === -1;

        response.send(info);
      });
    }).on('error', (error) => {
      process.logger.error(error.message, {error: error, method: 'versionController.getVersionAction'});
      response.send(info);
    });
  }

}

module.exports = VersionController;

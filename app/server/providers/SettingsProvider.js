'use strict';

/**
 * @module providers
 */

const openVeoApi = require('@openveo/api');

class SettingsProvider extends openVeoApi.providers.EntityProvider {

  /**
   * Defines an EntityProvider to get and save settings.
   *
   * @extends SettingsProvider
   * @constructor
   * @param {Database} database The database to interact with
   */
  constructor(database) {
    super(database, 'portal_settings');
  }

}

module.exports = SettingsProvider;

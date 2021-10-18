'use strict';

/**
 * @module portal/providers/SettingsProvider
 */

const async = require('async');
const openVeoApi = require('@openveo/api');
const ResourceFilter = openVeoApi.storages.ResourceFilter;

class SettingsProvider extends openVeoApi.providers.EntityProvider {

  /**
   * Defines an EntityProvider to get and save settings.
   *
   * @class SettingsProvider
   * @extends EntityProvider
   * @constructor
   * @param {Database} database The database to interact with
   * @see {@link https://github.com/veo-labs/openveo-api|OpenVeo API documentation} for more information about Database and EntityProvider
   */
  constructor(database) {
    super(database, 'portal_settings');
  }

  /**
   * Adds settings.
   *
   * If a setting already exists, an update is performed.
   *
   * @param {Array} settings The list of settings to store
   * @param {String} settings[].id The setting key
   * @param {*} settings[].value The setting value
   * @param {module:portal/providers/SettingsProvider~SettingsProvider~addCallback} [callback] The function to call
   * when it's done
   */
  add(settings, callback) {
    const settingsToAdd = [];
    const settingsToUpdate = [];
    const asyncFunctions = [];
    const settingIds = [];

    for (let setting of settings) {
      if (!setting.id)
        return this.executeCallback(callback, new TypeError('An id is required to create a setting'));

      settingIds.push(setting.id);
    }

    // Find all settings with the given ids
    this.get(
      new ResourceFilter().in('id', settingIds),
      {
        include: ['id']
      },
      settingIds.length,
      null,
      null,
      (getError, fetchedSettings) => {
        if (getError) return this.executeCallback(callback, getError);

        // Validate settings
        // Dissociate settings that will be added and settings that will be updated
        for (let setting of settings) {
          let exists = false;

          for (let fetchedSetting of fetchedSettings) {
            if (setting.id === fetchedSetting.id) {

              // Setting already exists
              // Add it to the list of settings to update
              settingsToUpdate.push({
                id: setting.id,
                value: setting.value
              });

              exists = true;
              break;
            }
          }

          if (exists) break;

          // Setting does not exist yet
          // Add it to the list of settings to insert
          settingsToAdd.push({
            id: setting.id,
            value: setting.value
          });
        }

        // Prepare function to add settings
        asyncFunctions.push((callback) => {
          if (!settingsToAdd.length) return callback();
          super.add(settingsToAdd, callback);
        });

        // Prepare functions to update settings
        settingsToUpdate.forEach((settingToUpdate) => {
          asyncFunctions.push((callback) => {
            this.updateOne(
              new ResourceFilter().equal('id', settingToUpdate.id),
              {
                value: settingToUpdate.value
              },
              callback
            );
          });
        });

        // Add / update settings
        async.parallel(asyncFunctions, (error, results) => {
          const totalAddedSettings = (results[0] && results[0][0]) || 0;
          const addedSettings = (results[0] && results[0][1]) || [];
          const total = settingsToUpdate.length + totalAddedSettings;
          this.executeCallback(callback, error, total, addedSettings.concat(settingsToUpdate));
        });
      }
    );
  }

  /**
   * Updates a setting.
   *
   * @param {ResourceFilter} [filter] Rules to filter the setting to update
   * @param {Object} data The modifications to perform
   * @param {*} data.value The setting value
   * @param {module:portal/providers/SettingsProvider~SettingsProvider~updateOneCallback} [callback] The function to
   * call when it's done
   */
  updateOne(filter, data, callback) {
    const modifications = {};
    modifications.value = data.value;

    super.updateOne(filter, modifications, callback);
  }

}

module.exports = SettingsProvider;

/**
 * @callback module:portal/providers/SettingsProvider~SettingsProvider~addCallback
 * @param {(Error|undefined)} error The error if an error occurred
 * @param {Number} total The total amount of settings inserted / updated
 * @param {Array} settings The list of added / updated settings
 */

/**
 * @callback module:portal/providers/SettingsProvider~SettingsProvider~updateOneCallback
 * @param {(Error|undefined)} error The error if an error occurred
 * @param {Number} total 1 if everything went fine
 */

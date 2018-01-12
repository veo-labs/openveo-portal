'use strict';

/**
 * @module models
 */

const openVeoApi = require('@openveo/api');

class SettingsModel extends openVeoApi.models.EntityModel {

  /**
   * Defines a SettingsModel to manipulate settings.
   *
   * @class SettingsModel
   * @constructor
   * @param {SettingsProvider} provider The settings provider
   */
  constructor(provider) {
    super(provider);
  }

  /**
   * Adds a new setting.
   *
   * If setting already exists with the given id, no addition is performed.
   *
   * @method add
   * @async
   * @param {Object} data Setting data
   * @param {String} data.id Setting id
   * @param {Mixed} data.value Setting value
   * @param {Function} callback The function to call when it's done
   *   - **Error** The error if an error occurred, null otherwise
   *   - **Number** The total amount of items inserted
   *   - **Object** The added setting
   */
  add(data, callback) {
    this.getOne(data.id, null, (error, setting) => {
      if (error) return callback(error);
      if (setting) return callback(null, 0, setting);

      this.provider.add({
        id: data.id,
        value: data.value
      }, (error, insertCount, documents) => {
        if (callback) {
          if (error)
            callback(error);
          else
            callback(null, insertCount, documents[0]);
        }
      });
    });
  }

  /**
   * Updates a setting.
   *
   * If setting does not exist it is automatically created.
   *
   * @method update
   * @async
   * @param {String} id The id of setting to update
   * @param {Object} data Setting data
   * @param {Mixed} data.value Setting value
   * @param {Function} callback The function to call when it's done
   *   - **Error** The error if an error occurred, null otherwise
   *   - **Number** The number of updated / added items
   */
  update(id, data, callback) {
    this.provider.update(id, data, (error, updatedCount) => {
      if (!updatedCount) {
        this.add({
          id: id,
          value: data.value
        }, (addError) => {
          if (addError) return callback(error);
          callback(null, 1);
        });
      } else
        callback(error, updatedCount);
    });
  }

}

module.exports = SettingsModel;

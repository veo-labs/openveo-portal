'use strict';

/**
 * @module controllers
 */

const openVeoApi = require('@openveo/api');
const errors = process.require('app/server/httpErrors.js');
const SettingsModel = process.require('app/server/models/SettingsModel.js');
const SettingsProvider = process.require('app/server/providers/SettingsProvider.js');
const storage = process.require('app/server/storage.js');

/**
 * Provides route actions to manipulate portal settings.
 *
 * @class settingsController
 * @static
 */

/**
 * Handles settings action to get an OpenVeo Portal settings.
 *
 * @method getEntityAction
 * @static
 * @async
 * @param {Request} request ExpressJS HTTP Request
 * @param {String} request.params.id The setting id to retrieve
 * @param {Response} response ExpressJS HTTP Response
 * @param {Function} next Function to defer execution to the next registered middleware
 */
module.exports.getEntityAction = (request, response, next) => {
  if (request.params.id) {
    const entityId = request.params.id;
    const model = new SettingsModel(new SettingsProvider(storage.getDatabase()));

    model.getOne(entityId, null, function(error, entity) {
      if (error) {
        process.logger.error(error.message, {error: error, method: 'getEntityAction', entity: entityId});
        next(errors.GET_SETTING_ERROR);
      } else if (!entity) {
        response.send({
          entity: null
        });
      } else {
        response.send({
          entity: entity
        });
      }
    });
  } else {

    // Missing id of the setting
    next(errors.GET_SETTING_MISSING_PARAMETERS);

  }
};

/**
 * Handles settings action to update OpenVeo Portal a setting.
 *
 * @method updateEntityAction
 * @static
 * @async
 * @param {Request} request ExpressJS HTTP Request
 * @param {Object} request.params Request's parameters
 * @param {String} request.params.id The setting id to update
 * @param {Object} request.body Request's body
 * @param {String} [request.body.value] Settings
 * @param {Response} response ExpressJS HTTP Response
 * @param {Function} next Function to defer execution to the next registered middleware
 */
module.exports.updateEntityAction = (request, response, next) => {
  if (request.params.id && request.body && request.body.value) {
    const model = new SettingsModel(new SettingsProvider(storage.getDatabase()));
    const entityId = request.params.id;
    let value;

    // Validate settings value depending on settings name
    if (entityId === 'live') {
      try {
        value = openVeoApi.util.shallowValidateObject(request.body.value, {
          activated: {type: 'boolean', required: true, default: false},
          playerType: {type: 'string', in: ['wowza', 'youtube']},
          url: {type: 'string'},
          private: {type: 'boolean'},
          groups: {type: 'array<string>'},
          wowza: {type: 'object'}
        });

        if (value.activated) {
          var type = value.playerType;
          if (!type ||
              !value.url ||
              (value.private && !value.groups.length) ||
              (type === 'wowza' && !value.wowza) ||
              (type === 'youtube' && !/^https:\/\/www\.youtube\.com\/watch\?v=.+/.test(value.url)) ||
              (type === 'wowza' && !/^https?:\/\/[^:/]*(:[0-9]+)?\/[^/]+\/[^/]+\/playlist.m3u8$/.test(value.url)) ||
              (type === 'wowza' && !/^([a-zA-Z0-9]{5}-)*[a-zA-Z0-9]{5}$/.test(value.wowza.playerLicenseKey))
          ) {
            return next(errors.UPDATE_SETTINGS_WRONG_PARAMETERS);
          }
        }

      } catch (error) {
        return next(errors.UPDATE_SETTINGS_WRONG_PARAMETERS);
      }
    }

    model.update(entityId, {
      value: value
    }, function(error, updateCount) {
      if (error) {
        process.logger.error((error && error.message) || 'Fail updating',
                             {method: 'updateEntityAction', entity: entityId});
        next(errors.UPDATE_SETTINGS_ERROR);
      } else {
        response.send({error: null, status: 'ok'});
      }
    });
  } else {

    // Missing id of the setting or the datas
    next(errors.UPDATE_SETTINGS_MISSING_PARAMETERS);

  }
};

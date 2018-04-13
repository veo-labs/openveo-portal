'use strict';

/**
 * @module controllers
 */

const openVeoApi = require('@openveo/api');
const errors = process.require('app/server/httpErrors.js');
const SettingsProvider = process.require('app/server/providers/SettingsProvider.js');
const context = process.require('app/server/context.js');
const ResourceFilter = openVeoApi.storages.ResourceFilter;

class SettingsController extends openVeoApi.controllers.EntityController {

  /**
   * Defines a SettingsController to deal with portal settings.
   *
   * @class SettingsController
   * @extends Controller
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Gets an instance of the entity provider associated to the controller.
   *
   * @method getProvider
   * @return {SettingsProvider} The provider
   */
  getProvider() {
    return new SettingsProvider(context.database);
  }

  /**
   * Handles settings action to get an OpenVeo Portal setting.
   *
   * @example
   *
   *     // Response example
   *     {
   *       "entity" : { ... }
   *     }
   *
   * @method getEntityAction
   * @async
   * @param {Request} request ExpressJS HTTP Request
   * @param {String} request.params.id The setting id to retrieve
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  getEntityAction(request, response, next) {
    if (request.params.id) {
      const settingId = request.params.id;
      const provider = this.getProvider();

      provider.getOne(new ResourceFilter().equal('id', settingId), null, function(error, setting) {
        if (error) {
          process.logger.error(error.message, {error: error, method: 'getEntityAction', entity: settingId});
          return next(errors.GET_SETTING_ERROR);
        }

        response.send({
          entity: (!setting) ? null : setting
        });
      });
    } else {

      // Missing id of the setting
      next(errors.GET_SETTING_MISSING_PARAMETERS);

    }
  }

  /**
   * Handles settings action to update OpenVeo Portal a setting.
   *
   * @example
   *
   *     // Response example
   *     {
   *       "total": 1
   *     }
   *
   * @method updateEntityAction
   * @async
   * @param {Request} request ExpressJS HTTP Request
   * @param {Object} request.params Request's parameters
   * @param {String} request.params.id The setting id to update
   * @param {Object} request.body Request's body
   * @param {String} [request.body.value] Settings
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  updateEntityAction(request, response, next) {
    if (request.params.id && request.body && request.body.value) {
      const provider = new SettingsProvider(context.database);
      const settingId = request.params.id;
      let value;

      // Validate settings value depending on settings name
      if (settingId === 'live') {
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

      provider.add([
        {
          id: settingId,
          value
        }
      ], function(error, total) {
        if (error) {
          process.logger.error((error && error.message) || 'Fail updating',
                               {method: 'updateEntityAction', entity: settingId});
          next(errors.UPDATE_SETTINGS_ERROR);
        } else {
          response.send({total});
        }
      });
    } else {

      // Missing id of the setting or the datas
      next(errors.UPDATE_SETTINGS_MISSING_PARAMETERS);

    }
  }

  /**
   * Adds settings.
   *
   * It is not possible to add several settings for now, use update instead.
   *
   * @method addEntitiesAction
   * @async
   * @param {Request} request ExpressJS HTTP Request
   * @param {Response} response ExpressJS HTTP Response
   * @param {Function} next Function to defer execution to the next registered middleware
   */
  addEntitiesAction(request, response, next) {
    throw new Error('addEntitiesAction method not available for settings');
  }

}

module.exports = SettingsController;
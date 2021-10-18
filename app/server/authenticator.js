'use strict';

/**
 * The authenticator helps manipulate users authenticated by passport strategies.
 *
 * Users returned by passport are not necessary OpenVeo Portal users. It could be users from a third party
 * authentication server. The authenticator helps making sure that the authenticated user is a ready to
 * use OpenVeo Portal user.
 *
 * @module portal/authenticator
 */

const async = require('async');
const openVeoApi = require('@openveo/api');
const SettingsProvider = process.require('app/server/providers/SettingsProvider.js');
const UserProvider = process.require('app/server/providers/UserProvider.js');
const conf = process.require('app/server/conf.js');
const context = process.require('app/server/context.js');
const ResourceFilter = openVeoApi.storages.ResourceFilter;

/**
 * Populates user with permissions.
 *
 * @method populateUser
 * @private
 * @param {Object} user The user to populate
 * @param {Array} [user.id] The user id
 * @param {module:portal/authenticator~populateUserCallback} callback The function to call when it's done
 */
function populateUser(user, callback) {
  if (user.id === conf.superAdminId) user.hasLiveAccess = true;
  if (!user.groups || !user.groups.length) return callback(null, user);

  // Get live settings
  const settingsProvider = new SettingsProvider(context.database);
  settingsProvider.getOne(new ResourceFilter().equal('id', 'live'), null, (error, setting) => {
    if (error) return callback(error);
    user.hasLiveAccess = openVeoApi.util.intersectArray(
      user.groups, setting && setting.value && setting.value.groups ? setting.value.groups : []
    ).length ? true : false;

    callback(null, user);
  });
}

/**
 * Serializes only essential user information required to retrieve it later.
 *
 * @method serializeUser
 * @static
 * @param {Object} user The user to serialize
 * @param {module:portal/authenticator~serializeUserCallback} callback The function to call when it's done
 */
module.exports.serializeUser = (user, callback) => {
  if (!user || !user.id)
    return callback(new Error(`Could not serialize user: unknown user "${(user ? user.id : '')}"`));

  callback(null, user.id);
};

/**
 * Fetches a user from serialized data.
 *
 * @method deserializeUser
 * @static
 * @param {String} data Serialized data as serialized by serializeUser(), the id of the user
 * @param {module:portal/authenticator~deserializeUserCallback} callback The function to call when it's done
 */
module.exports.deserializeUser = (data, callback) => {
  const userProvider = new UserProvider(context.database);

  userProvider.getOne(new ResourceFilter().equal('id', data), null, (error, user) => {
    if (error) return callback(error);
    if (!user) return callback(new Error(`Unkown user "${data}"`));
    populateUser(user, callback);
  });
};

/**
 * Verifies a user as returned by the passport local strategy.
 *
 * @method verifyUserByCredentials
 * @static
 * @param {String} email User's email
 * @param {String} password User's password
 * @param {module:portal/authenticator~verifyUserByCredentialsCallback} callback Function to call when its done
 */
module.exports.verifyUserByCredentials = (email, password, callback) => {
  const userProvider = new UserProvider(context.database);

  userProvider.getUserByCredentials(email, password, (error, user) => {
    if (error) return callback(error);
    if (!user) return callback(new Error(`Email and / or password incorrect for "${email}"`));
    populateUser(user, callback);
  });
};

/**
 * Verifies user as returned by third party providers.
 *
 * OpenVeo Portal trusts users from third party providers, if the user does not exist in OpenVeo Portal
 * it is created with minimum information.
 *
 * @method verifyUserAuthentication
 * @static
 * @param {Object} thirdPartyUser The user from the third party provider
 * @param {String} strategy The id of the strategy
 * @param {module:portal/authenticator~verifyUserAuthenticationCallback} callback Function to call when its done
 */
module.exports.verifyUserAuthentication = (thirdPartyUser, strategy, callback) => {
  const strategyConfiguration = conf.serverConf.auth[strategy];
  const groupAssociations = strategyConfiguration.groupAssociations;
  const thirdPartyIdAttribute = strategyConfiguration.userIdAttribute;
  const thirdPartyNameAttribute = strategyConfiguration.userNameAttribute;
  const thirdPartyEmailAttribute = strategyConfiguration.userEmailAttribute;
  const thirdPartyGroupAttribute = strategyConfiguration.userGroupAttribute;
  const userProvider = new UserProvider(context.database);
  const originId = openVeoApi.util.evaluateDeepObjectProperties(thirdPartyIdAttribute, thirdPartyUser);
  const thirdPartyUserName = openVeoApi.util.evaluateDeepObjectProperties(thirdPartyNameAttribute, thirdPartyUser);
  const thirdPartyUserEmail = openVeoApi.util.evaluateDeepObjectProperties(thirdPartyEmailAttribute, thirdPartyUser);
  let originGroups = openVeoApi.util.evaluateDeepObjectProperties(thirdPartyGroupAttribute, thirdPartyUser);
  let user;
  let exists = false;
  let groups = [];
  originGroups = originGroups || [];
  originGroups = (Array.isArray(originGroups)) ? originGroups : originGroups.split(',');

  async.series([

    // Test if user already exists in OpenVeo
    (callback) => {
      if (originId) {
        userProvider.getAll(
          new ResourceFilter().equal('origin', strategy).equal('originId', originId),
          null,
          {
            id: 'desc'
          },
          (error, users) => {
            if (error) return callback(error);
            if (users && users.length) {
              exists = true;
              user = users[0];
            }
            callback();
          }
        );
      } else {
        exists = false;
        callback();
      }
    },

    // Match third party user groups with OpenVeo content groups
    (callback) => {
      if (!originGroups) return callback();

      if (groupAssociations && groupAssociations.length) {

        // Look for third party user group inside OpenVeo Portal configuration
        groupAssociations.forEach((groupAssociation) => {
          if (originGroups.indexOf(groupAssociation.group) >= 0)
            groups = groups.concat(groupAssociation.groups);
        });
      }
      callback();
    },

    // Create user if it does not exist yet
    (callback) => {
      if (exists) return callback();

      userProvider.addThirdPartyUsers([
        {
          name: thirdPartyUserName,
          email: thirdPartyUserEmail,
          origin: strategy,
          originId,
          originGroups,
          groups
        }
      ], (error, total, addedUsers) => {
        if (addedUsers) user = addedUsers[0];
        callback(error);
      });
    },

    // Update user if information from third party provider have changed (name, email, group)
    (callback) => {
      if (user.name !== thirdPartyUserName ||
          user.email !== thirdPartyUserEmail ||
          !openVeoApi.util.areSameArrays(user.originGroups, originGroups) ||
          !openVeoApi.util.areSameArrays(user.groups, groups)
      ) {

        user.name = thirdPartyUserName;
        user.email = thirdPartyUserEmail;
        user.groups = groups;
        user.originGroups = originGroups;

        userProvider.updateThirdPartyUser(
          new ResourceFilter().equal('id', user.id),
          {
            name: user.name,
            email: user.email,
            originGroups: user.originGroups,
            groups: user.groups
          },
          strategy,
          callback
        );
      } else
        callback();
    },

    // Populate user with permissions
    (callback) => {
      populateUser(user, callback);
    }

  ], (error, results) => {
    callback(error, user);
  });

};

/**
 * @callback module:portal/authenticator~populateUserCallback
 * @param {(Error|undefined)} error The error if an error occurred
 * @param {Object} user The populated user
 */

/**
 * @callback module:portal/authenticator~serializeUserCallback
 * @param {(Error|undefined)} error The error if an error occurred
 * @param {String} serializedUser The serialized user information
 */

/**
 * @callback module:portal/authenticator~deserializeUserCallback
 * @param {(Error|undefined)} error The error if an error occurred
 * @param {Object} user The user with its permissions
 */

/**
 * @callback module:portal/authenticator~verifyUserByCredentialsCallback
 * @param {(Error|undefined)} error The error if an error occurred
 * @param {Object} user The user with its permissions
 */

/**
 * @callback module:portal/authenticator~verifyUserAuthenticationCallback
 * @param {(Error|undefined)} error The error if an error occurred
 * @param {Object} user The user with its permissions
 */

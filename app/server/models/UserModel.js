'use strict';

/**
 * @module models
 */

const crypto = require('crypto');
const path = require('path');
const shortid = require('shortid');
const async = require('async');
const openVeoApi = require('@openveo/api');
const configDir = openVeoApi.fileSystem.getConfDir();
const conf = require(path.join(configDir, 'portal/conf.json'));

class UserModel extends openVeoApi.models.EntityModel {

  /**
   * Defines a UserModel to manipulate back end users.
   *
   * @class UserModel
   * @extends EntityModel
   * @constructor
   * @param {UserProvider} provider The entity provider
   */
  constructor(provider) {
    super(provider);
  }

  /**
   * Gets a local user by credentials.
   *
   * @method getUserByCredentials
   * @async
   * @param {String} email The email of the user
   * @param {String} password The password of the user
   * @param {Function} callback The function to call when it's done
   *   - **Error** The error if an error occurred, null otherwise
   *   - **Object** The user
   */
  getUserByCredentials(email, password, callback) {
    password = crypto.createHmac('sha256', conf.passwordHashKey).update(password).digest('hex');
    this.provider.getUserByCredentials(email, password, callback);
  }

  /**
   * Adds a new user.
   *
   * @method add
   * @async
   * @param {Object} data A user object
   * @param {String} data.name User's name
   * @param {String} data.email User's email
   * @param {String} data.password User's password
   * @param {String} data.passwordValidate User's password validation
   * @param {String} [data.id] User's id, if not specified an id will be generated
   * @param {String} [data.origin] User's origin, default to local
   * @param {Array} [data.groups] User's group ids
   * @param {Boolean} [data.locked=false] true to lock user from modifications
   * @param {Function} [callback] The function to call when it's done
   *   - **Error** The error if an error occurred, null otherwise
   *   - **Number** The total amount of items inserted
   *   - **Object** The inserted user
   */
  add(data, callback) {
    if (!data.name || !data.email || !data.password) {
      callback(new Error('Requires name, email and password to add a user'));
      return;
    }

    // Validate password
    if (data.password !== data.passwordValidate) {
      callback(new Error('Passwords do not match'));
      return;
    }

    // Validate email
    if (!openVeoApi.util.isEmailValid(data.email)) {
      callback(new Error(`Invalid email address ${data.email}`));
      return;
    }

    // Verify if the email address is not already used
    this.provider.getUserByEmail(data.email, (error, user) => {
      if (error || user)
        callback(new Error(`Email "${data.email}" not available`));
      else {
        const password = crypto.createHmac('sha256', conf.passwordHashKey).update(data.password).digest('hex');

        // Build user object
        user = {
          id: data.id || shortid.generate(),
          name: data.name,
          email: data.email,
          password: password,
          locked: data.locked || false,
          origin: data.origin || openVeoApi.passport.STRATEGIES.LOCAL,
          groups: data.groups || []
        };

        this.provider.add(user, (error, addedCount, users) => {
          delete user['password'];
          if (callback) callback(error, addedCount, user);
        });
      }
    });

  }

  /**
   * Updates a user.
   *
   * @method update
   * @async
   * @param {String} id The id of the user to update
   * @param {Object} data A user object
   * @param {String} [data.email] User's email
   * @param {String} [data.password] User's password
   * @param {String} [data.passwordValidate] User's password validation
   * @param {Boolean} [data.locked=false] true to lock user from edition
   * @param {Function} callback The function to call when it's done
   *   - **Error** The error if an error occurred, null otherwise
   *   - **Number** The number of updated items
   */
  update(id, data, callback) {
    let updatedItems;

    // Validate password
    if (data.password) {
      if (data.password !== data.passwordValidate) {
        callback(new Error('Passwords does not match'));
        return;
      } else {
        const password = crypto.createHmac('sha256', conf.passwordHashKey).update(data.password).digest('hex');
        data.password = password;
        delete data.passwordValidate;
      }
    }

    // Validate email
    if (data.email && !openVeoApi.util.isEmailValid(data.email)) {
      callback(new Error('Invalid email address'));
      return;
    }

    async.series([

      // Verify if the email address is not already used
      (callback) => {
        if (!data.email) return callback();

        this.provider.getUserByEmail(data.email, (error, user) => {
          if (error) return callback(error);
          if (user && user.id != id) return callback(new Error('Email not available'));
          callback();
        });
      },

      // Update user
      (callback) => {
        this.provider.update(id, data, null, (error, totalItems) => {
          if (error) return callback(error);
          updatedItems = totalItems;
          callback();
        });
      }

    ], (error) => {
      callback(error, updatedItems);
    });
  }

  /**
   * Adds a third party provider user.
   *
   * @method addThirdPartyUser
   * @async
   * @param {Object} data A user object
   * @param {String} data.name User's name
   * @param {String} data.email User's email
   * @param {String} [data.id] User's id, if not specified an id will be generated
   * @param {Array} [data.groups] User's group ids
   * @param {String} origin Id of the third party provider system
   * @param {String} originId The user id in third party provider system
   * @param {Array} [originGroups] The user groups in third party provider system
   * @param {Function} [callback] The function to call when it's done
   *   - **Error** The error if an error occurred, null otherwise
   *   - **Number** The total amount of items inserted
   *   - **Object** The inserted user
   */
  addThirdPartyUser(data, origin, originId, originGroups, callback) {
    if (!origin || !data || !data.name || !originId) {
      callback(new Error('Requires name, origin and origin id to add a third party user'));
      return;
    }

    const user = {
      id: data.id || shortid.generate(),
      name: data.name,
      email: data.email,
      origin: origin,
      originId: originId,
      originGroups: originGroups || [],
      groups: data.groups || [],
      locked: true
    };

    this.provider.add(user, (error, addedCount, users) => {
      if (callback)
        callback(error, addedCount, user);
    });
  }

  /**
   * Updates a third party provider user.
   *
   * @method updateThirdPartyUser
   * @async
   * @param {String} id User id in OpenVeo
   * @param {Object} data A user object
   * @param {String} [data.name] User's name
   * @param {String} [data.email] User's email
   * @param {Array} [data.originGroups] User's groups in third party provider system
   * @param {Array} [data.groups] User's group ids
   * @param {String} origin The user origin (see openVeoApi.passport.STRATEGIES)
   * @param {Function} [callback] The function to call when it's done
   *   - **Error** The error if an error occurred, null otherwise
   *   - **Number** The total amount of items updates
   */
  updateThirdPartyUser(id, data, origin, callback) {
    const userData = {};

    if (data.name) userData.name = data.name;
    if (data.email) userData.email = data.email;
    if (data.originGroups) userData.originGroups = data.originGroups;
    if (data.groups) userData.groups = data.groups;

    this.provider.updateLocked(id, userData, origin, (error, updatedCount) => {
      if (callback)
        callback(error, updatedCount);
    });
  }

}

module.exports = UserModel;

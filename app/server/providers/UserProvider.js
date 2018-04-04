'use strict';

/**
 * @module providers
 */

const path = require('path');
const async = require('async');
const shortid = require('shortid');
const crypto = require('crypto');
const openVeoApi = require('@openveo/api');
const configDir = openVeoApi.fileSystem.getConfDir();
const conf = require(path.join(configDir, 'portal/conf.json'));
const ResourceFilter = openVeoApi.storages.ResourceFilter;

class UserProvider extends openVeoApi.providers.EntityProvider {

  /**
   * Defines a UserProvider to get and save back end users.
   *
   * @class UserProvider
   * @extends EntityProvider
   * @constructor
   * @param {Storage} storage The storage to use to store users
   */
  constructor(storage) {
    super(storage, 'portal_users');
  }

  /**
   * Gets an internal user by its credentials.
   *
   * @method getUserByCredentials
   * @async
   * @param {String} email The email of the user
   * @param {String} password The password of the user
   * @param {Function} callback Function to call when it's done
   *   - **Error** The error if an error occurred, null otherwise
   *   - **Object** The user
   */
  getUserByCredentials(email, password, callback) {
    password = crypto.createHmac('sha256', conf.passwordHashKey).update(password).digest('hex');

    this.getOne(
      new ResourceFilter()
      .equal('origin', openVeoApi.passport.STRATEGIES.LOCAL)
      .equal('email', email)
      .equal('password', password),
      {
        exclude: ['password']
      },
      callback
    );
  }

  /**
   * Gets an internal user by its email.
   *
   * @method getUserByEmail
   * @async
   * @param {String} email The email of the user
   * @param {Function} callback Function to call when it's done
   *   - **Error** The error if an error occurred, null otherwise
   *   - **Object** The user
   */
  getUserByEmail(email, callback) {
    this.getOne(
      new ResourceFilter()
      .equal('origin', openVeoApi.passport.STRATEGIES.LOCAL)
      .equal('email', email),
      {
        exclude: ['password']
      },
      callback
    );
  }


  /**
   * Adds users.
   *
   * @method add
   * @async
   * @param {Array} users The list of users to store with for each user:
   *   - **String** name The user name
   *   - **String** email The user email
   *   - **String** password The user password
   *   - **String** passwordValidate The user password validation
   *   - **String** [id] The user id, generated if not specified
   *   - **Array** [groups] The user groups ids
   *   - **Boolean** [locked=false] true to lock the user from edition, false otherwise
   * @param {Function} [callback] The function to call when it's done
   *   - **Error** The error if an error occurred, null otherwise
   *   - **Number** The total amount of users inserted
   *   - **Array** The list of added users
   */
  add(users, callback) {
    const usersToAdd = [];
    const userEmails = [];

    for (let user of users) {

      if (!user.name || !user.email || !user.password)
        return this.executeCallback(callback, new TypeError('Requires name, email and password to add a user'));

      // Validate password
      if (user.password !== user.passwordValidate)
        return this.executeCallback(callback, new Error('Passwords do not match'));

      // Validate email
      if (!openVeoApi.util.isEmailValid(user.email))
        return this.executeCallback(callback, new TypeError('Invalid email address: ' + user.email));

      userEmails.push(user.email);
    }

    // Find users
    this.getAll(
      new ResourceFilter()
      .equal('origin', openVeoApi.passport.STRATEGIES.LOCAL)
      .in('email', userEmails),
      {
        include: ['email']
      },
      {
        id: 'desc'
      },
      (error, fetchedUsers) => {
        if (error) return this.executeCallback(callback, error);

        for (let user of users) {

          // Validate email
          for (let fetchedUser of fetchedUsers) {
            if (user.email === fetchedUser.email)
              return this.executeCallback(callback, new Error(`Email "${user.email}" not available`));
          }

          // Encrypt password
          const password = crypto.createHmac('sha256', conf.passwordHashKey).update(user.password).digest('hex');

          usersToAdd.push({
            id: user.id || shortid.generate(),
            name: user.name,
            email: user.email,
            password,
            locked: user.locked || false,
            origin: openVeoApi.passport.STRATEGIES.LOCAL,
            groups: user.groups || []
          });
        }

        super.add(usersToAdd, (error, total, addedUsers) => {
          if (error) return this.executeCallback(callback, error);

          if (callback) {
            addedUsers.forEach((addedUser) => {
              delete addedUser['password'];
            });

            callback(error, total, addedUsers);
          }
        });
      }
    );
  }

  /**
   * Updates an internal user.
   *
   * @method updateOne
   * @async
   * @param {ResourceFilter} [filter] Rules to filter the user to update
   * @param {Object} data The modifications to perform
   * @param {String} [data.name] The user name
   * @param {String} [data.email] The user email
   * @param {String} [data.password] The user password. Also requires passwordValidate
   * @param {String} [data.passwordValidate] The user password validation. Also requires password
   * @param {Array} [data.groups] The user group ids
   * @param {Boolean} [data.locked] true to lock the user from edition, false otherwise
   * @param {Function} [callback] The function to call when it's done
   *   - **Error** The error if an error occurred, null otherwise
   *   - **Number** 1 if everything went fine
   */
  updateOne(filter, data, callback) {
    const modifications = {};
    let total;
    let user;

    if (!filter) filter = new ResourceFilter();
    filter.equal('origin', openVeoApi.passport.STRATEGIES.LOCAL);

    // Validate password
    if (data.password) {

      if (data.password !== data.passwordValidate)
        return this.executeCallback(callback, new Error('Passwords does not match'));
      else {

        // Encrypt password
        const password = crypto.createHmac('sha256', conf.passwordHashKey).update(data.password).digest('hex');
        modifications.password = password;

      }
    }

    // Validate email
    if (data.email && !openVeoApi.util.isEmailValid(data.email))
      return this.executeCallback(callback, new TypeError('Invalid email address'));

    // Validate groups
    if (data.groups) modifications.groups = data.groups;

    // Validate name
    if (data.name) modifications.name = data.name;

    // Validate locked
    if (typeof data.locked !== 'undefined') modifications.locked = Boolean(data.locked);

    async.series([

      // Get user corresponding to given filter
      (callback) => {
        this.getOne(
          filter,
          {
            include: ['id']
          },
          (error, fetchedUser) => {
            user = fetchedUser;
            callback(error);
          }
        );
      },

      // Verify if the email address is not already used
      (callback) => {
        if (!data.email) return callback();

        this.getUserByEmail(data.email, (error, fetchedUser) => {
          if (error) return callback(error);
          if (fetchedUser && fetchedUser.id != user.id) return callback(new Error('Email not available'));

          modifications.email = data.email;
          callback();
        });
      },

      // Update user
      (callback) => {
        super.updateOne(
          new ResourceFilter().equal('id', user.id).equal('origin', openVeoApi.passport.STRATEGIES.LOCAL),
          modifications,
          (error, totalItems) => {
            if (error) return callback(error);
            total = totalItems;
            callback();
          }
        );
      }

    ], (error) => {
      this.executeCallback(callback, error, total);
    });
  }

  /**
   * Adds external users.
   *
   * External users are automatically locked when added.
   *
   * @method addThirdPartyUsers
   * @async
   * @param {Array} users The list of users to add with for each user:
   *   - **String** name The user name
   *   - **String** email The user email
   *   - **String** origin Id of the third party provider system
   *   - **String** originId The user id in third party provider system
   *   - **String** [id] The user id, generated if not specified
   *   - **Array** [originGroups] The user groups in third party provider system
   *   - **Array** [groups] The user group ids
   * @param {Function} [callback] The function to call when it's done
   *   - **Error** The error if an error occurred, null otherwise
   *   - **Number** The total amount of users inserted
   *   - **Array** The inserted users
   */
  addThirdPartyUsers(users, callback) {
    const usersToAdd = [];

    for (let user of users) {

      if (!user.origin || !user.name || !user.email || !user.originId) {
        return this.executeCallback(
          callback,
          new TypeError('Requires name, email, origin and origin id to add a third party user')
        );
      }

      if (user.origin === openVeoApi.passport.STRATEGIES.LOCAL)
        return this.executeCallback(callback, new Error('Third party user origin can\'t be local'));

      usersToAdd.push({
        id: user.id || shortid.generate(),
        name: user.name,
        email: user.email,
        origin: user.origin,
        originId: user.originId,
        originGroups: user.originGroups || [],
        groups: user.groups || [],
        locked: true
      });
    }

    super.add(usersToAdd, callback);
  }

  /**
   * Updates an external user.
   *
   * @method updateThirdPartyUser
   * @async
   * @param {ResourceFilter} [filter] Rules to filter users to update
   * @param {Object} data The modifications to perform
   * @param {String} [data.name] The user name
   * @param {String} [data.email] The user email
   * @param {Array} [data.originGroups] The user groups in third party provider system
   * @param {Array} [data.groups] The user group ids
   * @param {Boolean} [data.locked] true to lock the user from edition, false otherwise
   * @param {String} origin The user origin (see openVeoApi.passport.STRATEGIES)
   * @param {Function} callback The function to call when it's done
   *   - **Error** The error if an error occurred, null otherwise
   *   - **Number** 1 if everything went fine
   */
  updateThirdPartyUser(filter, data, origin, callback) {
    const modifications = {};

    if (origin === openVeoApi.passport.STRATEGIES.LOCAL)
      return this.executeCallback(callback, new Error('Can\'t update a local user with "updateThirdPartyUser"'));

    if (!filter) filter = new ResourceFilter();
    filter.equal('origin', origin);

    if (data.name) modifications.name = data.name;
    if (data.email) modifications.email = data.email;
    if (data.originGroups) modifications.originGroups = data.originGroups;
    if (data.groups) modifications.groups = data.groups;
    if (typeof data.locked !== 'undefined') modifications.locked = Boolean(data.locked);

    this.storage.updateOne(this.location, filter, modifications, (error, total) => {
      this.executeCallback(callback, error, total);
    });
  }

  /**
   * Creates users indexes.
   *
   * @method createIndexes
   * @async
   * @param {Function} callback Function to call when it's done with:
   *  - **Error** An error if something went wrong, null otherwise
   */
  createIndexes(callback) {
    this.storage.createIndexes(this.location, [
      {key: {name: 1}, name: 'byName'},
      {key: {name: 'text'}, weights: {name: 1}, name: 'querySearch'}
    ], (error, result) => {
      if (result && result.note)
        process.logger.debug(`Create users indexes : ${result.note}`);

      callback(error);
    });
  }

}

module.exports = UserProvider;

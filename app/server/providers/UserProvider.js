'use strict';

/**
 * @module providers
 */

const openVeoApi = require('@openveo/api');

class UserProvider extends openVeoApi.providers.EntityProvider {

  /**
   * Defines a UserProvider to get and save back end users.
   *
   * @class UserProvider
   * @extends EntityProvider
   * @constructor
   * @param {Database} database The database to interact with
   */
  constructor(database) {
    super(database, 'portal_users');
  }

  /**
   * Gets a local user by its credentials.
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
    this.database.get(
      this.collection,
      {
        $and: [
          {
            origin: {$eq: openVeoApi.passport.STRATEGIES.LOCAL}
          },
          {
            email,
            password
          }
        ]
      },
      {
        password: 0
      },
      1,
      (error, data) => {
        callback(error, data && data[0]);
      }
    );
  }

  /**
   * Gets a local user by its email.
   *
   * @method getUserByEmail
   * @async
   * @param {String} email The email of the user
   * @param {Function} callback Function to call when it's done
   *   - **Error** The error if an error occurred, null otherwise
   *   - **Object** The user
   */
  getUserByEmail(email, callback) {
    this.database.get(
      this.collection,
      {
        $and: [
          {
            origin: {$eq: openVeoApi.passport.STRATEGIES.LOCAL}
          },
          {
            email
          }
        ]
      },
      {
        password: 0
      },
      1,
      (error, data) => {
        callback(error, data && data[0]);
      }
    );
  }

  /**
   * Gets a user without its paswword.
   *
   * @method getOne
   * @async
   * @param {String} id The user id
   * @param {Object} [filter] A MongoDB filter
   * @param {Function} callback Function to call when it's done
   *   - **Error** The error if an error occurred, null otherwise
   *   - **Object** The user
   */
  getOne(id, filter, callback) {
    if (!filter) filter = {};
    filter.id = id;

    this.database.get(
      this.collection,
      filter,
      {
        password: 0
      },
      1,
      (error, data) => {
        callback(error, data && data[0]);
      }
    );
  }

  /**
   * Updates a local user.
   *
   * If the entity has the property "locked", it won't be updated.
   *
   * @method update
   * @async
   * @param {String} id The id of the user to update
   * @param {Object} data The information about the user
   * @param {String} origin The user origin (see openVeoApi.passport.STRATEGIES)
   * @param {Function} callback The function to call when it's done
   *   - **Error** The error if an error occurred, null otherwise
   *   - **Number** The number of updated items
   */
  update(id, data, origin, callback) {
    this.database.update(this.collection, {
      locked: {
        $ne: true
      },
      id,
      origin: {$eq: origin || openVeoApi.passport.STRATEGIES.LOCAL}
    }, data, callback);
  }

  /**
   * Updates a locked user.
   *
   * @method updateLocked
   * @async
   * @param {String} id The id of the user to update
   * @param {Object} data The information about the user
   * @param {String} origin The user origin (see openVeoApi.passport.STRATEGIES)
   * @param {Function} callback The function to call when it's done
   *   - **Error** The error if an error occurred, null otherwise
   *   - **Number** The number of updated items
   */
  updateLocked(id, data, origin, callback) {
    this.database.update(this.collection, {
      id,
      origin: {$eq: origin || openVeoApi.passport.STRATEGIES.LOCAL}
    }, data, callback);
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
    this.database.createIndexes(this.collection, [
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

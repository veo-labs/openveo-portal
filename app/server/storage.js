'use strict';

/**
 * @module portal
 */

/**
 * Storage is a global context for OpenVeo Portal.
 *
 * @class storage
 * @static
 */

let database;

/**
 * Gets the current database instance.
 *
 * @method getDatabase
 * @static
 * @return {Database} A Database object
 */
module.exports.getDatabase = () => {
  return database;
};

/**
 * Sets a new database instance as the current database.
 *
 * @method setDatabase
 * @static
 * @param {Database} newDatabase The new database of the application
 */
module.exports.setDatabase = (newDatabase) => {
  database = newDatabase;
};

'use strict';

/**
 * @module portal
 */

const openVeoApi = require('@openveo/api');

class Context {

  /**
   * Defines an application context.
   *
   * Context is a singleton representing a global context for the whole project.
   * It contains a restricted list of elements as properties which can be accessed
   * from anywhere.
   *
   *     const context = process.require('app/server/context.js');
   *     console.log(context.database);
   *
   * @class context
   * @constructor
   */
  constructor() {
    let database;

    Object.defineProperties(this, {

      /**
       * The application database instance.
       *
       * @property database
       * @type Database
       */
      database: {
        enumerable: true,
        get: () => {
          return database;
        },
        set: (value) => {
          if (value instanceof openVeoApi.database.Database) database = value;
        }
      }

    });
  }

}

// Create singleton and seal it
const context = new Context();
Object.seal(context);

module.exports = context;

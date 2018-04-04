'use strict';

/**
 * Creates a user for OpenVeo Portal.
 *
 * Usage:
 *
 * # Create an Openveo Portal user
 * node scripts/createUser.js --name="USER_NAME" --email="USER_EMAIL"\
 * --password="USER_PASSWORD" --groups="GROUP1,GROUP2"
 *
 * # --name [required] The user's name as it will be displayed when connected
 * # --email [required] The user's email as it will uses when authenticating
 * # --password [required] The user's password
 * # --groups [optional] The user's groups as a comma separated list of content groups from OpenVeo (content group ids)
 */

require('../processRequire.js');
const path = require('path');
const async = require('async');
const nopt = require('nopt');
const openVeoApi = require('@openveo/api');
const UserProvider = process.require('app/server/providers/UserProvider.js');
const confDir = path.join(openVeoApi.fileSystem.getConfDir(), 'portal');
const databaseConf = require(path.join(confDir, 'databaseConf.json'));
const exit = process.exit;
let database;

// Process arguments
const knownProcessOptions = {
  name: [String],
  email: [String],
  password: [String],
  groups: [String]
};

// Parse process arguments
const processOptions = nopt(knownProcessOptions, null, process.argv);

// All process arguments are required except groups
if (!processOptions.name || !processOptions.email || !processOptions.password)
  throw new Error('Arguments name, email and password are required');

async.series([

  // Connect to database
  (callback) => {
    database = openVeoApi.storages.factory.get(databaseConf.type, databaseConf);
    database.connect((error) => {
      if (error)
        error.message = `Could not connect to the database with message: ${error.message}`;

      callback(error);
    });
  },

  // Create user
  (callback) => {
    let userProvider = new UserProvider(database);
    userProvider.add([
      {
        name: processOptions.name,
        email: processOptions.email,
        password: processOptions.password,
        passwordValidate: processOptions.password,
        groups: processOptions.groups ? processOptions.groups.split(',') : [],
        locked: true
      }
    ], (error) => {
      if (!error)
        process.stdout.write('User successfully added\n');

      callback(error);
    });
  }
], (error, results) => {
  if (error)
    throw error;

  exit();
});

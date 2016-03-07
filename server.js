'use strict';

require('./processRequire.js');
const path = require('path');
const nopt = require('nopt');
const openveoAPI = require('@openveo/api');
const Server = process.require('app/server/Server.js');
const configurationDirectoryPath = path.join(openveoAPI.fileSystem.getConfDir(), 'portal');
const loggerConfPath = path.join(configurationDirectoryPath, 'loggerConf.json');
const serverConfPath = path.join(configurationDirectoryPath, 'serverConf.json');
const databaseConfPath = path.join(configurationDirectoryPath, 'databaseConf.json');

let loggerConf;
let serverConf;
let databaseConf;

// Process list of arguments
const knownProcessOptions = {
  serverConf: [String, null],
  databaseConf: [String, null],
  loggerConf: [String, null]
};

// Parse process arguments
const processOptions = nopt(knownProcessOptions, null, process.argv);

// Load configuration files
try {
  loggerConf = require(processOptions.loggerConf || loggerConfPath);
  serverConf = require(processOptions.serverConf || serverConfPath);
  databaseConf = require(processOptions.databaseConf || databaseConfPath);
} catch (error) {
  throw new Error(`Invalid configuration file : ${error.message}`);
}

// Create logger
process.logger = openveoAPI.logger.add('portal', loggerConf);

// Instanciate a Server
const server = new Server(serverConf);

// Get a Database instance
const db = openveoAPI.Database.getDatabase(databaseConf);

// Establish connection to the database
db.connect((error) => {
  if (error) {
    process.logger.error(error && error.message);
    throw new Error(error);
  }

  openveoAPI.applicationStorage.setDatabase(db);
  server.onDatabaseAvailable(db);
  server.start();
});

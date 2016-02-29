'use strict';

require('./processRequire.js');
var path = require('path');
var nopt = require('nopt');
var openveoAPI = require('@openveo/api');
var Server = process.require('app/server/Server.js');
var configurationDirectoryPath = path.join(openveoAPI.fileSystem.getConfDir(), 'portal');
var loggerConfPath = path.join(configurationDirectoryPath, 'loggerConf.json');
var serverConfPath = path.join(configurationDirectoryPath, 'serverConf.json');
var databaseConfPath = path.join(configurationDirectoryPath, 'databaseConf.json');
var loggerConf;
var serverConf;
var databaseConf;

// Process list of arguments
var knownProcessOptions = {
  serverConf: [String, null],
  databaseConf: [String, null],
  loggerConf: [String, null]
};

// Parse process arguments
var processOptions = nopt(knownProcessOptions, null, process.argv);

// Load configuration files
try {
  loggerConf = require(processOptions.loggerConf || loggerConfPath);
  serverConf = require(processOptions.serverConf || serverConfPath);
  databaseConf = require(processOptions.databaseConf || databaseConfPath);
} catch (error) {
  throw new Error('Invalid configuration file : ' + error.message);
}

// Create logger
process.logger = openveoAPI.logger.add('portal', loggerConf);

// Instanciate a Server
var server = new Server(serverConf);

// Get a Database instance
var db = openveoAPI.Database.getDatabase(databaseConf);

// Establish connection to the database
db.connect(function(error) {
  if (error) {
    process.logger.error(error && error.message);
    throw new Error(error);
  }

  openveoAPI.applicationStorage.setDatabase(db);
  server.onDatabaseAvailable(db);
  server.start();
});

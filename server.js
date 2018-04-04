'use strict';

require('./processRequire.js');
const path = require('path');
const nopt = require('nopt');
const openVeoApi = require('@openveo/api');
const conf = process.require('app/server/conf.js');
const Server = process.require('app/server/Server.js');
const context = process.require('app/server/context.js');
const WebserviceClient = process.require('app/server/WebserviceClient.js');
const configurationDirectoryPath = path.join(openVeoApi.fileSystem.getConfDir(), 'portal');
const loggerConfPath = path.join(configurationDirectoryPath, 'loggerConf.json');
const serverConfPath = path.join(configurationDirectoryPath, 'serverConf.json');
const databaseConfPath = path.join(configurationDirectoryPath, 'databaseConf.json');
const webservicesConfPath = path.join(configurationDirectoryPath, 'webservicesConf.json');
const confPath = path.join(configurationDirectoryPath, 'conf.json');

// Process list of arguments
const knownProcessOptions = {
  serverConf: [String, null],
  databaseConf: [String, null],
  loggerConf: [String, null],
  conf: [String, null],
  webservicesConf: [String, null]
};

// Parse process arguments
const processOptions = nopt(knownProcessOptions, null, process.argv);

// Load configuration files
try {
  conf.loggerConf = require(processOptions.loggerConf || loggerConfPath);
  conf.serverConf = require(processOptions.serverConf || serverConfPath);
  conf.databaseConf = require(processOptions.databaseConf || databaseConfPath);
  conf.webservicesConf = require(processOptions.webservicesConf || webservicesConfPath);
  conf.conf = require(processOptions.conf || confPath);
  conf.serverConf.webServiceBasePath = '/ws/';
} catch (error) {
  throw new Error(`Invalid configuration file : ${error.message}`);
}

// Create logger
process.logger = openVeoApi.logger.add('portal', conf.loggerConf);

// Create Web Service client
WebserviceClient.create(conf.webservicesConf);

// Instanciate a Server
const server = new Server(conf.serverConf);

// Get a Database instance
const db = openVeoApi.storages.factory.get(conf.databaseConf.type, conf.databaseConf);

// Establish connection to the database
db.connect((error) => {
  if (error) {
    process.logger.error(error && error.message);
    throw new Error(error);
  }

  context.database = db;
  server.onDatabaseAvailable(db, (error) => {
    if (error) {
      process.logger.error(error && error.message);
      throw new Error(error);
    }

    server.start();
  });
});

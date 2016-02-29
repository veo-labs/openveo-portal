'use strict';

require('../../processRequire.js');
var path = require('path');
var childProcess = require('child_process');
var openveoAPI = require('@openveo/api');
var e2e = require('@openveo/test').e2e;
var configurationDirectoryPath = path.join(openveoAPI.fileSystem.getConfDir(), 'portal');
var serverConfPath = path.join(configurationDirectoryPath, 'serverTestConf.json');
var screenshotPlugin = e2e.plugins.screenshotPlugin;
var serverConf = require(serverConfPath);
var portalServer;

// Load a console logger
process.logger = openveoAPI.logger.get('portal');

// Load test suites
var suites = process.require('tests/client/protractorSuites.json');

exports.config = {
  seleniumServerJar: process.env.SELENIUM_JAR,
  chromeDriver: process.env.CHROME_DRIVER,
  framework: 'mocha',
  mochaOpts: {
    timeout: 200000,
    bail: false
  },
  suites: suites,
  baseUrl: 'http://127.0.0.1:' + serverConf.port + '/',
  plugins: [
    {
      outdir: 'build/screenshots',
      inline: screenshotPlugin
    }
  ],
  onPrepare: function() {
    var deferred = protractor.promise.defer();
    var flow = browser.controlFlow();

    // Init process configuration
    e2e.browser.deactivateAnimations();
    e2e.browser.init();

    // Set browser size
    e2e.browser.setSize(1920, 1080);

    // Executes watcher as a child process
    portalServer = childProcess.fork(path.join(process.root, '/server.js'), [
      '--serverConf', serverConfPath,
      '--databaseConf', path.join(configurationDirectoryPath, 'databaseTestConf.json')
    ]);

    // Listen to messages from server process
    portalServer.on('message', function(data) {
      if (data) {
        if (data.status === 'started') {
          process.logger.info('Server started');
          deferred.fulfill();
        }
      }
    });

    return flow.execute(function() {
      return deferred.promise;
    });
  },
  onCleanUp: function() {
    process.logger.info('Tests finished, exit server');
    portalServer.kill('SIGINT');
  }
};

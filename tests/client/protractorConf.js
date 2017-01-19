'use strict';

require('../../processRequire.js');
const path = require('path');
const childProcess = require('child_process');
const openveoAPI = require('@openveo/api');
const e2e = require('@openveo/test').e2e;
const configurationDirectoryPath = path.join(openveoAPI.fileSystem.getConfDir(), 'portal');
const serverConfPath = path.join(configurationDirectoryPath, 'serverTestConf.json');
const loggerConfPath = path.join(configurationDirectoryPath, 'loggerTestConf.json');
const confPath = path.join(configurationDirectoryPath, 'confTest.json');
const screenshotPlugin = e2e.plugins.screenshotPlugin;
const serverConf = require(serverConfPath);
let portalServer;

// Load a console logger
process.logger = openveoAPI.logger.get('portal');

// Load test suites
const suites = process.require('tests/client/protractorSuites.json');

exports.config = {
  framework: 'mocha',
  mochaOpts: {
    timeout: 200000,
    bail: false
  },
  suites,
  baseUrl: `http://127.0.0.1:${serverConf.port}/`,
  plugins: [
    {
      outdir: 'build/screenshots',
      inline: screenshotPlugin
    }
  ],
  onPrepare: () => {
    const deferred = protractor.promise.defer();
    const flow = browser.controlFlow();

    // Init process configuration
    e2e.browser.deactivateAnimations();
    e2e.browser.init();

    // Set browser size
    e2e.browser.setSize(1920, 1080);

    // Executes server as a child process
    portalServer = childProcess.fork(path.join(process.root, '/server.js'), [
      '--serverConf', serverConfPath,
      '--loggerConf', loggerConfPath,
      '--databaseConf', path.join(configurationDirectoryPath, 'databaseTestConf.json'),
      '--conf', confPath
    ]);

    // Listen to messages from server process
    portalServer.on('message', (data) => {
      if (data) {
        if (data.status === 'started') {
          process.logger.info('Server started');
          deferred.fulfill();
        }
      }
    });

    return flow.execute(() => {
      return deferred.promise;
    });
  },
  onCleanUp: () => {
    process.logger.info('Tests finished, exit server');
    portalServer.kill('SIGINT');
  }
};

'use strict';

require('./processRequire.js');
const readline = require('readline');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const os = require('os');
const async = require('async');
const openVeoAPI = require('@openveo/api');
const confDir = path.join(openVeoAPI.fileSystem.getConfDir(), 'portal');
const exit = process.exit;

// Create a readline interface to interact with the user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Creates a random hash.
 *
 * @param {Number} size The length of the expected hash
 * @return {String} A hash
 */
function getRandomHash(size) {
  return crypto.randomBytes(256).toString('base64').slice(0, size);
}

/**
 * Creates conf directory if it does not exist.
 *
 * @param {Function} callback Function to call when its done with :
 *   - **Error** An error if something went wrong, null otherwise
 */
function createConfDir(callback) {
  openVeoAPI.fileSystem.mkdir(confDir, callback);
}

/**
 * Creates logger directory if it does not exist.
 *
 * @param {Function} callback Function to call when its done with :
 *   - **Error** An error if something went wrong, null otherwise
 */
function createLoggerDir(callback) {
  const conf = require(path.join(confDir, 'loggerConf.json'));
  openVeoAPI.fileSystem.mkdir(path.dirname(conf.fileName), callback);
}

/**
 * Creates portal configuration file if it does not exist.
 *
 * @param {Function} callback Function to call when its done
 */
function createConf(callback) {
  const confFile = path.join(confDir, 'conf.json');
  const conf = {
    theme: 'default',
    filter: ['categories']
  };

  async.series([

    // Test if portal configuration exists
    // If configuration file already exists, nothing is done
    (callback) => {
      fs.exists(confFile, (exists) => {
        if (exists)
          callback(new Error(`${confFile} already exists\n`));
        else
          callback();
      });
    },

    // Ask for theme
    (callback) => {
      rl.question(`Enter the name of the theme to use (default: "${conf.theme}") :\n`, (answer) => {
        conf.theme = answer || conf.theme;
        callback();
      });
    },

    // Ask for Piwik
    (callback) => {
      rl.question(`If you want to embed your analytic HTML code,
you will need to define it in assets/themes/${conf.theme}/analytics.html
(press enter to continue)\n`, (answer) => {
        callback();
      });
    },

    // Ask for category filter
    (callback) => {
      rl.question(`Do you want to let user filter video by category ("Y/n") :\n`, (answer) => {
        if (answer == 'n')
          conf.filter = [];
      });
    },

    // Ask for available filters
    (callback) => {
      const ask = () => {
        rl.question(`Enter the name of video properties that the user would filter
(Enter empty value to skip or finish) :\n`, (answer) => {
          if (answer) {
            conf.filter.push(answer);
            ask();
          } else {
            callback();
          }
        });
      };
      ask();
    }
  ], (error, results) => {
    if (error) {
      process.stdout.write(error.message);
      callback();
    } else
    fs.writeFile(confFile, JSON.stringify(conf, null, '\t'), {encoding: 'utf8'}, callback);
  });
}

/**
 * Creates database configuration file if it does not exist.
 *
 * @param {Function} callback Function to call when its done
 */
function createDatabaseConf(callback) {
  const confFile = path.join(confDir, 'databaseConf.json');
  const conf = {
    type: 'mongodb',
    host: 'localhost',
    port: 27017
  };

  async.series([

    // Test if database configuration exists
    // If configuration file already exists, nothing is done
    (callback) => {
      fs.exists(confFile, (exists) => {
        if (exists)
          callback(new Error(`${confFile} already exists\n`));
        else
          callback();
      });
    },

    // Ask for database host
    (callback) => {
      rl.question(`Enter database host (default: ${conf.host}) :\n`, (answer) => {
        conf.host = answer || conf.host;
        callback();
      });
    },

    // Ask for database port
    (callback) => {
      rl.question(`Enter database port (default: ${conf.port}) :\n`, (answer) => {
        conf.port = answer || conf.port;
        callback();
      });
    },

    // Ask for database name
    (callback) => {
      rl.question(`Enter database name :\n`, (answer) => {
        conf.database = answer || '';
        callback();
      });
    },

    // Ask for database user name
    (callback) => {
      rl.question(`Enter database user name :\n`, (answer) => {
        conf.username = answer || '';
        callback();
      });
    },

    // Ask for database user password
    (callback) => {
      rl.question(`Enter database user password :\n`, (answer) => {
        conf.password = answer || '';
        callback();
      });
    }
  ], (error, results) => {
    if (error) {
      process.stdout.write(error.message);
      callback();
    } else
      fs.writeFile(confFile, JSON.stringify(conf, null, '\t'), {encoding: 'utf8'}, callback);
  });
}

/**
 * Creates loggers configuration file if it does not exist.
 *
 * @param {Function} callback Function to call when its done
 */
function createLoggerConf(callback) {
  const confFile = path.join(confDir, 'loggerConf.json');
  const conf = {
    level: 'info',
    maxFileSize: 1048576,
    maxFiles: 2
  };

  async.series([

    // Test if logger configuration exists
    // If configuration file already exists, nothing is done
    (callback) => {
      fs.exists(confFile, (exists) => {
        if (exists)
          callback(new Error(`${confFile} already exists\n`));
        else
          callback();
      });
    },

    // Ask for log directory path
    (callback) => {
      const defaultPath = path.join(os.tmpdir(), 'openveo', 'logs');
      rl.question(`Enter OpenVeo Portal logs directory (default: ${defaultPath}) :\n`, (answer) => {
        conf.fileName = path.join((answer || defaultPath), 'openveo-portal.log').replace(/\\/g, '/');
        callback();
      });
    }
  ], (error, results) => {
    if (error) {
      process.stdout.write(error.message);
      callback();
    } else
      fs.writeFile(confFile, JSON.stringify(conf, null, '\t'), {encoding: 'utf8'}, callback);
  });
}

/**
 * Asks the user for cas configuration.
 *
 * @param {Function} The function to call when its done with :
 *   - **Error** An error if something went wrong
 *   - **Object** The cas configuration
 */
function askForCasAuthConf(callback) {
  const conf = {
    version: '3'
  };

  async.series([

    // Ask for application service registered in cas server
    (callback) => {
      rl.question('Enter the application service registered in cas server :\n', (answer) => {
        conf.service = answer;
        callback();
      });
    },

    // Enter the url of the cas server
    (callback) => {
      rl.question('Enter the url of the cas server :\n', (answer) => {
        conf.url = answer;
        callback();
      });
    },

    // Ask for authentication
    (callback) => {
      rl.question(`Enter the version of the cas protocol to use to connect to the cas server ? (default: \
${conf.version}) :\n`, (answer) => {
        conf.version = answer || conf.version;
        callback();
      });
    },

    // Ask for certificate
    (callback) => {
      rl.question('Enter the complete path to the cas certificate :\n', (answer) => {
        conf.certificate = answer;
        callback();
      });
    }
  ], (error, results) => {
    if (error) {
      process.stdout.write(error.message);
      callback();
    } else
      callback(conf);
  });
}

/**
 * Creates server configuration file if it does not exist.
 *
 * @param {Function} callback Function to call when its done
 */
function createServerConf(callback) {
  let authConf;
  const confFile = path.join(confDir, 'serverConf.json');
  const conf = {
    port: 3003
  };

  async.series([

    // Test if server configuration exists
    // If configuration file already exists, nothing is done
    (callback) => {
      fs.exists(confFile, (exists) => {
        if (exists)
          callback(new Error(`${confFile} already exists\n`));
        else
          callback();
      });
    },

    // Ask for log session hash
    (callback) => {
      const hash = getRandomHash(40);
      rl.question(`Enter a hash to secure HTTP sessions (default: ${hash}) :\n`, (answer) => {
        conf.sessionSecret = answer || hash;
        callback();
      });
    },

    // Ask for HTTP server port
    (callback) => {
      rl.question(`Enter OpenVeo Portal server port (default: ${conf.port}) :\n`, (answer) => {
        conf.port = answer || conf.port;
        callback();
      });
    },

    // Ask for authentication
    (callback) => {
      rl.question('Do you want to add authentication to the portal ? (y/N) :\n', (answer) => {
        if (answer === 'y') authConf = {};
        callback();
      });
    },

    // Ask for the authentication mechanism
    (callback) => {
      if (!authConf) return callback();
      rl.question('Which authentication mechanism do you want to configure ? (0:local -default-, 1:cas) :\n',
      (answer) => {
        if (answer === '1') {
          authConf.type = 'cas';

          askForCasAuthConf((casConf) => {
            authConf.cas = casConf;
            callback();
          });
        } else {
          authConf.type = 'local';
          callback();
        }
      });
    }
  ], (error, results) => {
    if (error) {
      process.stdout.write(error.message);
      callback();
    } else {
      if (authConf) conf.auth = authConf;
      fs.writeFile(confFile, JSON.stringify(conf, null, '\t'), {encoding: 'utf8'}, callback);
    }
  });
}

/**
 * Creates portal configuration file if it does not exist.
 *
 * @param {Function} callback Function to call when its done
 */
function createWebservicesConf(callback) {
  const confFile = path.join(confDir, 'webservicesConf.json');
  const conf = {
    host: '192.168.0.1',
    port: '3001'
  };

  async.series([

    // Test if webservices configuration exists
    // If configuration file already exists, nothing is done
    (callback) => {
      fs.exists(confFile, (exists) => {
        if (exists)
          callback(new Error(`${confFile} already exists\n`));
        else
          callback();
      });
    },

    // Ask webservices host
    (callback) => {
      rl.question(`Enter Webservices host (default: ${conf.host}):\n`, (answer) => {
        conf.host = answer || conf.host;
        callback();
      });
    },

    // Ask webservices port
    (callback) => {
      rl.question(`Enter Webservices port (default: ${conf.port}):\n`, (answer) => {
        conf.port = answer || conf.port;
        callback();
      });
    },

    // Ask webservices oAuth client ID
    (callback) => {
      rl.question('Enter Webservices oAuth Client ID :\n', (answer) => {
        conf.clientID = answer || '';
        callback();
      });
    },

    // Ask webservices oAuth secret ID
    (callback) => {
      rl.question('Enter Webservices oAuth Secret ID :\n', (answer) => {
        conf.secretID = answer || '';
        callback();
      });
    }
  ], (error, results) => {
    if (error) {
      process.stdout.write(error.message);
      callback();
    } else
      fs.writeFile(confFile, JSON.stringify(conf, null, '\t'), {encoding: 'utf8'}, callback);
  });
}

/**
 * Verifies connection to the database.
 *
 * @param {Function} callback Function to call when its done
 */
function verifyDatabaseConf(callback) {
  const databaseConf = require(path.join(confDir, 'databaseConf.json'));
  const db = openVeoAPI.Database.getDatabase(databaseConf);

  db.connect((error) => {
    if (error) {
      process.stdout.write(`Could not connect to the database with message : ${error.message}`);
      exit();
    }

    callback();
  });
}

// Launch installation
async.series([
  createConfDir,
  createConf,
  createDatabaseConf,
  createLoggerConf,
  createLoggerDir,
  createServerConf,
  createWebservicesConf,
  verifyDatabaseConf
], (error, results) => {
  if (error)
    throw error;
  else {
    process.stdout.write('Installation complete\n');
    exit();
  }
});

'use strict';

require('./processRequire.js');
var readline = require('readline');
var crypto = require('crypto');
var path = require('path');
var fs = require('fs');
var os = require('os');
var async = require('async');
var openVeoAPI = require('@openveo/api');
var confDir = path.join(openVeoAPI.fileSystem.getConfDir(), 'portal');
var exit = process.exit;

// Create a readline interface to interact with the user
var rl = readline.createInterface({
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
  var conf = require(path.join(confDir, 'loggerConf.json'));
  openVeoAPI.fileSystem.mkdir(path.dirname(conf.fileName), callback);
}

/**
 * Creates portal configuration file if it does not exist.
 *
 * @param {Function} callback Function to call when its done
 */
function createConf(callback) {
  var confFile = path.join(confDir, 'conf.json');
  var conf = {
    theme: 'default'
  };

  async.series([

    // Test if portal configuration exists
    // If configuration file already exists, nothing is done
    function(callback) {
      fs.exists(confFile, function(exists) {
        if (exists)
          callback(new Error(confFile + ' already exists\n'));
        else
          callback();
      });
    },

    // Ask for theme
    function(callback) {
      rl.question('Enter the name of the theme to use (default: ' + conf.theme + ') :\n', function(answer) {
        conf.theme = answer || conf.theme;
        callback();
      });
    }
  ], function(error, results) {
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
  var confFile = path.join(confDir, 'databaseConf.json');
  var conf = {
    type: 'mongodb',
    host: 'localhost',
    port: 27017
  };

  async.series([

    // Test if database configuration exists
    // If configuration file already exists, nothing is done
    function(callback) {
      fs.exists(confFile, function(exists) {
        if (exists)
          callback(new Error(confFile + ' already exists\n'));
        else
          callback();
      });
    },

    // Ask for database host
    function(callback) {
      rl.question('Enter database host (default: ' + conf.host + ') :\n', function(answer) {
        conf.host = answer || conf.host;
        callback();
      });
    },

    // Ask for database port
    function(callback) {
      rl.question('Enter database port (default: ' + conf.port + ') :\n', function(answer) {
        conf.port = answer || conf.port;
        callback();
      });
    },

    // Ask for database name
    function(callback) {
      rl.question('Enter database name :\n', function(answer) {
        conf.database = answer || '';
        callback();
      });
    },

    // Ask for database user name
    function(callback) {
      rl.question('Enter database user name :\n', function(answer) {
        conf.username = answer || '';
        callback();
      });
    },

    // Ask for database user password
    function(callback) {
      rl.question('Enter database user password :\n', function(answer) {
        conf.password = answer || '';
        callback();
      });
    }
  ], function(error, results) {
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
  var confFile = path.join(confDir, 'loggerConf.json');
  var conf = {
    level: 'info',
    maxFileSize: 1048576,
    maxFiles: 2
  };

  async.series([

    // Test if logger configuration exists
    // If configuration file already exists, nothing is done
    function(callback) {
      fs.exists(confFile, function(exists) {
        if (exists)
          callback(new Error(confFile + ' already exists\n'));
        else
          callback();
      });
    },

    // Ask for log directory path
    function(callback) {
      var defaultPath = path.join(os.tmpdir(), 'openveo', 'logs');
      rl.question('Enter OpenVeo Portal logs directory (default: ' + defaultPath + ') :\n', function(answer) {
        conf.fileName = path.join((answer || defaultPath), 'openveo-portal.log').replace(/\\/g, '/');
        callback();
      });
    }
  ], function(error, results) {
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
  var conf = {
    version: '3'
  };

  async.series([

    // Ask for application service registered in cas server
    function(callback) {
      rl.question('Enter the application service registered in cas server :\n', function(answer) {
        conf.service = answer;
        callback();
      });
    },

    // Enter the url of the cas server
    function(callback) {
      rl.question('Enter the url of the cas server :\n', function(answer) {
        conf.url = answer;
        callback();
      });
    },

    // Ask for authentication
    function(callback) {
      rl.question('Enter the version of the cas protocol to use to connect to the cas server ? (default: ' +
                  conf.version + ') :\n', function(answer) {
        conf.version = answer || conf.version;
        callback();
      });
    },

    // Ask for certificate
    function(callback) {
      rl.question('Enter the complete path to the cas certificate :\n', function(answer) {
        conf.certificate = answer;
        callback();
      });
    }
  ], function(error, results) {
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
  var confFile = path.join(confDir, 'serverConf.json');
  var authConf;
  var conf = {
    port: 3003
  };

  async.series([

    // Test if server configuration exists
    // If configuration file already exists, nothing is done
    function(callback) {
      fs.exists(confFile, function(exists) {
        if (exists)
          callback(new Error(confFile + ' already exists\n'));
        else
          callback();
      });
    },

    // Ask for log session hash
    function(callback) {
      var hash = getRandomHash(40);
      rl.question('Enter a hash to secure HTTP sessions (default: ' + hash + ') :\n', function(answer) {
        conf.sessionSecret = answer || hash;
        callback();
      });
    },

    // Ask for HTTP server port
    function(callback) {
      rl.question('Enter OpenVeo Portal server port (default: ' + conf.port + ') :\n', function(answer) {
        conf.port = answer || conf.port;
        callback();
      });
    },

    // Ask for authentication
    function(callback) {
      rl.question('Do you want to add authentication to the portal ? (y/N) :\n', function(answer) {
        if (answer === 'y') authConf = {};
        callback();
      });
    },

    // Ask for the authentication mechanism
    function(callback) {
      if (!authConf) return callback();
      rl.question('Which authentication mechanism do you want to configure ? (0:local -default-, 1:cas) :\n',
      function(answer) {
        if (answer === '1') {
          authConf.type = 'cas';

          askForCasAuthConf(function(casConf) {
            authConf.cas = casConf;
            callback();
          });
        } else {
          authConf.type = 'local';
          callback();
        }
      });
    }
  ], function(error, results) {
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
 * Verifies connection to the database.
 *
 * @param {Function} callback Function to call when its done
 */
function verifyDatbaseConf(callback) {
  var databaseConf = require(path.join(confDir, 'databaseConf.json'));
  var db = openVeoAPI.Database.getDatabase(databaseConf);

  db.connect(function(error) {
    if (error) {
      process.stdout.write('Could not connect to the database with message : ' + error.message);
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
  verifyDatbaseConf
], function(error, results) {
  if (error)
    throw error;
  else {
    process.stdout.write('Installation complete\n');
    exit();
  }
});

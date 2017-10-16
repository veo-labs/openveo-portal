'use strict';

require('./processRequire.js');
const readline = require('readline');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const os = require('os');
const async = require('async');
const openVeoApi = require('@openveo/api');
const storage = process.require('app/server/storage.js');
const UserProvider = process.require('app/server/providers/UserProvider.js');
const confDir = path.join(openVeoApi.fileSystem.getConfDir(), 'portal');
const exit = process.exit;

// Create a readline interface to interact with the user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let rlSecure = false;

/**
 * Secure question to not show stdout
 */
function secureQuestion(query, callback) {
  rlSecure = true;
  rl.question(query, (value) => {
    rl.history = rl.history.slice(1);
    rlSecure = false;
    callback(value);
  });
}

// rewrite stdout in cas of secure rl
process.stdin.on('data', (char) => {
  if (rlSecure) {
    const pass = Array(rl.line.length + 1).join('*');
    process.stdout.write(`\x1B[2K\x1B[200D${pass}`);
  }
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
  openVeoApi.fileSystem.mkdir(confDir, callback);
}

/**
 * Creates logger directory if it does not exist.
 *
 * @param {Function} callback Function to call when its done with :
 *   - **Error** An error if something went wrong, null otherwise
 */
function createLoggerDir(callback) {
  const conf = require(path.join(confDir, 'loggerConf.json'));
  openVeoApi.fileSystem.mkdir(path.dirname(conf.fileName), callback);
}

/**
 * Creates portal configuration file if it does not exist.
 *
 * @param {Function} callback Function to call when its done
 */
function createConf(callback) {
  const confFile = path.join(confDir, 'conf.json');
  const conf = {
    passwordHashKey: getRandomHash(10),
    theme: 'default',
    exposedFilter: [],
    categoriesFilter: '',
    privateFilter: [],
    publicFilter: [],
    cache: {
      filterTTL: 600,
      videoTTL: 60
    },
    useDialog: true
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

    // Ask for password hash key
    (callback) => {
      rl.question(
        `Enter a secret key used to encrypt users passwords (default: ${conf.passwordHashKey}) :\n`,
        (answer) => {
          if (answer) conf.passwordHashKey = answer;
          callback();
        }
      );
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
      rl.question('Enter the taxonomy ID that the user could filter (default: none) :\n', (answer) => {
        conf.categoriesFilter = answer || conf.categoriesFilter;
        callback();
      });
    },

    // Ask for available exposedFilter
    (callback) => {
      const ask = () => {
        rl.question('Enter the video properties ID that the user could filter ' +
                    '(Enter empty value to skip or finish) :\n', (answer) => {
          if (answer) {
            conf.exposedFilter.push(answer);
            ask();
          } else {
            callback();
          }
        });
      };
      ask();
    },

    // Ask for public group filter
    (callback) => {
      const ask = () => {
        const alert = conf.publicFilter.length ? '' :
        'If you do not specify any group, all videos without group will be shown.';
        rl.question(`Enter the video group IDs that anonymous user will see. ${alert}
(Enter empty value to skip or finish):\n`, (answer) => {
          if (answer) {
            conf.publicFilter.push(answer);
            ask();
          } else {
            callback();
          }
        });
      };
      ask();
    },

    // Ask for private group filter
    (callback) => {
      const ask = () => {
        const alert = conf.privateFilter.length ? '' :
        'If you do not specify any group, results will not change even if the user is connected';
        rl.question(`Enter the video group IDs that authentified user will see. ${alert}
(Enter empty value to skip or finish):\n`, (answer) => {
          if (answer) {
            conf.privateFilter.push(answer);
            ask();
          } else {
            callback();
          }
        });
      };
      ask();
    },

    // Ask for cache filter TTL
    (callback) => {
      rl.question('Enter the TTL of cache filter in seconds (default:600) :\n', (answer) => {
        conf.cache.filterTTL = parseInt(answer || conf.cache.filterTTL);
        callback();
      });
    },

    // Ask for cache video TTL
    (callback) => {
      rl.question('Enter the TTL of cache video in seconds (default:60) :\n', (answer) => {
        conf.cache.videoTTL = parseInt(answer || conf.cache.videoTTL);
        callback();
      });
    },

    // Ask for UI to open video
    (callback) => {
      rl.question('Do you want to open video in a popin dialog (n/Y) :\n', (answer) => {
        if (answer === 'n') conf.useDialog = false;
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
        conf.port = parseInt(answer || conf.port);
        callback();
      });
    },

    // Ask for database name
    (callback) => {
      rl.question('Enter database name :\n', (answer) => {
        conf.database = answer || '';
        callback();
      });
    },

    // Ask for database user name
    (callback) => {
      rl.question('Enter database user name :\n', (answer) => {
        conf.username = answer || '';
        callback();
      });
    },

    // Ask for database user password
    (callback) => {
      secureQuestion('Enter database user password :\n', (answer) => {
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
    maxFileSize: 104857600,
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
      rl.question('Enter the complete path to the cas certificate:\n', (answer) => {
        if (answer) conf.certificate = answer;
        callback();
      });
    },

    // Ask for attribute holding the user group
    (callback) => {
      rl.question('Enter the name of the attribute holding the user group:\n', (answer) => {
        if (answer) conf.userGroupAttribute = answer;
        callback();
      });
    },

    // Ask for attribute holding the user id
    (callback) => {
      rl.question('Enter the name of the attribute holding the user unique id:\n', (answer) => {
        if (answer) conf.userIdAttribute = answer;
        callback();
      });
    },

    // Ask for attribute holding the user name
    (callback) => {
      rl.question('Enter the name of the attribute holding the user name id:\n', (answer) => {
        if (answer) conf.userNameAttribute = answer;
        callback();
      });
    },

    // Ask for attribute holding the user name
    (callback) => {
      rl.question('Enter the name of the attribute holding the user email:\n', (answer) => {
        if (answer) conf.userEmailAttribute = answer;
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
 * Asks the user for LDAP configuration.
 *
 * @param {Function} The function to call when its done with:
 *   - **Error** An error if something went wrong
 *   - **Object** The LDAP configuration
 */
function askForLdapAuthConf(callback) {
  const conf = {
    searchFilter: '(&(objectclass=person)(cn={{username}}))'
  };

  async.series([

    // LDAP server url
    (callback) => {
      rl.question('Enter the url of the LDAP server:\n', (answer) => {
        conf.url = answer;
        callback();
      });
    },

    // Bind attribute
    (callback) => {
      rl.question('Enter the entry attribute to bind to when connecting to LDAP server: (default: dn)\n', (answer) => {
        if (answer) conf.bindAttribute = answer;
        callback();
      });
    },

    // Entry id
    (callback) => {
      rl.question('Enter the entry id to use to connect to LDAP server:\n', (answer) => {
        conf.bindDn = answer;
        callback();
      });
    },

    // Entry password
    (callback) => {
      secureQuestion('Enter the entry password:\n', (answer) => {
        conf.bindPassword = answer;
        callback();
      });
    },

    // Search base
    (callback) => {
      rl.question('Enter the search base when looking for users:\n', (answer) => {
        conf.searchBase = answer;
        callback();
      });
    },

    // Search scope
    (callback) => {
      rl.question('Enter the search scope when looking for users: (default: sub)\n', (answer) => {
        if (answer) conf.searchScope = answer;
        callback();
      });
    },

    // Search filter
    (callback) => {
      rl.question(`Enter the search filter to find a user: (default: ${conf.searchFilter})\n`, (answer) => {
        conf.searchFilter = answer || conf.searchFilter;
        callback();
      });
    },

    // Group attribute
    (callback) => {
      rl.question('Enter the name of the attribute holding the user group:\n', (answer) => {
        if (answer) conf.userGroupAttribute = answer;
        callback();
      });
    },

    // User id attribute
    (callback) => {
      rl.question('Enter the name of the attribute holding the user unique id:\n', (answer) => {
        if (answer) conf.userIdAttribute = answer;
        callback();
      });
    },

    // User name attribute
    (callback) => {
      rl.question('Enter the name of the attribute holding the user name:\n', (answer) => {
        if (answer) conf.userNameAttribute = answer;
        callback();
      });
    },

    // User name attribute
    (callback) => {
      rl.question('Enter the name of the attribute holding the user email:\n', (answer) => {
        if (answer) conf.userEmailAttribute = answer;
        callback();
      });
    },

    // Certificate
    (callback) => {
      rl.question('Enter the complete path to the LDAP certificate:\n', (answer) => {
        if (answer) conf.certificate = answer;
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
      secureQuestion(`Enter a hash to secure HTTP sessions (default: ${hash}) :\n`, (answer) => {
        conf.sessionSecret = answer || hash;
        callback();
      });
    },

    // Ask for HTTP server port
    (callback) => {
      rl.question(`Enter OpenVeo Portal server port (default: ${conf.port}) :\n`, (answer) => {
        conf.port = parseInt(answer || conf.port);
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

    // Local
    (callback) => {
      if (!authConf) return callback();

      rl.question('Do you want to add local authentication to the portal? (y/N) :\n', (answer) => {
        if (answer === 'y') authConf.local = true;
        callback();
      });

    },

    // CAS
    (callback) => {
      if (!authConf) return callback();

      rl.question('Do you want to configure authentication using CAS ? (y/N) :\n', (answer) => {
        if (answer === 'y') {
          askForCasAuthConf((casConf) => {
            authConf.cas = casConf;
            callback();
          });
        } else {
          callback();
        }
      });

    },

    // LDAP
    (callback) => {
      if (!authConf) return callback();

      rl.question('Do you want to configure authentication using LDAP ? (y/N) :\n', (answer) => {
        if (answer === 'y') {
          askForLdapAuthConf((ldapConf) => {
            authConf.ldapauth = ldapConf;
            callback();
          });
        } else {
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
    path: 'http://127.0.0.1:3002',
    certificate: ''
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
      rl.question(`Enter Webservices path (default: ${conf.path}):\n`, (answer) => {
        conf.path = answer || conf.path;
        callback();
      });
    },

    // Ask certificate path
    (callback) => {
      rl.question(`Enter Webservices certificate path (default: ${conf.certificate}):\n`, (answer) => {
        conf.certificate = answer || conf.certificate;
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
      secureQuestion('Enter Webservices oAuth Secret ID :\n', (answer) => {
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
  const db = openVeoApi.database.factory.get(databaseConf);

  db.connect((error) => {
    if (error) {
      process.stdout.write(`Could not connect to the database with message : ${error.message}`);
      exit();
    }

    storage.setDatabase(db);
    callback();
  });
}

/**
 * Creates super administrator if it does not exist.
 */
function createSuperAdmin(callback) {
  const userProvider = new UserProvider(storage.getDatabase());
  const conf = require(path.join(confDir, 'conf.json'));
  const user = {
    id: '0',
    locked: true,
    origin: openVeoApi.passport.STRATEGIES.LOCAL
  };

  async.series([
    (callback) => {

      // Verify if the super admin does not exist
      userProvider.getOne('0', null, (error, user) => {
        if (user)
          callback(new Error('A super admin user already exists\n'));
        else
          callback(error);
      });
    },
    (callback) => {
      rl.question('Enter the name of the OpenVeo Portal super admin to create:\n', (answer) => {
        if (!answer) return callback(new Error('Invalid name, aborting\n'));
        user.name = answer;
        callback();
      });
    },
    (callback) => {
      secureQuestion('Enter the password of the OpenVeo super admin to create:\n', (answer) => {
        if (!answer) return callback(new Error('Invalid password, aborting\n'));
        user.password = crypto.createHmac('sha256', conf.passwordHashKey).update(answer).digest('hex');
        callback();
      });
    },
    (callback) => {
      rl.question('Enter the email of the OpenVeo Portal super admin to create:\n', (answer) => {
        if (!answer || !openVeoApi.util.isEmailValid(answer)) return callback(Error('Invalid email, aborting\n'));
        user.email = answer;
        callback();
      });
    }
  ], (error, results) => {
    if (error) {
      process.stdout.write(error.message);
      callback();
    } else
      userProvider.add(user, (error) => {
        callback(error);
      });
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
  verifyDatabaseConf,
  createSuperAdmin
], (error, results) => {
  if (error)
    throw error;
  else {
    process.stdout.write('Installation complete\n');
    exit();
  }
});

'use strict';

/**
 * @module server
 * @main server
 */

var path = require('path');
var express = require('express');
var session = require('express-session');
var passport = require('passport');
var consolidate = require('consolidate');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var openveoAPI = require('@openveo/api');
var defaultController = process.require('app/server/controllers/defaultController.js');
var errorController = process.require('app/server/controllers/errorController.js');
var passportStrategies = process.require('app/server/passport/strategies.js');
var configurationDirectoryPath = path.join(openveoAPI.fileSystem.getConfDir(), 'portal');
var portalConf = require(path.join(configurationDirectoryPath, 'conf.json'));

// Common options for all static servers delivering static files
var staticServerOptions = {
  extensions: ['htm', 'html'],
  setHeaders: function(response) {
    response.set('x-timestamp', Date.now());
  }
};

/**
 * Defines Portal HTTP Server.
 *
 * @example
 *     var Server = process.require("app/server/Server.js");
 *     var serv = new Server({
 *        port: 3000,
 *        sessionSecret: "123456789",
 *        auth: {
 *          type: "cas",
 *          cas: {
 *            ...
 *          }
 *        }
 *     });
 *
 * @class Server
 * @param {Object} configuration Service configuration
 * @constructor
 */
function Server(configuration) {

  /**
   * Express application.
   *
   * @property app
   * @type Application
   */
  this.app = express();

  /**
   * Server configuration object.
   *
   * @property configuration
   * @type Object
   */
  this.configuration = configuration;

}

module.exports = Server;

/**
 * Prepares server after being sure that the connection to the database is established.
 *
 * @param {Database} database Project's database
 * @method onDatabaseAvailable
 */
Server.prototype.onDatabaseAvailable = function(database) {

  // Remove x-powered-by http header
  this.app.set('x-powered-by', false);

  // Set mustache as the template engine and set views directory
  this.app.engine('html', consolidate.mustache);
  this.app.set('view engine', 'html');
  this.app.set('views', [
    path.join(process.root, 'app/client/front/views')
  ]);

  // Parse Cookie header
  this.app.use(cookieParser());

  // Parse request body
  this.app.use(bodyParser.urlencoded({
    extended: true
  }));
  this.app.use(bodyParser.json());

  // Build express-session options
  // Allowed server to restart without loosing any session
  var sessionOptions = {
    secret: this.configuration.sessionSecret,
    saveUninitialized: true,
    resave: true,
    store: database.getStore(),
    cookie: {}
  };

  // Secure cookies on production
  if (process.env.NODE_ENV === 'production') {
    this.app.set('trust proxy', 1);
    sessionOptions.cookie.secure = true;
  }

  this.app.use(session(sessionOptions));

  // Authentication is activated
  if (this.configuration.auth) {

    // Initialize passport
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // Initialize passport strategy depending on the configuration
    var authType = this.configuration.auth.type;
    passport.use(passportStrategies.get(authType, this.configuration.auth[authType]));

  }

  // Disable cache on get requests
  this.app.get('*', openveoAPI.middlewares.disableCacheMiddleware);

  // Serve favicon
  this.app.use(favicon(process.root + '/assets/themes/' + portalConf.theme + '/favicon.ico'));

  // Log each request
  this.app.use(openveoAPI.middlewares.logRequestMiddleware);

  // Deliver assets using static server
  this.app.use(express.static(path.normalize(process.root + '/assets'), staticServerOptions));

  // Add private static assets directory for development (uncompressed client JavaScript files)
  if (process.env.NODE_ENV !== 'production')
    this.app.use(express.static(path.normalize(process.root + '/app/client/front/js'), staticServerOptions));

  this.mountRoutes();
};

/**
 * Mounts server routes.
 *
 * @method mountRoutes
 */
Server.prototype.mountRoutes = function() {
  if (this.configuration.auth) {

    // Use passport to authenticate the request using the strategy defined in configuration
    this.app.get('/authenticate', passport.authenticate(this.configuration.auth.type, {
      successRedirect: '/'
    }));

    // Use passport to logout the request using the strategy defined in configuration
    this.app.get('/logout', passport.logout(this.configuration.auth.type));

  }

  // Handle not found routes
  this.app.all('*', defaultController.defaultAction);

  // Handle errors
  this.app.use(errorController.errorAction);

};

/**
 * Starts the server.
 *
 * @method start
 */
Server.prototype.start = function() {
  var server = this.app.listen(this.configuration.port, function() {
    process.logger.info('Server listening at http://%s:%s', server.address().address, server.address().port);

    // If process is a child process, send an event to parent process informing that the server has started
    if (process.connected)
      process.send({status: 'started'});

  });
};

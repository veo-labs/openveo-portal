'use strict';

/**
 * @module portal/Server
 */

/* eslint node/no-sync: 0 */
const path = require('path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const consolidate = require('consolidate');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const openVeoApi = require('@openveo/api');
const DefaultController = process.require('app/server/controllers/DefaultController.js');
const ErrorController = process.require('app/server/controllers/ErrorController.js');
const StatisticsController = process.require('app/server/controllers/StatisticsController.js');
const AuthenticationController = process.require('app/server/controllers/AuthenticationController.js');
const VersionController = process.require('app/server/controllers/VersionController.js');
const SettingsController = process.require('app/server/controllers/SettingsController.js');
const GroupsController = process.require('app/server/controllers/GroupsController.js');
const VideosController = process.require('app/server/controllers/VideosController.js');
const CategoriesController = process.require('app/server/controllers/CategoriesController.js');
const FiltersController = process.require('app/server/controllers/FiltersController.js');
const portalConf = process.require('app/server/conf.js');
const authenticator = process.require('app/server/authenticator.js');
const UserProvider = process.require('app/server/providers/UserProvider.js');
const applicationConf = process.require('conf.json');
const strategyFactory = openVeoApi.passport.strategyFactory;

// Common options for all static servers delivering static files
const staticServerOptions = {
  extensions: ['htm', 'html'],
  setHeaders: (response) => {
    response.set('x-timestamp', Date.now());
  }
};

/**
 * Initializes passport strategies to manage user authentication.
 *
 * @memberof module:portal/Server~Server
 * @this module:portal/Server~Server
 * @private
 * @inner
 */
function initializePassport() {
  if (!this.configuration.auth) return;

  this.app.use(passport.initialize());
  this.app.use(passport.session());

  // Instantiate passport strategies
  Object.keys(this.configuration.auth).forEach((strategy) => {
    let strategyConf = this.configuration.auth[strategy];
    if (Object.prototype.toString.call(strategyConf) !== '[object Object]')
      strategyConf = {};

    strategyConf.usernameField = 'login';
    strategyConf.passwordField = 'password';
    strategyConf.logoutUri = 'be';

    if (strategy === openVeoApi.passport.STRATEGIES.LOCAL) {

      // Local strategy does not work like the other strategies, the passport verify callback is used to
      // retrieve the user instead of verifying it
      passport.use(strategyFactory.get(
        openVeoApi.passport.STRATEGIES.LOCAL,
        strategyConf,
        (login, password, callback) => {
          authenticator.verifyUserByCredentials(login, password, (error, user) => {
            if (error) {
              process.logger.error(error.message, {error: error, method: 'verify'});
              callback(null, false);
            } else
              callback(null, user);
          });
        }
      ));

    } else {
      passport.use(strategyFactory.get(strategy, strategyConf, (user, callback) => {
        authenticator.verifyUserAuthentication(user, strategy, (error, verifiedUser) => {
          if (error) {
            process.logger.error(error.message, {error: error, method: 'verify'});
            callback(null, false);
          } else
            callback(null, verifiedUser);
        });
      }));
    }

  });

  // In order to support login sessions, Passport serializes and
  // deserializes user instances to and from the session
  passport.serializeUser(authenticator.serializeUser);

  // When subsequent requests are received, the serialized datas are used to find
  // the user, which will be restored to req.user
  passport.deserializeUser((id, callback) => {
    authenticator.deserializeUser(id, (error, user) => {
      if (error) {
        process.logger.error(error.message, {error: error, method: 'deserializeUser'});
        callback(null, false);
      } else
        callback(null, user);
    });
  });
}

class Server {

  /**
   * Creates a new Portal HTTP server.
   *
   * @example
   * const Server = process.require('app/server/Server.js');
   * const serv = new Server({
   *    port: 3003,
   *    sessionSecret: '123456789',
   *    auth: {
   *      cas: {
   *        ...
   *      }
   *    }
   * });
   *
   * @class Server
   * @constructor
   * @param {Object} configuration Server configuration
   */
  constructor(configuration) {

    Object.defineProperties(this,

      /** @lends module:portal/Server~Server */
      {

        /**
         * Express application.
         *
         * @type {Application}
         * @instance
         */
        app: {
          value: express(),
          writable: true
        },

        /**
         * Server configuration object.
         *
         * @type {Object}
         * @instance
         */
        configuration: {
          value: configuration,
          writable: true
        }

      }

    );

  }

  /**
   * Prepares server after being sure that the connection to the database is established.
   *
   * @param {Database} database Project's database
   * @param {callback} callback Function to call when its done
   */
  onDatabaseAvailable(database, callback) {

    // Remove x-powered-by http header
    this.app.set('x-powered-by', false);

    // Set mustache as the template engine and set views directory
    this.app.engine('html', consolidate.mustache);
    this.app.set('view engine', 'html');
    this.app.set('views', [
      path.join(process.root, 'app/client/front/views'),
      path.join(process.root, 'assets/be/views')
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
    const sessionOptions = {
      secret: this.configuration.sessionSecret,
      saveUninitialized: true,
      resave: true,
      store: database.getStore('portal_sessions'),
      cookie: {}
    };

    // Secure cookies on production
    if (process.env.NODE_ENV === 'production') {
      this.app.set('trust proxy', 1);

      // sessionOptions.cookie.secure = true; Only needed if server is ssl server, not behind a frontal
    }

    this.app.use(session(sessionOptions));

    // Initialize authentication mechanisms
    initializePassport.call(this);

    // Deliver assets using static server
    this.app.use(express.static(path.normalize(`${process.root}/assets`), staticServerOptions));

    // Deliver libraries
    this.mountLibraries();

    // Add private static assets directory for development (uncompressed client JavaScript files)
    if (process.env.NODE_ENV !== 'production')
      this.app.use(express.static(path.normalize(`${process.root}/app/client/front/js`), staticServerOptions));

    // Serve favicon
    this.app.use(favicon(`${process.root}/assets/themes/${portalConf.conf.theme}/favicon.ico`));

    // Disable cache on get requests
    this.app.get('*', openVeoApi.middlewares.disableCacheMiddleware);

    // Log each request
    this.app.use(openVeoApi.middlewares.logRequestMiddleware);

    this.mountRoutes();
    this.createIndexes(database, callback);
  }

  /**
   * Mounts libraries.
   */
  mountLibraries() {
    if (!applicationConf.libraries) return;

    applicationConf.libraries.forEach((library) => {
      const mountPath = path.join('/', library.mountPath);
      process.logger.info(`Mount library "${library.name}" on ${mountPath}`);

      try {
        const libraryPath = path.dirname(require.resolve(path.join(library.name, 'package.json')));
        this.app.use(mountPath, express.static(libraryPath, staticServerOptions));
      } catch (error) {
        process.logger.error(`Unable to mount library "${library.name}" with message: ${error.message}`);
      }
    });
  }

  /**
   * Mounts server routes.
   */
  mountRoutes() {
    const webServiceBasePath = this.configuration.webServiceBasePath;
    const authenticationController = new AuthenticationController();
    const categoriesController = new CategoriesController();
    const defaultController = new DefaultController();
    const errorController = new ErrorController();
    const filtersController = new FiltersController();
    const groupsController = new GroupsController();
    const settingsController = new SettingsController();
    const statisticsController = new StatisticsController();
    const versionController = new VersionController();
    const videosController = new VideosController();

    // Web service routes
    if (this.configuration.auth) {
      this.app.get(
        `${webServiceBasePath}authenticate/:type`,
        authenticationController.authenticateExternalAction.bind(authenticationController)
      );
      this.app.post(
        `${webServiceBasePath}authenticate`,
        authenticationController.authenticateInternalAction.bind(authenticationController)
      );
    }

    this.app.post(
      `${webServiceBasePath}statistics/:entity/:type/:id`,
      statisticsController.statisticsAction.bind(statisticsController)
    );
    this.app.get(
      `${webServiceBasePath}videos/promoted`,
      videosController.getPromotedVideosAction.bind(videosController)
    );
    this.app.get(
      `${webServiceBasePath}videos/:id`,
      videosController.getVideoAction.bind(videosController)
    );
    this.app.post(
      `${webServiceBasePath}videos/:id/poi/convert`,
      videosController.convertVideoPoiAction.bind(videosController)
    );
    this.app.get(
      `${webServiceBasePath}categories`,
      categoriesController.getCategoriesAction.bind(categoriesController)
    );
    this.app.get(
      `${webServiceBasePath}filters`,
      filtersController.getFiltersAction.bind(filtersController)
    );
    this.app.post(
      `${webServiceBasePath}videos`,
      videosController.searchAction.bind(videosController)
    );
    this.app.get(
      `${webServiceBasePath}settings/:id`,
      settingsController.getEntityAction.bind(settingsController)
    );

    // Routes security
    this.app.all(
      '/be*',
      authenticationController.restrictAction.bind(authenticationController)
    );

    // Web service routes
    if (this.configuration.auth) {
      this.app.get(
        `/be${webServiceBasePath}logout`,
        authenticationController.logoutAction.bind(authenticationController)
      );
      this.app.post(
        `/be${webServiceBasePath}logout`,
        authenticationController.logoutAction.bind(authenticationController)
      );
    }

    this.app.get(
      `/be${webServiceBasePath}version`,
      versionController.getVersionAction.bind(versionController)
    );
    this.app.get(
      `/be${webServiceBasePath}settings/:id`,
      settingsController.getEntityAction.bind(settingsController)
    );
    this.app.post(
      `/be${webServiceBasePath}settings/:id`,
      settingsController.updateEntityAction.bind(settingsController)
    );
    this.app.get(
      `/be${webServiceBasePath}groups`,
      groupsController.getGroupsAction.bind(groupsController)
    );
    this.app.get(
      `/be${webServiceBasePath}videos/promoted`,
      videosController.getPromotedVideosAction.bind(videosController)
    );
    this.app.get(
      `/be${webServiceBasePath}videos/:id`,
      videosController.getVideoAction.bind(videosController)
    );
    this.app.post(
      `/be${webServiceBasePath}videos`,
      videosController.searchAction.bind(videosController)
    );

    // Not found web service routes
    this.app.all(
      `/${webServiceBasePath}*`,
      defaultController.defaultWebServiceAction.bind(defaultController)
    );
    this.app.all(
      `/be${webServiceBasePath}*`,
      defaultController.defaultWebServiceAction.bind(defaultController)
    );

    // Not found routes
    this.app.all(
      '/be*',
      defaultController.defaultBackOfficeAction.bind(defaultController)
    );
    this.app.all(
      '*',
      defaultController.defaultAction.bind(defaultController)
    );

    // Handle errors
    this.app.use(errorController.errorAction.bind(errorController));
  }

  /**
   * Creates database indexes.
   *
   * @param {Database} database The database instance
   * @param {callback} callback Function to call when its done
   */
  createIndexes(database, callback) {
    const userProvider = new UserProvider(database);
    userProvider.createIndexes(callback);
  }

  /**
   * Starts the server.
   */
  start() {
    const server = this.app.listen(this.configuration.port, () => {
      process.logger.info('Server listening at http://%s:%s', server.address().address, server.address().port);

      // If process is a child process, send an event to parent process informing that the server has started
      if (process.connected)
        process.send({status: 'started'});

    });
  }

}

module.exports = Server;

'use strict';

/**
 * Defines Portal HTTP Server.
 *
 * @module portal
 * @main portal
 */

/* eslint no-sync: 0 */
const path = require('path');
const url = require('url');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const consolidate = require('consolidate');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const openVeoApi = require('@openveo/api');
const defaultController = process.require('app/server/controllers/defaultController.js');
const errorController = process.require('app/server/controllers/errorController.js');
const searchController = process.require('app/server/controllers/searchController.js');
const statisticsController = process.require('app/server/controllers/statisticsController.js');
const authenticationController = process.require('app/server/controllers/authenticationController.js');
const passportStrategies = process.require('app/server/passport/strategies.js');
const portalConf = process.require('app/server/conf.js');
const configurationDirectoryPath = path.join(openVeoApi.fileSystem.getConfDir(), 'portal');
const webservicesConf = require(path.join(configurationDirectoryPath, 'webservicesConf.json'));

const OPENVEO_URL = webservicesConf.path;

// Common options for all static servers delivering static files
const staticServerOptions = {
  extensions: ['htm', 'html'],
  setHeaders: (response) => {
    response.set('x-timestamp', Date.now());
  }
};

class Server {

  /**
   * Creates a new Portal HTTP server.
   *
   * @example
   *     var Server = process.require('app/server/Server.js');
   *     var serv = new Server({
   *        port: 3003,
   *        sessionSecret: '123456789',
   *        auth: {
   *          type: 'cas',
   *          cas: {
   *            ...
   *          }
   *        }
   *     });
   *
   * @class Server
   * @constructor
   * @param {Object} configuration Server configuration
   */
  constructor(configuration) {

    Object.defineProperties(this, {

      /**
       * Express application.
       *
       * @property app
       * @type Application
       */
      app: {
        value: express(),
        writable: true
      },

      /**
       * Server configuration object.
       *
       * @property configuration
       * @type Object
       */
      configuration: {
        value: configuration,
        writable: true
      }

    });

  }

  /**
   * Prepares server after being sure that the connection to the database is established.
   *
   * @method onDatabaseAvailable
   * @param {Database} database Project's database
   */
  onDatabaseAvailable(database) {

    // Remove x-powered-by http header
    this.app.set('x-powered-by', false);

    // Set mustache as the template engine and set views directory
    this.app.engine('html', consolidate.mustache);
    this.app.set('view engine', 'html');
    this.app.set('views', path.join(process.root, 'app/client/front/views'));

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

    // Authentication is activated
    if (this.configuration.auth) {

      // Initialize passport
      this.app.use(passport.initialize());
      this.app.use(passport.session());

      // Initialize passport strategy depending on the configuration
      const auth = this.configuration.auth;

      // Load passport strategies
      for (var type in auth)
        passport.use(passportStrategies.get(type, auth[type]));

      // Serialize user into passport session
      passport.serializeUser((user, done) => {
        done(null, user);
      });

      // Deserialize user from passport session
      passport.deserializeUser((user, done) => {
        done(null, user);
      });
    }

    // for thumbnail only, set server as proxy to webservice server
    // path : /*/*.jpg, /*/*.jpeg, /*/*.jpg?thumb=small, /*/*.jpeg?thumb=small
    // not: /themes/*.jpg
    this.app.get(/^\/((?!themes).)+\/.+(\.jpg|\.jpeg)(\?thumb=small)?$/, (req, res) => {

      const filename = path.basename(req.url).split('?')[0];

      const urlParsed = url.parse(OPENVEO_URL);
      const requestOptions = {
        protocol: urlParsed.protocol,
        port: urlParsed.port,
        host: urlParsed.hostname,
        method: 'GET',
        path: req.url
      };

      const requestCallback = (response) => {
        if (response.statusCode == 200) {
          let currentByteIndex = 0;
          let responseContentLength = 0;

          response.setEncoding('binary');
          if (response.headers && response.headers['content-length']) {
            responseContentLength = parseInt(response.headers['content-length']);
          }
          const responseBody = Buffer.alloc(responseContentLength);

          response.on('data', (chunk) => {
            responseBody.write(chunk, currentByteIndex, 'binary');
            currentByteIndex += chunk.length;
          });
          response.on('error', (error) => {
            process.logger.error(error.message, {error, method: 'getImageResponse'});
            res.status(502).send('Server unavailable');
          });

          response.on('end', () => {
            res.contentType(filename);
            res.send(responseBody);
          });
        } else {
          res.status(404)        // HTTP status 404: NotFound
            .send('Not found');
        }
      };

      const protocol = urlParsed.protocol.split(':')[0];
      if (protocol == 'https') {
        requestOptions['cert'] = fs.readFileSync(path.normalize(webservicesConf.certificate));
        requestOptions['agent'] = false;
        requestOptions['rejectUnauthorized'] = process.env.NODE_ENV === 'production';
      }

      const request = require(protocol).request(requestOptions, requestCallback);
      request.on('error', (error) => {
        process.logger.error(error.message, {error, method: 'getImageRequest'});
        res.status(502).send('Server unavailable');
      });

      request.end();
    });

    // Deliver assets using static server
    this.app.use(express.static(path.normalize(`${process.root}/assets`), staticServerOptions));

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
  }

  /**
   * Mounts server routes.
   *
   * @method mountRoutes
   */
  mountRoutes() {
    if (this.configuration.auth) {
      this.app.get('/authenticate/:type', authenticationController.authenticateExternalAction);
      this.app.post('/authenticate', authenticationController.authenticateInternalAction);
      this.app.get('/logout', authenticationController.logoutAction);
      this.app.post('/logout', authenticationController.logoutAction);
    }

    this.app.post('/statistics/:entity/:type/:id', statisticsController.statisticsAction);

    this.app.get('/getvideo/:id', searchController.getVideoAction);

    this.app.get('/categories', searchController.getCategoriesAction);

    this.app.get('/filters', searchController.getSearchFiltersAction);

    this.app.post('/search', searchController.searchAction);

    // Handle not found routes
    this.app.all('*', defaultController.defaultAction);

    // Handle errors
    this.app.use(errorController.errorAction);
  }

  /**
   * Starts the server.
   *
   * @method start
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

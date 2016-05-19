'use strict';

/**
 * @module server
 * @main server
 */
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
const openveoAPI = require('@openveo/api');
const defaultController = process.require('app/server/controllers/defaultController.js');
const errorController = process.require('app/server/controllers/errorController.js');
const searchController = process.require('app/server/controllers/searchController.js');
const statisticsController = process.require('app/server/controllers/statisticsController.js');
const passportStrategies = process.require('app/server/passport/strategies.js');
const configurationDirectoryPath = path.join(openveoAPI.fileSystem.getConfDir(), 'portal');
const portalConf = require(path.join(configurationDirectoryPath, 'conf.json'));
const webservicesConf = require(path.join(configurationDirectoryPath, 'webservicesConf.json'));

const OPENVEO_URL = webservicesConf.path;

// Common options for all static servers delivering static files
const staticServerOptions = {
  extensions: ['htm', 'html'],
  setHeaders: (response) => {
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
 */
class Server {

  /**
   * Creates a new Portal HTTP server.
   *
   * @param {Object} configuration Service configuration
   * @constructor
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
   * @param {Database} database Project's database
   * @method onDatabaseAvailable
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
      const authType = this.configuration.auth.type;
      passport.use(passportStrategies.get(authType, this.configuration.auth[authType]));
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
          const responseBody = new Buffer(responseContentLength);

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
        requestOptions['ca'] = fs.readFileSync(path.normalize(webservicesConf.certificate));
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
    this.app.use(favicon(`${process.root}/assets/themes/${portalConf.theme}/favicon.ico`));

    // Disable cache on get requests
    this.app.get('*', openveoAPI.middlewares.disableCacheMiddleware);

    // Log each request
    this.app.use(openveoAPI.middlewares.logRequestMiddleware);

    this.mountRoutes();
  }

  /**
   * Mounts server routes.
   *
   * @method mountRoutes
   */
  mountRoutes() {
    if (this.configuration.auth) {

      // Use passport to authenticate the request using the strategy defined in configuration
      this.app.get('/authenticate', passport.authenticate(this.configuration.auth.type, {
        successRedirect: '/'
      }));

      // Use passport to logout the request using the strategy defined in configuration
      this.app.get('/logout', passport.logout(this.configuration.auth.type));
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

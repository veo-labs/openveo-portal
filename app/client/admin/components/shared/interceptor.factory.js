'use strict';

(function(app) {

  /**
   * Defines an HTTP interceptor.
   *
   * It intercepts HTTP requests to add the back office base path to all requests except templates.
   * It handles all HTTP responses errors and displays corresponding error messages.
   *
   * Not authorized errors (401) broadcast a opaHttpError event while the other HTTP errors display an error message
   * using a notification.
   *
   * @class OpaInterceptor
   * @memberof module:opa
   * @inner
   * @param {Object} $rootScope AngularJS root scope
   * @param {Object} $filter AngularJS $filter service
   * @param {Object} $q AngularJS $q service
   */
  function OpaInterceptor($rootScope, $filter, $q) {

    /**
     * Builds the error message for the given error.
     *
     * @param {Object} error The promise error as returned by the interceptor
     * @return {String} The translated error message corresponding to the server error
     */
    var getErrorMessage = function(error) {
      var errorCode;

      if (error.data && error.data.error)
        errorCode = error.data.error.code;

      // Not authorized
      if (error.status === 403)
        return $filter('opaTranslate')('ERRORS.FORBIDDEN');

      // Probably a client application error
      else if (error.status === 400)
        return $filter('opaTranslate')('ERRORS.CLIENT');

      // Internal server error
      else if (errorCode)
        return $filter('opaTranslate')('ERRORS.SERVER') + ' (code=' + errorCode + ')';

      // Other error
      else
        return $filter('opaTranslate')('ERRORS.SERVER');
    };

    return {

      request: function(config) {

        // Add base path to all requests except templates
        if (config.url && !/^.*\.html$/.test(config.url))
          config.url = '/be/' + config.url.replace(/^\/(.*)/, '$1');

        return config;
      },

      responseError: function(rejection) {

        // A request has been attempted while user is not longer authenticated on the server side
        if (rejection.status === 401)
          $rootScope.$broadcast('opaHttpError', {authenticationError: true});

        // Canceled or network error
        else if (rejection.status === -1) {

          // Set alert only on network error, not on cancel
          if (!rejection.config || !rejection.config.timeout || !rejection.config.timeout.status)
            $rootScope.$broadcast('opaHttpError', {message: getErrorMessage(rejection)});

        // Other status
        } else
          $rootScope.$broadcast('opaHttpError', {message: getErrorMessage(rejection)});

        return $q.reject(rejection);
      }
    };
  }

  app.factory('opaInterceptor', OpaInterceptor);
  OpaInterceptor.$inject = ['$rootScope', '$filter', '$q'];

})(angular.module('opa'));

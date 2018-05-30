'use strict';

/**
 * Offer internationalization utilities.
 *
 * @module opa.i18n
 * @main opa.i18n
 */

(function(angular) {
  angular.module('opa.i18n', []);
})(angular);
;'use strict';

/**
 * OpenVeo Portal AngularJS administration module to manage administration interface.
 *
 * opa (for OpenVeo Portal Admin) module holds all components of the OpenVeo Portal administration interface.
 *
 * @module opa
 * @main opa
 */

(function(angular) {

  /**
   * Main module of the OpenVeo Portal administration interface.
   */
  var app = angular.module('opa', [
    'ngRoute',
    'ngAnimate',
    'ngMaterial',
    'ngAria',
    'opa.i18n'
  ]);

  /**
   * Configures application main routes and set location mode to HTML5.
   */
  app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {

      // Register dashboard page route
      $routeProvider.when('/', {
        template: '<opa-dashboard></opa-dashboard>',
        title: 'HOME.PAGE_TITLE'
      }).otherwise('/');

      $locationProvider.html5Mode(true);
    }]);

  angular.element(document).ready(function() {
    //loadConfiguration().then(function() {
      angular.bootstrap(document, ['opa'], {strictDi: true});
    //});
  });

})(angular);
;'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages <opa-dashboard> component.
   *
   * @class OpaDashboardController
   * @constructor
   */
  function OpaDashboardController() {
    console.log('OpaDashboardController');
    this.pipi = 'caca';
  }

  app.controller('OpaDashboardController', OpaDashboardController);
  OpaDashboardController.$inject = [];

})(angular.module('opa'));
;'use strict';

/**
 * Dashboard component presents a list of components as blocks.
 *
 * Usage:
 * <opa-dashboard></opa-dashboard>
 *
 * @module opa.dashboard
 * @main opa.dashboard
 */

(function(app) {

  app.component('opaDashboard', {
    templateUrl: 'dashboard.html',
    controller: 'OpaDashboardController',
    bindings: {}
  });

})(angular.module('opa'));
;'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Defines the main controller of the OpenVeo Portal administration interface.
   *
   * @class OpaIndexController
   * @constructor
   * @param {Object} $scope AngularJS scope
   * @param {Object} $route AngularJS $route service
   */
  function OpaIndexController($scope, $route) {
    var self = this;
    console.log('OpaIndexController');
    console.log($scope);
    //console.log(angular.element(document.body).controller());
    $scope.pouet = 'pouet';
    this.pouet = 'toto';
    console.log(angular.element(document.body).scope());
    console.log(angular.element(document.body).isolateScope());

    //Object.defineProperties(this, {

      /**
       * Information about the page.
       *
       * @property page
       * @type Object
       */
      /*page: {
        value: {},
        writable: true
      }

    });

    // Listen to route change start event
    $scope.$on('$routeChangeStart', function(event, next) {
      console.log('$routeChangeStart');
    });

    // Listen to route change success event
    $scope.$on('$routeChangeSuccess', function(event, route) {
      console.log('$routeChangeSuccess');
      self.page.title = route && route.title;
    });

    // Listen to the route change error event
    $scope.$on('$routeChangeError', function(event, current, previous, eventObj) {
      console.log('$routeChangeError');
    });*/
  }

  app.controller('OpaIndexController', OpaIndexController);
  OpaIndexController.$inject = ['$scope', '$route'];

})(angular.module('opa'));
;'use strict';

/**
 * @module opa.i18n
 */

(function(app) {

  /**
   * Translate filter to translate an id using a dictionary of translations.
   *
   * @class OpaTranslateFilter
   * @constructor
   */
  function OpaTranslateFilter(translations) {

    /**
     * Translates an id into the appropriated translated text.
     *
     * @method opaTranslate
     * @param {String} id The id of the translation
     * @param {Number} number The number to determine pluralization
     * @return {String} The translated string
     */
    return function(id, number) {
      return id;
    };

  }

  app.filter('opaTranslate', OpaTranslateFilter);
  OpaTranslateFilter.$inject = [];

})(angular.module('opa.i18n'));

//# sourceMappingURL=openveo-portal-admin.js.map
'use strict';

/**
 * Dashboard component presents a list of components as cards.
 *
 * Requires:
 * - **ngMaterial** AngularJS Material module
 * - **opaAbout** Component presenting information about Portal
 *
 * @example
 * <opa-dashboard></opa-dashboard>
 *
 * @module opa/dashboard
 */

(function(app) {

  app.component('opaDashboard', {
    templateUrl: 'opa-dashboard.html',
    controller: 'OpaDashboardController',
    bindings: {}
  });

})(angular.module('opa'));

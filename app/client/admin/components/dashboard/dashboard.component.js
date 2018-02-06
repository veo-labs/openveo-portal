'use strict';

/**
 * @module opa
 */

/**
 * Dashboard component presents a list of components as cards.
 *
 *     <opa-dashboard></opa-dashboard>
 *
 * Requires:
 * - **ngMaterial** AngularJS Material module
 * - **opaAbout** Component presenting information about Portal
 *
 * @class opaDashboard
 */

(function(app) {

  app.component('opaDashboard', {
    templateUrl: 'opa-dashboard.html',
    controller: 'OpaDashboardController',
    bindings: {}
  });

})(angular.module('opa'));

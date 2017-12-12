'use strict';

/**
 * @module opa
 */

/**
 * Dashboard component presents a list of components as cards.
 *
 *     <opa-dashboard></opa-dashboard>
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

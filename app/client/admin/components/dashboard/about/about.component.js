'use strict';

/**
 * About component presents information about OpenVeo Portal project.
 *
 * Requires:
 * - **ngMaterial** AngularJS Material module
 * - **opaTranslate** Internationalization translate filter
 * - **opaInfoButton** Component used to display info actions
 *
 * @example
 * <opa-about></opa-about>
 *
 * @module opa/dashboard/about
 */

(function(app) {

  app.component('opaAbout', {
    templateUrl: 'opa-about.html',
    controller: 'OpaAboutController',
    bindings: {}
  });

})(angular.module('opa'));

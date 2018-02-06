'use strict';

/**
 * @module opa
 */

/**
 * About component presents information about OpenVeo Portal project.
 *
 *     <opa-about></opa-about>
 *
 * Requires:
 * - **ngMaterial** AngularJS Material module
 * - **opaTranslate** Internationalization translate filter
 * - **opaInfoButton** Component used to display info actions
 *
 * @class opaAbout
 */

(function(app) {

  app.component('opaAbout', {
    templateUrl: 'opa-about.html',
    controller: 'OpaAboutController',
    bindings: {}
  });

})(angular.module('opa'));

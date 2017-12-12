'use strict';

/**
 * @module opa
 */

/**
 * About component presents information about OpenVeo Portal project.
 *
 *     <opa-about></opa-about>
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

'use strict';

/**
 * Info button presents an information button opening a dialog with a message.
 *
 * It uses opa-info directive to display the message.
 *
 * Available attributes are:
 *   - [String] **opa-message**: An AngularJS expression evaluating to a wrapped version of the message that can be
 *     used as a trusted variant in $sce.HTML context
 *   - [String] **[opa-accessibility]**: The button accessibility message
 *   - [String] **[opa-help]**: The tooltip text
 *
 * Requires:
 * - **ngMaterial** AngularJS Material module
 * - **opaInfo** Directive opening a panel with a message and a close button
 *
 * @example
 * $scope.message = 'Message which may contain HTML';
 *
 * <opa-info-button
 *   opa-message="message"
 *   opa-accessibility="Info button accessibility message"
 *   opa-help="Info button tooltip text"
 * ></opa-info-button>
 *
 * @module opa/infoButton
 */

(function(app) {

  app.component('opaInfoButton', {
    templateUrl: 'opa-infoButton.html',
    controller: 'OpaInfoButtonController',
    bindings: {
      opaMessage: '<',
      opaAccessibility: '@',
      opaHelp: '@'
    }
  });

})(angular.module('opa'));

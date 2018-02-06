'use strict';

/**
 * @module opa
 */

/**
 * Info button presents an information button opening a dialog with a message.
 *
 * It uses opa-info directive to display the message.
 *
 *     $scope.message = 'Message which may contain HTML';
 *
 *     <opa-info-button
 *       opa-message="message"
 *       opa-label="Info button ARIA label"
 *       opa-help="Info button tooltip text"
 *     ></opa-info-button>
 *
 * Available attributes are:
 *   - [String] **opa-message**: An AngularJS expression evaluating to a wrapped version of the message that can be
 *     used as a trusted variant in $sce.HTML context
 *   - [String] **[opa-label]**: The button accessibility text
 *   - [String] **[opa-help]**: The tooltip text
 *
 * Requires:
 * - **ngMaterial** AngularJS Material module
 * - **opaInfo** Directive opening a panel with a message and a close button
 *
 * @class opa
 */

(function(app) {

  app.component('opaInfoButton', {
    templateUrl: 'opa-infoButton.html',
    controller: 'OpaInfoButtonController',
    bindings: {
      opaMessage: '<',
      opaLabel: '@',
      opaHelp: '@'
    }
  });

})(angular.module('opa'));

'use strict';

(function(app) {

  /**
   * Info directive presents a message in an AngularJS Material panel with a close button.
   *
   * When HTML element holding the attribute is clicked, a panel is opened next to the element
   * with the message and a close button.
   *
   * Available attributes are:
   * - [Object] **opa-info**: The wrapped version of the message that can be used as a trusted
   * variant in $sce.HTML context
   * - [String] **opa-close**: The close button label
   * - [String] **opa-close-aria**: The close button ARIA label
   *
   * Requires:
   * - **ngMaterial** AngularJS Material module
   *
   * @example
   * $scope.message = 'Message which may contain HTML';
   *
   * <div
   *   opa-info="message"
   *   opa-close="Close button label"
   *   opa-close-aria="Close button ARIA label"
   * ></div>
   *
   * @module opa/info
   */
  function opaInfo() {
    return {
      restrict: 'A',
      scope: {
        message: '<opaInfo',
        closeLabel: '@opaClose',
        closeAriaLabel: '@opaCloseAria'
      },
      controller: 'OpaInfoController',
      controllerAs: 'ctrl',
      bindToController: true
    };
  }

  app.directive('opaInfo', opaInfo);

})(angular.module('opa'));

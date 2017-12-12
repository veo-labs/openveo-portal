'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Info directive presents a message in an AngularJS Material panel with a close button.
   *
   * When HTML element holding the attribute is clicked, a panel is opened next to the element
   * with the message and a close button.
   *
   *     <div opa-info="'MESSAGE_TRANSLATION_ID' | opaTranslate"></div>
   *
   * Available attributes are:
   * - [Object] **opa-info**: The wrapped version of the message that can be used as a trusted
   * variant in $sce.HTML context
   *
   * @class opaInfo
   */
  function opaInfo() {
    return {
      restrict: 'A',
      scope: {
        message: '=opaInfo'
      },
      controller: 'OpaInfoController',
      controllerAs: 'ctrl',
      bindToController: true
    };
  }

  app.directive('opaInfo', opaInfo);

})(angular.module('opa'));

'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages opaInfoButton component.
   *
   * @class OpaInfoButtonController
   * @param {Object} $filter AngularJS $filter service
   * @constructor
   */
  function OpaInfoButtonController($filter) {
    var ctrl = this;

    Object.defineProperties(ctrl, {

      /**
       * Handles one-way binding properties changes.
       *
       * @method $onChanges
       * @final
       * @param {Object} changedProperties Properties which have changed since last digest loop
       * @param {Object} [changedProperties.opaLabel] opa-info old and new value
       * @param {Boolean} [changedProperties.opaLabel.currentValue] opa-info new value
       */
      $onChanges: {
        value: function(changedProperties) {
          if (changedProperties.opaLabel)
            ctrl.opaLabel = changedProperties.opaLabel.currentValue ||
              $filter('opaTranslate')('INFO.INFO_BUTTON_DESCRIPTION');
        }
      }

    });

  }

  app.controller('OpaInfoButtonController', OpaInfoButtonController);
  OpaInfoButtonController.$inject = ['$filter'];

})(angular.module('opa'));

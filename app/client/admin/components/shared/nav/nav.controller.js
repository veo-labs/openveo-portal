'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages opaNav component.
   *
   * @class OpaNavController
   * @constructor
   */
  function OpaNavController() {
    var ctrl = this;

    Object.defineProperties(ctrl, {

      /**
       * Handles keypress items.
       *
       * @method handleItemKeypress
       * @final
       * @param {Event} event The keypress event
       * @param {Object} item The item receiving the event
       */
      handleItemKeypress: {
        value: function(event, item) {
          if (event.keyCode === 13) {

            // Captured "enter" key

            // Execute item associated action
            item.action(item);

          }
        }
      }

    });
  }

  app.controller('OpaNavController', OpaNavController);
  OpaNavController.$inject = [];

})(angular.module('opa'));

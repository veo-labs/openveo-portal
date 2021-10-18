'use strict';

(function(app) {

  /**
   * Manages opaNav component.
   *
   * @class OpaNavController
   * @memberof module:opa/nav
   * @inner
   * @constructor
   */
  function OpaNavController() {
    var ctrl = this;

    Object.defineProperties(ctrl,

      /** @lends module:opa/nav~OpaNavController */
      {

        /**
         * Handles keypress items.
         *
         * @memberof module:opa/nav~OpaNavController
         * @method handleItemKeypress
         * @instance
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

      }

    );
  }

  app.controller('OpaNavController', OpaNavController);
  OpaNavController.$inject = [];

})(angular.module('opa'));

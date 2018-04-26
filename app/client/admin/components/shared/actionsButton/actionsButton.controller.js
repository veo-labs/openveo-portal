'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages opaActionsButton component.
   *
   * @class OpaActionsButtonController
   * @constructor
   * @param {Object} $element The HTML element holding the component
   * @param {Object} $window JQLite element of the window
   * @param {Object} $document JQLite element of the document
   */
  function OpaActionsButtonController($element, $window, $document) {
    var ctrl = this;

    Object.defineProperties(ctrl, {

      /**
       * Indicates if the list of actions is visible or not.
       *
       * @property isOpened
       * @type Boolean
       */
      isOpened: {
        value: false,
        writable: true
      },

      /**
       * Shows / hides actions.
       *
       * @method toggleActions
       * @final
       */
      toggleActions: {
        value: function() {
          var actionsWrapperElement = $element[0].querySelector('.opa-actions-wrapper');
          ctrl.isOpened = !ctrl.isOpened;

          if (ctrl.isOpened) {
            var height;
            var actionsElement = $element.find('ul')[0];
            var computedStyle = $window.getComputedStyle(actionsElement);
            height = parseFloat(computedStyle.getPropertyValue('height') || computedStyle['height']);
            if (!height) height = actionsElement['offsetHeight'];

            actionsWrapperElement.style.height = height + 'px';
          } else
            actionsWrapperElement.style.height = '0px';
        }
      },

      /**
       * Handles keypress events on actions.
       *
       * @method handleActionKeypress
       * @final
       * @param {Event} event The keypress event
       * @param {Object} action The action receiving the event
       */
      handleActionKeypress: {
        value: function(event, action) {
          if (event.keyCode === 13) {

            // Captured "enter" key

            // Execute action associated action
            action.action(action);

          }
        }
      }

    });

  }

  app.controller('OpaActionsButtonController', OpaActionsButtonController);
  OpaActionsButtonController.$inject = ['$element', '$window', '$document'];

})(angular.module('opa'));

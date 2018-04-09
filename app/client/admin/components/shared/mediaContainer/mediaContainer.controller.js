'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages opaMediaContainer component.
   *
   * @class OpaMediaContainerController
   */
  function OpaMediaContainerController() {
    var self = this;

    Object.defineProperties(self, {

      /**
       * Trigger the edit callback to select a new media.
       *
       * @method onClick
       * @final
       */
      onClick: {
        value: function() {
          self.opaEdit();
        }
      },

      /**
       * Trigger the remove action to clear the media.
       *
       * @method onRemove
       * @final
       */
      onRemove: {
        value: function($event) {
          $event.stopPropagation();
          self.opaRemove();
        }
      }
    });
  }

  app.controller('OpaMediaContainerController', OpaMediaContainerController);

})(angular.module('opa'));

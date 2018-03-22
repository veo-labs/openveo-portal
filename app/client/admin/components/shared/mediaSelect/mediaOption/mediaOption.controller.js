'use strict';

/**
 * @module opa
 */
(function(app) {

  /**
   * Manages opaMediaOption component.
   *
   * @class OpaMediaOptionController
   */
  function OpaMediaOptionController() {
    var self = this;

    Object.defineProperties(self, {

      /**
       * Indicates if the media is checked or not.
       *
       * @property isChecked
       * @type Boolean
       */
      isChecked: {
        value: false,
        writable: true
      },

      /**
       * Handles one-way binding properties changes.
       *
       * Watch for checkboxes state changes
       *
       * @method $onChanges
       * @param {Object} changedProperties Properties which have changed since last digest loop
       * @final
       */
      $onChanges: {
        value: function(changedProperties) {
          if (changedProperties.hasOwnProperty('opaChecked'))
            self.isChecked = self.opaChecked;
        }
      },

      /**
       * Update the parent select when the checkbox is changed.
       *
       * @method updateSelect
       * @final
       */
      updateSelect: {
        value: function() {
          if (self.isChecked)
            self.selectCtrl.check(self.opaMedia);
          else
            self.selectCtrl.uncheck(self.opaMedia);
        }
      }

    });

  }

  app.controller('OpaMediaOptionController', OpaMediaOptionController);

})(angular.module('opa'));

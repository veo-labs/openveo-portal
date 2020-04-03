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
  function OpaMediaOptionController($element) {
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
          if (Object.prototype.hasOwnProperty.call(changedProperties, 'opaChecked'))
            self.isChecked = self.opaChecked;

          if (Object.prototype.hasOwnProperty.call(changedProperties, 'opaFocus') && self.opaFocus === true) {
            $element.find('md-checkbox')[0].focus();
          }
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
      },

      /**
       * Launch opaBlur() binding callback
       *
       * @method opaBlur
       * @final
       */
      onBlur: {
        value: function() {
          self.opaBlur();
        }
      }

    });

  }

  app.controller('OpaMediaOptionController', OpaMediaOptionController);
  OpaMediaOptionController.$inject = ['$element'];

})(angular.module('opa'));

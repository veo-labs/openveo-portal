'use strict';

(function(app) {

  /**
   * Manages opaMediaOption component.
   *
   * @class OpaMediaOptionController
   * @memberof module:opa/mediaOption
   * @inner
   */
  function OpaMediaOptionController($element) {
    var self = this;

    Object.defineProperties(self,

      /** @lends module:opa/mediaOption~OpaMediaOptionController */
      {

        /**
         * Indicates if the media is checked or not.
         *
         * @type {Boolean}
         * @instance
         * @default false
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
         * @memberof module:opa/mediaOption~OpaMediaOptionController
         * @method $onChanges
         * @instance
         * @param {Object} changedProperties Properties which have changed since last digest loop
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
         * @memberof module:opa/mediaOption~OpaMediaOptionController
         * @method updateSelect
         * @instance
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
         * @memberof module:opa/mediaOption~OpaMediaOptionController
         * @method opaBlur
         * @instance
         */
        onBlur: {
          value: function() {
            self.opaBlur();
          }
        }

      }

    );

  }

  app.controller('OpaMediaOptionController', OpaMediaOptionController);
  OpaMediaOptionController.$inject = ['$element'];

})(angular.module('opa'));

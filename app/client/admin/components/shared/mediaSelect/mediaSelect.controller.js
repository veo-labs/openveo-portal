'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages opaMediaSelect component.
   *
   * @class OpaMediaSelectController
   * @constructor
   */
  function OpaMediaSelectController() {
    var self = this;
    var index;

    Object.defineProperties(self, {

      /**
       * The list of selected medias.
       *
       * @property selection
       * @type Array
       */
      selection: {
        value: [],
        writable: true
      },

      /**
       * Defines if the model can contains one or many medias.
       *
       * @property multiple
       * @type Boolean
       */
      multiple: {
        value: false,
        writable: true
      },

      /**
       * Checkboxes states.
       *
       * @property checkboxesStates
       * @type Array
       */
      checkboxesStates: {
        value: [],
        writable: true
      },

      /**
       * Controller initialization state.
       *
       * The initialization of the checkboxes states can't be done before
       * the controller initialization is completed.
       *
       * @property isInitialized
       * @type Boolean
       */
      isInitialized: {
        value: false,
        writable: true
      },

      /**
       * Initializes controller.
       *
       * @method $onInit
       * @final
       */
      $onInit: {
        value: function() {
          self.multiple = self.opaMultiple || Array.isArray(self.ngModel);

          if (self.ngModel)
            self.selection = self.multiple ? self.ngModel : [self.ngModel];

          self.setCheckboxesStates();
          self.isInitialized = true;
        }
      },

      /**
       * Handles one-way binding properties changes.
       *
       * @method $onChanges
       * @param {Object} changedProperties Properties which have changed since last digest loop
       * @final
       */
      $onChanges: {
        value: function(changedProperties) {
          if (changedProperties.hasOwnProperty('opaMedias') && self.isInitialized) {
            self.setCheckboxesStates();
          }
        }
      },

      /**
       * Add a media to the selection.
       *
       * @method check
       * @param {Object} media
       * @final
       */
      check: {
        value: function(media) {
          index = self.opaMedias.indexOf(media);
          if (!self.multiple) {
            self.selection = [media.id];
            self.ngModel = media.id;

            // Uncheck all the other checkboxes
            for (var i = 0; i < self.checkboxesStates.length; i++)
              self.checkboxesStates[i] = i === index;
          } else if (self.selection.indexOf(media.id) === -1) {
            self.selection.push(media.id);
            self.ngModel = self.selection;
            self.checkboxesStates[index] = true;
          }
        }
      },

      /**
       * Remove a media from the selection.
       *
       * @method uncheck
       * @param {Object} media
       * @final
       */
      uncheck: {
        value: function(media) {
          // Remove from selection
          index = self.selection.indexOf(media.id);
          if (index !== -1) {
            self.selection.splice(index, 1);
          }

          // Disable value
          index = self.opaMedias.indexOf(media);
          if (index !== -1)
            self.checkboxesStates[index] = false;

          self.ngModel = self.multiple ? self.selection : '';
        }
      },

      /**
       * Set checkboxes states
       *
       * Define if checkboxes are checked or not (depending on selection)
       * at the initialization or when the medias are changed.
       *
       * @method setCheckboxesStates()
       * @final
       */
      setCheckboxesStates: {
        value: function() {
          self.checkboxesStates = [];
          self.opaMedias.forEach(function(media) {
            self.checkboxesStates.push(self.selection.indexOf(media.id) !== -1);
          });
        }
      }

    });
  }

  app.controller('OpaMediaSelectController', OpaMediaSelectController);

})(angular.module('opa'));

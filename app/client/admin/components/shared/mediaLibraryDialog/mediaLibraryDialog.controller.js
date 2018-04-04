'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages media library dialog
   *
   * @class OpaMediaLibraryDialogController
   * @constructor
   */
  function OpaMediaLibraryDialogController($mdDialog, $mdMedia, value, multiple) {
    var self = this;

    Object.defineProperties(self, {

      /**
       * Value of the media library.
       *
       * @property value
       * @type Mixed
       */
      value: {
        value: null,
        writable: true
      },

      /**
       * Defines if the value can contains one or many medias.
       *
       * @property multiple
       * @type Boolean
       */
      multiple: {
        value: null,
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
          self.value = value;
          self.multiple = multiple;
        }
      },

      /**
       * Determines the size of the dialog depending on the view port.
       *
       * @method dialogSizeClass
       * @final
       */
      dialogSizeClass: {
        value: function() {
          if ($mdMedia('xs'))
            return 'dialog-100';

          if ($mdMedia('sm'))
            return 'dialog-80';

          if ($mdMedia('md'))
            return 'dialog-55';

          if ($mdMedia('gt-md'))
            return 'dialog-40';

          return;
        }
      },

      /**
       * Cancels changes.
       *
       * @method cancel
       * @final
       */
      cancel: {
        value: function() {
          $mdDialog.cancel();
        }
      },

      /**
       * Saves changes.
       *
       * @method close
       * @final
       */
      close: {
        value: function() {
          $mdDialog.hide({value: self.value});
        }
      }

    });
  }

  app.controller('OpaMediaLibraryDialogController', OpaMediaLibraryDialogController);
  OpaMediaLibraryDialogController.$inject = ['$mdDialog', '$mdMedia', 'value', 'multiple'];

})(angular.module('opa'));

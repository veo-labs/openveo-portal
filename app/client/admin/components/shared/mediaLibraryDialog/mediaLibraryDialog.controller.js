'use strict';

/**
 * @module opa/mediaLibraryDialog
 */

(function(app) {

  /**
   * Manages media library dialog
   *
   * @class OpaMediaLibraryDialogController
   * @memberof module:opa/mediaLibraryDialog
   * @inner
   * @constructor
   */
  function OpaMediaLibraryDialogController($mdDialog, $mdMedia, value, multiple) {
    var self = this;

    Object.defineProperties(self,

      /** @lends module:opa/mediaLibraryDialog~OpaMediaLibraryDialogController */
      {

        /**
         * Value of the media library.
         *
         * @type {*}
         * @instance
         * @default null
         */
        value: {
          value: null,
          writable: true
        },

        /**
         * Defines if the value can contains one or many medias.
         *
         * @type {Boolean}
         * @instance
         * @default null
         */
        multiple: {
          value: null,
          writable: true
        },

        /**
         * Initializes controller.
         *
         * @memberof module:opa/mediaLibraryDialog~OpaMediaLibraryDialogController
         * @method $onInit
         * @instance
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
         * @memberof module:opa/mediaLibraryDialog~OpaMediaLibraryDialogController
         * @method dialogSizeClass
         * @instance
         */
        dialogSizeClass: {
          value: function() {
            if ($mdMedia('xs'))
              return 'opa-dialog-100';

            if ($mdMedia('sm'))
              return 'opa-dialog-80';

            if ($mdMedia('md'))
              return 'opa-dialog-55';

            if ($mdMedia('gt-md'))
              return 'opa-dialog-40';

            return;
          }
        },

        /**
         * Cancels changes.
         *
         * @memberof module:opa/mediaLibraryDialog~OpaMediaLibraryDialogController
         * @method cancel
         * @instance
         */
        cancel: {
          value: function() {
            $mdDialog.cancel();
          }
        },

        /**
         * Saves changes.
         *
         * @memberof module:opa/mediaLibraryDialog~OpaMediaLibraryDialogController
         * @method close
         * @instance
         */
        close: {
          value: function() {
            $mdDialog.hide({value: self.value});
          }
        }

      }

    );
  }

  app.controller('OpaMediaLibraryDialogController', OpaMediaLibraryDialogController);
  OpaMediaLibraryDialogController.$inject = ['$mdDialog', '$mdMedia', 'value', 'multiple'];

})(angular.module('opa'));

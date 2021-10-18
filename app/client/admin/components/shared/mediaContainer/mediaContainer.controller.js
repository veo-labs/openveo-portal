'use strict';

(function(app) {

  /**
   * Manages opaMediaContainer component.
   *
   * @class OpaMediaContainerController
   * @memberof module:opa/mediaContainer
   * @inner
   */
  function OpaMediaContainerController() {
    var self = this;

    Object.defineProperties(self,

      /** @lends module:opa/mediaContainer~OpaMediaContainerController */
      {

        /**
         * Trigger the edit callback to select a new media.
         *
         * @memberof module:opa/mediaContainer~OpaMediaContainerController
         * @method onClick
         * @instance
         */
        onClick: {
          value: function() {
            self.opaEdit();
          }
        },

        /**
         * Trigger the remove action to clear the media.
         *
         * @memberof module:opa/mediaContainer~OpaMediaContainerController
         * @method onRemove
         * @instance
         */
        onRemove: {
          value: function($event) {
            $event.stopImmediatePropagation();
            self.opaRemove();
          }
        }

      }

    );
  }

  app.controller('OpaMediaContainerController', OpaMediaContainerController);

})(angular.module('opa'));

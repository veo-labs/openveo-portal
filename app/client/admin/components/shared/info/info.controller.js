'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages information dialogs.
   *
   * @class OpaInfoController
   * @constructor
   * @param {Object} $scope Directive isolated scope
   * @param {Object} $element JQLite element of the directive
   * @param {Object} $document JQLite element of the document
   * @param {Object} $mdPanel AngularJS Material service to create panels
   */
  function OpaInfoController($scope, $element, $document, $mdPanel) {
    var ctrl = this;
    var panelReference = null;
    var panelPromise = null;
    var panelPosition = $mdPanel.newPanelPosition();

    Object.defineProperties(ctrl, {

      /**
       * Opens the information dialog.
       *
       * @method open
       * @final
       */
      open: {
        value: function() {
          if (panelReference || panelPromise) return;

          panelPromise = $mdPanel.open({
            templateUrl: 'opa-info.html',
            controller: function() {
              this.close = ctrl.close;
            },
            controllerAs: 'ctrl',
            locals: {
              message: ctrl.message
            },
            attachTo: $document[0].body,
            escapeToClose: true,
            clickOutsideToClose: true,
            position: panelPosition,
            onCloseSuccess: function() {
              panelReference = null;
            }
          }).then(function(reference) {
            panelPromise = null;
            panelReference = reference;
          });
        }
      },

      /**
       * Closes the information dialog.
       *
       * @method close
       * @final
       */
      close: {
        value: function() {
          if (panelReference) {
            panelReference.close();
          }
        }
      },

      /**
       * Initializes controller.
       *
       * @method $onInit
       */
      $onInit: {
        value: function() {
          panelPosition.relativeTo($element).addPanelPosition(
            $mdPanel.xPosition.ALIGN_START,
            $mdPanel.yPosition.BELOW
          );
        }
      }

    });

    // Add click event handler to open the dialog
    $element.on('click', ctrl.open);

    // Remove event handler on destroy
    $scope.$on('$destroy', function() {
      ctrl.close();
      $element.off('click', ctrl.open);
    });
  }

  app.controller('OpaInfoController', OpaInfoController);
  OpaInfoController.$inject = ['$scope', '$element', '$document', '$mdPanel'];

})(angular.module('opa'));

'use strict';

(function(app) {

  /**
   * Manages information dialogs.
   *
   * @class OpaInfoController
   * @memberof module:opa/info
   * @inner
   * @constructor
   * @param {Object} $scope Directive isolated scope
   * @param {Object} $element JQLite element of the directive
   * @param {Object} $document JQLite element of the document
   * @param {Object} $timeout AngularJS $timeout service
   * @param {Object} $mdPanel AngularJS Material service to create panels
   * @param {Object} opaInfoConfiguration opa-info configuration service
   */
  function OpaInfoController($scope, $element, $document, $timeout, $mdPanel, opaInfoConfiguration) {
    var ctrl = this;
    var panelReference = null;
    var panelPromise = null;
    var panelPosition = $mdPanel.newPanelPosition();
    var defaultOptions = opaInfoConfiguration.getOptions();

    Object.defineProperties(ctrl,

      /** @lends module:opa/info~OpaInfoController */
      {

        /**
         * Opens the information dialog.
         *
         * @memberof module:opa/info~OpaInfoController
         * @method open
         * @instance
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
                message: ctrl.message,
                closeLabel: ctrl.closeLabel,
                closeAriaLabel: ctrl.closeAriaLabel
              },
              attachTo: $document[0].body,
              escapeToClose: true,
              clickOutsideToClose: true,
              position: panelPosition,
              onCloseSuccess: function() {
                panelReference = null;
                $element[0].focus();
              }
            }).then(function(reference) {
              panelPromise = null;
              panelReference = reference;

              $timeout(function() {

                // Set focus on button
                $document[0].querySelector('.opa-info button').focus();

              }, 1);

            });
          }
        },

        /**
         * Closes the information dialog.
         *
         * @memberof module:opa/info~OpaInfoController
         * @method close
         * @instance
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
         * @memberof module:opa/info~OpaInfoController
         * @method $onInit
         * @instance
         */
        $onInit: {
          value: function() {
            panelPosition.relativeTo($element).addPanelPosition(
              $mdPanel.xPosition.ALIGN_START,
              $mdPanel.yPosition.BELOW
            );
          }
        },

        /**
         * Handles attributes changes.
         *
         * Validate attributes.
         *
         * @memberof module:opa/info~OpaInfoController
         * @method $onChanges
         * @instance
         * @param {Object} changedProperties Properties which have changed since last digest loop
         * @param {Object} [changedProperties.closeLabel] opa-close attribute old and new value
         * @param {String} [changedProperties.closeLabel.currentValue] opa-close new value
         * @param {Object} [changedProperties.closeAriaLabel] opa-close-aria attribute old and new value
         * @param {String} [changedProperties.closeAriaLabel.currentValue] opa-close-aria new value
         */
        $onChanges: {
          value: function(changedProperties) {
            if (changedProperties.closeLabel)
              ctrl.closeLabel = changedProperties.closeLabel.currentValue || defaultOptions.closeLabel;

            if (changedProperties.closeAriaLabel)
              ctrl.closeAriaLabel = changedProperties.closeAriaLabel.currentValue || defaultOptions.closeAriaLabel;
          }
        }

      }

    );

    // Add click event handler to open the dialog
    $element.on('click', ctrl.open);

    // Remove event handler on destroy
    $scope.$on('$destroy', function() {
      ctrl.close();
      $element.off('click', ctrl.open);
    });
  }

  app.controller('OpaInfoController', OpaInfoController);
  OpaInfoController.$inject = ['$scope', '$element', '$document', '$timeout', '$mdPanel', 'opaInfoConfiguration'];

})(angular.module('opa'));

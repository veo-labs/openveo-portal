'use strict';

/**
 * @module opa
 */

/**
 * Actions button component presents a collapsable button with a list of actions.
 *
 *     $scope.icon = 'angular_material_icon_id';
 *     $scope.label = 'BUTTON_LABEL_TRANSLATION_ID';
 *     $scope.actions = [
 *       {
 *         label 'ACTION_LABEL_TRANSLATION_ID',
 *         icon: 'angular_material_icon_id',
 *         selected: true,
 *         action: function() {
 *           console.log('Do something');
 *         }
 *       }
 *     ];
 *
 *     <opa-actions-button opa-label="label" opa-icon="icon" opa-actions="actions"></opa-actions-button>
 *
 * Available attributes are:
 * - [String] **opa-label**: The button label as a translation id
 * - [String] **[opa-icon]**: An icon to display before the label, it must be an AngularJS Material icon id
 * - [Array] **opa-actions**: The list of actions with for each action:
 *   - [String] **label**: The action label as a translation id
 *   - [Function] **action**: A function to call when the action is clicked
 *   - [String] **[icon]**: An icon to display before the label, must be an Angular Material icon id
 *   - [Boolean] **[selected]**: A boolean indicating if the action must appear as selected
 *
 * Requires:
 * - **ngMaterial** AngularJS Material module
 * - **opaTranslate** Internationalization translate filter
 *
 * @class opaActionsButton
 */

(function(app) {

  app.component('opaActionsButton', {
    templateUrl: 'opa-actionsButton.html',
    controller: 'OpaActionsButtonController',
    bindings: {
      opaLabel: '<',
      opaIcon: '<',
      opaActions: '<'
    }
  });

})(angular.module('opa'));

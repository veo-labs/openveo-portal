'use strict';

/**
 * Actions button component presents a collapsable button with a list of actions.
 *
 * Available attributes are:
 * - [String] **opa-label**: The button label
 * - [String] **[opa-icon]**: An icon to display before the label, it must be an AngularJS Material icon id
 * - [Array] **opa-actions**: The list of actions with for each action:
 *   - [String] **label**: The action label
 *   - [Function] **action**: A function to call when the action is clicked
 *   - [String] **[icon]**: An icon to display before the label, must be an Angular Material icon id
 *   - [Boolean] **[selected]**: A boolean indicating if the action must appear as selected
 *
 * Requires:
 * - **ngMaterial** AngularJS Material module
 *
 * @example
 * $scope.icon = 'angular_material_icon_id';
 * $scope.label = 'Button label';
 * $scope.actions = [
 *   {
 *     label 'Action label',
 *     icon: 'angular_material_icon_id',
 *     selected: true,
 *     action: function() {
 *       console.log('Do something');
 *     }
 *   }
 * ];
 *
 * <opa-actions-button opa-label="{{label}}" opa-icon="{{icon}}" opa-actions="actions"></opa-actions-button>
 *
 * @module opa/actionsButton
 */

(function(app) {

  app.component('opaActionsButton', {
    templateUrl: 'opa-actionsButton.html',
    controller: 'OpaActionsButtonController',
    bindings: {
      opaLabel: '@',
      opaIcon: '@',
      opaActions: '<'
    }
  });

})(angular.module('opa'));

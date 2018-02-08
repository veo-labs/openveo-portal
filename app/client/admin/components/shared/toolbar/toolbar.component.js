'use strict';

/**
 * @module opa
 */

/**
 * Toolbar component presents actions and a title.
 *
 *     $scope.toolbarTitle = 'Toolbar title';
 *     $scope.toolbarLeftActions = [
 *       {
 *         label: 'Left action label',
 *         icon: 'left_action_icon_id',
 *         help: 'Left action tooltip message',
 *         action: function() {
 *           console.log('Do something');
 *         }
 *       }
 *     ];
 *
 *     $scope.toolbarRightActions = [
 *       {
 *         label: 'First right action label',
 *         icon: 'first_right_action_icon_id',
 *         help: 'First right action tooltip message',
 *         menu: [
 *           {
 *             label: 'Sub action label',
 *             selected: true,
 *             action: function() {
 *               console.log('Do something');
 *             }
 *           }
 *         ]
 *       },
 *       {
 *         label: 'Second right action label',
 *         icon: 'second_right_action_icon_id',
 *         help: 'Second right action tooltip message',
 *         action: function() {
 *           console.log('Do something');
 *         }
 *       }
 *     ];
 *     <opa-toolbar
 *                  opa-title="{{toolbarTitle}}"
 *                  opa-left-actions="toolbarLeftActions"
 *                  opa-right-actions="toolbarRightActions"
 *     ></opa-toolbar>
 *
 * Available attributes are:
 * - [String] **[opa-title]**: The toolbar title
 * - [Array] **[opa-left-actions]**: The list of actions. May contain:
 *   - a simple action with:
 *     - [String] **label**: The action name (used for accessibility)
 *     - [Function] **action**: The function to execute when the icon is clicked
 *     - [String] **icon**: An icon representing the action as an Angular Materia icon id
 *     - [String] **[help]**: Tooltip message about the action
 *   - a list of actions with for each action:
 *    - [String] **label**: The action name (used for accessibility)
 *    - [String] **icon**: An icon representing the action as an Angular Materia icon id
 *    - [Array] **menu**: A list of simple actions with for each action:
 *      - [String] **label**: The action name (used for menu name and accessibility)
 *      - [Function] **action**: The function to execute when the icon is clicked
 *      - [Boolean] **[selected]**: A boolean indicating if the action should be selected by default
 * - [Array] **[opa-right-actions]**: Same as left actions
 *
 * Requires:
 * - **ngMaterial** The AngularJS Material module
 *
 * @class opaToolbar
 */
(function(app) {

  app.component('opaToolbar', {
    templateUrl: 'opa-toolbar.html',
    controller: 'OpaToolbarController',
    bindings: {
      opaTitle: '@',
      opaLeftActions: '<',
      opaRightActions: '<'
    }
  });

})(angular.module('opa'));

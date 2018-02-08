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
 *         type: 'icon',
 *         label: 'Icon action accessibility message',
 *         icon: 'icon_action_icon_id',
 *         help: 'Icon action tooltip message',
 *         action: function() {
 *           console.log('Do something');
 *         }
 *       }
 *     ];
 *
 *     $scope.toolbarRightActions = [
 *       {
 *         type: 'list',
 *         label: 'List action accessibility message',
 *         icon: 'list_action_icon_id',
 *         help: 'List action tooltip message',
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
 *         type: 'text',
 *         label: 'Text action label',
 *         help: 'Text action accessibility message',
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
 *   - [String] **type**: The type of action, could be either *text*, *icon* or *list*. Depending on type,
 *     properties below can be added
 *   - [...]: Properties depending on the **type** property as described below
 * - [Array] **[opa-right-actions]**: Same as left actions
 *
 * Available action types are:
 * - **text**, a simple text button which may have:
 *   - [String] **label**: The action button label
 *   - [Function] **action**: The function to execute when the button is clicked
 *   - [String] **[help]**: The action accessibility label
 * - **icon**, a simple icon button which may have:
 *   - [String] **label**: The action name (used for accessibility)
 *   - [Function] **action**: The function to execute when the icon is clicked
 *   - [String] **icon**: An icon representing the action as an Angular Materia icon id
 *   - [String] **[help]**: Tooltip message about the action
 * - **list**, an icon button opening a list of textual actions which may have:
 *   - [String] **label**: The action name (used for accessibility)
 *   - [String] **icon**: An icon representing the action as an Angular Materia icon id
 *   - [Array] **menu**: A list of simple actions with for each action:
 *     - [String] **label**: The action name (used for menu item name and accessibility)
 *     - [Function] **action**: The function to execute when the item is clicked
 *     - [Boolean] **[selected]**: A boolean indicating if the action should be selected by default
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

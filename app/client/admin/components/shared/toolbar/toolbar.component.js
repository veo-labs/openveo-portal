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
 *         icon: 'icon_action_icon_id',
 *         help: 'Icon action tooltip message',
 *         accessibility: 'Icon action accessibility message',
 *         action: function() {
 *           console.log('Do something');
 *         }
 *       }
 *     ];
 *
 *     $scope.toolbarRightActions = [
 *       {
 *         type: 'list',
 *         icon: 'list_action_icon_id',
 *         help: 'List action tooltip message',
 *         accessibility: 'List action accessibility message',
 *         menu: [
 *           {
 *             label: 'Sub action label',
 *             selected: true,
 *             accessibility: 'Sub action accessibility message',
 *             action: function() {
 *               console.log('Do something');
 *             }
 *           }
 *         ]
 *       },
 *       {
 *         type: 'text',
 *         label: 'Text action label',
 *         accessibility: 'Text action accessibility message',
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
 *   - [String] **[accessibility]**: The action accessibility message
 * - **icon**, a simple icon button which may have:
 *   - [Function] **action**: The function to execute when the icon is clicked
 *   - [String] **icon**: An icon representing the action as an Angular Materia icon id
 *   - [String] **[help]**: Tooltip message about the action
 *   - [String] **[accessibility]**: The action accessibility message
 * - **list**, an icon button opening a list of textual actions which may have:
 *   - [String] **icon**: An icon representing the action as an Angular Materia icon id
 *   - [Array] **menu**: A list of simple actions with for each action:
 *     - [String] **label**: The item name
 *     - [Function] **action**: The function to execute when the item is clicked
*      - [String] **[accessibility]**: The item accessibility message
 *     - [Boolean] **[selected]**: A boolean indicating if the item should be selected by default
 *   - [String] **[accessibility]**: The action accessibility message
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

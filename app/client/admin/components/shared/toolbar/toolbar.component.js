'use strict';

/**
 * @module opa
 */

/**
 * Toolbar component presents actions and a title.
 *
 *     $scope.toolbarTitle = 'TOOLBAR_TITLE_TRANSLATION_ID';
 *     $scope.toolbarLeftActions = [
 *       {
 *         label: 'HOME_LABEL_TRANSLATION_ID',
 *         icon: 'home',
 *         help: 'TOOLTIP_MESSAGE_TRANSLATION_ID',
 *         action: function() {
 *           console.log('Do something');
 *         }
 *       }
 *     ];
 *
 *     $scope.toolbarRightActions = [
 *       {
 *         label: 'SETTINGS_LABEL_TRANSLATION_ID',
 *         icon: 'settings',
 *         help: 'TOOLTIP_MESSAGE_TRANSLATION_ID',
 *         menu: [
 *           {
 *             label: 'SETTINGS_SUB_ACTION_LABEL_TRANSLATION_ID',
 *             selected: true,
 *             action: function() {
 *               console.log('Do something');
 *             }
 *           }
 *         ]
 *       },
 *       {
 *         label: 'LOGOUT_LABEL_TRANSLATION_ID',
 *         icon: 'power_settings_new',
 *         help: 'TOOLTIP_MESSAGE_TRANSLATION_ID',
 *         action: function() {
 *           console.log('Do something');
 *         }
 *       }
 *     ];
 *     <opa-toolbar
 *                  opa-title="toolbarTitle"
 *                  opa-left-actions="toolbarLeftActions"
 *                  opa-right-actions="toolbarRightActions"
 *     ></opa-toolbar>
 *
 * Available attributes are:
 * - [String] **[opa-title]**: The toolbar title as a translation id
 * - [Array] **[opa-left-actions]**: The list of actions. May be:
 *   - a simple action with:
 *     - [String] **label**: The action name translation id (used for accessibility)
 *     - [Function] **action**: The function to execute when the icon is clicked
 *     - [String] **[icon]**: An icon representing the action as an Angular Materia icon id
 *     - [String] **[help]**: Tooltip message about the action
 *   - a list of actions with for each action:
 *    - [String] **label**: The action name translation id (used for accessibility)
 *    - [String] **icon**: An icon representing the action as an Angular Materia icon id
 *    - [Array] **menu**: A list of simple actions with for each action:
 *      - [String] **label**: The action name translation id (used for menu name and accessibility)
 *      - [Function] **action**: The function to execute when the icon is clicked
 *      - [Boolean] **[selected]**: A boolean indicating if the action should be selected by default
 * - [Array] **[opa-right-actions]**: Same as left actions
 *
 * @class opaToolbar
 */
(function(app) {

  app.component('opaToolbar', {
    templateUrl: 'opa-toolbar.html',
    controller: 'OpaToolbarController',
    bindings: {
      opaTitle: '<',
      opaLeftActions: '<',
      opaRightActions: '<'
    }
  });

})(angular.module('opa'));

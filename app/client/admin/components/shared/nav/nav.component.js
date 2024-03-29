'use strict';

/**
 * Nav component presents side navigation menu.
 *
 * Available attributes are:
 * - [Array] **opa-menu**: An array of menu items. Several kind of items exist:
 *   - Simple menu items with:
 *     - [String] **label**: The item label
 *     - [Function] **action**: The function to call when the item is clicked
 *     - [String] **[icon]**: An icon to place before the label, it must be an AngularJS Material icon id
 *     - [Boolean] **[selected]**: A boolean indicating if the item must appear as selected
 *   - Dividers with:
 *     - [Boolean] **divider**: If set to "true" the item will be a simple rule. Use it to separate menu items
 *   - Items containing sub items with:
 *     - [String] **label**: The item label
 *     - [String] **[icon]**: An icon to place before the label, it must be an AngularJS Material icon id
 *     - [Array] **actions**: A list of actions with for each action:
 *       - [String] **label**: The action label
 *       - [Function] **action**: The function to call when the action is clicked
 *       - [String] **[icon]**: An icon to place before the label, it must be an AngularJS Material icon id
 *       - [Boolean] **[selected]**: A boolean indicating if the action must appear as selected
 *
 * Requires:
 * - **ngMaterial** AngularJS Material module
 * - **opaActionsButton** Component creating a collapsable button with a list of actions
 *
 * @example
 * $scope.menu = [
 *   {
 *     label: 'Menu item label',
 *     icon: 'angular_material_icon_id',
 *     selected: true,
 *     action: function() {
 *       console.log('Do something');
 *     }
 *   },
 *   {
 *     divider: true
 *   },
 *   {
 *     label: 'Menu item label',
 *     icon: 'angular_material_icon_id',
 *     actions: [
 *       {
 *         label 'Sub menu item label',
 *         icon: 'angular_material_icon_id',
 *         selected: true,
 *         action: function() {
 *           console.log('Do something');
 *         }
 *       }
 *     ]
 *   }
 * ];
 *
 * <opa-nav opa-menu="menu"></opa-nav>
 *
 * @module opa/nav
 */

(function(app) {

  app.component('opaNav', {
    templateUrl: 'opa-nav.html',
    controller: 'OpaNavController',
    bindings: {
      opaMenu: '<'
    }
  });

})(angular.module('opa'));

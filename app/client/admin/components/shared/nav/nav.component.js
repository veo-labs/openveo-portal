'use strict';

/**
 * @module opa
 */

/**
 * Nav component presents side navigation menu.
 *
 *     $scope.menu = [
 *       {
 *         label: 'ITEM_LABEL_TRANSLATION_ID',
 *         icon: 'angular_material_icon_id',
 *         selected: true,
 *         action: function() {
 *           console.log('Do something');
 *         }
 *       },
 *       {
 *         divider: true
 *       },
 *       {
 *         label: 'ITEM_LABEL_TRANSLATION_ID',
 *         icon: 'angular_material_icon_id',
 *         actions: [
 *           {
 *             label 'ACTION_LABEL_TRANSLATION_ID',
 *             icon: 'angular_material_icon_id',
 *             selected: true,
 *             action: function() {
 *               console.log('Do something');
 *             }
 *           }
 *         ]
 *       }
 *     ];
 *
 *     <opa-nav opa-menu="menu"></opa-nav>
 *
 * Available attributes are:
 * - [Array] **opa-menu**: An array of menu items. Several kind of items exist:
 *   - Simple menu items with:
 *     - [String] **label**: The item label as a translation id
 *     - [Function] **action**: The function to call when the item is clicked
 *     - [String] **[icon]**: An icon to place before the label, it must be an AngularJS Material icon id
 *     - [Boolean] **[selected]**: A boolean indicating if the item must appear as selected
 *   - Dividers with:
 *     - [Boolean] **divider**: If set to "true" the item will be a simple rule. Use it to separate menu items
 *   - Items containing sub items with:
 *     - [String] **label**: The item label as a translation id
 *     - [String] **[icon]**: An icon to place before the label, it must be an AngularJS Material icon id
 *     - [Array] **actions**: A list of actions with for each action:
 *       - [String] **label**: The action label as a translation id
 *       - [Function] **action**: The function to call when the action is clicked
 *       - [String] **[icon]**: An icon to place before the label, it must be an AngularJS Material icon id
 *       - [Boolean] **[selected]**: A boolean indicating if the action must appear as selected
 *
 * Requires:
 * - **ngMaterial** AngularJS Material module
 * - **opaActionsButton** Component creating a collapsable button with a list of actions
 * - **opaTranslate** Internationalization translate filter
 *
 * @class opaNav
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

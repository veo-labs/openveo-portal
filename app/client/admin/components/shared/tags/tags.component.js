'use strict';

/**
 * Tags component is a form element to enter a list of tags.
 *
 * Tags form element is composed of an input element to add tags followed by the list of added tags. If attribute
 * opa-available-tags is set, an autocomplete displays these tags then no other tag can be added.
 *
 * An AngularJS Material component has the same features (and more) than the md-chips component. But md-chips
 * has some caveats, mostly visual like no support for errors and no support for floating label which
 * completely destructures the whole formular.
 *
 * opa-tags also works like AngularJS Material input, textarea and md-select elements, it can be added
 * to an md-input-container with a label and error messages.
 *
 * Available attributes are:
 *   - [Array] **[opa-available-tags]**: The list of predefined tags, if set only tags in this list can be added
 *     and autocomplete is displayed. Each tag must contain:
 *     - [String] **name**: The label of the tag to display in autocomplete and validated tags
 *     - [String] **value**: The unique value of the tag, two tags can't have the same value
 *
 * Requires:
 * - **ngMaterial** AngularJS Material module
 *
 * @example
 * <script>
 *   $scope.listOfTags = ['tag1', 'tag2'];
 *   $scope.isRequired = false;
 *   $scope.availableTags = [
 *     {
 *       name: 'Tag 1',
 *       value: 'tag1'
 *     },
 *     {
 *       name: 'Tag 2',
 *       value: 'tag2'
 *     },
 *     {
 *       name: 'Tag 3',
 *       value: 'tag3'
 *     }
 *   ];
 * </script>
 * <opa-tags
 *          ng-model="listOfTags"
 *          opa-available-tags="availableTags"
 *          ng-required="isRequired"
 * >
 * </opa-tags>
 *
 * @example
 * <script>
 *   $scope.isRequired = true;
 *   $scope.listOfTags = [];
 * </script>
 * <form name="myForm">
 *   <mb-input-container>
 *     <label>My tags:</label>
 *     <opa-tags
 *              name="myTags"
 *              ng-model="listOfTags"
 *              ng-required="isRequired"
 *     >
 *     </opa-tags>
 *     <div ng-messages="myForm.myTags.$error">
 *       <div ng-message="required">Error: This field is required</div>
 *     </div>
 *   </mb-input-container>
 * </form>
 *
 * @module opa/tags
 */
(function(app) {

  app.component('opaTags', {
    templateUrl: 'opa-tags.html',
    controller: 'OpaTagsController',
    require: ['?ngModel', '^?mdInputContainer'],
    bindings: {
      opaAvailableTags: '<',
      ngRequired: '<'
    }
  });

})(angular.module('opa'));

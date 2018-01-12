'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages opaTags component.
   *
   * @class OpaTagsController
   * @param {Object} $element The HTML element holding the component
   * @param {Object} $scope The component isolated scope
   * @constructor
   */
  function OpaTagsController($element, $scope) {
    var ctrl = this;
    var ngModelController = $element.controller('ngModel');
    var mdInputContainerController;
    var inputNgModelController;
    var autoCompleteElement;
    var inputElement;
    var autoCompleteFocusedIndex = -1;
    var isRequired = false;

    /**
     * Updates and validates component attributes.
     */
    function updateAttributes() {
      ctrl.opaAvailableTags = (typeof ctrl.opaAvailableTags === 'undefined') ? null : ctrl.opaAvailableTags;
    }

    /**
     * Gets tag values.
     *
     * The component stores either the list of values or the list of tags (with "name" and "value") depending
     * on opa-available-tags attribute.
     *
     * When directive does not have opa-available-tags attribute, ctrl.tags stores tags as values.
     * When directive has opa-available-tags attribute, ctrl.tags contains tags as objects with name and
     * value properties.
     *
     * @return {Array} The opa-tags values
     */
    function getValues() {

      // Without opa-available-tags
      if (!ctrl.opaAvailableTags)
        return angular.copy(ctrl.tags);

      // With opa-available-tags
      // Retrieve values from available options
      var values = [];
      ctrl.tags.forEach(function(name) {
        for (var i = 0; i < ctrl.opaAvailableTags.length; i++) {
          if (ctrl.opaAvailableTags[i].name === name) {
            values.push(ctrl.opaAvailableTags[i].value);
            break;
          }
        }
      });

      return values;
    }

    /**
     * Avoids propagation and default behaviour of an event.
     *
     * @param {Event} event The event to stop
     */
    function stopEvent(event) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    }

    Object.defineProperties(ctrl, {

      /**
       * The input value.
       *
       * @property tag
       * @type String
       */
      tag: {
        value: '',
        writable: true
      },

      /**
       * The list of added tags.
       *
       * It could contain either a list of strings or a list of objects with "name" and "value" properties
       * (if opa-available-tags is set).
       *
       * @property tags
       * @type Array
       */
      tags: {
        value: [],
        writable: true
      },

      /**
       * The autocomplete values corresponding to current input value.
       *
       * Only if opa-available-tags is set.
       *
       * @property autoCompleteValues
       * @type Array
       * @final
       */
      autoCompleteValues: {
        value: []
      },

      /**
       * Indicates if the autocomplete should be displayed or not.
       *
       * @property isAutoCompleteDisplayed
       * @type Boolean
       * @final
       */
      isAutoCompleteDisplayed: {
        value: false,
        writable: true
      },

      /**
       * Initializes controller and attributes.
       *
       * @method $onInit
       * @final
       */
      $onInit: {
        value: function() {
          updateAttributes();
          autoCompleteElement = angular.element($element[0].querySelector('.ov-field-tags-auto-complete'));
          inputElement = $element.find('input');

          inputElement.on('focus', function() {
            ctrl.isAutoCompleteDisplayed = true;
          });
        }
      },

      /**
       * Adds a validator on the input.
       *
       * AngularJS Material has a special behavior when an HTMLInputElement is within an md-input-container.
       * When the validity of the input changes it automatically sets the validity of the md-input-container which
       * is used to visually indicates if the opa-tags field is valid or not.
       * OpaTagsController also set the validity of the md-input-container when the opa-tags field validity changes.
       * Consequently the validity state sent to the md-input-container by the OpaTagsController can be crushed by
       * the one sent by the input ngModel controller.
       * To avoid this we define a new validator on the input element to match the validity of the opa-tags element.
       *
       * @method $postLink
       * @final
       */
      $postLink: {
        value: function() {
          inputNgModelController = angular.element($element.find('input')[0]).controller('ngModel');

          // Add the "opaTags" validator to the input model
          // opa-tags is valid if not touched, not required or not empty
          inputNgModelController.$validators.opaTags = function(modelValue, viewValue) {
            var isEmpty = !ctrl.tags || ctrl.tags.length === 0;
            return !inputNgModelController.$touched || !isRequired || !isEmpty;
          };
        }
      },

      /**
       * Removes event listeners.
       *
       * @method $onDestroy
       * @final
       */
      $onDestroy: {
        value: function() {
          inputElement.off('focus');
          inputElement.off('blur');
          autoCompleteElement.off('keydown');
        }
      },

      /**
       * Handles one-way binding properties changes.
       *
       * Watch for changes on the ng-required expression.
       *
       * @method $onChanges
       * @param {Object} changedProperties Properties which have changed since last digest loop
       * @param {Object} [changedProperties.ngRequired] ng-required old and new value
       * @param {Boolean} [changedProperties.ngRequired.currentValue] ng-required new value
       * @final
       */
      $onChanges: {
        value: function(changedProperties) {
          if (changedProperties.ngRequired)
            isRequired = changedProperties.ngRequired.currentValue ? true : false;

          var isEmpty = !ctrl.tags || ctrl.tags.length === 0;
          if (mdInputContainerController)
            mdInputContainerController.setInvalid(isRequired && isEmpty && inputNgModelController.$touched);
        }
      },

      /**
       * Displays auto-complete depending on the given input value.
       *
       * @method autoComplete
       * @final
       */
      autoComplete: {
        value: function() {

          // No predefined tags, thus no auto-complete
          if (!ctrl.opaAvailableTags) return;

          // Clear actual auto-complete list
          ctrl.autoCompleteValues.splice(0, ctrl.autoCompleteValues.length);

          // Search all auto-complete names which start by the input value (case insensitive)
          if (ctrl.tag) {
            ctrl.opaAvailableTags.forEach(function(tag) {
              if (tag.name.toLowerCase().indexOf(ctrl.tag.toLowerCase()) === 0)
                ctrl.autoCompleteValues.push(tag);
            });
          }

          if (!ctrl.autoCompleteValues.length) {

            autoCompleteFocusedIndex = -1;
            autoCompleteElement.off('keydown');
          } else
            ctrl.isAutoCompleteDisplayed = true;
        }
      },

      /**
       * Removes a tag when user click on the delete icon.
       *
       * @final
       * @param {Event} event The event which trigger the call to removeTag
       * @param {Number} index The index of the tag to remove in the list of tags
       */
      removeTag: {
        value: function(event, index) {

          // Remove tag
          ctrl.tags.splice(index, 1);
          ngModelController.$setViewValue(getValues());

          // Stop event propagation and default
          event.stopImmediatePropagation();
          event.stopPropagation();
          event.preventDefault();

          // Validate the model
          ngModelController.$validate();

          // No more tags set focus back to the input
          if (!ctrl.tags.length)
            inputElement[0].focus();

        }
      },

      /**
       * Handles keyboard events on autocomplete.
       *
       * Down and up arrows navigate into the autocomplete focusing the previous / next element in the list.
       * When hitting down on the first item of the list the focus is set back to the input.
       * When hitting up on the last item of the list the focus is set back to the input.
       *
       * @param {Event} event The keyboard event
       * @param {String} tagName The name of the tag if enter is pressed
       */
      handleAutoCompleteKeys: {
        value: function(event, tagName) {
          if (!ctrl.autoCompleteValues.length) return;

          if (event.keyCode === 40 || event.keyCode === 38) {
            var direction = event.keyCode === 40 ? 1 : -1;

            if (direction === 1 && autoCompleteFocusedIndex + 1 >= ctrl.autoCompleteValues.length ||
                direction === -1 && autoCompleteFocusedIndex <= 0
            ) {

              // No more item in the autocomplete list
              // Go back to the input
              autoCompleteFocusedIndex = -1;
              inputElement[0].focus();

            } else {
              autoCompleteFocusedIndex += direction;
              autoCompleteElement[0].querySelectorAll('li')[autoCompleteFocusedIndex].focus();
            }

            stopEvent(event);
          } else if (event.keyCode === 13 && tagName) {
            ctrl.addTag(tagName);
            stopEvent(event);
          }
        }
      },

      /**
       * Handles keys.
       *
       * Add a new tag when user press "enter".
       *
       * @method handleInputKeys
       * @final
       * @param {Event} event The keyboard event
       */
      handleInputKeys: {
        value: function(event) {
          if (event.keyCode === 13) {

            // Captured "enter" key

            // Add the new tag and focus input element
            ctrl.addTag(ctrl.tag);
            stopEvent(event);

          } else if (event.keyCode === 9) {

            // Captured "tag" key
            // Leaving field, hide the autocomplete
            ctrl.isAutoCompleteDisplayed = false;

          } else if (ctrl.autoCompleteValues.length) {

            if (event.keyCode === 40) {

              // Captured "down" key
              // Focus first autocomplete element
              autoCompleteFocusedIndex = 0;
              autoCompleteElement[0].querySelector('li').focus();

            } else if (event.keyCode === 38) {

              // Captured "up" key
              // Focus last autocomplete element
              autoCompleteFocusedIndex = ctrl.autoCompleteValues.length - 1;
              autoCompleteElement[0].querySelectorAll('li')[autoCompleteFocusedIndex].focus();

            }

            if (event.keyCode === 38 || event.keyCode === 40) {
              stopEvent(event);

              // Captured "up" or "down" key
              // Autocomplete has focus now, listen to keydown events in autocomplete
              autoCompleteElement.off('keydown');
              autoCompleteElement.on('keydown', ctrl.handleAutoCompleteKeys);
            }

          }
        }
      },

      /**
       * Add a new tag.
       *
       * @method addTag
       * @final
       * @param {String} tag Either the name of the tag if opa-available-tags is set or the value if not
       */
      addTag: {
        value: function(tag) {

          // Without opa-available-tags attribute
          if ((!ctrl.opaAvailableTags) &&
              (tag && ctrl.tags.indexOf(tag) === -1)
             ) {
            ctrl.tag = '';
            ctrl.tags.push(tag);
            ngModelController.$setViewValue(getValues());

            // Validate the model
            ngModelController.$validate();
            return;
          }

          // With opa-available-tags attribute
          // Make sure tag is part of available tags
          if (ctrl.opaAvailableTags) {
            for (var i = 0; i < ctrl.opaAvailableTags.length; i++) {
              if (ctrl.opaAvailableTags[i].name === tag) {

                // Only register not already entered tags
                if (tag && ctrl.tags.indexOf(ctrl.opaAvailableTags[i].name) === -1) {
                  ctrl.tags.push(tag);
                  ngModelController.$setViewValue(getValues());

                  // Validate the model
                  ngModelController.$validate();
                }

                // Clean up input and auto complete and set focus back to input
                ctrl.tag = '';
                ctrl.autoComplete();
                inputElement[0].focus();

                break;
              }
            }
          }
        }
      }

    });

    /**
     * Tests if the model is empty.
     *
     * It overrides AngularJS $isEmpty.
     *
     * @param {Array} values The list of tags
     * @return {Boolean} true if there is no tags, false otherwise
     */
    ngModelController.$isEmpty = function(values) {
      var isEmpty = !values || values.length === 0;
      if (mdInputContainerController)
        mdInputContainerController.setInvalid(isRequired && isEmpty && inputNgModelController.$touched);
      return isEmpty;
    };

    /**
     * Renders the list of tags from model.
     *
     * The component stores either the list of values or the list of tags (with "name" and "value") depending
     * on opa-available-tags attribute.
     *
     * When directive does not have opa-available-tags attribute, ctrl.tags stores tags as values.
     * When directive has opa-available-tags attribute, ctrl.tags contains tags as objects with name and
     * value properties.
     *
     * It overrides AngularJS $render.
     */
    ngModelController.$render = function() {

      // No opa-available-tags attribute
      if (!ctrl.opaAvailableTags)
        ctrl.tags = angular.copy(ngModelController.$viewValue) || [];
      else {

        // Got opa-available-tags attribute
        // Retrieve values from available tags
        ctrl.tags = [];
        (ngModelController.$viewValue || []).forEach(function(value) {
          for (var i = 0; i < ctrl.opaAvailableTags.length; i++) {
            if (ctrl.opaAvailableTags[i].value === value) {
              ctrl.tags.push(ctrl.opaAvailableTags[i].name);
              break;
            }
          }
        });

      }
    };

    // Watch for attributes changes
    $scope.$watch('$ctrl.opaAvailableTags', updateAttributes);

  }

  app.controller('OpaTagsController', OpaTagsController);
  OpaTagsController.$inject = ['$element', '$scope'];

})(angular.module('opa'));

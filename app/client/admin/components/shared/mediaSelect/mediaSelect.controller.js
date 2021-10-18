'use strict';

(function(app) {

  /**
   * Manages opaMediaSelect component.
   *
   * @class OpaMediaSelectController
   * @memberof module:opa/mediaSelect
   * @inner
   * @constructor
   */
  function OpaMediaSelectController($element) {
    var self = this;
    var index;

    Object.defineProperties(self,

      /** @lends module:opa/mediaSelect~OpaMediaSelectController */
      {

        /**
         * The list of selected medias.
         *
         * @type {Array}
         * @instance
         */
        selection: {
          value: [],
          writable: true
        },

        /**
         * Defines if the model can contains one or many medias.
         *
         * @type {Boolean}
         * @instance
         * @default false
         */
        multiple: {
          value: false,
          writable: true
        },

        /**
         * Checkboxes states.
         *
         * @type {Array}
         * @instance
         */
        checkboxesStates: {
          value: [],
          writable: true
        },

        /**
          * Focus states.
         *
         * @type {Array}
         * @instance
         */
        focusStates: {
          value: [],
          writable: true
        },

        /**
         * Locks the focus when navigating between opaMediaOptions.
         *
         * @type {Boolean}
         * @instance
         * @default false
         */
        keepFocus: {
          value: false,
          writable: true
        },

        /**
         * Controller initialization state.
         *
         * The initialization of the checkboxes states can't be done before
         * the controller initialization is completed.
         *
         * @type {Boolean}
         * @instance
         * @default false
         */
        isInitialized: {
          value: false,
          writable: true
        },

        /**
         * Initializes controller.
         *
         * @memberof module:opa/mediaSelect~OpaMediaSelectController
         * @method $onInit
         * @instance
         */
        $onInit: {
          value: function() {
            self.multiple = self.opaMultiple || Array.isArray(self.ngModel);

            if (self.ngModel)
              self.selection = self.multiple ? self.ngModel : [self.ngModel];

            self.setCheckboxesStates();
            self.isInitialized = true;
          }
        },

        /**
         * Handles one-way binding properties changes.
         *
         * @memberof module:opa/mediaSelect~OpaMediaSelectController
         * @method $onChanges
         * @instance
         * @param {Object} changedProperties Properties which have changed since last digest loop
         */
        $onChanges: {
          value: function(changedProperties) {
            if (Object.prototype.hasOwnProperty.call(changedProperties, 'opaMedias') && self.isInitialized) {
              self.setCheckboxesStates();
              self.setFocusStates();
            }
          }
        },

        /**
         * Add a media to the selection.
         *
         * @memberof module:opa/mediaSelect~OpaMediaSelectController
         * @method check
         * @instance
         * @param {Object} media
         */
        check: {
          value: function(media) {
            index = self.opaMedias.indexOf(media);
            if (!self.multiple) {
              self.selection = [media.id];
              self.ngModel = media.id;

              // Uncheck all the other checkboxes
              for (var i = 0; i < self.checkboxesStates.length; i++)
                self.checkboxesStates[i] = i === index;
            } else if (self.selection.indexOf(media.id) === -1) {
              self.selection.push(media.id);
              self.ngModel = self.selection;
              self.checkboxesStates[index] = true;
            }
          }
        },

        /**
         * Remove a media from the selection.
         *
         * @memberof module:opa/mediaSelect~OpaMediaSelectController
         * @method uncheck
         * @instance
         * @param {Object} media
         */
        uncheck: {
          value: function(media) {
            // Remove from selection
            index = self.selection.indexOf(media.id);
            if (index !== -1) {
              self.selection.splice(index, 1);
            }

            // Disable value
            index = self.opaMedias.indexOf(media);
            if (index !== -1)
              self.checkboxesStates[index] = false;

            self.ngModel = self.multiple ? self.selection : '';
          }
        },

        /**
         * Set checkboxes states
         *
         * Define if checkboxes are checked or not (depending on selection)
         * at the initialization or when the medias are changed.
         *
         * @memberof module:opa/mediaSelect~OpaMediaSelectController
         * @method setCheckboxesStates
         * @instance
         */
        setCheckboxesStates: {
          value: function() {
            self.checkboxesStates = [];
            self.opaMedias.forEach(function(media) {
              self.checkboxesStates.push(self.selection.indexOf(media.id) !== -1);
            });
          }
        },

        /**
         * Set focus states
         *
         * Disables the focus on all medias
         *
         * @memberof module:opa/mediaSelect~OpaMediaSelectController
         * @method setFocusStates
         * @instance
         */
        setFocusStates: {
          value: function() {
            self.focusStates = [];
            self.opaMedias.forEach(function(media) {
              self.focusStates.push(false);
            });
          }
        },

        /**
         * Manages options focus.
         *
         * Enables focus on the first option when focus reaches
         * the mediaSelect component, or switches between options
         * when left or right arrows are pressed.
         *
         * @memberof module:opa/mediaSelect~OpaMediaSelectController
         * @method optionFocus
         * @instance
         */
        optionFocus: {
          value: function($event) {
            if (!Object.prototype.isPrototypeOf.call(KeyboardEvent.prototype, $event) || !self.focusStates.length)
              return;

            if ($event.keyCode === 9) {
              self.keepFocus = true;
              self.focusStates[0] = true;
              $element.children().addClass('opa-focused');
            } else {
              var curIndex = self.focusStates.indexOf(true);
              var newIndex;

              if (curIndex === -1)
                return;

              switch ($event.keyCode) {
                case 37:
                  newIndex = curIndex - 1;
                  break;

                case 39:
                  newIndex = curIndex + 1;
                  break;

                default:
                  return;
              }

              if (newIndex >= self.focusStates.length)
                newIndex = 0;
              else if (newIndex < 0)
                newIndex = self.focusStates.length - 1;

              if (newIndex === curIndex)
                return;

              self.keepFocus = true;
              self.focusStates[curIndex] = false;
              self.focusStates[newIndex] = true;
            }
          }
        },

        /**
         * Disables options focus on blur event.
         *
         * @memberof module:opa/mediaSelect~OpaMediaSelectController
         * @method onBlur
         * @instance
         */
        onBlur: {
          value: function() {
            if (self.keepFocus)
              self.keepFocus = false;
            else {
              var index = self.focusStates.indexOf(true);
              if (index !== -1)
                self.focusStates[index] = false;

              $element.children().removeClass('opa-focused');
            }
          }
        }

      }

    );
  }

  app.controller('OpaMediaSelectController', OpaMediaSelectController);
  OpaMediaSelectController.$inject = ['$element'];

})(angular.module('opa'));

'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Manages opaStreamUrlValidator directive.
   *
   * @class OpaStreamUrlValidatorController
   * @constructor
   * @param {Object} $element JQLite element of the directive
   */
  function OpaStreamUrlValidatorController($element) {
    var ctrl = this;
    var ngModelController = $element.controller('ngModel');

    Object.defineProperties(this, {

      /**
       * Validates that the given value is a Youtube stream URL.
       *
       * Expected format only allows URLs starting with "https://www.youtube.com/watch?v=" and
       * finishing with any number of alphanumeric characters plus some URL characters like
       * dashes, underscores, ampersand and equals.
       * e.g. https://www.youtube.com/watch?v=someid
       *
       * @method isValidYoutubeStreamUrl
       * @param {String} value The url to validate
       * @return {Boolean} true if valid, false otherwise
       * @final
       */
      isValidYoutubeStreamUrl: {
        value: function(value) {
          return /^https:\/\/www\.youtube\.com\/watch\?v=[&=\w-]+$/.test(value);
        }
      },

      /**
       * Validates that the given value is a Wowza stream URL.
       *
       * Expected format allows http or https URLs with or without port followed by two REST
       * like parameters and ending by "playlist.m3u8".
       * e.g. https://wowza-example.local:1935/application-example/stream-example/playlist.m3u8
       *
       * @method isValidWowzaStreamUrl
       * @param {String} value The url to validate
       * @return {Boolean} true if valid, false otherwise
       * @final
       */
      isValidWowzaStreamUrl: {
        value: function(value) {
          return /^https?:\/\/[\w-.]*(:[0-9]+)?\/[\w-._]+\/[\w-._]+\/playlist.m3u8$/.test(value);
        }
      },

      /**
       * Validates that the given value is a Vodalys Studio stream URL.
       *
       * Expected format only allows URLs starting with "https://console.vodaly.stydio/" and
       * finishing with any sequence of characters excluding interrogation point, hash or equal.
       * e.g. https://console.vodalys.studio/vpage2/0hjertPpReB2Dbmr
       *
       * @method isValidVodalysStreamUrl
       * @param {String} value The url to validate
       * @return {Boolean} true if valid, false otherwise
       * @final
       */
      isValidVodalysStreamUrl: {
        value: function(value) {
          return /^https?:\/\/console\.vodalys\.studio\/[^#?=]+$/.test(value);
        }
      },

      /**
       * Handles one-way binding properties changes and force model validation.
       *
       * @method $onChanges
       * @final
       */
      $onChanges: {
        value: function() {
          ngModelController.$validate();
        }
      }

    });

    // Add the "opaStreamUrl" validator to the model
    ngModelController.$validators.opaStreamUrl = function(modelValue, viewValue) {
      if (!modelValue) return true;
      if (!ctrl.opaStreamUrlValidator) return true;

      if (ctrl.opaType === 'youtube') return ctrl.isValidYoutubeStreamUrl(modelValue);
      else if (ctrl.opaType === 'wowza') return ctrl.isValidWowzaStreamUrl(modelValue);
      else if (ctrl.opaType === 'vodalys') return ctrl.isValidVodalysStreamUrl(modelValue);
    };
  }

  app.controller('OpaStreamUrlValidatorController', OpaStreamUrlValidatorController);
  OpaStreamUrlValidatorController.$inject = ['$element'];

})(angular.module('opa'));

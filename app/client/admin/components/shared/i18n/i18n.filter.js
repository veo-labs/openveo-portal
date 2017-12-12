'use strict';

/**
 * @module opa.i18n
 */

(function(app) {

  /**
   * Translate filter to translate an id using a dictionary of translations.
   *
   * @class OpaTranslateFilter
   * @constructor
   * @param {Object} $sce AngularJS $sce service
   * @param {Object} opaTranslations The list of OpenVeo Portal translations
   */
  function OpaTranslateFilter($sce, opaTranslations) {

    /**
     * Translates an id into the appropriated translated text.
     *
     * @example
     *     // Translation dictionary
     *     var translations = {
     *       MY_SIMPLE_TRANSLATION_ID: 'Simple translation',
     *       MY_TRANSLATION_ID: {
     *         SINGLE: 'Single translation',
     *         PLURAL: 'Plural translation'
     *       },
     *       MY_TRANSLATION_WITH_PARAMETERS_ID: 'Translation with "%parameter%"'
     *     };
     *
     *     $scope.translationParameters = {
     *       '%parameter%': 'my value'
     *     };
     *
     * @example
     *     <!-- Simple translation -->
     *     <p>{{'MY_SIMPLE_TRANSLATION_ID' | opaTranslate}}</p>
     *
     *     <!-- Single translation -->
     *     <p>{{'MY_TRANSLATION_ID' | opaTranslate:0}}</p>
     *
     *     <!-- Single translation -->
     *     <p>{{'MY_TRANSLATION_ID' | opaTranslate:1}}</p>
     *
     *     <!-- Plural translation -->
     *     <p>{{'MY_TRANSLATION_ID' | opaTranslate:2}}</p>
     *
     *     <!-- Translation with "my value" -->
     *     <p>{{'MY_TRANSLATION_WITH_PARAMETERS_ID' | opaTranslate:0:translationParameters}}</p>
     *
     * @method opaTranslate
     * @param {String} id The id of the translation
     * @param {Number} [number] The number to determine pluralization
     * @param {Object} [parameters] Placeholder to replace with their values
     * @return {Object|null} The wrapped version of the translated string that can be used as a
     * trusted variant in $sce.HTML context
     */
    return function(id, number, parameters) {
      if (id) {
        id = id.toUpperCase();
        var properties = id.split('.');
        var translation = id;
        var property = opaTranslations;
        number = parseInt(number);

        // Nested search
        for (var i = 0; i < properties.length; i++) {
          if (property[properties[i]])
            property = property[properties[i]];
        }

        // Pluralization
        if (typeof property === 'object' &&
            !isNaN(number) &&
            'SINGLE' in property &&
            'PLURAL' in property
        ) {
          property = (number > 1) ? property['PLURAL'] : property['SINGLE'];
        }

        translation = (typeof property === 'string') ? property : id;

        // Parameters
        if (parameters) {
          var reg = new RegExp(Object.keys(parameters).join('|'), 'gi');
          translation = translation.replace(reg, function(matched) {
            return parameters[matched];
          });
        }
        return $sce.trustAsHtml(translation);
      }

      return null;
    };

  }

  app.filter('opaTranslate', OpaTranslateFilter);
  OpaTranslateFilter.$inject = ['$sce', 'opaTranslations'];

})(angular.module('opa.i18n'));

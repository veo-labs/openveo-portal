'use strict';

(function(app) {

  /**
   * Defines a filter to translate an id, contained inside a dictionary of translations,
   * into the appropriated text.
   *
   * @module ov.i18n
   * @class TranslateFilter
   */
  function TranslateFilter(translations) {

    /**
     * Translates an id into the appropriated text.
     *
     * @method translate
     * @param {String} id The id of the translation
     * @return {String} The translated string
     */
    return function(id) {
      if (id) {
        var properties = id.split('.');
        var property = translations;

        for (var i = 0; i < properties.length; i++) {
          if (property[properties[i]])
            property = property[properties[i]];
        }
        return (typeof property === 'string') ? property : id;
      }

      return id;
    };

  }

  app.filter('translate', TranslateFilter);
  TranslateFilter.$inject = ['translations'];

})(angular.module('ov.i18n'));

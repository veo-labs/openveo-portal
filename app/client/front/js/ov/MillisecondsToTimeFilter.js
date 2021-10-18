'use strict';

(function(angular, app) {

  /**
   * Converts time in milliseconds into time string (hh:mm:ss).
   *
   * @memberof module:ov
   * @inner
   * @class MillisecondsToTime
   * @constructor
   */
  function MillisecondsToTime() {

    /**
     * @memberof module:ov~MillisecondsToTime
     * @method millisecondsToTime
     */
    return function(value) {
      var ms = parseInt(value);

      if (isNaN(ms)) {
        return undefined;
      }

      var hours = Math.floor(ms / (3600 * 1000));
      var minutes = Math.floor((ms - hours * 3600 * 1000) / (60 * 1000));
      var seconds = Math.floor(ms / 1000 - ((hours * 60) + minutes) * 60);
      var pad = function(value) {
        return ('0' + value).slice(-2);
      };

      var humanTime = (hours) ? pad(hours) + ':' : '';
      return humanTime + pad(minutes) + ':' + pad(seconds);
    };
  }

  app.filter('millisecondsToTime', MillisecondsToTime);

})(angular, angular.module('ov.portal'));


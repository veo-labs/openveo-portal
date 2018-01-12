'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Stream URL validator directive validates that a model is a valid stream URL depending on type.
   *
   *     <script>
   *       function Controller($scope) {
   *         $scope.validates = true;
   *         $scope.streamType = 'youtube';
   *       }
   *     </script>
   *     <form name="myForm">
   *       <input name="myField" ng-model="myUrl" opa-stream-url-validator="{{validates}}" opa-type="{{streamType}}"/>
   *       {{myForm.myField.$error.opaStreamUrlValidator}}
   *     </form>
   *
   * Available attributes are:
   *   - [Boolean] **opa-stream-url-validator** An AngularJS expression evaluating to true if validator is active,
   *     false otherwise
   *   - [String] **opa-type** An AngularJS expression evaluating to a String, possible values are:
   *     - **youtube** Validate that the stream url respect the following format: https://www.youtube.com/watch?v=[ID]
   *       with:
   *       - **[ID]** the id of the stream
   *     - **wowza** Validate that the stream url respect the following format:
   *       [WOWZA_PROTOCOL]://[WOWZA_IP_ADDRESS]:[WOWZA_PORT]/[WOWZA_APPLICATION_NAME]/[WOWZA_STREAM_NAME]/playlist.m3u8
   *       with:
  *        - **[WOWZA_PROTOCOL]** Wowza streaming protocol (either http or https)
  *        - **[WOWZA_IP_ADDRESS]** Wowza streaming engine IP address
  *        - **[WOWZA_PORT]** Wowza streaming engine port
  *        - **[WOWZA_APPLICATION_NAME]** Wowza live application name
  *        - **[WOWZA_STREAM_NAME]** Wowza live stream name (could be a SMIL name)
   *
   * The registered name of the validator is "opaStreamUrl".
   *
   * @class opaStreamUrlValidator
   */
  function opaStreamUrlValidator() {
    return {
      restrict: 'A',
      require: ['^ngModel'],
      controller: 'OpaStreamUrlValidatorController',
      controllerAs: 'ctrl',
      bindToController: true,
      scope: {
        opaStreamUrlValidator: '<',
        opaType: '<'
      }
    };
  }

  app.directive('opaStreamUrlValidator', opaStreamUrlValidator);

})(angular.module('opa'));

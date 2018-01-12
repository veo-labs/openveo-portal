'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * License key validator directive validates that a model is a valid license key.
   *
   *     <script>
   *       function Controller($scope) {
   *         $scope.validates = true;
   *       }
   *     </script>
   *     <form name="myForm">
   *       <input name="myField" ng-model="myLicenseKey" opa-license-key-validator="{{validates}}" />
   *       {{myForm.myField.$error.opaLicenseKeyValidator}}
   *     </form>
   *
   * Available attributes are:
   *   - [Boolean] **opa-license-key-validator** An AngularJS expression evaluating to true if validator is active,
   *     false otherwise
   *
   * The registered name of the validator is "opaLicenseKey".
   *
   * @class opaLicenseKeyValidator
   */
  function opaLicenseKeyValidator() {
    return {
      restrict: 'A',
      require: ['^ngModel'],
      controller: 'OpaLicenseKeyValidatorController',
      controllerAs: 'ctrl',
      bindToController: true,
      scope: {
        opaLicenseKeyValidator: '<'
      }
    };
  }

  app.directive('opaLicenseKeyValidator', opaLicenseKeyValidator);

})(angular.module('opa'));

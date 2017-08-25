'use strict';

(function(app) {

  /**
   * Defines the controller which controls loginForm.html template.
   */
  function LoginFormController($scope) {
    this.theme = openVeoPortalSettings.theme;
    this.hasCas = openVeoPortalSettings.authenticationMechanisms.indexOf('cas') >= 0;
    this.hasExternal = this.hasCas;
  }

  app.controller('LoginFormController', LoginFormController);
  LoginFormController.$inject = ['$scope'];

})(angular.module('ov.portal'));

'use strict';

(function(app) {

  /**
   * Defines the controller which controls loginForm.html template.
   */
  function LoginFormController($scope, $location, $window, $analytics, authenticationService) {
    var self = this;
    this.theme = openVeoPortalSettings.theme;
    this.hasCas = openVeoPortalSettings.authenticationMechanisms.indexOf('cas') >= 0;
    this.hasLdap = true;
    this.hasExternal = this.hasCas;
    this.hasError = false;
    this.isLogging = false;

    /**
     * Signs in using the login form information (login and password).
     * If user successfully signed in, redirect to the home page, otherwise, set the form as on error.
     */
    this.signIn = function() {
      if (this.login && this.password) {
        this.isLogging = true;
        $analytics.eventTrack('Login');

        authenticationService.login('ldapauth', this.login, this.password).then(function(result) {
          authenticationService.setUserInfo(result.data);
          self.isLogging = false;
          self.hasError = false;
          $window.location.href = '/';
        }, function() {
          self.isLogging = false;
          self.hasError = true;
          self.login = self.password = '';
        });
      }
    };
  }

  app.controller('LoginFormController', LoginFormController);
  LoginFormController.$inject = ['$scope', '$location', '$window', '$analytics', 'authenticationService'];

})(angular.module('ov.portal'));

'use strict';

window.assert = chai.assert;

describe('opaLiveSettings', function() {
  let $compile;
  let $rootScope;
  let $filter;
  let $sce;
  let scope;

  // Load modules
  beforeEach(function() {
    module('opa');
    module('templates');
  });

  // Dependencies injections
  beforeEach(inject((_$compile_, _$rootScope_, _$filter_, _$sce_) => {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $filter = _$filter_;
    $sce = _$sce_;
  }));

  // Initializes tests
  beforeEach(function() {
    scope = $rootScope.$new();
  });

  it('should change the message of the live switch button regarding its state', function() {
    scope.settings = {
      activated: true
    };
    let element = angular.element('<opa-live-settings opa-settings="settings"></opa-live-settings>');

    element = $compile(element)(scope);
    scope.$digest();

    /**
     * Gets the switch label.
     *
     * @return {String} The clean switch label
     */
    function getLabelText() {
      const labelElement = angular.element(element[0].querySelector('md-switch .md-label'));
      return labelElement.text().replace(/\s+/g, ' ').trim();
    }

    assert.equal(getLabelText(), $sce.getTrustedHtml($filter('opaTranslate')('SETTINGS.LIVE.ACTIVATED_LABEL')));

    scope.settings = {
      activated: false
    };
    scope.$digest();

    assert.equal(getLabelText(), $sce.getTrustedHtml($filter('opaTranslate')('SETTINGS.LIVE.DEACTIVATED_LABEL')));
  });

  it('should display live settings if live is activated and hide if live is deactivated', function() {
    scope.settings = {
      activated: true
    };
    let element = angular.element('<opa-live-settings opa-settings="settings"></opa-live-settings>');

    element = $compile(element)(scope);
    scope.$digest();

    let settingsElement = angular.element(element[0].querySelector('.opa-live-sub-settings'));
    assert.notOk(settingsElement.hasClass('ng-hide'), 'Expected settings to be displayed');

    scope.settings = {
      activated: false
    };
    scope.$digest();

    assert.ok(settingsElement.hasClass('ng-hide'), 'Expected settings to be hidden');
  });

  it('should display an error message if URL is not specified', function() {
    scope.settings = {
      activated: true
    };
    let element = angular.element('<opa-live-settings opa-settings="settings"></opa-live-settings>');

    element = $compile(element)(scope);
    scope.$digest();

    const messageElement = angular.element(element[0].querySelector('.opa-live-url div[ng-message="required"]'));
    assert.equal(messageElement.text(), $sce.getTrustedHtml($filter('opaTranslate')('SETTINGS.LIVE.URL_EMPTY_ERROR')));
  });

  it('should display an error message if URL is not valid regarding selected player type', function() {
    scope.settings = {
      activated: true,
      playerType: 'wowza',
      url: 'wrong url format'
    };
    let element = angular.element('<opa-live-settings opa-settings="settings"></opa-live-settings>');

    element = $compile(element)(scope);
    scope.$digest();

    let messageElement = angular.element(element[0].querySelector('.opa-live-url div[ng-message="opaStreamUrl"]'));
    assert.equal(
      messageElement.text(),
      $sce.getTrustedHtml($filter('opaTranslate')('SETTINGS.LIVE.URL_WOWZA_ERROR')),
      'Expected error message about Wowza'
    );

    // Change player type
    scope.settings = {
      activated: true,
      playerType: 'youtube',
      url: 'wrong url format'
    };

    scope.$digest();

    assert.equal(
      messageElement.text(),
      $sce.getTrustedHtml($filter('opaTranslate')('SETTINGS.LIVE.URL_YOUTUBE_ERROR')),
      'Expected error message about Youtube'
    );

    // Change player type
    scope.settings = {
      activated: true,
      playerType: 'vodalys',
      url: 'wrong url format'
    };

    scope.$digest();

    assert.equal(
      messageElement.text(),
      $sce.getTrustedHtml($filter('opaTranslate')('SETTINGS.LIVE.URL_VODALYS_ERROR')),
      'Expected error message about Vodalys'
    );
  });

  it('should display wowza specific settings when wowza is the selected player type', function() {
    scope.settings = {
      activated: true,
      playerType: 'youtube'
    };
    let element = angular.element('<opa-live-settings opa-settings="settings"></opa-live-settings>');

    element = $compile(element)(scope);
    scope.$digest();

    let wowzaSettingsElement = angular.element(element[0].querySelector('.opa-live-wowza-settings'));
    assert.ok(wowzaSettingsElement.hasClass('ng-hide'), 'Expected wowza settings to be hidden');

    scope.settings = {
      activated: true,
      playerType: 'wowza'
    };

    scope.$digest();

    assert.notOk(wowzaSettingsElement.hasClass('ng-hide'), 'Expected wowza settings to be displayed');
  });

  it('should display an error message if wowza license key is not specified while player type is wowza', function() {
    scope.settings = {
      activated: true,
      playerType: 'wowza'
    };
    let element = angular.element('<opa-live-settings opa-settings="settings"></opa-live-settings>');

    element = $compile(element)(scope);
    scope.$digest();

    const messageElement = element[0].querySelector('.opa-live-wowza-license div[ng-message="required"]');
    assert.equal(
      angular.element(messageElement).text(),
      $sce.getTrustedHtml($filter('opaTranslate')('SETTINGS.LIVE.PLAYER_LICENSE_EMPTY_ERROR'))
    );
  });

  it('should display an error message if wowza license key is not specified while player type is wowza', function() {
    scope.settings = {
      activated: true,
      playerType: 'wowza'
    };
    let element = angular.element('<opa-live-settings opa-settings="settings"></opa-live-settings>');

    element = $compile(element)(scope);
    scope.$digest();

    const messageElement = element[0].querySelector('.opa-live-wowza-license div[ng-message="required"]');
    assert.equal(
      angular.element(messageElement).text(),
      $sce.getTrustedHtml($filter('opaTranslate')('SETTINGS.LIVE.PLAYER_LICENSE_EMPTY_ERROR'))
    );
  });

  it('should display an error message if wowza license key is not a valid license key', function() {
    scope.settings = {
      activated: true,
      playerType: 'wowza',
      wowza: {
        playerLicenseKey: 'wrong license key'
      }
    };
    let element = angular.element('<opa-live-settings opa-settings="settings"></opa-live-settings>');

    element = $compile(element)(scope);
    scope.$digest();

    const messageElement = element[0].querySelector('.opa-live-wowza-license div[ng-message="opaLicenseKey"]');
    assert.equal(
      angular.element(messageElement).text(),
      $sce.getTrustedHtml($filter('opaTranslate')('SETTINGS.LIVE.PLAYER_LICENSE_ERROR'))
    );
  });

  it('should display private specific settings when live is private', function() {
    scope.settings = {
      activated: true,
      private: false
    };
    let element = angular.element('<opa-live-settings opa-settings="settings"></opa-live-settings>');

    element = $compile(element)(scope);
    scope.$digest();

    let privateSettingsElement = angular.element(element[0].querySelector('.opa-live-private-settings'));
    assert.ok(privateSettingsElement.hasClass('ng-hide'), 'Expected private settings to be hidden');

    scope.settings = {
      activated: true,
      private: true
    };

    scope.$digest();

    assert.notOk(privateSettingsElement.hasClass('ng-hide'), 'Expected private settings to be displayed');
  });

  it('should display an error message if groups is not specified while live is private', function() {
    scope.settings = {
      activated: true,
      private: true
    };
    let element = angular.element('<opa-live-settings opa-settings="settings"></opa-live-settings>');

    element = $compile(element)(scope);
    scope.$digest();

    const messageElement = element[0].querySelector('.opa-live-groups div[ng-message="required"]');
    assert.equal(
      angular.element(messageElement).text(),
      $sce.getTrustedHtml($filter('opaTranslate')('SETTINGS.LIVE.GROUPS_EMPTY_ERROR'))
    );
  });

});

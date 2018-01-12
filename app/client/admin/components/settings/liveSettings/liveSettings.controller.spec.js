'use strict';

window.assert = chai.assert;

describe('OpaLiveSettingsController', function() {
  let $componentController;
  let $rootScope;
  let $scope;

  // Load modules
  beforeEach(function() {
    module('opa');
  });

  // Dependencies injections
  beforeEach(inject(function(_$componentController_, _$rootScope_) {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
  }));

  // Initiate scope
  beforeEach(function() {
    $scope = $rootScope.$new();
  });

  it('should emit an "opaLiveSettingsLinked" event when linked', function() {
    const handleEvent = chai.spy(() => {});
    $rootScope.$on('opaLiveSettingsLinked', handleEvent);

    const ctrl = $componentController('opaLiveSettings');
    ctrl.$postLink();
    $rootScope.$digest();

    handleEvent.should.have.been.called.exactly(1);
  });

  it('should call function registered by opa-on-update attribute when settings change', function() {
    const ctrl = $componentController('opaLiveSettings');
    ctrl.opaSettings = {
      activated: true
    };
    ctrl.opaOnUpdate = chai.spy(() => {});
    $rootScope.$digest();

    ctrl.opaSettings.activated = false;
    $rootScope.$digest();

    ctrl.opaSettings.playerType = true;
    $rootScope.$digest();

    ctrl.opaOnUpdate.should.have.been.called.exactly(3);
  });

  describe('settings validation', function() {

    it('should set default value for undefined settings', function() {
      const ctrl = $componentController('opaLiveSettings');
      ctrl.opaSettings = {};

      ctrl.$onChanges({
        opaSettings: {
          currentValue: {}
        }
      });

      assert.isNotOk(ctrl.opaSettings.activated, 'Expected live to be deactivated by default');
      assert.equal(ctrl.opaSettings.playerType, 'wowza', 'Expected wowza player by default');
      assert.isNull(ctrl.opaSettings.url, 'Expected stream url to be null by default');
      assert.isDefined(ctrl.opaSettings.wowza, 'Expected wowza property to be defined by default');
      assert.isNull(ctrl.opaSettings.wowza.playerLicenseKey, 'Expected wowza player license to be null by default');
      assert.isNotOk(ctrl.opaSettings.private, 'Expected live to be private by default');
      assert.isArray(ctrl.opaSettings.groups, 'Expected groups to be an array by default');
      assert.isEmpty(ctrl.opaSettings.groups, 'No groups expected by default');
    });

    it('should update live switch message with activated message if live is activated', function() {
      const ctrl = $componentController('opaLiveSettings');
      ctrl.opaSettings = {};

      ctrl.$onChanges({
        opaSettings: {
          currentValue: {
            activated: true
          }
        }
      });

      assert.equal(ctrl.liveSwitchMessage, 'SETTINGS.LIVE.ACTIVATED_LABEL', 'Expected activated message');
    });

    it('should update live switch message with activated message if live is deactivated', function() {
      const ctrl = $componentController('opaLiveSettings');
      ctrl.opaSettings = {};

      ctrl.$onChanges({
        opaSettings: {
          currentValue: {
            activated: false
          }
        }
      });

      assert.equal(ctrl.liveSwitchMessage, 'SETTINGS.LIVE.DEACTIVATED_LABEL', 'Expected deactivated message');
    });

    it('should update url error message with wowza message if player is wowza', function() {
      const ctrl = $componentController('opaLiveSettings');
      ctrl.opaSettings = {};

      ctrl.$onChanges({
        opaSettings: {
          currentValue: {
            playerType: 'wowza'
          }
        }
      });

      assert.equal(ctrl.urlErrorMessage, 'SETTINGS.LIVE.URL_WOWZA_ERROR', 'Expected wowza message');
    });

    it('should update url error message with youtube message if player is youtube', function() {
      const ctrl = $componentController('opaLiveSettings');
      ctrl.opaSettings = {};

      ctrl.$onChanges({
        opaSettings: {
          currentValue: {
            playerType: 'youtube'
          }
        }
      });

      assert.equal(ctrl.urlErrorMessage, 'SETTINGS.LIVE.URL_YOUTUBE_ERROR', 'Expected youtube message');
    });

    it('should call function registered by opa-on-update attribute if settings are valid', function() {
      $scope.opaLiveSettings = {
        $valid: true
      };
      const ctrl = $componentController('opaLiveSettings', {
        $scope
      });
      ctrl.opaOnUpdate = chai.spy(() => {});
      ctrl.opaSettings = {};

      ctrl.$onChanges({
        opaSettings: {
          currentValue: {}
        }
      });

      ctrl.opaOnUpdate.should.have.been.called.exactly(1);
    });

  });

  describe('updateLiveSwitchMessage', function() {

    it('should update the live switch message regarding its activated or deactivated', function() {
      const ctrl = $componentController('opaLiveSettings');

      ctrl.updateLiveSwitchMessage(true);
      assert.equal(ctrl.liveSwitchMessage, 'SETTINGS.LIVE.ACTIVATED_LABEL');

      ctrl.updateLiveSwitchMessage(false);
      assert.equal(ctrl.liveSwitchMessage, 'SETTINGS.LIVE.DEACTIVATED_LABEL');
    });

  });

  describe('updateUrlErrorMessage', function() {

    it('should update the URL error message depending on selected player type', function() {
      const ctrl = $componentController('opaLiveSettings');

      ctrl.updateUrlErrorMessage('wowza');
      assert.equal(ctrl.urlErrorMessage, 'SETTINGS.LIVE.URL_WOWZA_ERROR');

      ctrl.updateUrlErrorMessage('youtube');
      assert.equal(ctrl.urlErrorMessage, 'SETTINGS.LIVE.URL_YOUTUBE_ERROR');
    });

  });

  describe('isValid', function() {

    it('should return true if form is valid', function() {
      $scope.opaLiveSettings = {
        $valid: true
      };
      const ctrl = $componentController('opaLiveSettings', {
        $scope
      });
      assert.isOk(ctrl.isValid(), 'Expected live settings to be valid');
    });

    it('should return false if form is invalid', function() {
      $scope.opaLiveSettings = {
        $valid: false
      };
      const ctrl = $componentController('opaLiveSettings', {
        $scope
      });
      assert.isNotOk(ctrl.isValid(), 'Expected live settings to be invalid');
    });

    it('should return true if form is not yet available', function() {
      const ctrl = $componentController('opaLiveSettings');
      assert.isOk(ctrl.isValid(), 'Expected live settings to be valid');
    });

  });

  describe('callUpdate', function() {

    it('should call the function registered using opa-on-update attribute with settings', function() {
      const ctrl = $componentController('opaLiveSettings');
      ctrl.opaSettings = {};
      ctrl.opaOnUpdate = chai.spy((data) => {
        assert.strictEqual(data.settings, ctrl.opaSettings, 'Wrong settings');
      });
      ctrl.callUpdate();

      ctrl.opaOnUpdate.should.have.been.called.exactly(1);
    });

    it('should not call the function registered using opa-on-update attribute if form is invalid', function() {
      $scope.opaLiveSettings = {
        $valid: false
      };
      const ctrl = $componentController('opaLiveSettings', {
        $scope
      });
      ctrl.opaOnUpdate = chai.spy(() => {});
      ctrl.callUpdate();

      ctrl.opaOnUpdate.should.have.been.called.exactly(0);
    });

    it('should not throw an error if opa-on-update is not defined', function() {
      const ctrl = $componentController('opaLiveSettings');
      ctrl.opaSettings = {};

      assert.doesNotThrow(() => {
        ctrl.callUpdate();
      });

    });

  });

});

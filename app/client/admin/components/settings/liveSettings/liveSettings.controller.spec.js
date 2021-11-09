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

  describe('settings validation', function() {

    it('should set default value for undefined settings', function() {
      const ctrl = $componentController('opaLiveSettings');
      ctrl.settings = {};

      ctrl.$onChanges({
        opaSettings: {
          currentValue: {}
        }
      });

      assert.isNotOk(ctrl.settings.activated, 'Expected live to be deactivated by default');
      assert.equal(ctrl.settings.playerType, 'wowza', 'Expected wowza player by default');
      assert.isNull(ctrl.settings.url, 'Expected stream url to be null by default');
      assert.isNotOk(ctrl.settings.private, 'Expected live to be private by default');
      assert.isArray(ctrl.settings.groups, 'Expected groups to be an array by default');
      assert.isEmpty(ctrl.settings.groups, 'No groups expected by default');
    });

    it('should update live switch message with activated message if live is activated', function() {
      const ctrl = $componentController('opaLiveSettings');
      ctrl.settings = {};

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
      ctrl.settings = {};

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
      ctrl.settings = {};

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
      ctrl.settings = {};

      ctrl.$onChanges({
        opaSettings: {
          currentValue: {
            playerType: 'youtube'
          }
        }
      });

      assert.equal(ctrl.urlErrorMessage, 'SETTINGS.LIVE.URL_YOUTUBE_ERROR', 'Expected youtube message');
    });

    it('should update url error message with vimeo message if player is vimeo', function() {
      const ctrl = $componentController('opaLiveSettings');
      ctrl.settings = {};

      ctrl.$onChanges({
        opaSettings: {
          currentValue: {
            playerType: 'vimeo'
          }
        }
      });

      assert.equal(ctrl.urlErrorMessage, 'SETTINGS.LIVE.URL_VIMEO_ERROR', 'Expected vimeo message');
    });

    it('should update url error message with Vodalys message if player is vodalys', function() {
      const ctrl = $componentController('opaLiveSettings');
      ctrl.settings = {};

      ctrl.$onChanges({
        opaSettings: {
          currentValue: {
            playerType: 'vodalys'
          }
        }
      });

      assert.equal(ctrl.urlErrorMessage, 'SETTINGS.LIVE.URL_VODALYS_ERROR', 'Expected vodalys message');
    });

    it('should call function registered by opa-on-update attribute if settings are valid', function(done) {
      $scope.opaLiveSettings = {
        $valid: true
      };
      const ctrl = $componentController('opaLiveSettings', {
        $scope
      });
      ctrl.opaOnUpdate = chai.spy(() => {});
      ctrl.settings = {};

      ctrl.$onChanges({
        opaSettings: {
          currentValue: {}
        }
      });

      setTimeout(function() {
        ctrl.opaOnUpdate.should.have.been.called.exactly(1);
        done();
      });
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
      assert.equal(ctrl.urlErrorMessage, 'SETTINGS.LIVE.URL_WOWZA_ERROR', 'Wrong Wowza error message');

      ctrl.updateUrlErrorMessage('youtube');
      assert.equal(ctrl.urlErrorMessage, 'SETTINGS.LIVE.URL_YOUTUBE_ERROR', 'Wrong Youtube error message');

      ctrl.updateUrlErrorMessage('vimeo');
      assert.equal(ctrl.urlErrorMessage, 'SETTINGS.LIVE.URL_VIMEO_ERROR', 'Wrong Vimeo error message');

      ctrl.updateUrlErrorMessage('vodalys');
      assert.equal(ctrl.urlErrorMessage, 'SETTINGS.LIVE.URL_VODALYS_ERROR', 'Wrong Vodalys error message');
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

    it('should call the function registered using opa-on-update attribute with settings', function(done) {
      const ctrl = $componentController('opaLiveSettings');
      ctrl.settings = {};
      ctrl.opaOnUpdate = chai.spy((data) => {
        assert.strictEqual(data.settings, ctrl.settings, 'Wrong settings');
      });
      ctrl.callUpdate();

      setTimeout(function() {
        ctrl.opaOnUpdate.should.have.been.called.exactly(1);
        done();
      });
    });

    it('should not call the function registered using opa-on-update attribute if form is invalid', function(done) {
      $scope.opaLiveSettings = {
        $valid: false
      };
      const ctrl = $componentController('opaLiveSettings', {
        $scope
      });
      ctrl.opaOnUpdate = chai.spy(() => {});
      ctrl.callUpdate();

      setTimeout(function() {
        ctrl.opaOnUpdate.should.have.been.called.exactly(0);
        done();
      });
    });

    it('should not throw an error if opa-on-update is not defined', function() {
      const ctrl = $componentController('opaLiveSettings');
      ctrl.settings = {};

      assert.doesNotThrow(() => {
        ctrl.callUpdate();
      });

    });

  });

});

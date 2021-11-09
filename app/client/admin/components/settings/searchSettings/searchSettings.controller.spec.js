'use strict';

window.assert = chai.assert;

describe('OpaSearchSettingsController', function() {
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

  it('should emit an "opaSearchSettingsLinked" event when linked', function() {
    const handleEvent = chai.spy(() => {});
    $rootScope.$on('opaSearchSettingsLinked', handleEvent);

    const ctrl = $componentController('opaSearchSettings');
    ctrl.$postLink();
    $rootScope.$digest();

    handleEvent.should.have.been.called.exactly(1);
  });

  describe('settings validation', function() {

    it('should set default value for undefined settings', function() {
      const ctrl = $componentController('opaSearchSettings');
      ctrl.settings = {};

      ctrl.$onChanges({
        opaSettings: {
          currentValue: {}
        }
      });

      assert.isNotOk(ctrl.settings.pois, 'Expected search in points of interest to be deactivated by default');
    });

    it('should call function registered by opa-on-update attribute if settings are valid', function(done) {
      $scope.opaLiveSettings = {
        $valid: true
      };
      const ctrl = $componentController('opaSearchSettings', {
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

  describe('isValid', function() {

    it('should return true if form is valid', function() {
      $scope.opaSearchSettings = {
        $valid: true
      };
      const ctrl = $componentController('opaSearchSettings', {
        $scope
      });
      assert.isOk(ctrl.isValid(), 'Expected search settings to be valid');
    });

    it('should return false if form is invalid', function() {
      $scope.opaSearchSettings = {
        $valid: false
      };
      const ctrl = $componentController('opaSearchSettings', {
        $scope
      });
      assert.isNotOk(ctrl.isValid(), 'Expected search settings to be invalid');
    });

    it('should return true if form is not yet available', function() {
      const ctrl = $componentController('opaSearchSettings');
      assert.isOk(ctrl.isValid(), 'Expected search settings to be valid');
    });

  });

  describe('callUpdate', function() {

    it('should call the function registered using opa-on-update attribute with settings', function(done) {
      const ctrl = $componentController('opaSearchSettings');
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
      $scope.opaSearchSettings = {
        $valid: false
      };
      const ctrl = $componentController('opaSearchSettings', {
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
      const ctrl = $componentController('opaSearchSettings');
      ctrl.settings = {};

      assert.doesNotThrow(() => {
        ctrl.callUpdate();
      });
    });

  });

});

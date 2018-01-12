'use strict';

window.assert = chai.assert;

describe('OpaLicenseKeyValidatorController', function() {
  let $controller;
  let $element;
  let modelController;

  // Load modules
  beforeEach(function() {
    module('opa');
  });

  // Dependencies injections
  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));

  // Initializes tests
  beforeEach(function() {
    modelController = {
      $validators: {},
      $validate: () => {}
    };
    $element = {
      controller: () => {
        return modelController;
      }
    };
  });

  it('should set model as valid if empty', function() {
    const emptyValues = ['', 0, false];
    $controller('OpaLicenseKeyValidatorController', {
      $element
    });

    emptyValues.forEach((emptyValue) => {
      assert.isOk(
        modelController.$validators.opaLicenseKey(emptyValue),
        `Expected model to be valid for value ${emptyValue}`
      );
    });
  });

  it('should set model as valid if validator is deactivated', function() {
    const ctrl = $controller('OpaLicenseKeyValidatorController', {
      $element
    });
    ctrl.opaLicenseKeyValidator = false;

    assert.isOk(
      modelController.$validators.opaLicenseKey('new value'),
      'Expected model to be valid when validator is deactivated'
    );
  });

  it('should be able to validate the model', function() {
    const validValues = [
      'PLAY1-cerPw-zxezN-eMvje-9jHAD-8xA3j',
      'aaaaa-bbbbb-ccccc-ddddd-eeeee-fffff-ggggg',
      '00000-11111-22222-33333-44444-55555',
      'PLAY1-cerPw-zxezN-eMvje-9jHAD',
      'PLAY1-cerPw-zxezN-eMvje',
      'PLAY1-cerPw-zxezN',
      'PLAY1-cerPw',
      'PLAY1'
    ];
    const invalidValues = [
      '123456-cerPw-zxezN-eMvje-9jHAD-8xA3j',
      'PLAY1--cerPw-zxezN-eMvje-9jHAD-8xA3j',
      'PLAYé-cerPw-zxezN-eMvje-9jHAD-8xA3j',
      '-cerPw-zxezN-eMvje-9jHAD-8xA3j',
      '-'
    ];
    const ctrl = $controller('OpaLicenseKeyValidatorController', {
      $element
    });
    ctrl.opaLicenseKeyValidator = true;

    validValues.forEach(function(validValue) {
      assert.isOk(
        modelController.$validators.opaLicenseKey(validValue),
        `Expected model to be valid for value "${validValue}"`
      );
    });

    invalidValues.forEach(function(invalidValue) {
      assert.isNotOk(
        modelController.$validators.opaLicenseKey(invalidValue),
        `Expected model to be invalid for value "${invalidValue}"`
      );
    });
  });

});

'use strict';

window.assert = chai.assert;

describe('OpaStreamUrlValidatorController', function() {
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
    $controller('OpaStreamUrlValidatorController', {
      $element
    });

    emptyValues.forEach((emptyValue) => {
      assert.isOk(
        modelController.$validators.opaStreamUrl(emptyValue),
        `Expected model to be valid for value ${emptyValue}`
      );
    });
  });

  it('should set model as valid if validator is deactivated', function() {
    const ctrl = $controller('OpaStreamUrlValidatorController', {
      $element
    });
    ctrl.opaStreamUrlValidator = false;

    assert.isOk(
      modelController.$validators.opaStreamUrl('new value'),
      'Expected model to be valid when validator is deactivated'
    );
  });

  it('should be able to validate a youtube URL', function() {
    const validValues = [
      'https://www.youtube.com/watch?v=id',
      'https://www.youtube.com/watch?v=id&t=42a',
      'https://www.youtube.com/watch?v=id-_&='
    ];
    const invalidValues = [
      'https://www.youtube.com/watch?v=',
      'https://www.youtube.com/watch?v=id with spaces',
      'https://www.youtube.com/watch?v=é',
      'https://www.youtube.com/watch?v',
      'https://www.youtube.com/watch?',
      'https://www.youtube.com/watch',
      'http://www.youtube.com/watch?v=id',
      'beforehttp://www.youtube.com/watch?v=id'
    ];
    const ctrl = $controller('OpaStreamUrlValidatorController', {
      $element
    });
    ctrl.opaStreamUrlValidator = true;
    ctrl.opaType = 'youtube';

    validValues.forEach(function(validValue) {
      assert.isOk(
        modelController.$validators.opaStreamUrl(validValue),
        `Expected model to be valid for value "${validValue}"`
      );
    });

    invalidValues.forEach(function(invalidValue) {
      assert.isNotOk(
        modelController.$validators.opaStreamUrl(invalidValue),
        `Expected model to be invalid for value "${invalidValue}"`
      );
    });
  });

  it('should be able to validate a wowza URL', function() {
    const validValues = [
      'https://wowza-example.local:1935/application-example/stream-example/playlist.m3u8',
      'http://wowza-example.local:1935/application-example/stream-example/playlist.m3u8',
      'http://wowza-example.local/application-example/stream-example/playlist.m3u8',
      'http://wowza-example.local/application/stream/playlist.m3u8',
      'http://wowza.local/application/stream/playlist.m3u8'
    ];
    const invalidValues = [
      'https//wowza-example.local:1935/application-example/stream-example/playlist.m3u8',
      'https:/wowza-example.local:1935/application-example/stream-example/playlist.m3u8',
      'https://wowza-example.local:a1935/application-example/stream-example/playlist.m3u8',
      'https://wowza-example.local:1935/application-example/stream-example/playlist',
      'https://wowza-example.local:1935/application-example/stream-example/wrong.m3u8',
      'https://wowza-example.local:1935/stream-example/playlist.m3u8'
    ];
    const ctrl = $controller('OpaStreamUrlValidatorController', {
      $element
    });
    ctrl.opaStreamUrlValidator = true;
    ctrl.opaType = 'wowza';

    validValues.forEach(function(validValue) {
      assert.isOk(
        modelController.$validators.opaStreamUrl(validValue),
        `Expected model to be valid for value "${validValue}"`
      );
    });

    invalidValues.forEach(function(invalidValue) {
      assert.isNotOk(
        modelController.$validators.opaStreamUrl(invalidValue),
        `Expected model to be invalid for value "${invalidValue}"`
      );
    });
  });

});

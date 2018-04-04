'use strict';

describe('OpaMediaLibraryDialogController', function() {
  let $controller;
  let $mdDialog;
  let $mdMedia;
  let value;
  let multiple;

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
    $mdMedia = {};
    $mdDialog = {
      cancel: () => {},
      hide: (response) => {
        return response;
      }
    };
  });

  it('should call $mdDialog.cancel() on cancel', function() {
    const spy = chai.spy.on($mdDialog, 'cancel');
    const ctrl = $controller('OpaMediaLibraryDialogController', {
      $mdDialog,
      $mdMedia,
      value,
      multiple
    });

    ctrl.cancel();

    spy.should.have.been.called.exactly(1);
  });

  it('should call $mdDialog.hide() on close', function() {
    const spy = chai.spy.on($mdDialog, 'hide');
    const ctrl = $controller('OpaMediaLibraryDialogController', {
      $mdDialog,
      $mdMedia,
      value,
      multiple
    });

    ctrl.close();

    spy.should.have.been.called.exactly(1);
  });

  it('should return new value on close', function() {
    value = 'old value';
    const expectedValue = 'new value';
    $mdDialog.hide = (response) => {
      assert.strictEqual(response.value, expectedValue);
    };
    const ctrl = $controller('OpaMediaLibraryDialogController', {
      $mdDialog,
      $mdMedia,
      value,
      multiple
    });

    ctrl.$onInit();
    assert.equal(ctrl.value, value);

    ctrl.value = expectedValue;
    ctrl.close();

  });

});

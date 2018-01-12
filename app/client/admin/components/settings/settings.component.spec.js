'use strict';

window.assert = chai.assert;

describe('opaSettings', function() {
  let $compile;
  let $rootScope;
  let scope;

  // Load modules
  beforeEach(function() {
    module('opa', ($controllerProvider) => {
      $controllerProvider.register('OpaSettingsController', () => {});
    });
    module('templates');
  });

  // Dependencies injections
  beforeEach(inject((_$compile_, _$rootScope_) => {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
  }));

  // Initializes tests
  beforeEach(function() {
    scope = $rootScope.$new();
  });

  it('should contain an opa-live-settings component', function() {
    let element = angular.element('<opa-settings></opa-settings>');

    element = $compile(element)(scope);
    scope.$digest();

    assert.isNotNull(element[0].querySelector('opa-live-settings'), 'Expected an opa-live-settings component');
  });

  it('should not contain opa-live-settings component but an error when retreiving settings failed', function() {
    let element = angular.element('<opa-settings></opa-settings>');

    element = $compile(element)(scope);
    scope.$digest();

    const ctrl = element.controller('opaSettings');
    ctrl.isError = true;
    scope.$digest();

    assert.isNull(element[0].querySelector('opa-live-settings'), 'Unexpected opa-live-settings component');
    assert.isNotNull(element[0].querySelector('.opa-error-message'), 'Expected an error message');
  });

  it('should not be able to submit formular if saving', function() {
    let element = angular.element('<opa-settings></opa-settings>');

    element = $compile(element)(scope);
    scope.$digest();

    const ctrl = element.controller('opaSettings');
    ctrl.isSaving = true;
    scope.$digest();

    let submitButton = element[0].querySelector('.opa-submit-button');
    assert.equal(submitButton.getAttribute('disabled'), 'disabled');
    assert.isNull(submitButton.querySelector('span'), 'Unexpected button label');
    assert.isNotNull(submitButton.querySelector('md-progress-circular'), 'Expected button preloader');
  });

  it('should not be able to submit formular if not valid', function() {
    let element = angular.element('<opa-settings></opa-settings>');

    element = $compile(element)(scope);
    scope.$digest();

    const ctrl = element.controller('opaSettings');
    ctrl.isValid = () => false;
    scope.$digest();

    assert.equal(element[0].querySelector('.opa-submit-button').getAttribute('disabled'), 'disabled');
  });

  it('should be able to save formular', function() {
    let element = angular.element('<opa-settings></opa-settings>');

    element = $compile(element)(scope);
    scope.$digest();

    const ctrl = element.controller('opaSettings');
    ctrl.isValid = () => true;
    ctrl.save = chai.spy(() => {});
    scope.$digest();

    angular.element(element[0].querySelector('.opa-submit-button')).triggerHandler('click', {});

    ctrl.save.should.have.been.called.exactly(1);
  });

});

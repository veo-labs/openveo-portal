'use strict';

window.assert = chai.assert;

describe('opaPromotedVideos', function() {
  let $compile;
  let $rootScope;
  let scope;
  let OpaPromotedVideosController;
  let ctrl;

  // Load modules
  beforeEach(function() {
    ctrl = {
      getContainersTemplate: () => {
        return 'opa-promotedVideos-containers-2And4Cols.html';
      }
    };
    OpaPromotedVideosController = function() {
      return ctrl;
    };

    module('opa', ($controllerProvider) => {
      $controllerProvider.register('OpaPromotedVideosController', OpaPromotedVideosController);
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

  it('should contain 9 opa-media-container components in 2 and 4 columns configuration', function() {
    let element = angular.element('<opa-promoted-videos></opa-promoted-videos>');

    ctrl.getContainersTemplate = () => {
      return 'opa-promotedVideos-containers-2And4Cols.html';
    };

    ctrl.containers = [];

    for (let i = 0; i < 9; i++)
      ctrl.containers.push({title: i});

    element = $compile(element)(scope);
    scope.$digest();

    assert.lengthOf(element[0].querySelectorAll('opa-media-container'), 9, 'Expected 9 opa-media-container components');
  });

  it('should contain 9 opa-media-container components in 3 columns configuration', function() {
    let element = angular.element('<opa-promoted-videos></opa-promoted-videos>');

    ctrl.getContainersTemplate = () => {
      return 'opa-promotedVideos-containers-3Cols.html';
    };

    ctrl.containers = [];

    for (let i = 0; i < 9; i++)
      ctrl.containers.push({title: i});

    element = $compile(element)(scope);
    scope.$digest();

    assert.lengthOf(element[0].querySelectorAll('opa-media-container'), 9, 'Expected 9 opa-media-container components');
  });

  it('should not contain any opa-media-container but an error when retreiving promoted videos failed', function() {
    let element = angular.element('<opa-promoted-videos></opa-promoted-videos>');

    ctrl.isError = true;

    element = $compile(element)(scope);
    scope.$digest();

    assert.lengthOf(element[0].querySelectorAll('opa-live-settings'), 0, 'Unexpected opa-media-container components');
    assert.isNotNull(element[0].querySelector('.opa-error-message'), 'Expected an error message');
  });

  it('should not be able to submit formular if saving', function() {
    let element = angular.element('<opa-promoted-videos></opa-promoted-videos>');

    ctrl.isSaving = true;

    element = $compile(element)(scope);
    scope.$digest();

    let submitButton = element[0].querySelector('.opa-submit-button');
    assert.equal(submitButton.getAttribute('disabled'), 'disabled');
    assert.isNull(submitButton.querySelector('span'), 'Unexpected button label');
    assert.isNotNull(submitButton.querySelector('md-progress-circular'), 'Expected button preloader');
  });

  it('should be able to save formular', function() {
    let element = angular.element('<opa-promoted-videos></opa-promoted-videos>');

    ctrl.isValid = () => true;
    ctrl.save = chai.spy(() => {});

    element = $compile(element)(scope);
    scope.$digest();

    angular.element(element[0].querySelector('.opa-submit-button')).triggerHandler('click', {});

    ctrl.save.should.have.been.called.exactly(1);
  });

});

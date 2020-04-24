'use strict';

window.assert = chai.assert;

describe('opaAbout', function() {
  let $compile;
  let $rootScope;
  let $sce;
  let scope;
  let element;
  let ctrl;

  // Load modules
  beforeEach(function() {
    module('opa', function($controllerProvider) {

      // Mock controller
      $controllerProvider.register('OpaAboutController', function() {
        this.isLoaded = true;
      });

    });
    module('templates');
  });

  // Dependencies injections
  beforeEach(inject(function(_$compile_, _$rootScope_, _$sce_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $sce = _$sce_;
  }));

  // Initializes tests
  beforeEach(function() {
    scope = $rootScope.$new();
    element = angular.element('<opa-about></opa-about>');
    element = $compile(element)(scope);
    scope.$digest();
    ctrl = element.controller('opaAbout');
  });

  it('should display a preloader when loading', function() {
    ctrl.isLoaded = false;
    scope.$digest();

    assert.notInclude(
      angular.element(element[0].querySelector('.opa-loader')).attr('class').split(' '),
      'ng-hide',
      'Expected loader to be displayed'
    );

    assert.include(
      angular.element(element[0].querySelector('.opa-about > div')).attr('class').split(' '),
      'ng-hide',
      'Expected content to be hidden'
    );
  });

  it('should display information about OpenVeo Portal', function() {
    ctrl.information = {
      version: '1.0.0',
      latestVersion: '1.0.0',
      versionUrl: 'http://my.url.test/1.0.0',
      latestVersionUrl: 'http://my.url.test/1.0.0',
      versionSourcesUrl: 'http://my.url.test/1.0.0/sources',
      updateAvailable: false
    };
    ctrl.message = $sce.trustAsHtml('Content message of opa-about component');

    scope.$digest();

    const footerButtonElement = element[0].querySelector('footer a');
    assert.include(angular.element(element[0].querySelector('header md-icon')).text(), 'check_circle', 'Wrong icon');
    assert.equal(angular.element(element[0].querySelector('section p')).text(), ctrl.message, 'Wrong message');
    assert.equal(angular.element(footerButtonElement).attr('href'), ctrl.information.versionSourcesUrl, 'Wrong link');
  });

  it('should change status icon if a new version is available', function() {
    ctrl.information = {
      version: '1.0.0',
      latestVersion: '2.0.0',
      updateAvailable: true
    };

    scope.$digest();

    assert.include(angular.element(element[0].querySelector('header md-icon')).text(), 'new_releases', 'Wrong icon');
  });

  it('should display an error message if no message defined', function() {
    ctrl.message = null;
    scope.$digest();
    assert.isNotEmpty(angular.element(element[0].querySelector('section p')).text(), 'Wrong message');
  });

  it('should display an error message if no message defined', function() {
    ctrl.message = null;
    scope.$digest();
    assert.isNotEmpty(angular.element(element[0].querySelector('section p')).text(), 'Wrong message');
  });

  it('should display an error message if no message defined', function() {
    ctrl.message = null;
    scope.$digest();
    assert.isNotEmpty(angular.element(element[0].querySelector('section p')).text(), 'Wrong message');
  });

  it('should not display sources button if version is not known', function() {
    ctrl.information = {};
    assert.isNull(element[0].querySelector('footer a'), 'Unexpected sources button');
  });
});

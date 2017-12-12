'use strict';

window.assert = chai.assert;

describe('opaDashboard', function() {
  let $compile;
  let $rootScope;
  let scope;

  // Load modules
  beforeEach(function() {
    module('opa');
    module('templates');
  });

  // Dependencies injections
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
  }));

  // Initializes tests
  beforeEach(function() {
    scope = $rootScope.$new();
  });

  it('should contain an opa-about component', function() {
    let element = angular.element('<opa-dashboard></opa-dashboard>');
    element = $compile(element)(scope);
    scope.$digest();

    assert.isNotNull(element[0].querySelector('opa-about'), 'Expected an opa-about component');
  });
});

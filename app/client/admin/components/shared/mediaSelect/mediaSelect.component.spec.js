'use strict';

window.assert = chai.assert;

describe('opaMediaSelect', function() {
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
    scope.medias = [];

    for (let i = 1; i <= 10; i++)
      scope.medias.push({
        id: i,
        title: 'Media ' + i + ' Title',
        date: new Date(),
        preview: ''
      });
  });

  it('should have single value in the model when opa-multiple is set to false', function() {
    scope.model = 8;
    let element = angular.element(
      '<opa-media-select ng-model="model" opa-medias="medias" opa-multiple="false"></opa-media-select>'
    );
    element = $compile(element)(scope);
    scope.$digest();

    // Click on the md-checkbox of the media having the id 3.
    angular.element(
      element[0].querySelector('opa-media-option:nth-child(3) md-checkbox')
    ).triggerHandler({type: 'click'});
    assert.strictEqual(scope.model, 3);
  });

  it('should have an array of values in the model when opa-multiple is set to true', function() {
    scope.model = [5];
    let element = angular.element(
      '<opa-media-select ng-model="model" opa-medias="medias" opa-multiple="true"></opa-media-select>'
    );
    element = $compile(element)(scope);
    scope.$digest();

    // Click on all the odd media's id md-checkbox
    angular.element(
      element[0].querySelectorAll('opa-media-option:nth-child(odd) md-checkbox')
    ).triggerHandler({type: 'click'});
    assert.deepEqual(scope.model, [1, 3, 7, 9]);
  });

});

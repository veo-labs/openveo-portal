'use strict';

window.assert = chai.assert;

describe('opaInfo', function() {
  let $compile;
  let $rootScope;
  let $document;
  let $sce;
  let scope;
  let element;

  // Load modules
  beforeEach(function() {
    module('opa');
    module('templates');
  });

  // Dependencies injections
  beforeEach(inject(function(_$rootScope_, _$compile_, _$document_, _$sce_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $document = _$document_;
    $sce = _$sce_;
  }));

  // Initializes tests
  beforeEach(function() {
    scope = $rootScope.$new();
  });

  it('should display the message', function() {
    scope.message = $sce.trustAsHtml('Expected message');
    element = angular.element('<p opa-info="message"></p>');
    element = $compile(element)(scope);
    scope.$digest();

    element.triggerHandler({type: 'click'});
    $rootScope.$digest();
    scope.$digest();

    assert.isNotNull($document[0].body.querySelector('.opa-info'), 'Missing panel');
  });

  it('should display a button to close the panel', function() {
    scope.message = $sce.trustAsHtml('Expected message');
    element = angular.element('<p opa-info="message"></p>');
    element = $compile(element)(scope);
    scope.$digest();

    element.triggerHandler({type: 'click'});
    $rootScope.$digest();
    scope.$digest();

    const buttonElement = $document[0].body.querySelector('.opa-info button');
    assert.isNotNull(buttonElement, 'Missing button');

    angular.element(buttonElement).triggerHandler({type: 'click'});

    assert.isNull($document[0].body.querySelector('.opa-info'), 'Unexpected panel');
  });

  it('should not display anything if message is not defined', function() {
    element = angular.element('<p opa-info></p>');
    element = $compile(element)(scope);
    scope.$digest();

    element.triggerHandler({type: 'click'});
    $rootScope.$digest();
    scope.$digest();

    assert.isNull($document[0].body.querySelector('.opa-info'), 'Unexpected panel');
  });

});

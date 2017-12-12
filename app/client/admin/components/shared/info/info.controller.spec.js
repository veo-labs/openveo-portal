'use strict';

window.assert = chai.assert;

describe('OpaInfoController', function() {
  let expectedMessage;
  let $compile;
  let $rootScope;
  let $document;
  let $sce;
  let scope;
  let element;
  let ctrl;

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
    expectedMessage = $sce.trustAsHtml('Expected message');
    scope.message = expectedMessage;

    element = angular.element('<p opa-info="message"></p>');
    element = $compile(element)(scope);
    scope.$digest();

    ctrl = element.controller('opaInfo');
  });

  describe('open', function() {

    it('should be able to open a panel with the message', function() {
      assert.equal(ctrl.message, expectedMessage);
      ctrl.open();
      $rootScope.$digest();
      scope.$digest();

      assert.isNotNull($document[0].body.querySelector('.opa-info'), 'Missing panel');
    });

    it('should be able to open a panel by clicking on the element', function() {
      element.triggerHandler({type: 'click'});
      $rootScope.$digest();
      scope.$digest();
      assert.isNotNull($document[0].body.querySelector('.opa-info'), 'Missing panel');
    });

    it('should not be able to open a panel if already opened', function() {
      ctrl.open();
      ctrl.open();
      $rootScope.$digest();
      scope.$digest();

      assert.equal($document[0].body.querySelectorAll('.opa-info').length, 1, 'Unexpected number of panels');
    });

  });

  describe('close', function() {

    it('should be able to close the panel', function() {
      ctrl.open();
      $rootScope.$digest();
      scope.$digest();

      assert.isNotNull($document[0].body.querySelector('.opa-info'), 'Missing panel');

      ctrl.close();
      $rootScope.$digest();
      scope.$digest();

      assert.isNull($document[0].body.querySelector('.opa-info'), 'Unexpected panel');
    });

  });

});

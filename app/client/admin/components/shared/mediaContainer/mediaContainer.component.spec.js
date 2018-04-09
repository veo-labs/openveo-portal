'use strict';

window.assert = chai.assert;

describe('opaMediaContainer', function() {
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

    scope.media = null;
    scope.editAction = () => {};
    scope.removeAction = () => {};
  });

  it('should launch the editAction() when the container is clicked', function() {
    const spy = chai.spy.on(scope, 'editAction');
    let element = angular.element(
      '<opa-media-container opa-title="TEST" opa-media="media" opa-edit="editAction()"></opa-media-container>'
    );
    element = $compile(element)(scope);
    scope.$digest();

    // Click on the div.opa-media-container.
    element.children().triggerHandler({type: 'click'});
    spy.should.have.been.called.exactly(1);
  });

  it('should not display media\'s tags when the media is unset', function() {
    let element = angular.element(
      '<opa-media-container opa-title="TEST" opa-media="media"></opa-media-container>'
    );
    element = $compile(element)(scope);
    scope.$digest();

    assert.isOk(element.children().hasClass('empty'));
    assert.equal(element.children().children().length, 1);
  });

  it('should launch the removeAction() when the remove button is clicked', function() {
    scope.media = {title: 'Test video', date: new Date(), preview: ''};
    const editSpy = chai.spy.on(scope, 'editAction');
    const removeSpy = chai.spy.on(scope, 'removeAction');
    let element = angular.element(
      '<opa-media-container opa-title="TEST" opa-media="media" opa-edit="editAction()" opa-remove="removeAction()">' +
      '</opa-media-container>'
    );
    element = $compile(element)(scope);
    scope.$digest();

    // Click on the div.opa-media-container.
    element.find('button').triggerHandler({type: 'click'});
    editSpy.should.have.not.been.called();
    removeSpy.should.have.been.called.exactly(1);
  });
});

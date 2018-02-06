'use strict';

window.assert = chai.assert;

describe('OpaActionsButtonController', function() {
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

  describe('toggleActions', function() {

    it('should be able to open / close the list of actions', function() {
      scope.label = 'Expected actions button label';
      scope.actions = [
        {
          label: 'First action label',
          action: () => {}
        },
        {
          label: 'Second action label',
          action: () => {}
        }
      ];
      let element = angular.element(
        '<opa-actions-button opa-label="{{label}}" opa-actions="actions"></opa-actions-button>'
      );
      element = $compile(element)(scope);
      scope.$digest();

      const ctrl = element.controller('opaActionsButton');
      const actionsWrapperElement = element[0].querySelector('.opa-actions-wrapper');
      const actionsWrapperHeight = parseInt(actionsWrapperElement.style.height);

      assert.ok(!ctrl.isOpened, 'Expected the list of actions to be closed by default');
      assert.ok(!actionsWrapperHeight, 'Expected actions wrapper element to have a height of 0 by default');

      ctrl.toggleActions();

      assert.ok(ctrl.isOpened, 'Expected the list of actions to be opened');
      assert.ok(!actionsWrapperHeight, 'Expected actions wrapper element to have a positive height');

      ctrl.toggleActions();

      assert.ok(!ctrl.isOpened, 'Expected the list of actions to be closed');
      assert.ok(!actionsWrapperHeight, 'Expected actions wrapper element to have a height of 0');
    });

  });

});

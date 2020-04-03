'use strict';

window.assert = chai.assert;

describe('opaActionsButton', function() {
  let $compile;
  let $rootScope;
  let scope;

  // Load modules
  beforeEach(function() {
    module('opa', function($controllerProvider) {
      $controllerProvider.register('OpaActionsButtonController', function() {
        this.toggleActions = () => {};
      });
    });
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

  it('should be able to open / close the list of actions by clicking on the label', function() {
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
    ctrl.toggleActions = chai.spy(ctrl.toggleActions);
    angular.element(element[0].querySelector('button')).triggerHandler({type: 'click'});

    ctrl.toggleActions.should.have.been.called.exactly(1);
  });

  it('should not display anything if label is not defined', function() {
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
    let element = angular.element('<opa-actions-button opa-actions="actions"></opa-actions-button>');
    element = $compile(element)(scope);
    scope.$digest();

    assert.isNull(element[0].querySelector('button'), 'Unexpected button');
    assert.isNull(element[0].querySelector('.opa-actions-wrapper'), 'Unexpected actions');
  });

  it('should not display anything if no actions', function() {
    const wrongActions = ['string', 42, {}];
    scope.label = 'Expected actions button label';

    wrongActions.forEach((wrongAction) => {
      scope.actions = wrongAction;

      let element = angular.element('<opa-actions-button opa-actions="actions"></opa-actions-button>');
      element = $compile(element)(scope);
      scope.$digest();

      assert.isNull(element[0].querySelector('button'), 'Unexpected button');
      assert.isNull(element[0].querySelector('.opa-actions-wrapper'), 'Unexpected actions');
    });
  });

  it('should display an icon if set', function() {
    scope.label = 'Expected actions button label';
    scope.icon = 'some_icon_id';
    scope.actions = [
      {
        label: 'First action label',
        action: () => {}
      }
    ];
    let element = angular.element(
      '<opa-actions-button opa-label="{{label}}" opa-actions="actions" opa-icon="{{icon}}"></opa-actions-button>'
    );
    element = $compile(element)(scope);
    scope.$digest();

    const iconElement = element[0].querySelector('button > md-icon:first-child');
    assert.isNotNull(iconElement, 'Expected an icon');
    assert.equal(angular.element(iconElement).text(), scope.icon, 'Wrong icon');
  });

  it('should not display an icon if not set', function() {
    scope.label = 'Expected actions button label';
    scope.actions = [
      {
        label: 'First action label',
        action: () => {}
      }
    ];
    let element = angular.element(
      '<opa-actions-button opa-label="{{label}}" opa-actions="actions"></opa-actions-button>'
    );
    element = $compile(element)(scope);
    scope.$digest();

    assert.isNull(element[0].querySelector('button > md-icon:first-child'));
  });

  it('should display a list of actions', function() {
    scope.label = 'Expected actions button label';
    scope.actions = [
      {
        label: 'first action label',
        action: chai.spy(() => {}),
        icon: 'some_icon_id'
      }
    ];
    let element = angular.element(
      '<opa-actions-button opa-label="{{label}}" opa-actions="actions"></opa-actions-button>'
    );
    element = $compile(element)(scope);
    scope.$digest();

    const actionElements = element[0].querySelectorAll('li');

    for (let i = 0; i < actionElements.length; i++) {
      let iconElement = actionElements[i].querySelector('md-icon');
      let labelElement = actionElements[i].querySelector('span');
      let linkElement = actionElements[i].querySelector('a');
      assert.equal(angular.element(iconElement).text(), scope.actions[i].icon, 'Wrong icon');
      assert.equal(angular.element(labelElement).text().toLowerCase(), scope.actions[i].label, 'Wrong label');
      assert.notInclude(
        angular.element(actionElements[i]).attr('class').split(' '),
        'opa-selected',
        'Expected action to be selected'
      );

      angular.element(linkElement).triggerHandler({type: 'click'});

      scope.actions[i].action.should.have.been.called.exactly(1);
    }

    assert.equal(actionElements.length, scope.actions.length, 'Wrong number of actions');
  });

  it('should not display an action without a label', function() {
    scope.label = 'Expected actions button label';
    scope.actions = [
      {
        action: () => {}
      }
    ];
    let element = angular.element(
      '<opa-actions-button opa-label="{{label}}" opa-actions="actions"></opa-actions-button>'
    );
    element = $compile(element)(scope);
    scope.$digest();

    const actionElements = element[0].querySelectorAll('li');

    assert.equal(actionElements.length, 0, 'Wrong number of actions');
  });

  it('should not display an action without an action', function() {
    scope.label = 'Expected actions button label';
    scope.actions = [
      {
        label: 'first action label'
      }
    ];
    let element = angular.element(
      '<opa-actions-button opa-label="{{label}}" opa-actions="actions"></opa-actions-button>'
    );
    element = $compile(element)(scope);
    scope.$digest();

    const actionElements = element[0].querySelectorAll('li');

    assert.equal(actionElements.length, 0, 'Wrong number of actions');
  });

  it('should be able to mark an action as selected', function() {
    scope.label = 'Expected actions button label';
    scope.actions = [
      {
        label: 'first action label',
        action: () => {},
        selected: true
      }
    ];
    let element = angular.element(
      '<opa-actions-button opa-label="{{label}}" opa-actions="actions"></opa-actions-button>'
    );
    element = $compile(element)(scope);
    scope.$digest();

    const actionElement = element[0].querySelector('li');

    assert.include(
      angular.element(actionElement).attr('class').split(' '),
      'opa-selected',
      'Expected action to be selected'
    );
  });
});

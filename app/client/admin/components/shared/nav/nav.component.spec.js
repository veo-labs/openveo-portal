'use strict';

window.assert = chai.assert;

describe('opaAbout', function() {
  let $compile;
  let $rootScope;
  let scope;
  let element;

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

  it('should be able to present simple menu items', function() {
    scope.menu = [
      {
        label: 'first item label',
        icon: 'first_item_icon_id',
        action: chai.spy(() => {})
      },
      {
        label: 'second item label',
        icon: 'second_item_icon_id',
        action: chai.spy(() => {}),
        selected: true
      }
    ];

    element = angular.element('<opa-nav opa-menu="menu"></opa-nav>');
    element = $compile(element)(scope);
    scope.$digest();

    const itemElements = element[0].querySelectorAll('li');

    for (let i = 0; i < itemElements.length; i++) {
      const itemElement = itemElements[i];
      const menuItem = scope.menu[i];
      angular.element(itemElement.querySelector('a')).triggerHandler({type: 'click'});
      menuItem.action.should.have.been.called.exactly(1);
      assert.equal(angular.element(itemElement.querySelector('a > span')).text().toLowerCase(), menuItem.label);
      assert.equal(angular.element(itemElement.querySelector('a > md-icon')).text(), menuItem.icon);

      if (menuItem.selected) {
        assert.include(
          angular.element(itemElement.querySelector('a')).attr('class').split(' '),
          'opa-selected',
          `Expected item ${menuItem.label} to be selected`
        );
      }

    }

    assert.isEmpty(element[0].querySelectorAll('li md-divider'), 'Unexpected divider');
    assert.isEmpty(element[0].querySelectorAll('li opa-actions-button'), 'Unexpected actions buttons');
  });

  it('should ignore simple items without associated function or label', function() {
    scope.menu = [
      {
        label: 'first item label'
      },
      {
        action: () => {}
      }
    ];

    element = angular.element('<opa-nav opa-menu="menu"></opa-nav>');
    element = $compile(element)(scope);
    scope.$digest();

    const itemElements = element[0].querySelectorAll('li a');

    assert.equal(itemElements.length, 0, 'Wrong number of items');
  });

  it('should be able to present dividers', function() {
    scope.menu = [
      {
        divider: true
      }
    ];
    element = angular.element('<opa-nav opa-menu="menu"></opa-nav>');
    element = $compile(element)(scope);
    scope.$digest();

    const dividerElements = element[0].querySelectorAll('li md-divider');

    assert.equal(dividerElements.length, scope.menu.length, 'Wrong number of dividers');
    assert.isEmpty(element[0].querySelectorAll('li opa-actions-button'), 'Unexpected actions buttons');
  });

  it('should be able to present actions buttons', function() {
    scope.menu = [
      {
        label: 'actions button label',
        icon: 'actions_button_icon_id',
        actions: [
          {
            label: 'first action label',
            icon: 'first_action_icon_id',
            action: () => {}
          }
        ]
      }
    ];
    element = angular.element('<opa-nav opa-menu="menu"></opa-nav>');
    element = $compile(element)(scope);
    scope.$digest();

    const actionsButtonsElements = element[0].querySelectorAll('li opa-actions-button');

    assert.equal(actionsButtonsElements.length, scope.menu.length, 'Wrong number of actions buttons');
    assert.isEmpty(element[0].querySelectorAll('li md-divider'), 'Unexpected dividers');
  });

  it('should ignore actions buttons without actions or label', function() {
    scope.menu = [
      {
        icon: 'actions_button_icon_id',
        actions: [
          {
            label: 'first action label',
            icon: 'first_action_icon_id',
            action: () => {}
          }
        ]
      },
      {
        label: 'actions button label',
        icon: 'actions_button_icon_id'
      }
    ];
    element = angular.element('<opa-nav opa-menu="menu"></opa-nav>');
    element = $compile(element)(scope);
    scope.$digest();

    assert.isEmpty(element[0].querySelectorAll('li opa-actions-button'), 'Unexpected actions buttons');
  });
});

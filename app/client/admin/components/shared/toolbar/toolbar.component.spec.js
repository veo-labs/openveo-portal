'use strict';

window.assert = chai.assert;

describe('opaToolbar', function() {
  const actionGroups = {
    left: {
      name: 'left actions',
      class: 'opa-toolbar-left-actions',
      attribute: 'opa-left-actions'
    },
    right: {
      name: 'right actions',
      class: 'opa-toolbar-right-actions',
      attribute: 'opa-right-actions'
    }
  };
  let $compile;
  let $rootScope;
  let $document;
  let $animate;
  let scope;

  // Load modules
  beforeEach(function() {
    module('opa');
    module('templates');
    module('ngAnimateMock');
  });

  // Dependencies injections
  beforeEach(inject(function(_$compile_, _$rootScope_, _$document_, _$animate_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $document = _$document_;
    $animate = _$animate_;
  }));

  // Initializes tests
  beforeEach(function() {
    scope = $rootScope.$new();
  });

  Object.keys(actionGroups).forEach((actionGroupId) => {
    const actionGroup = actionGroups[actionGroupId];

    describe(actionGroup.name, function() {

      it('should be able to add a list of icon actions', function() {
        scope.actions = [
          {
            type: 'icon',
            label: 'First icon action',
            icon: 'first_action_icon_id',
            action: chai.spy(() => {})
          },
          {
            type: 'icon',
            label: 'Second icon action label',
            icon: 'second_action_icon_id',
            action: chai.spy(() => {})
          }
        ];

        let element = angular.element(`<opa-toolbar ${actionGroup.attribute}="actions"></opa-toolbar>`);
        element = $compile(element)(scope);
        scope.$digest();

        const buttons = element[0].querySelectorAll(`.${actionGroup.class} button`);

        assert.equal(
          buttons.length,
          scope.actions.length,
          'Wrong number of buttons'
        );

        for (let i = 0; i < buttons.length; i++) {
          angular.element(buttons[i]).triggerHandler({type: 'click'});
          scope.$digest();

          scope.actions[i].action.should.have.been.called.exactly(1);

          assert.equal(
            angular.element(buttons[i].querySelector('md-icon')).text(),
            scope.actions[i].icon,
            'Unexpected button(s)'
          );
        }
      });

      it('should be able to add a list of text actions', function() {
        scope.actions = [
          {
            type: 'text',
            label: 'First text action label',
            help: 'First text action accessibility message',
            action: chai.spy(() => {})
          },
          {
            type: 'text',
            label: 'Second text action label',
            help: 'Second text action accessibility message',
            action: chai.spy(() => {})
          }
        ];

        let element = angular.element(`<opa-toolbar ${actionGroup.attribute}="actions"></opa-toolbar>`);
        element = $compile(element)(scope);
        scope.$digest();

        const buttons = element[0].querySelectorAll(`.${actionGroup.class} button`);

        assert.equal(
          buttons.length,
          scope.actions.length,
          'Wrong number of buttons'
        );

        for (let i = 0; i < buttons.length; i++) {
          angular.element(buttons[i]).triggerHandler({type: 'click'});
          scope.$digest();

          scope.actions[i].action.should.have.been.called.exactly(1);

          assert.equal(
            angular.element(buttons[i]).text(),
            scope.actions[i].label,
            'Wrong button label'
          );

          assert.equal(
            angular.element(buttons[i]).attr('aria-label'),
            scope.actions[i].help,
            'Wrong button accessibility label'
          );
        }
      });

      it('should be able to add a list action', function() {
        scope.actions = [
          {
            type: 'list',
            label: 'First list action label',
            icon: 'first_action_icon_id',
            menu: [
              {
                label: 'First sub action label',
                action: chai.spy(() => {})
              },
              {
                label: 'Second sub action label',
                action: chai.spy(() => {})
              }
            ]
          }
        ];

        let element = angular.element(`<opa-toolbar ${actionGroup.attribute}="actions"></opa-toolbar>`);
        element = $compile(element)(scope);
        scope.$digest();

        const button = element[0].querySelector(`.${actionGroup.class} button`);

        assert.equal(
          angular.element(button.querySelector('md-icon')).text(),
          scope.actions[0].icon,
          'Unexpected icon'
        );

        // Open sub menu
        angular.element(button).triggerHandler({type: 'click'});
        $animate.flush();

        const subButtons = $document[0].body.querySelectorAll('.opa-toolbar-menu button');

        assert.equal(
          subButtons.length,
          scope.actions[0].menu.length,
          'Wrong number of sub buttons'
        );

        for (let i = 0; i < subButtons.length; i++) {

          // Click on sub action
          angular.element(subButtons[i]).triggerHandler({type: 'click'});
          scope.actions[0].menu[i].action.should.have.been.called.exactly(1);

        }

        // Close menu when done
        angular.element(button).scope().$mdMenu.close(
          null,
          {
            closeAll: true,
            preserveElement: false,
            preserveScope: false
          }
        );
        $animate.flush();
      });

      it('should be able to select a list sub action', function() {
        scope.actions = [
          {
            type: 'list',
            label: 'First list action label',
            icon: 'first_action_icon_id',
            menu: [
              {
                label: 'First sub action label',
                selected: true,
                action: () => {}
              }
            ]
          }
        ];

        let element = angular.element(`<opa-toolbar ${actionGroup.attribute}="actions"></opa-toolbar>`);
        element = $compile(element)(scope);
        scope.$digest();

        const button = element[0].querySelector(`.${actionGroup.class} button`);

        // Open menu actions
        angular.element(button).triggerHandler({type: 'click'});
        $animate.flush();

        const subButton = $document[0].body.querySelector('.opa-toolbar-menu md-menu-item');

        assert.include(
          angular.element(subButton).attr('class').split(' '),
          'opa-selected',
          'Expected action to be selected'
        );

        // Close menu when done
        angular.element(button).scope().$mdMenu.close(
          null,
          {
            closeAll: true,
            preserveElement: false,
            preserveScope: false
          }
        );
        $animate.flush();
      });

      it('should be ignored if no action function specified', function() {
        scope.actions = [
          {
            type: 'icon',
            label: 'First icon action label',
            icon: 'first_action_icon_id'
          }
        ];

        let element = angular.element(`<opa-toolbar ${actionGroup.attribute}="actions"></opa-toolbar>`);
        element = $compile(element)(scope);
        scope.$digest();

        assert.isNotOk(
          element[0].querySelectorAll(`.${actionGroup.class} button`).length,
          'Unexpected button(s)'
        );
      });

      it('should not be displayed if no left nor right actions', function() {
        let element = angular.element('<opa-toolbar></opa-toolbar>');
        element = $compile(element)(scope);
        scope.$digest();

        assert.isNull(
          element[0].querySelector(`.${actionGroup.class}`),
          'Unexpected button(s)'
        );
      });

    });

  });

});

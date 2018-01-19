'use strict';

window.assert = chai.assert;

describe('opaTags', function() {
  let $compile;
  let $rootScope;
  let scope;

  // Load modules
  beforeEach(function() {
    module('opa');
    module('templates');
    module('ngAnimateMock');
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

  describe('autocomplete', function() {

    it('should be displayed when current input value is found in available tags', function() {
      scope.data = [];
      scope.availableTags = [
        {
          name: 'name',
          value: 'value'
        }
      ];

      let element = angular.element('<opa-tags ng-model="data" opa-available-tags="availableTags"></opa-tags>');
      element = $compile(element)(scope);
      scope.$digest();

      const tagsInputElement = angular.element(element.find('input')[0]);
      const controller = element.controller('opaTags');

      // Set input value to the first character of the first available tag name
      const inputNgModelController = tagsInputElement.controller('ngModel');
      inputNgModelController.$setViewValue(scope.availableTags[0].name[0]);
      scope.$apply();

      assert.equal(controller.autoCompleteValues.length, 1);
    });

    it('should not be displayed when ov-available-tags is not set', function() {
      scope.data = [];

      let element = angular.element('<opa-tags ng-model="data">></opa-tags>');
      element = $compile(element)(scope);
      scope.$digest();

      const tagsInputElement = angular.element(element.find('input')[0]);
      const controller = element.controller('opaTags');

      // Set input value to a character
      const inputNgModelController = tagsInputElement.controller('ngModel');
      inputNgModelController.$setViewValue('n');
      scope.$apply();

      assert.equal(controller.autoCompleteValues.length, 0);
    });

    it('should be case insensitive', function() {
      scope.data = [];
      scope.availableTags = [
        {
          name: 'name',
          value: 'value'
        }
      ];

      let element = angular.element('<opa-tags ng-model="data" opa-available-tags="availableTags"></opa-tags>');
      element = $compile(element)(scope);
      scope.$digest();

      const tagsInputElement = angular.element(element.find('input')[0]);
      const controller = element.controller('opaTags');

      // Set input value to the first letter of the first available tag name in upper case
      const inputNgModelController = tagsInputElement.controller('ngModel');
      inputNgModelController.$setViewValue(scope.availableTags[0].name[0].toUpperCase());
      scope.$apply();

      assert.equal(controller.autoCompleteValues.length, 1);
    });

    it('should not be displayed if input is empty', function() {
      scope.data = [];
      scope.availableTags = [
        {
          name: 'name',
          value: 'value'
        }
      ];

      let element = angular.element('<opa-tags ng-model="data" opa-available-tags="options"></opa-tags>');
      element = $compile(element)(scope);
      scope.$digest();

      const controller = element.controller('opaTags');
      assert.equal(controller.autoCompleteValues.length, 0);
    });

  });

  it('should be able to add a tag using the "enter" key', function() {
    const expectedValue = 'value';
    scope.data = [];

    let element = angular.element('<opa-tags ng-model="data"></opa-tags>');
    element = $compile(element)(scope);
    scope.$digest();

    const tagsInputElement = angular.element(element.find('input')[0]);

    tagsInputElement.controller('ngModel').$setViewValue(expectedValue);
    tagsInputElement.triggerHandler({type: 'keydown', keyCode: 13});
    scope.$apply();

    assert.equal(scope.data[0], expectedValue);
  });

  it('should not be able to add an empty tag', function() {
    scope.data = [];

    let element = angular.element('<opa-tags ng-model="data"></opa-tags>');
    element = $compile(element)(scope);
    scope.$digest();

    let tagsInputElement = angular.element(element.find('input')[0]);
    tagsInputElement.triggerHandler({type: 'keydown', keyCode: 13});
    scope.$apply();

    assert.equal(scope.data.length, 0);
  });

  it('should not be able to add an already entered tag', function() {
    const expectedValue = 'value';
    scope.data = [];

    let element = angular.element('<opa-tags ng-model="data"></opa-tags>');
    element = $compile(element)(scope);
    scope.$digest();

    const tagsInputElement = angular.element(element.find('input')[0]);

    tagsInputElement.controller('ngModel').$setViewValue(expectedValue);
    tagsInputElement.triggerHandler({type: 'keydown', keyCode: 13});

    tagsInputElement.controller('ngModel').$setViewValue(expectedValue);
    tagsInputElement.triggerHandler({type: 'keydown', keyCode: 13});

    scope.$apply();

    assert.equal(scope.data.length, 1);
  });

  it('should not be able to add an empty tag when using predefined tags', function() {
    scope.data = [];
    scope.availableTags = [
      {
        name: 'name',
        value: 'value'
      }
    ];

    let element = angular.element('<opa-tags ng-model="data" opa-available-tags="availableTags"></opa-tags>');
    element = $compile(element)(scope);
    scope.$digest();

    const tagsInputElement = angular.element(element.find('input')[0]);

    tagsInputElement.triggerHandler({type: 'keydown', keyCode: 13});
    scope.$apply();

    assert.equal(scope.data.length, 0);
  });

  it('should be able to add a tag present in available tags when using predefined tags', function() {
    scope.data = [];
    scope.availableTags = [
      {
        name: 'name',
        value: 'value'
      }
    ];

    let element = angular.element('<opa-tags ng-model="data" opa-available-tags="availableTags"></opa-tags>');
    element = $compile(element)(scope);
    scope.$digest();

    const tagsInputElement = angular.element(element.find('input')[0]);

    tagsInputElement.controller('ngModel').$setViewValue(scope.availableTags[0].name);
    tagsInputElement.triggerHandler({type: 'keydown', keyCode: 13});
    scope.$apply();

    assert.equal(scope.data[0], scope.availableTags[0].value);
  });

  it('should not be able to add a tag not present in available tags when using available tags', function() {
    scope.data = [];
    scope.availableTags = [
      {
        name: 'name',
        value: 'value'
      }
    ];

    let element = angular.element('<opa-tags ng-model="data" opa-available-tags="availableTags"></opa-tags>');
    element = $compile(element)(scope);
    scope.$digest();

    const tagsInputElement = angular.element(element.find('input')[0]);

    tagsInputElement.controller('ngModel').$setViewValue('Tags not in options');
    tagsInputElement.triggerHandler({type: 'keydown', keyCode: 13});
    scope.$apply();

    assert.equal(scope.data.length, 0);
  });

  it('should not be able to add an already entered tag when using available tags', function() {
    scope.data = [];
    scope.availableTags = [
      {
        name: 'name',
        value: 'value'
      }
    ];

    let element = angular.element('<opa-tags ng-model="data" opa-available-tags="availableTags"></opa-tags>');
    element = $compile(element)(scope);
    scope.$digest();

    const tagsInputElement = angular.element(element.find('input')[0]);

    tagsInputElement.controller('ngModel').$setViewValue(scope.availableTags[0].name);
    tagsInputElement.triggerHandler({type: 'keydown', keyCode: 13});

    tagsInputElement.controller('ngModel').$setViewValue(scope.availableTags[0].name);
    tagsInputElement.triggerHandler({type: 'keydown', keyCode: 13});

    scope.$apply();

    assert.equal(scope.data.length, 1);
  });

  it('should empty the autocomplete after tag has been added when using available tags', function() {
    scope.data = [];
    scope.availableTags = [
      {
        name: 'name',
        value: 'value'
      }
    ];

    let element = angular.element('<opa-tags ng-model="data" opa-available-tags="availableTags"></opa-tags>');
    element = $compile(element)(scope);
    scope.$digest();

    const tagsInputElement = angular.element(element.find('input')[0]);
    const controller = element.controller('opaTags');

    tagsInputElement.controller('ngModel').$setViewValue(scope.availableTags[0].name);
    tagsInputElement.triggerHandler({type: 'keydown', keyCode: 13});

    scope.$apply();

    assert.equal(controller.autoCompleteValues.length, 0);
  });

  it('should empty the input after adding a tag', function() {
    scope.data = [];

    let element = angular.element('<opa-tags ng-model="data"></opa-tags>');
    element = $compile(element)(scope);
    scope.$digest();

    const tagsInputElement = angular.element(element.find('input')[0]);

    tagsInputElement.controller('ngModel').$setViewValue('value');
    tagsInputElement.triggerHandler({type: 'keydown', keyCode: 13});
    scope.$apply();

    assert.isEmpty(tagsInputElement.val());
  });

  it('should not empty the input if adding a tag which already exists', function() {
    const expectedValue = 'value';
    scope.data = [];

    let element = angular.element('<opa-tags ng-model="data"></opa-tags>');
    element = $compile(element)(scope);
    scope.$digest();

    const controller = element.controller('opaTags');
    const tagsInputElement = angular.element(element.find('input')[0]);

    tagsInputElement.controller('ngModel').$setViewValue(expectedValue);
    tagsInputElement.triggerHandler({type: 'keydown', keyCode: 13});

    tagsInputElement.controller('ngModel').$setViewValue(expectedValue);
    tagsInputElement.triggerHandler({type: 'keydown', keyCode: 13});
    scope.$apply();

    assert.equal(controller.tag, expectedValue);
  });

  it('should be able to remove a tag using the close button', function() {
    scope.data = ['value'];

    let element = angular.element('<opa-tags ng-model="data"></opa-tags>');
    element = $compile(element)(scope);
    scope.$digest();

    const removeLinkElement = angular.element(element.find('button')[0]);

    removeLinkElement.triggerHandler('click', 0);
    scope.$apply();

    assert.equal(scope.data.length, 0);
  });

  it('should be considered empty if there is no value', function() {
    let element = angular.element('<opa-tags ng-model="data"></opa-tags>');
    element = $compile(element)(scope);
    scope.$digest();

    const ngModelController = element.controller('ngModel');

    assert.ok(ngModelController.$isEmpty());
    assert.ok(ngModelController.$isEmpty([]));
  });

  it('should always set parent mdInputContainer as valid if not required', function() {
    let element = angular.element(`
      <md-input-container>
        <opa-tags ng-model="data"></opa-tags>
      </md-input-container>
    `);
    element = $compile(element)(scope);
    scope.$digest();

    assert.isNotOk(element.hasClass('md-input-invalid'), 'Expected parent mdInputContainer to be valid');

    const inputNgModelController = angular.element(element.find('input')[0]).controller('ngModel');
    inputNgModelController.$setTouched();
    inputNgModelController.$validate();
    scope.$digest();

    assert.isNotOk(element.hasClass('md-input-invalid'), 'Expected parent mdInputContainer to be valid');
  });

  it('should set parent mdInputContainer as invalid if empty while required', function() {
    scope.required = true;
    let element = angular.element(`
      <md-input-container>
        <opa-tags ng-model="data" ng-required="required"></opa-tags>
      </md-input-container>
    `);
    element = $compile(element)(scope);
    scope.$digest();

    const inputNgModelController = angular.element(element.find('input')[0]).controller('ngModel');
    inputNgModelController.$setTouched();
    inputNgModelController.$validate();
    scope.$digest();

    assert.isOk(element.hasClass('md-input-invalid'), 'Expected parent mdInputContainer to be invalid');
  });

  it('should set parent mdInputContainer as valid by default even if required', function() {
    scope.required = true;
    let element = angular.element(`
      <md-input-container>
        <opa-tags ng-model="data" ng-required="required"></opa-tags>
      </md-input-container>
    `);
    element = $compile(element)(scope);
    scope.$digest();

    assert.isNotOk(element.hasClass('md-input-invalid'), 'Expected parent mdInputContainer to be valid');
  });

  it('should set parent mdInputContainer as invalid if opa-tags becomes required', function() {
    scope.required = false;
    let element = angular.element(`
      <md-input-container>
        <opa-tags ng-model="data" ng-required="required"></opa-tags>
      </md-input-container>
    `);
    element = $compile(element)(scope);
    scope.$digest();

    const inputNgModelController = angular.element(element.find('input')[0]).controller('ngModel');
    inputNgModelController.$setTouched();
    inputNgModelController.$validate();
    scope.$digest();

    scope.required = true;
    scope.$digest();

    assert.isOk(element.hasClass('md-input-invalid'), 'Expected parent mdInputContainer to be invalid');
  });

  it('should add class "md-required" to mdInputContainer associated label if opa-tags is required', function() {
    scope.required = true;
    let element = angular.element(`
      <md-input-container>
        <label>Label</label>
        <opa-tags ng-model="data" ng-required="required"></opa-tags>
      </md-input-container>
    `);
    element = $compile(element)(scope);
    scope.$digest();

    assert.isOk(element.find('label').hasClass('md-required'), 'Expected associated label to be required');
  });

});

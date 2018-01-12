'use strict';

window.assert = chai.assert;

describe('OpaInfoButtonController', function() {
  let $componentController;
  let $rootScope;
  let $filter;
  let $sce;

  // Load modules
  beforeEach(function() {
    module('opa');
  });

  // Dependencies injections
  beforeEach(inject(function(_$componentController_, _$rootScope_, _$sce_, _$filter_) {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    $sce = _$sce_;
    $filter = _$filter_;
  }));

  it('should set default label if not specified', function() {
    const ctrl = $componentController('opaInfoButton');
    ctrl.$onChanges({
      opaLabel: {}
    });
    $rootScope.$digest();

    const expectedDefaultLabel = $sce.getTrustedHtml($filter('opaTranslate')('INFO.INFO_BUTTON_DESCRIPTION'));
    const expectedLabel = 'Expected label';
    assert.equal(ctrl.opaLabel, expectedDefaultLabel, 'Wrong label');

    ctrl.$onChanges({
      opaLabel: {
        currentValue: expectedLabel
      }
    });

    $rootScope.$digest();
    assert.equal(ctrl.opaLabel, expectedLabel, 'Wrong label');
  });

});

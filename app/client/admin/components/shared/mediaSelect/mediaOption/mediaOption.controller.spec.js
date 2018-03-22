'use strict';

window.assert = chai.assert;

describe('OpaMediaOptionController', function() {
  let $componentController;

  // Load modules
  beforeEach(function() {
    module('opa');
  });

  // Dependencies injections
  beforeEach(inject(function(_$compile_, _$rootScope_, _$componentController_) {
    $componentController = _$componentController_;
  }));

  describe('updateSelect', function() {
    const bindings = {
      opaChecked: undefined,
      opaMedia: {},
      selectCtrl: {
        check: (media) => {},
        uncheck: (media) => {}
      }
    };

    it('should call OpaMediaSelectController.check when checkbox is checked', function() {
      bindings.opaChecked = true;
      const ctrl = $componentController('opaMediaOption', {}, bindings);
      const spy = chai.spy.on(bindings.selectCtrl, 'check');

      ctrl.$onChanges({opaChecked: {currentValue: bindings.opaChecked, previousValue: undefined}});
      ctrl.updateSelect();

      spy.should.have.been.called.exactly(1);
    });

    it('should call OpaMediaSelectController.uncheck when checkbox is unchecked', function() {
      bindings.opaChecked = false;
      const ctrl = $componentController('opaMediaOption', {}, bindings);
      const spy = chai.spy.on(bindings.selectCtrl, 'uncheck');

      ctrl.$onChanges({opaChecked: {currentValue: bindings.opaChecked, previousValue: undefined}});
      ctrl.updateSelect();

      spy.should.have.been.called.exactly(1);
    });

  });

});

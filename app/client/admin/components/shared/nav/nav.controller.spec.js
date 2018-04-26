'use strict';

window.assert = chai.assert;

describe('OpaNavController', function() {
  let $componentController;

  // Load modules
  beforeEach(function() {
    module('opa');
  });

  // Dependencies injections
  beforeEach(inject(function(_$componentController_) {
    $componentController = _$componentController_;
  }));

  describe('handleItemKeypress', function() {

    it('should execute action associated to the action element when "enter" key is hit', function() {
      const ctrl = $componentController('opaNav');
      const expectedItem = {
        action: chai.spy(() => {})
      };

      ctrl.handleItemKeypress({keyCode: 13}, expectedItem);

      expectedItem.action.should.have.been.called.exactly(1);
    });

    it('should not execute action when the pressed key is not "enter"', function() {
      const ctrl = $componentController('opaNav');
      const expectedItem = {
        action: chai.spy(() => {})
      };

      ctrl.handleItemKeypress({keyCode: 42}, expectedItem);

      expectedItem.action.should.have.been.called.exactly(0);
    });

  });

});

'use strict';

window.assert = chai.assert;

describe('OpaDashboardController', function() {
  let $componentController;
  let $rootScope;

  // Load modules
  beforeEach(function() {
    module('opa');
  });

  // Dependencies injections
  beforeEach(inject(function(_$componentController_, _$rootScope_) {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
  }));

  it('should emit an "opaViewLoaded" event when loaded', function() {
    const handleEvent = chai.spy(() => {});
    $rootScope.$on('opaViewLoaded', handleEvent);

    const ctrl = $componentController('opaDashboard');
    ctrl.$onInit();

    handleEvent.should.have.been.called.exactly(1);
  });

});

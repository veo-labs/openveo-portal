'use strict';

window.assert = chai.assert;

describe('OpaSettingsController', function() {
  let $componentController;
  let $rootScope;
  let $q;
  let opaSettingsFactory;
  let opaGroupsFactory;
  let opaNotificationFactory;

  // Load modules
  beforeEach(function() {
    module('opa', ($provide) => {
      opaSettingsFactory = {
        getSetting: () => $q.resolve({})
      };
      opaGroupsFactory = {
        getGroups: () => $q.resolve({})
      };
      opaNotificationFactory = {};
    });
  });

  // Dependencies injections
  beforeEach(inject(function(_$componentController_, _$rootScope_, _$q_) {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  it('should emit an "opaViewLoaded" event when loaded', function() {
    const handleEvent = chai.spy(() => {});
    $rootScope.$on('opaViewLoaded', handleEvent);

    const ctrl = $componentController('opaSettings', {
      $element: {},
      opaSettingsFactory,
      opaGroupsFactory,
      opaNotificationFactory
    });
    ctrl.$onInit();
    $rootScope.$digest();

    handleEvent.should.have.been.called.exactly(1);
  });

  it('should emit an "opaViewLoaded" event and set error if loading settings failed', function() {
    const handleEvent = chai.spy(() => {});
    $rootScope.$on('opaViewLoaded', handleEvent);

    opaSettingsFactory.getSetting = () => $q.reject();

    const ctrl = $componentController('opaSettings', {
      $element: {},
      opaSettingsFactory,
      opaGroupsFactory,
      opaNotificationFactory
    });
    ctrl.$onInit();
    $rootScope.$digest();

    handleEvent.should.have.been.called.exactly(1);
    assert.isOk(ctrl.isError, 'Expected component to be on error');
  });

  it('should retrieve live settings and groups an initialization', function() {
    const expectedSettings = {
      data: {
        entity: {
          value: 'Expected settings'
        }
      }
    };
    const expectedGroups = {
      data: {
        entities: [{
          name: 'Group name',
          id: 'group-id'
        }]
      }
    };
    opaSettingsFactory.getSetting = () => $q.resolve(expectedSettings);
    opaGroupsFactory.getGroups = () => $q.resolve(expectedGroups);

    const ctrl = $componentController('opaSettings', {
      $element: {},
      opaSettingsFactory,
      opaGroupsFactory,
      opaNotificationFactory
    });
    ctrl.$onInit();
    $rootScope.$digest();

    assert.equal(ctrl.liveSettings, expectedSettings.data.entity.value, 'Wrong settings');
    assert.equal(ctrl.availableGroups.length, expectedGroups.data.entities.length, 'Wrong groups');
    assert.equal(ctrl.availableGroups[0].name, expectedGroups.data.entities[0].name, 'Wrong group name');
    assert.equal(ctrl.availableGroups[0].value, expectedGroups.data.entities[0].id, 'Wrong group id');
  });

});

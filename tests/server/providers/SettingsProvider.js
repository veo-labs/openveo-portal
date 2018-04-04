'use strict';

const path = require('path');
const assert = require('chai').assert;
const mock = require('mock-require');
const api = require('@openveo/api');

describe('SettingsProvider', function() {
  let EntityProvider;
  let SettingsProvider;
  let openVeoApi;
  let storage;
  let provider;
  let expectedSettings;
  const expectedLocation = 'location';

  // Initiates mocks
  beforeEach(function() {
    storage = {};

    EntityProvider = function() {
      this.storage = storage;
      this.location = expectedLocation;
    };
    EntityProvider.prototype.get = function(filter, fields, limit, page, sort, callback) {
      callback(null, expectedSettings, {
        limit,
        page,
        pages: Math.ceil(expectedSettings.length / limit),
        size: expectedSettings.length
      });
    };
    EntityProvider.prototype.executeCallback = function() {
      const args = Array.prototype.slice.call(arguments);
      const callback = args.shift();
      if (callback) return callback.apply(null, args);
    };

    openVeoApi = {
      providers: {
        EntityProvider: EntityProvider
      },
      storages: {
        ResourceFilter: api.storages.ResourceFilter
      }
    };

    mock('@openveo/api', openVeoApi);
  });

  // Initiates tests
  beforeEach(function() {
    SettingsProvider = mock.reRequire(path.join(process.root, 'app/server/providers/SettingsProvider.js'));
    provider = new SettingsProvider(storage, expectedLocation);
  });

  // Stop mocks
  afterEach(function() {
    mock.stopAll();
  });

  describe('add', function() {

    it('should add / update settings', function(done) {
      const expectedId = '42';
      const expectedExistingId = '43';
      const expectedExistingSettings = [];
      const expectedSettings = [];

      expectedSettings.push(
        {
          id: 'id' + expectedId,
          value: 'Value ' + expectedId
        }
      );

      expectedExistingSettings.push(
        {
          id: 'id' + expectedExistingId,
          value: 'Value ' + expectedExistingId
        }
      );

      EntityProvider.prototype.get = function(filter, fields, limit, page, sort, callback) {
        callback(null, expectedExistingSettings);
      };

      EntityProvider.prototype.add = function(resources, callback) {
        assert.deepEqual(resources[0], expectedSettings[0]);
        callback(null, expectedSettings.length, expectedSettings);
      };

      EntityProvider.prototype.updateOne = function(filter, data, callback) {
        assert.equal(
          filter.getComparisonOperation(api.storages.ResourceFilter.OPERATORS.EQUAL, 'id').value,
          expectedExistingSettings[0].id,
          'Wrong id'
        );
        assert.equal(data.value, expectedExistingSettings[0].value, 'Wrong value');
        callback(null, 1);
      };

      provider.add(
        expectedSettings.concat(expectedExistingSettings),
        (error, total, settings) => {
          assert.isNull(error, 'Unexpected error');
          assert.deepEqual(settings, expectedSettings.concat(expectedExistingSettings), 'Wrong settings');
          assert.equal(
            total,
            expectedSettings.length + expectedExistingSettings.length,
            'Wrong number of inserted / updated settings'
          );
          done();
        }
      );
    });

    it('should execute callback with an error if setting id is not specified', function(done) {
      expectedSettings = [
        {
          value: 'Value 42'
        }
      ];

      EntityProvider.prototype.add = function(settings, callback) {
        assert.ok(false, 'Unexpected add');
      };

      EntityProvider.prototype.updateOne = function(filter, data, callback) {
        assert.ok(false, 'Unexpected update');
      };

      provider.add(
        expectedSettings,
        (error, total, settings) => {
          assert.instanceOf(error, TypeError, 'Wrong error');
          assert.isUndefined(total, 'Unexpected total');
          assert.isUndefined(settings, 'Unexpected settings');
          done();
        }
      );
    });

    it('should execute callback with an error if getting settings failed', function(done) {
      const expectedError = new Error('Something went wrong');
      expectedSettings = [
        {
          id: '42',
          value: 'Value 42'
        }
      ];

      EntityProvider.prototype.get = function(filter, fields, limit, page, sort, callback) {
        callback(expectedError);
      };

      EntityProvider.prototype.add = function(settings, callback) {
        assert.ok(false, 'Unexpected add');
      };

      EntityProvider.prototype.updateOne = function(filter, data, callback) {
        assert.ok(false, 'Unexpected update');
      };

      provider.add(
        expectedSettings,
        (error, total, settings) => {
          assert.strictEqual(error, expectedError, 'Wrong error');
          done();
        }
      );
    });

    it('should execute callback with an error if adding settings failed', function(done) {
      const expectedError = new Error('Something went wrong');
      expectedSettings = [
        {
          id: '42',
          value: 'Value 42'
        }
      ];

      EntityProvider.prototype.get = function(filter, fields, limit, page, sort, callback) {
        callback(null, []);
      };

      EntityProvider.prototype.add = function(settings, callback) {
        callback(expectedError);
      };

      provider.add(
        expectedSettings,
        (error, total, settings) => {
          assert.strictEqual(error, expectedError, 'Wrong error');
          done();
        }
      );
    });

    it('should execute callback with an error if updating settings failed', function(done) {
      const expectedError = new Error('Something went wrong');
      const expectedId = '42';
      expectedSettings = [
        {
          id: expectedId,
          value: 'Value 42'
        }
      ];

      EntityProvider.prototype.get = function(filter, fields, limit, page, sort, callback) {
        callback(null, [
          {
            id: expectedId
          }
        ]);
      };

      EntityProvider.prototype.updateOne = function(filter, data, callback) {
        callback(expectedError);
      };

      provider.add(
        expectedSettings,
        (error, total, settings) => {
          assert.strictEqual(error, expectedError, 'Wrong error');
          done();
        }
      );
    });

  });

  describe('updateOne', function() {

    it('should update a setting', function(done) {
      const expectedFilter = {};
      const expectedModifications = {value: 'New value'};
      const expectedTotal = 1;

      EntityProvider.prototype.updateOne = function(filter, modifications, callback) {
        assert.deepEqual(modifications, expectedModifications, 'Wrong modifications');
        callback(null, expectedTotal);
      };

      provider.updateOne(
        expectedFilter,
        expectedModifications,
        (error, total) => {
          assert.isNull(error, 'Unexpected error');
          assert.equal(total, expectedTotal, 'Wrong total');
          done();
        }
      );
    });

    it('should update only name and scopes', function(done) {
      const expectedFilter = {};
      const expectedModifications = {
        value: 'New value',
        unexpectedProperty: 'Value'
      };
      const expectedTotal = 1;

      EntityProvider.prototype.updateOne = function(filter, modifications, callback) {
        assert.strictEqual(filter, expectedFilter, 'Wrong filter');
        assert.notProperty(modifications, 'unexpectedProperty', 'Unexpected property');
        callback(null, expectedTotal);
      };

      provider.updateOne(
        expectedFilter,
        expectedModifications,
        (error, total) => {
          assert.isNull(error, 'Unexpected error');
          assert.equal(total, expectedTotal, 'Wrong total');
          done();
        }
      );
    });
  });

});

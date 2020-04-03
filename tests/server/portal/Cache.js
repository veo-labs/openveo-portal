'use strict';

const chai = require('chai');
const spies = require('chai-spies');
const Cache = process.require('app/server/Cache.js');

const assert = chai.assert;
chai.should();
chai.use(spies);

describe('Cache', function() {
  let cache;

  // Initiates tests
  beforeEach(function() {
    cache = new Cache();
  });

  describe('del', function() {

    it('should be able to delete a simple key', function() {
      const expectedKeyId = 'cache-key';
      cache.set(expectedKeyId, 'value');

      assert.equal(cache.del(expectedKeyId), 1, 'Wrong number of deleted entries');
      assert.isUndefined(cache.get(expectedKeyId), 'Expected entry to be removed');
    });

    it('should be able to delete several keys', function() {
      const keys = ['key1', 'key2'];

      for (let key of keys)
        cache.set(key, `${key}-value`);

      assert.equal(cache.del(keys), keys.length, 'Wrong number of deleted entries');

      for (let key of keys)
        assert.isUndefined(cache.get(key), `Expected ${key} to be removed`);
    });

    it('should be able to delete several keys using a wildcard', function() {
      const prefix = 'key';
      const keys = [`${prefix}1`, `${prefix}2`];

      for (let key of keys)
        cache.set(key, `${key}-value`);

      assert.equal(cache.del(`${prefix}*`), keys.length, 'Wrong number of deleted entries');

      for (let key of keys)
        assert.isUndefined(cache.get(key), `Expected ${key} to be removed`);
    });

  });

  describe('get', function() {

    it('should be able to get a value from cache', function() {
      const expectedKeyId = 'cache-key';
      const expectedValue = 'value';

      cache.set(expectedKeyId, expectedValue);

      assert.equal(cache.get(expectedKeyId), expectedValue, 'Wrong value');
    });

    it('should be able to get several values using wildcard', function() {
      const prefix = 'key';
      const entries = {
        [`${prefix}1`]: 'value1',
        [`${prefix}2`]: 'value2'
      };
      for (let key in entries)
        cache.set(key, entries[key]);

      assert.deepEqual(cache.get(`${prefix}*`), Object.values(entries), 'Wrong values');
    });

    it('should return undefined if value is not found', function() {
      assert.isUndefined(cache.get('Unknown'), 'Unexpected value');
    });

    it('should throw an error if key is not a string nor a number', function() {
      const invalidKeys = [[], {}, true];

      for (let invalidKey of invalidKeys) {
        assert.throws(() => {
          cache.get(invalidKey, true);
        });
      }
    });

  });

  describe('mget', function() {

    it('should be able to get several values', function() {
      const entries = {
        ['key1']: 'value1',
        ['key2']: 'value2'
      };

      for (let key in entries)
        cache.set(key, entries[key]);

      assert.deepEqual(cache.mget(Object.keys(entries)), entries, 'Wrong values');
    });

    it('should be able to get several values using wildcard', function() {
      const prefix = 'key';
      const entries = {
        [`${prefix}1`]: 'value1',
        [`${prefix}2`]: 'value2'
      };

      for (let key in entries)
        cache.set(key, entries[key]);

      assert.deepEqual(cache.mget([`${prefix}*`]), entries, 'Wrong values');
    });

  });

});

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

      const onDelete = chai.spy((error, total) => {
        assert.isNull(error);
        assert.equal(total, 1, 'Wrong number of deleted entries');
      });

      assert.equal(cache.del(expectedKeyId, onDelete), 1, 'Wrong returned number of deleted entries');
      assert.isUndefined(cache.get(expectedKeyId), 'Expected entry to be removed');
      onDelete.should.have.been.called.exactly(1);
    });

    it('should be able to delete several keys', function() {
      const keys = ['key1', 'key2'];

      for (let key of keys)
        cache.set(key, `${key}-value`);

      const onDelete = chai.spy((error, total) => {
        assert.isNull(error);
        assert.equal(total, keys.length, 'Wrong number of deleted entries');
      });

      assert.equal(cache.del(keys, onDelete), keys.length, 'Wrong returned number of deleted entries');

      for (let key of keys)
        assert.isUndefined(cache.get(key), `Expected ${key} to be removed`);

      onDelete.should.have.been.called.exactly(1);
    });

    it('should be able to delete several keys using a wildcard', function() {
      const prefix = 'key';
      const keys = [`${prefix}1`, `${prefix}2`];

      for (let key of keys)
        cache.set(key, `${key}-value`);

      const onDelete = chai.spy((error, total) => {
        assert.isNull(error, 'Unexpected error');
        assert.equal(total, keys.length, 'Wrong number of deleted entries');
      });

      assert.equal(cache.del(`${prefix}*`, onDelete), keys.length, 'Wrong returned number of deleted entries');

      for (let key of keys)
        assert.isUndefined(cache.get(key), `Expected ${key} to be removed`);

      onDelete.should.have.been.called.exactly(1);
    });

  });

  describe('get', function() {

    it('should be able to get a value from cache', function() {
      const expectedKeyId = 'cache-key';
      const expectedValue = 'value';
      cache.set(expectedKeyId, 'value');

      const onGet = chai.spy((error, value) => {
        assert.isNull(error, 'Unexpected error');
        assert.equal(value, expectedValue, 'Wrong value');
      });

      assert.equal(cache.get(expectedKeyId, onGet), expectedValue, 'Wrong returned value');
      onGet.should.have.been.called.exactly(1);
    });

    it('should be able to get several values using wildcard', function() {
      const prefix = 'key';
      const entries = {
        [`${prefix}1`]: 'value1',
        [`${prefix}2`]: 'value2'
      };
      for (let key in entries)
        cache.set(key, entries[key]);

      const onGet = chai.spy((error, values) => {
        assert.isNull(error, 'Unexpected error');
        assert.deepEqual(values, Object.values(entries), 'Wrong values');
      });

      assert.deepEqual(cache.get(`${prefix}*`, onGet), Object.values(entries), 'Wrong returned values');
      onGet.should.have.been.called.exactly(1);
    });

    it('should return undefined if value is not found', function() {
      const onGet = chai.spy((error, value) => {
        assert.isNull(error, 'Unexpected error');
        assert.isUndefined(value, 'Unexpected value');
      });

      assert.isUndefined(cache.get('Unknown', onGet), 'Unexpected value');
    });

    it('should throw an error if value is not found and errors activated', function() {
      assert.throws(() => {
        cache.get('Unknown', true);
      });
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

      const onGet = chai.spy((error, values) => {
        assert.isNull(error, 'Unexpected error');
        assert.deepEqual(values, entries, 'Wrong values');
      });

      assert.deepEqual(cache.mget(Object.keys(entries), onGet), entries, 'Wrong returned values');
      onGet.should.have.been.called.exactly(1);
    });

    it('should be able to get several values using wildcard', function() {
      const prefix = 'key';
      const entries = {
        [`${prefix}1`]: 'value1',
        [`${prefix}2`]: 'value2'
      };

      for (let key in entries)
        cache.set(key, entries[key]);

      const onGet = chai.spy((error, values) => {
        assert.isNull(error, 'Unexpected error');
        assert.deepEqual(values, entries, 'Wrong values');
      });

      assert.deepEqual(cache.mget([`${prefix}*`], onGet), entries, 'Wrong returned values');
      onGet.should.have.been.called.exactly(1);
    });

  });

});

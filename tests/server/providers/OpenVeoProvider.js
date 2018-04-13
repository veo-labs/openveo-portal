'use strict';

const path = require('path');
const chai = require('chai');
const spies = require('chai-spies');
const mock = require('mock-require');
const api = require('@openveo/api');
const ResourceFilter = api.storages.ResourceFilter;

const assert = chai.assert;
chai.should();
chai.use(spies);

describe('OpenVeoProvider', function() {
  let Cache;
  let OpenVeoProvider;
  let Provider;
  let storage;
  let provider;
  let cache;
  let openVeoApi;
  let expectedDocuments;

  // Initiates mocks
  beforeEach(function() {
    storage = {
      buildFilter: () => '',
      getOne: chai.spy((location, filter, fields, callback) => {
        callback(null, expectedDocuments[0]);
      }),
      get: chai.spy((location, filter, fields, limit, page, sort, callback) => {
        callback(null, expectedDocuments, {});
      }),
      updateOne: chai.spy((location, filter, modifications, callback) => {
        callback(null, 1);
      })
    };
    Cache = function(options) {
      this.options = options;
    };
    Cache.prototype.on = chai.spy(function(event, functionToExecute) {});
    Cache.prototype.del = chai.spy(function(key, callback) {});
    Cache.prototype.set = chai.spy(function(key, value) {});
    Cache.prototype.get = chai.spy(function(key, callback, errorOnMissing) {
      return;
    });

    cache = new Cache();

    Provider = function() {
      this.storage = storage;
    };
    Provider.prototype.executeCallback = function() {
      const args = Array.prototype.slice.call(arguments);
      const callback = args.shift();
      if (callback) return callback.apply(null, args);
    };

    openVeoApi = {
      providers: {
        Provider
      },
      storages: {
        ResourceFilter
      }
    };

    mock(path.join(process.root, 'app/server/Cache.js'), Cache);
    mock('@openveo/api', openVeoApi);
  });

  // Initiates tests
  beforeEach(function() {
    OpenVeoProvider = mock.reRequire(path.join(process.root, 'app/server/providers/OpenVeoProvider.js'));
    provider = new OpenVeoProvider(storage, cache);
  });

  // Stop mocks
  afterEach(function() {
    mock.stopAll();
  });

  it('should delete cache entries when they expire', function() {
    const expectedKey = 'key';
    let onCacheExpired;
    cache = new Cache();

    cache.on = chai.spy((event, callback) => {
      assert.equal(event, 'expired', 'Wrong event');
      onCacheExpired = callback;
    });

    cache.del = chai.spy((key, callback) => {
      assert.equal(key, expectedKey, 'Wrong key');
    });

    provider = new OpenVeoProvider(storage, cache);
    onCacheExpired(expectedKey);

    cache.on.should.have.been.called.exactly(1);
    cache.del.should.have.been.called.exactly(1);
  });

  it('should create a cache with TTL to 10 seconds if no cache specified', function() {
    provider = new OpenVeoProvider(storage);

    assert.instanceOf(provider.cache, Cache, 'Wrong cache');
    assert.equal(provider.cache.options.stdTTL, 10, 'Wrong TTL');
    assert.equal(provider.cache.options.checkperiod, 10, 'Wrong check period');
  });

  describe('getOne', function() {

    it('should get a document from storage', function(done) {
      const expectedLocation = 'location';
      const expectedId = '42';
      const expectedTtl = 60;
      const expectedFields = {
        include: ['field1'],
        exclude: ['field2']
      };
      expectedDocuments = [
        {
          id: '42'
        }
      ];

      cache.set = chai.spy((key, value, ttl) => {
        assert.strictEqual(value, expectedDocuments[0], 'Wrong document');
        assert.strictEqual(ttl, expectedTtl, 'Wrong TTL');
      });

      storage.getOne = chai.spy((location, filter, fields, callback) => {
        assert.equal(location, expectedLocation, 'Wrong location');
        assert.equal(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.EQUAL, 'id').value,
          expectedId,
          'Wrong id'
        );
        assert.deepEqual(fields, expectedFields, 'Wrong fields');
        callback(null, expectedDocuments[0]);
      });

      provider.getOne(expectedLocation, expectedId, expectedFields, expectedTtl, (error, document) => {
        assert.isNull(error, 'Unexpected error');
        assert.strictEqual(document, expectedDocuments[0], 'Wrong document');
        storage.getOne.should.have.been.called.exactly(1);
        cache.set.should.have.been.called.exactly(1);
        done();
      });
    });

    it('should get results from cache when already fetched', function(done) {
      const expectedLocation = 'location';
      const expectedId = '42';
      const expectedFields = {
        include: ['field1'],
        exclude: ['field2']
      };
      expectedDocuments = [
        {
          id: '42'
        }
      ];

      provider.cache.get = chai.spy((key, callback, errorOnMissing) => {
        return expectedDocuments[0];
      });

      provider.getOne(expectedLocation, expectedId, expectedFields, 60, (error, document) => {
        assert.isNull(error, 'Unexpected error');
        assert.strictEqual(document, expectedDocuments[0], 'Wrong document');
        provider.cache.get.should.have.been.called.exactly(1);
        storage.getOne.should.have.been.called.exactly(0);
        done();
      });
    });

    it('should execute callback with an error if getting document failed', function(done) {
      const expectedError = new Error('Something went wrong');
      expectedDocuments = [
        {
          id: '42'
        }
      ];

      storage.getOne = chai.spy((location, filter, fields, callback) => {
        callback(expectedError);
      });

      provider.getOne('location', '42', null, 60, (error, document) => {
        assert.strictEqual(error, expectedError, 'Wrong error');
        storage.getOne.should.have.been.called.exactly(1);
        cache.set.should.have.been.called.exactly(0);
        done();
      });
    });

  });

  describe('get', function() {

    it('should get documents from storage', function(done) {
      const expectedLocation = 'location';
      const expectedFilter = new ResourceFilter();
      const expectedTtl = 60;
      const expectedPage = 42;
      const expectedLimit = 10;
      const expectedSort = {id: 'desc'};
      const expectedFields = {
        include: ['field1'],
        exclude: ['field2']
      };
      const expectedPagination = {};
      expectedDocuments = [
        {
          id: '42'
        }
      ];

      cache.set = chai.spy((key, value, ttl) => {
        assert.strictEqual(value.documents, expectedDocuments, 'Wrong documents');
        assert.strictEqual(value.pagination, expectedPagination, 'Wrong pagination');
        assert.strictEqual(ttl, expectedTtl, 'Wrong TTL');
      });

      storage.get = chai.spy((location, filter, fields, limit, page, sort, callback) => {
        assert.equal(location, expectedLocation, 'Wrong location');
        assert.strictEqual(filter, expectedFilter, 'Wrong filter');
        assert.strictEqual(fields, expectedFields, 'Wrong fields');
        assert.equal(limit, expectedLimit, 'Wrong limit');
        assert.equal(page, expectedPage, 'Wrong page');
        assert.strictEqual(sort, expectedSort, 'Wrong sort');
        callback(null, expectedDocuments, expectedPagination);
      });

      provider.get(
        expectedLocation,
        expectedFilter,
        expectedFields,
        expectedLimit,
        expectedPage,
        expectedSort,
        60,
        (error, documents, pagination) => {
          assert.isNull(error, 'Unexpected error');
          assert.deepEqual(documents, expectedDocuments, 'Wrong documents');
          assert.strictEqual(pagination, expectedPagination, 'Wrong pagination');
          storage.get.should.have.been.called.exactly(1);
          cache.set.should.have.been.called.exactly(1);
          done();
        }
      );
    });

    it('should get results from cache if available', function(done) {
      const expectedPagination = {};
      expectedDocuments = [
        {
          id: '42'
        }
      ];

      cache.get = chai.spy((key, value, ttl) => {
        return {
          documents: expectedDocuments,
          pagination: expectedPagination
        };
      });

      provider.get('location', new ResourceFilter(), null, 10, 1, null, null, (error, documents, pagination) => {
        assert.isNull(error, 'Unexpected error');
        assert.deepEqual(documents, expectedDocuments, 'Wrong documents');
        assert.strictEqual(pagination, expectedPagination, 'Wrong pagination');
        cache.get.should.have.been.called.exactly(1);
        storage.get.should.have.been.called.exactly(0);
        cache.set.should.have.been.called.exactly(0);
        done();
      });
    });

    it('should execute callback with an error if getting documents failed', function(done) {
      const expectedError = new Error('Something went wrong');
      expectedDocuments = [];

      storage.get = chai.spy((location, filter, fields, limit, page, sort, callback) => {
        callback(expectedError);
      });

      provider.get('location', new ResourceFilter(), null, 10, 1, null, null, (error, documents, pagination) => {
        assert.strictEqual(error, expectedError, 'Wrong error');
        storage.get.should.have.been.called.exactly(1);
        cache.set.should.have.been.called.exactly(0);
        done();
      });
    });

  });

  describe('getAll', function() {

    it('should get all pages of documents', function(done) {
      const expectedLocation = 'location';
      const expectedFilter = new ResourceFilter();
      const expectedTtl = 60;
      const expectedSort = {id: 'desc'};
      const expectedFields = {
        include: ['field1'],
        exclude: ['field2']
      };
      const expectedSize = 100;
      let expectedPage = 0;
      expectedDocuments = [];

      for (var i = 0; i < expectedSize; i++)
        expectedDocuments.push({id: i});

      provider.get = chai.spy((location, filter, fields, limit, page, sort, ttl, callback) => {
        assert.equal(location, expectedLocation, 'Wrong location');
        assert.strictEqual(filter, expectedFilter, 'Wrong filter');
        assert.strictEqual(fields, expectedFields, 'Wrong fields');
        assert.isNull(limit, 'Unexpected limit');
        assert.equal(page, expectedPage, 'Wrong page');
        assert.strictEqual(sort, expectedSort, 'Wrong sort');
        expectedPage++;
        callback(
          null,
          expectedDocuments.slice(page * 10, page * 10 + 10),
          {
            limit: 10,
            page: page,
            pages: Math.ceil(expectedDocuments.length / 10),
            size: expectedDocuments.length
          }
        );
      });

      provider.getAll(
        expectedLocation,
        expectedFilter,
        expectedFields,
        expectedSort,
        expectedTtl,
        (error, documents) => {
          assert.isNull(error, 'Unexpected error');
          assert.deepEqual(documents, expectedDocuments, 'Wrong documents');
          provider.get.should.have.been.called.exactly(Math.ceil(expectedDocuments.length / 10));
          done();
        }
      );
    });

    it('should execute callback with an error if getting a page failed', function(done) {
      const expectedError = new Error('Something went wrong');
      expectedDocuments = [];

      provider.get = chai.spy((location, filter, fields, limit, page, sort, ttl, callback) => {
        callback(expectedError);
      });

      provider.getAll(
        'location',
        new ResourceFilter(),
        null,
        null,
        null,
        (error, documents) => {
          assert.strictEqual(error, expectedError, 'Wrong error');
          provider.get.should.have.been.called.exactly(1);
          done();
        }
      );
    });

  });

  describe('updateOne', function() {

    it('should update a document', function(done) {
      const expectedLocation = 'location';
      const expectedId = '42';
      const expectedData = {};

      storage.updateOne = chai.spy((location, filter, modifications, callback) => {
        assert.equal(location, expectedLocation, 'Wrong location');
        assert.equal(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.EQUAL, 'id').value,
          expectedId,
          'Wrong id'
        );
        assert.strictEqual(modifications, expectedData, 'Wrong data');
        callback(null, 1);
      });

      provider.updateOne(expectedLocation, expectedId, expectedData, (error, total) => {
        assert.isNull(error, 'Unexpected error');
        assert.equal(total, 1, 'Wrong total');
        storage.updateOne.should.have.been.called.exactly(1);
        done();
      });
    });

    it('should execute callback with an error if updating document failed', function(done) {
      const expectedError = new Error('Something went wrong');

      storage.updateOne = chai.spy((location, filter, modifications, callback) => {
        callback(expectedError);
      });

      provider.updateOne('location', '42', {}, (error, total) => {
        assert.strictEqual(error, expectedError, 'Unexpected error');
        storage.updateOne.should.have.been.called.exactly(1);
        done();
      });
    });

  });

  describe('deleteDocumentCache', function() {

    it('should delete cache entries regarding a document', function() {
      const expectedLocation = 'location';
      const expectedId = '42';

      provider.cache.del = chai.spy((key, callback) => {
        assert.equal(key, `getOne-${expectedLocation}-${expectedId}-*`, 'Wrong key');
        return 1;
      });

      assert.equal(
        provider.deleteDocumentCache(expectedLocation, expectedId, false),
        1,
        'Wrong number of removed entries'
      );
      provider.cache.del.should.have.been.called.exactly(1);
    });

    it('should be able to delete cache entries about a document including pages in paginated results', function() {
      const expectedLocation = 'location';
      const expectedId = '42';
      const expectedCacheId = 'cache-id';
      let count = 0;
      expectedDocuments = [
        {
          id: expectedId
        },
        {
          id: '43'
        }
      ];

      provider.cache.mget = chai.spy((key, callback) => {
        assert.deepEqual(key, [`get-${expectedLocation}-*`], 'Wrong key to get');
        return {
          [expectedCacheId]: {
            documents: expectedDocuments
          }
        };
      });

      provider.cache.del = chai.spy((key, callback) => {
        if (count)
          assert.equal(key, expectedCacheId, 'Wrong key to delete');
        else
          assert.equal(key, `getOne-${expectedLocation}-${expectedId}-*`, 'Wrong key to delete');

        count++;
        return 1;
      });

      // Once to remove cache entry with key starting by "getOne-", once to remove cache entry with key holded in
      // expectedCacheId
      assert.equal(
        provider.deleteDocumentCache(expectedLocation, expectedId, true),
        2,
        'Wrong number of removed entries'
      );
      provider.cache.del.should.have.been.called.exactly(2);
    });

    it('should not remove anything if location is not specified', function() {
      assert.equal(
        provider.deleteDocumentCache(null, 'id', true),
        0,
        'Unexpected removal'
      );
      provider.cache.del.should.have.been.called.exactly(0);
    });

    it('should not remove anything if document id is not specified', function() {
      assert.equal(
        provider.deleteDocumentCache('location', null, true),
        0,
        'Unexpected removal'
      );
      provider.cache.del.should.have.been.called.exactly(0);
    });

  });

  describe('deleteLocationCache', function() {

    it('should delete all cache entries relative to a location', function() {
      const expectedLocation = 'location';
      let count = 0;

      provider.cache.del = chai.spy((key, callback) => {
        if (count)
          assert.equal(key, `getOne-${expectedLocation}-*`, 'Wrong key to delete');
        else
          assert.equal(key, `get-${expectedLocation}-*`, 'Wrong key to delete');

        count++;
        return 1;
      });

      assert.equal(
        provider.deleteLocationCache(expectedLocation),
        2,
        'Wrong number of removed entries'
      );
    });

    it('should not remove anything if location is not specified', function() {
      assert.equal(
        provider.deleteLocationCache(null),
        0,
        'Unexpected removal'
      );
      provider.cache.del.should.have.been.called.exactly(0);
    });

  });

});

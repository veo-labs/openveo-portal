'use strict';

const path = require('path');
const querystring = require('querystring');
const chai = require('chai');
const spies = require('chai-spies');
const mock = require('mock-require');
const api = require('@openveo/api');
const ResourceFilter = api.storages.ResourceFilter;

const assert = chai.assert;
chai.should();
chai.use(spies);

describe('OpenVeoStorage', function() {
  let OpenVeoClient;
  let OpenVeoStorage;
  let openVeoStorage;
  let expectedDocuments;

  // Initiates mocks
  beforeEach(function() {
    OpenVeoClient = function(url, clientId, secretId, certificate) {
      this.url = url;
      this.clientId = clientId;
      this.secretId = secretId;
      this.certificate = certificate;
    };
    OpenVeoClient.prototype.get = chai.spy(function(endPoint) {
      Promise.resolve(expectedDocuments);
    });
    OpenVeoClient.prototype.post = chai.spy(function(endPoint, data) {
      Promise.resolve({total: 1});
    });
    const restNodeJsClient = {
      OpenVeoClient: OpenVeoClient
    };

    mock('@openveo/rest-nodejs-client', restNodeJsClient);
  });

  // Initiates tests
  beforeEach(function() {
    OpenVeoStorage = mock.reRequire(path.join(process.root, 'app/server/storages/OpenVeoStorage.js'));
    openVeoStorage = new OpenVeoStorage({});
  });

  // Stop mocks
  afterEach(function() {
    mock.stopAll();
  });

  it('should instanciate an OpenVeoClient', function() {
    const expectedConfiguration = {
      path: 'url',
      clientID: 'client id',
      secretID: 'secret id',
      certificate: 'certificate'
    };

    openVeoStorage = new OpenVeoStorage(expectedConfiguration);
    assert.instanceOf(openVeoStorage.client, OpenVeoClient, 'Wrong OpenVeoClient');
    assert.equal(openVeoStorage.client.url, expectedConfiguration.path, 'Wrong URL');
    assert.equal(openVeoStorage.client.clientId, expectedConfiguration.clientID, 'Wrong client id');
    assert.equal(openVeoStorage.client.secretId, expectedConfiguration.secretID, 'Wrong secret id');
    assert.equal(openVeoStorage.client.certificate, expectedConfiguration.certificate, 'Wrong certificate');
  });

  describe('buildFilter', function() {

    it('should transform a ResourceFilter into a web service filter', function() {
      const filter = new ResourceFilter();
      const expectedEqualField = 'equalField';
      const expectedEqualValue = 'equalField';
      const expectedInField = 'inField';
      const expectedInValue = ['inValue1', 'inValue2'];
      const expectedSearch = 'search';
      filter.equal(expectedEqualField, expectedEqualValue)
      .in(expectedInField, expectedInValue)
      .search(expectedSearch);

      const builtFilter = openVeoStorage.buildFilter(filter);

      assert.property(builtFilter, expectedEqualField, `Missing field ${expectedEqualField}`);
      assert.property(builtFilter, expectedInField, `Missing field ${expectedInField}`);
      assert.property(builtFilter, 'query', 'Missing field query');
      assert.equal(builtFilter[expectedInField], expectedInValue, `Wrong value for "${expectedInField}" field`);
      assert.equal(builtFilter['query'], expectedSearch, 'Wrong value for "query" field');
      assert.equal(
        builtFilter[expectedEqualField],
        expectedEqualValue,
        `Wrong value for "${expectedEqualField}" field`
      );
    });

    it('should return an empty object if no filter specified', function() {
      const builtFilter = openVeoStorage.buildFilter();
      assert.isObject(builtFilter, 'Wrong filter');
      assert.isEmpty(builtFilter, 'Unexpected fields');
    });

    it('should throw an error if using an unsupported operation', function() {
      const unsupportedComparisonOperators = {
        [ResourceFilter.OPERATORS.NOT_IN]: ['value'],
        [ResourceFilter.OPERATORS.NOT_EQUAL]: 'value',
        [ResourceFilter.OPERATORS.GREATER_THAN]: 42,
        [ResourceFilter.OPERATORS.GREATER_THAN_EQUAL]: 42,
        [ResourceFilter.OPERATORS.LESSER_THAN]: 42,
        [ResourceFilter.OPERATORS.LESSER_THAN_EQUAL]: 42
      };
      const unsupportedLogicalOperators = {
        [ResourceFilter.OPERATORS.OR]: [new ResourceFilter(), new ResourceFilter()],
        [ResourceFilter.OPERATORS.NOR]: [new ResourceFilter(), new ResourceFilter()],
        [ResourceFilter.OPERATORS.AND]: [new ResourceFilter(), new ResourceFilter()]
      };

      for (let unsupportedComparisonOperator in unsupportedComparisonOperators) {
        const filter = new ResourceFilter();
        filter[unsupportedComparisonOperator]('field', unsupportedComparisonOperators[unsupportedComparisonOperator]);
        assert.throws(() => {
          openVeoStorage.buildFilter(filter);
        }, null, null, `Expected usage of operator "${unsupportedComparisonOperator}" to throw an error`);
      }

      for (let unsupportedLogicalOperator in unsupportedLogicalOperators) {
        const filter = new ResourceFilter();
        filter[unsupportedLogicalOperator](unsupportedLogicalOperators[unsupportedLogicalOperator]);
        assert.throws(() => {
          openVeoStorage.buildFilter(filter);
        }, null, null, `Expected usage of operator "${unsupportedLogicalOperator}" to throw an error`);
      }
    });

  });

  describe('buildSort', function() {

    it('should transform the storage sort object into an OpenVeo web service equivalent', function() {
      const expectedField = 'field1';
      const expectedValue = 'desc';
      const unexpectedField = 'field2';

      const sort = openVeoStorage.buildSort({
        [expectedField]: 'desc',
        [unexpectedField]: 'asc'
      });

      assert.notProperty(sort, unexpectedField, 'Unexpected field');
      assert.equal(sort.sortBy, expectedField, 'Wrong field');
      assert.equal(sort.sortOrder, expectedValue, 'Wrong value');
    });

    it('should create an empty sort object if no sort field specified', function() {
      const sort = openVeoStorage.buildSort();

      assert.isObject(sort, 'Wrong sort');
      assert.isEmpty(sort, 'Unexpected sort field');
    });

  });

  describe('get', function() {

    it('should execute callback with fetched documents and pagination', function(done) {
      const expectedEndPoint = '/endPoint';
      const expectedPagination = {};
      expectedDocuments = [
        {
          id: '42'
        }
      ];

      openVeoStorage.client.get = chai.spy((endPoint) => {
        const endPointChunks = endPoint.split('?');
        const params = querystring.parse(endPointChunks[1]);

        assert.equal(endPointChunks[0], expectedEndPoint, 'Wrong end point');
        assert.equal(params.page, '0', 'Wrong page');
        assert.equal(params.limit, '10', 'Wrong limit');

        return Promise.resolve({
          entities: expectedDocuments,
          pagination: expectedPagination
        });
      });

      openVeoStorage.get(expectedEndPoint, null, null, null, null, null, (error, documents, pagination) => {
        assert.isNull(error, 'Unexpected error');
        assert.strictEqual(documents, expectedDocuments, 'Wrong documents');
        assert.strictEqual(pagination, expectedPagination, 'Wrong pagination');
        openVeoStorage.client.get.should.have.been.called.exactly(1);
        done();
      });
    });

    it('should be able to filter documents', function(done) {
      const expectedEndPoint = '/endPoint';
      const expectedEqualField = 'field';
      const expectedEqualValue = 'value';
      const expectedInField = 'field2';
      const expectedInValue = ['value1', 'value2'];
      const expectedSearch = 'search';
      const expectedFilter = new ResourceFilter()
      .equal(expectedEqualField, expectedEqualValue)
      .in(expectedInField, expectedInValue)
      .search(expectedSearch);

      openVeoStorage.client.get = chai.spy((endPoint) => {
        const endPointChunks = endPoint.split('?');
        const params = querystring.parse(endPointChunks[1]);

        assert.equal(endPointChunks[0], expectedEndPoint, 'Wrong end point');
        assert.equal(params.page, '0', 'Wrong page');
        assert.equal(params.limit, '10', 'Wrong limit');
        assert.equal(params[expectedEqualField], expectedEqualValue, 'Wrong equal field');
        assert.deepEqual(params[expectedInField], expectedInValue, 'Wrong in field');
        assert.deepEqual(params.query, expectedSearch, 'Wrong search');
        return Promise.resolve({});
      });

      openVeoStorage.get(expectedEndPoint, expectedFilter, null, null, null, null, (error, documents, pagination) => {
        assert.isNull(error, 'Unexpected error');
        openVeoStorage.client.get.should.have.been.called.exactly(1);
        done();
      });
    });

    it('should be able to paginate documents', function(done) {
      const expectedPage = 42;
      const expectedLimit = 43;

      openVeoStorage.client.get = chai.spy((endPoint) => {
        const endPointChunks = endPoint.split('?');
        const params = querystring.parse(endPointChunks[1]);

        assert.equal(params.page, expectedPage, 'Wrong page');
        assert.equal(params.limit, expectedLimit, 'Wrong limit');
        return Promise.resolve({});
      });

      openVeoStorage.get(
        '/endPoint',
        null,
        null,
        expectedLimit,
        expectedPage,
        null,
        (error, documents, pagination) => {
          assert.isNull(error, 'Unexpected error');
          openVeoStorage.client.get.should.have.been.called.exactly(1);
          done();
        }
      );
    });

    it('should be able to sort documents', function(done) {
      const expectedSortBy = 'field';
      const expectedSortOrder = 'desc';

      openVeoStorage.client.get = chai.spy((endPoint) => {
        const endPointChunks = endPoint.split('?');
        const params = querystring.parse(endPointChunks[1]);

        assert.equal(params.sortBy, expectedSortBy, 'Wrong sort field');
        assert.equal(params.sortOrder, expectedSortOrder, 'Wrong sort order');
        return Promise.resolve({});
      });

      openVeoStorage.get(
        '/endPoint',
        null,
        null,
        null,
        null,
        {
          [expectedSortBy]: expectedSortOrder
        },
        (error, documents, pagination) => {
          assert.isNull(error, 'Unexpected error');
          openVeoStorage.client.get.should.have.been.called.exactly(1);
          done();
        }
      );
    });

    it('should be able to include / exclude fields', function(done) {
      const expectedFields = {
        include: ['field1'],
        exclude: ['field2']
      };

      openVeoStorage.client.get = chai.spy((endPoint) => {
        const endPointChunks = endPoint.split('?');
        const params = querystring.parse(endPointChunks[1]);

        assert.equal(params.include, expectedFields.include, 'Wrong include fields');
        assert.equal(params.exclude, expectedFields.exclude, 'Wrong exclude fields');
        return Promise.resolve({});
      });

      openVeoStorage.get(
        '/endPoint',
        null,
        expectedFields,
        null,
        null,
        null,
        (error, documents, pagination) => {
          assert.isNull(error, 'Unexpected error');
          openVeoStorage.client.get.should.have.been.called.exactly(1);
          done();
        }
      );
    });

    it('should execute callback with an error if getting documents failed', function(done) {
      const expectedError = new Error('Something went wrong');

      openVeoStorage.client.get = chai.spy((endPoint) => {
        return Promise.reject(expectedError);
      });

      openVeoStorage.get(
        '/endPoint',
        null,
        null,
        null,
        null,
        null,
        (error, documents, pagination) => {
          assert.strictEqual(error, expectedError, 'Wrong error');
          openVeoStorage.client.get.should.have.been.called.exactly(1);
          done();
        }
      );
    });

  });

  describe('convertVideoPoi', function() {

    it('should be able to call openVeo client convert function', function(done) {
      const expectedVideoId = 42;
      const expectedDuration = 3600000;
      const expectedEndPoint = `publish/videos/${expectedVideoId}/poi/convert`;

      openVeoStorage.client.post = chai.spy((endPoint, data, callback) => {
        assert.strictEqual(endPoint, expectedEndPoint);
        assert.strictEqual(data.duration, expectedDuration);

        return Promise.resolve({});
      });

      openVeoStorage.convertVideoPoi(expectedVideoId, expectedDuration, (error, video) => {
        openVeoStorage.client.post.should.have.been.called.exactly(1);
        done();
      });
    });

    it('should execute callback with an error if convert failed', function(done) {
      const expectedError = new Error('Something went wrong');

      openVeoStorage.client.post = chai.spy((endPoint, data, callback) => {
        return Promise.reject(expectedError);
      });

      openVeoStorage.convertVideoPoi(null, null, (error, video) => {
        assert.strictEqual(error, expectedError);
        openVeoStorage.client.post.should.have.been.called.exactly(1);
        done();
      });
    });

  });

  describe('updateOne', function() {

    it('should update a document', function(done) {
      const expectedEndPoint = '/endPoint';
      const expectedId = '42';
      const expectedData = {
        field: 'value'
      };

      openVeoStorage.client.post = chai.spy((endPoint, data) => {
        assert.equal(endPoint, `${expectedEndPoint}/${expectedId}`, 'Wrong end point');
        assert.strictEqual(data, expectedData, 'Wrong data');
        return Promise.resolve({total: 1});
      });

      openVeoStorage.updateOne(
        expectedEndPoint,
        new ResourceFilter().equal('id', expectedId),
        expectedData,
        (error, total) => {
          assert.isNull(error, 'Unexpected error');
          assert.equal(total, 1, 'Wrong total');
          openVeoStorage.client.post.should.have.been.called.exactly(1);
          done();
        }
      );
    });

    it('should execute callback with an error if updating document failed', function(done) {
      const expectedError = new Error('Something went wrong');

      openVeoStorage.client.post = chai.spy((endPoint, data) => {
        return Promise.reject(expectedError);
      });

      openVeoStorage.updateOne(
        '/endPoint',
        new ResourceFilter().equal('id', '42'),
        {},
        (error, total) => {
          assert.strictEqual(error, expectedError, 'Wrong error');
          openVeoStorage.client.post.should.have.been.called.exactly(1);
          done();
        }
      );
    });

  });

  describe('getOne', function() {

    it('should get a document', function(done) {
      const expectedEndPoint = '/endPoint';
      const expectedId = '42';

      openVeoStorage.client.get = chai.spy((endPoint) => {
        assert.equal(endPoint, `${expectedEndPoint}/${expectedId}`, 'Wrong end point');
        return Promise.resolve({entity: expectedDocuments[0]});
      });

      openVeoStorage.getOne(
        expectedEndPoint,
        new ResourceFilter().equal('id', expectedId),
        null,
        (error, document) => {
          assert.isNull(error, 'Unexpected error');
          assert.strictEqual(document, expectedDocuments[0], 'Wrong document');
          openVeoStorage.client.get.should.have.been.called.exactly(1);
          done();
        }
      );
    });

    it('should be able to include / exclude fields', function(done) {
      const expectedFields = {
        include: ['field1'],
        exclude: ['field2']
      };

      openVeoStorage.client.get = chai.spy((endPoint) => {
        const endPointChunks = endPoint.split('?');
        const params = querystring.parse(endPointChunks[1]);

        assert.equal(params.include, expectedFields.include, 'Wrong include fields');
        assert.equal(params.exclude, expectedFields.exclude, 'Wrong exclude fields');
        return Promise.resolve({entity: expectedDocuments[0]});
      });

      openVeoStorage.getOne(
        '/endPoint',
        new ResourceFilter().equal('id', '42'),
        expectedFields,
        (error, document) => {
          assert.isNull(error, 'Unexpected error');
          openVeoStorage.client.get.should.have.been.called.exactly(1);
          done();
        }
      );
    });

    it('should execute callback with an error if getting document failed', function(done) {
      const expectedError = new Error('Something went wrong');

      openVeoStorage.client.get = chai.spy((endPoint) => {
        return Promise.reject(expectedError);
      });

      openVeoStorage.getOne(
        '/endPoint',
        new ResourceFilter().equal('id', '42'),
        null,
        (error, document) => {
          assert.strictEqual(error, expectedError, 'Wrong error');
          openVeoStorage.client.get.should.have.been.called.exactly(1);
          done();
        }
      );
    });

  });

});

'use strict';

const path = require('path');
const chai = require('chai');
const spies = require('chai-spies');
const mock = require('mock-require');
const HTTP_ERRORS = process.require('app/server/httpErrors.js');

const assert = chai.assert;
chai.should();
chai.use(spies);

describe('FiltersController', function() {
  let request;
  let response;
  let filtersController;
  let openVeoProvider;
  let context;
  let conf;

  // Mocks
  beforeEach(function() {
    conf = {
      conf: {
        exposedFilter: ['customProperty1'],
        categoriesFilter: 'taxonomyId',
        cache: {
          filterTTL: 42
        }
      }
    };

    openVeoProvider = {};

    context = {
      openVeoProvider
    };

    request = {
      body: {},
      params: {},
      query: {}
    };
    response = {};

    mock(path.join(process.root, 'app/server/conf.js'), conf);
    mock(path.join(process.root, 'app/server/context.js'), context);
  });

  // Initializes tests
  beforeEach(function() {
    const FiltersController = mock.reRequire(
      path.join(process.root, 'app/server/controllers/FiltersController.js')
    );
    filtersController = new FiltersController();
  });

  // Stop mocks
  afterEach(function() {
    mock.stopAll();
  });

  describe('getFiltersAction', function() {

    it('should send response with search filters', function(done) {
      let count = 0;
      const expectedTaxonomies = [
        {
          id: '42',
          tree: [
            {
              id: '43',
              title: 'Title 43',
              items: [
                {
                  id: '44',
                  title: 'Title 44'
                }
              ]
            }
          ]
        }
      ];
      const expectedCustomProperties = [
        {
          id: conf.conf.exposedFilter[0],
          name: 'Name',
          description: 'Description',
          type: 'list',
          values: ['value1', 'value2']
        }
      ];

      openVeoProvider.getOne = chai.spy((location, id, fields, ttl, callback) => {
        if (!count) {
          assert.equal(location, '/taxonomies', 'Wrong location');
          assert.equal(id, conf.conf.categoriesFilter, 'Wrong id');
          assert.equal(ttl, conf.conf.cache.filterTTL, 'Wrong TTL');
          count++;
          callback(null, expectedTaxonomies[0]);
        } else {
          assert.equal(location, '/publish/properties', 'Wrong location');
          assert.equal(id, expectedCustomProperties[0].id, 'Wrong id');
          assert.equal(ttl, conf.conf.cache.filterTTL, 'Wrong TTL');
          count++;
          callback(null, expectedCustomProperties[0]);
        }
      });

      response.send = (result) => {
        const category = result[0];
        const customProperty = result[1];

        openVeoProvider.getOne.should.have.been.called.exactly(2);
        assert.equal(category.id, 'categories', 'Wrong categories id');
        assert.equal(category.type, 'list', 'Wrong categories type');
        assert.equal(category.name, 'categories', 'Wrong categories name');
        assert.deepEqual(
          Object.keys(category.values),
          [expectedTaxonomies[0].tree[0].id, expectedTaxonomies[0].tree[0].items[0].id],
          'Wrong categories ids'
        );
        assert.strictEqual(customProperty, expectedCustomProperties[0], 'Wrong custom properties');
        done();
      };

      filtersController.getFiltersAction(request, response, (error) => {
        assert.ok(false, 'Unexpected call to next');
      });
    });

    it('should send only custom properties if taxonomy id is not specified', function(done) {
      conf.conf.categoriesFilter = null;

      openVeoProvider.getOne = chai.spy((location, id, fields, ttl, callback) => {
        callback();
      });

      response.send = (result) => {
        openVeoProvider.getOne.should.have.been.called.exactly(1);
        done();
      };

      filtersController.getFiltersAction(request, response, (error) => {
        assert.ok(false, 'Unexpected call to next');
      });
    });

    it('should execute next with an error if getting taxonomy failed', function(done) {
      openVeoProvider.getOne = chai.spy((location, id, fields, ttl, callback) => {
        callback(new Error('Something went wrong'));
      });

      response.send = (result) => {
        assert.ok(false, 'Unexpected results');
      };

      filtersController.getFiltersAction(request, response, (error) => {
        openVeoProvider.getOne.should.have.been.called.exactly(1);
        assert.strictEqual(error, HTTP_ERRORS.GET_FILTERS_CATEGORIES_ERROR, 'Wrong error');
        done();
      });
    });

    it('should execute next with an error if getting custom property failed', function(done) {
      let count = 0;

      openVeoProvider.getOne = chai.spy((location, id, fields, ttl, callback) => {
        if (!count) {
          count++;
          return callback();
        }
        callback(new Error('Something went wrong'));
      });

      response.send = (result) => {
        assert.ok(false, 'Unexpected results');
      };

      filtersController.getFiltersAction(request, response, (error) => {
        openVeoProvider.getOne.should.have.been.called.exactly(2);
        assert.strictEqual(error, HTTP_ERRORS.GET_FILTERS_PROPERTIES_ERROR, 'Wrong error');
        done();
      });
    });

  });

});

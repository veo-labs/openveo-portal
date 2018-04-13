'use strict';

const path = require('path');
const chai = require('chai');
const spies = require('chai-spies');
const mock = require('mock-require');
const HTTP_ERRORS = process.require('app/server/httpErrors.js');

const assert = chai.assert;
chai.should();
chai.use(spies);

describe('CategoriesController', function() {
  let request;
  let response;
  let categoriesController;
  let expectedTaxonomies;
  let openVeoProvider;
  let context;
  let conf;

  // Mocks
  beforeEach(function() {
    expectedTaxonomies = [];

    conf = {
      conf: {
        categoriesFilter: 'taxonomyId',
        cache: {
          filterTTL: 42
        }
      }
    };

    openVeoProvider = {
      getOne: (location, id, fields, ttl, callback) => {
        callback(null, expectedTaxonomies[0]);
      }
    };

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
    const CategoriesController = mock.reRequire(
      path.join(process.root, 'app/server/controllers/CategoriesController.js')
    );
    categoriesController = new CategoriesController();
  });

  // Stop mocks
  afterEach(function() {
    mock.stopAll();
  });

  describe('getCategoriesAction', function() {

    it('should send response with the list of categories', function(done) {
      expectedTaxonomies = [
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

      openVeoProvider.getOne = chai.spy((location, id, fields, ttl, callback) => {
        assert.equal(location, '/taxonomies', 'Wrong location');
        assert.equal(id, conf.conf.categoriesFilter, 'Wrong id');
        assert.equal(ttl, conf.conf.cache.filterTTL, 'Wrong ttl');
        callback(null, expectedTaxonomies[0]);
      });

      response.send = (result) => {
        openVeoProvider.getOne.should.have.been.called.exactly(1);
        assert.property(result, expectedTaxonomies[0].tree[0].id, 'Missing category');
        assert.property(result, expectedTaxonomies[0].tree[0].items[0].id, 'Missing sub category');
        assert.equal(
          result[expectedTaxonomies[0].tree[0].id],
          expectedTaxonomies[0].tree[0].title, 'Wrong category title'
        );
        assert.equal(
          result[expectedTaxonomies[0].tree[0].items[0].id],
          expectedTaxonomies[0].tree[0].items[0].title,
          'Wrong sub category title'
        );
        done();
      };

      categoriesController.getCategoriesAction(request, response, (error) => {
        assert.ok(false, 'Unexpected error');
      });
    });

    it('should execute next with an error if getting taxonomy failed', function(done) {
      openVeoProvider.getOne = (location, id, fields, ttl, callback) => {
        callback(new Error('Something went wrong'));
      };

      response.send = chai.spy((result) => {});

      categoriesController.getCategoriesAction(request, response, (error) => {
        assert.strictEqual(error, HTTP_ERRORS.GET_CATEGORIES_ERROR, 'Wrong error');
        response.send.should.have.been.called.exactly(0);
        done();
      });
    });

  });

});

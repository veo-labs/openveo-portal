'use strict';

const path = require('path');
const chai = require('chai');
const spies = require('chai-spies');
const mock = require('mock-require');
const api = require('@openveo/api');
const HTTP_ERRORS = process.require('app/server/httpErrors.js');
const ResourceFilter = api.storages.ResourceFilter;

const assert = chai.assert;
chai.should();
chai.use(spies);

describe('VideosController', function() {
  let request;
  let response;
  let videosController;
  let expectedVideos;
  let openVeoProvider;
  let context;
  let conf;

  // Mocks
  beforeEach(function() {
    expectedVideos = [];

    conf = {
      conf: {
        publicFilter: ['42'],
        privateFilter: ['43'],
        cache: {
          videoTTL: 42
        }
      },
      superAdminId: '1'
    };

    openVeoProvider = {
      getOne: chai.spy((location, id, fields, ttl, callback) => {
        callback(null, expectedVideos[0]);
      }),
      get: chai.spy((location, filter, fields, limit, page, sort, ttl, callback) => {
        callback(
          null,
          expectedVideos,
          {
            limit: limit,
            page: page,
            pages: Math.floor(expectedVideos.length / limit),
            size: expectedVideos.length
          }
        );
      })
    };

    context = {
      openVeoProvider
    };

    request = {
      body: {
        filter: {},
        pagination: {}
      },
      params: {},
      query: {},
      isAuthenticated: () => false
    };
    response = {};

    mock(path.join(process.root, 'app/server/conf.js'), conf);
    mock(path.join(process.root, 'app/server/context.js'), context);
  });

  // Initializes tests
  beforeEach(function() {
    const VideosController = mock.reRequire(
      path.join(process.root, 'app/server/controllers/VideosController.js')
    );
    videosController = new VideosController();
  });

  // Stop mocks
  afterEach(function() {
    mock.stopAll();
  });

  describe('searchAction', function() {

    it('should send response with the list of videos and pagination', function(done) {
      let expectedPagination;
      expectedVideos = [
        {
          id: '42'
        }
      ];

      openVeoProvider.get = chai.spy((location, filter, fields, limit, page, sort, ttl, callback) => {
        assert.equal(location, '/publish/videos', 'Wrong location');
        assert.deepEqual(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.IN, 'groups').value,
          conf.conf.publicFilter,
          'Wrong groups'
        );
        assert.equal(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.EQUAL, 'states').value,
          12,
          'Wrong state'
        );
        assert.equal(limit, 9, 'Wrong limit');
        assert.equal(page, 0, 'Wrong page');
        assert.property(sort, 'date', 'Wrong sort field');
        assert.equal(sort['date'], 'desc', 'Wrong sort order');
        assert.equal(ttl, conf.conf.cache.videoTTL, 'Wrong TTL');

        expectedPagination = {
          limit: limit,
          page: page,
          pages: Math.floor(expectedVideos.length / limit),
          size: expectedVideos.length
        };
        callback(null, expectedVideos, expectedPagination);
      });

      response.send = (result) => {
        assert.strictEqual(result.entities, expectedVideos, 'Wrong videos');
        assert.strictEqual(result.pagination, expectedPagination, 'Wrong pagination');
        openVeoProvider.get.should.have.been.called.exactly(1);
        done();
      };

      videosController.searchAction(request, response, (error) => {
        assert.ok(false, 'Unexpected call to next');
      });
    });

    it('should fetch videos belonging to both private and public groups if user is authenticated', function(done) {
      request.isAuthenticated = () => true;
      request.user = {id: '42'};

      openVeoProvider.get = chai.spy((location, filter, fields, limit, page, sort, ttl, callback) => {
        assert.deepEqual(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.IN, 'groups').value,
          conf.conf.publicFilter.concat(conf.conf.privateFilter),
          'Wrong groups'
        );
        callback();
      });

      response.send = (result) => {
        openVeoProvider.get.should.have.been.called.exactly(1);
        done();
      };

      videosController.searchAction(request, response, (error) => {
        assert.ok(false, 'Unexpected call to next');
      });
    });

    it('should be able to fetch videos by search query', function(done) {
      request.body.filter.query = 'Query search';

      openVeoProvider.get = chai.spy((location, filter, fields, limit, page, sort, ttl, callback) => {
        assert.deepEqual(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.SEARCH).value,
          request.body.filter.query,
          'Wrong search query'
        );
        callback();
      });

      response.send = (result) => {
        openVeoProvider.get.should.have.been.called.exactly(1);
        done();
      };

      videosController.searchAction(request, response, (error) => {
        assert.ok(false, 'Unexpected call to next');
      });
    });

    it('should be able to fetch videos by date', function(done) {
      request.body.filter.dateStart = '1980-05-15';
      request.body.filter.dateEnd = '1988-12-01';

      openVeoProvider.get = chai.spy((location, filter, fields, limit, page, sort, ttl, callback) => {
        assert.equal(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.EQUAL, 'dateStart').value,
          request.body.filter.dateStart,
          'Wrong start date'
        );
        assert.equal(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.EQUAL, 'dateEnd').value,
          request.body.filter.dateEnd,
          'Wrong end date'
        );
        callback();
      });

      response.send = (result) => {
        openVeoProvider.get.should.have.been.called.exactly(1);
        done();
      };

      videosController.searchAction(request, response, (error) => {
        assert.ok(false, 'Unexpected call to next');
      });
    });

    it('should be able to fetch videos by category', function(done) {
      request.body.filter.categories = ['category1'];

      openVeoProvider.get = chai.spy((location, filter, fields, limit, page, sort, ttl, callback) => {
        assert.deepEqual(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.IN, 'categories').value,
          request.body.filter.categories,
          'Wrong categories'
        );
        callback();
      });

      response.send = (result) => {
        openVeoProvider.get.should.have.been.called.exactly(1);
        done();
      };

      videosController.searchAction(request, response, (error) => {
        assert.ok(false, 'Unexpected call to next');
      });
    });

    it('should be able to fetch videos by custom properties', function(done) {
      request.body.filter.customProperty1 = 'value1';
      request.body.filter.customProperty2 = 'value2';

      openVeoProvider.get = chai.spy((location, filter, fields, limit, page, sort, ttl, callback) => {
        assert.equal(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.EQUAL, 'properties[customProperty1]').value,
          request.body.filter.customProperty1,
          'Wrong customProperty1'
        );
        assert.equal(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.EQUAL, 'properties[customProperty2]').value,
          request.body.filter.customProperty2,
          'Wrong customProperty2'
        );
        callback();
      });

      response.send = (result) => {
        openVeoProvider.get.should.have.been.called.exactly(1);
        done();
      };

      videosController.searchAction(request, response, (error) => {
        assert.ok(false, 'Unexpected call to next');
      });
    });

    it('should execute next with an error if no public groups configured', function(done) {
      conf.conf.publicFilter = [];

      response.send = (result) => {
        assert.ok(false, 'Unexpected call to next');
      };

      videosController.searchAction(request, response, (error) => {
        assert.strictEqual(error, HTTP_ERRORS.CONF_ERROR, 'Wrong error');
        openVeoProvider.get.should.have.been.called.exactly(0);
        done();
      });
    });

    it('should execute next with an error if sort field is not supported', function(done) {
      request.body.filter.sortBy = 'unsupported';

      response.send = (result) => {
        assert.ok(false, 'Unexpected call to next');
      };

      videosController.searchAction(request, response, (error) => {
        assert.strictEqual(error, HTTP_ERRORS.SEARCH_WRONG_PARAMETERS, 'Wrong error');
        openVeoProvider.get.should.have.been.called.exactly(0);
        done();
      });
    });

    it('should execute next with an error if sort order is not valid', function(done) {
      request.body.filter.sortOrder = 'not valid';

      response.send = (result) => {
        assert.ok(false, 'Unexpected call to next');
      };

      videosController.searchAction(request, response, (error) => {
        assert.strictEqual(error, HTTP_ERRORS.SEARCH_WRONG_PARAMETERS, 'Wrong error');
        openVeoProvider.get.should.have.been.called.exactly(0);
        done();
      });
    });

    it('should execute next with an error if limit is equal to 0', function(done) {
      request.body.pagination.limit = 0;

      response.send = (result) => {
        assert.ok(false, 'Unexpected call to next');
      };

      videosController.searchAction(request, response, (error) => {
        assert.strictEqual(error, HTTP_ERRORS.SEARCH_WRONG_PARAMETERS, 'Wrong error');
        openVeoProvider.get.should.have.been.called.exactly(0);
        done();
      });
    });

    it('should execute next with an error if filter is not specified', function(done) {
      request.body.filter = null;

      response.send = (result) => {
        assert.ok(false, 'Unexpected call to next');
      };

      videosController.searchAction(request, response, (error) => {
        assert.strictEqual(error, HTTP_ERRORS.SEARCH_WRONG_PARAMETERS, 'Wrong error');
        openVeoProvider.get.should.have.been.called.exactly(0);
        done();
      });
    });

    it('should execute next with an error if pagination is not specified', function(done) {
      request.body.pagination = null;

      response.send = (result) => {
        assert.ok(false, 'Unexpected call to next');
      };

      videosController.searchAction(request, response, (error) => {
        assert.strictEqual(error, HTTP_ERRORS.SEARCH_WRONG_PARAMETERS, 'Wrong error');
        openVeoProvider.get.should.have.been.called.exactly(0);
        done();
      });
    });

    it('should execute next with an error if fetching videos failed', function(done) {
      openVeoProvider.get = chai.spy((location, filter, fields, limit, page, sort, ttl, callback) => {
        callback(new Error('Something went wrong'));
      });

      response.send = (result) => {
        assert.ok(false, 'Unexpected call to next');
      };

      videosController.searchAction(request, response, (error) => {
        assert.strictEqual(error, HTTP_ERRORS.SEARCH_ERROR, 'Wrong error');
        openVeoProvider.get.should.have.been.called.exactly(1);
        done();
      });
    });

  });

  describe('getVideoAction', function() {

    it('should send response with information about the video', function(done) {
      request.params.id = '42';
      expectedVideos = [
        {
          id: '42',
          metadata: {
            groups: conf.conf.publicFilter
          }
        }
      ];

      openVeoProvider.getOne = chai.spy((location, id, fields, ttl, callback) => {
        assert.equal(location, '/publish/videos', 'Wrong location');
        assert.equal(id, request.params.id, 'Wrong id');
        assert.equal(ttl, conf.conf.cache.videoTTL, 'Wrong TTL');
        callback(null, expectedVideos[0]);
      });

      response.send = (result) => {
        assert.strictEqual(result.entity, expectedVideos[0], 'Wrong video');
        openVeoProvider.getOne.should.have.been.called.exactly(1);
        done();
      };

      videosController.getVideoAction(request, response, (error) => {
        assert.ok(false, 'Unexpected error');
      });
    });

    it('should execute next with an error if getting video failed', function(done) {
      request.params.id = '42';
      expectedVideos = [
        {
          id: '42'
        }
      ];

      openVeoProvider.getOne = chai.spy((location, id, fields, ttl, callback) => {
        callback(new Error('Something went wrong'));
      });

      response.send = (result) => {
        assert.ok(false, 'Unexpected response');
      };

      videosController.getVideoAction(request, response, (error) => {
        openVeoProvider.getOne.should.have.been.called.exactly(1);
        assert.strictEqual(error, HTTP_ERRORS.GET_VIDEO_ERROR, 'Wrong error');
        done();
      });
    });

    it('should execute next with an error if video is not found', function(done) {
      request.params.id = '42';
      expectedVideos = [];

      openVeoProvider.getOne = chai.spy((location, id, fields, ttl, callback) => {
        callback();
      });

      response.send = (result) => {
        assert.ok(false, 'Unexpected response');
      };

      videosController.getVideoAction(request, response, (error) => {
        openVeoProvider.getOne.should.have.been.called.exactly(1);
        assert.strictEqual(error, HTTP_ERRORS.GET_VIDEO_NOT_FOUND, 'Wrong error');
        done();
      });
    });

    it(
      'should send response with a property "needAuth" if user is not authenticated and video not public',
      function(done) {
        request.params.id = '42';
        expectedVideos = [
          {
            id: '42',
            metadata: {
              groups: []
            }
          }
        ];

        response.send = (result) => {
          openVeoProvider.getOne.should.have.been.called.exactly(1);
          assert.ok(result.needAuth, 'Expected "needAuth" property');
          done();
        };

        videosController.getVideoAction(request, response, (error) => {
          assert.ok(false, 'Unexpected call to next');
        });
      }
    );

    it('should send response with the video if user is the super administrator', function(done) {
      request.params.id = '42';
      request.user = {id: conf.superAdminId};
      request.isAuthenticated = () => true;
      expectedVideos = [
        {
          id: '42',
          metadata: {
            groups: []
          }
        }
      ];

      response.send = (result) => {
        openVeoProvider.getOne.should.have.been.called.exactly(1);
        assert.strictEqual(result.entity, expectedVideos[0], 'Wrong video');
        done();
      };

      videosController.getVideoAction(request, response, (error) => {
        assert.ok(false, 'Unexpected call to next');
      });
    });

    it(
      'should send response with the video if video is part of private groups and user is authenticated',
      function(done) {
        request.params.id = '42';
        request.isAuthenticated = () => true;
        request.user = {
          id: '43',
          groups: []
        };
        expectedVideos = [
          {
            id: '42',
            metadata: {
              groups: conf.conf.privateFilter
            }
          }
        ];

        response.send = (result) => {
          openVeoProvider.getOne.should.have.been.called.exactly(1);
          assert.strictEqual(result.entity, expectedVideos[0], 'Wrong video');
          done();
        };

        videosController.getVideoAction(request, response, (error) => {
          assert.ok(false, 'Unexpected call to next');
        });
      }
    );

    it('should send response with the video if video is part of user\'s groups', function(done) {
      request.params.id = '42';
      request.isAuthenticated = () => true;
      request.user = {
        id: '43',
        groups: ['group1']
      };
      expectedVideos = [
        {
          id: '42',
          metadata: {
            groups: request.user.groups
          }
        }
      ];

      response.send = (result) => {
        openVeoProvider.getOne.should.have.been.called.exactly(1);
        assert.strictEqual(result.entity, expectedVideos[0], 'Wrong video');
        done();
      };

      videosController.getVideoAction(request, response, (error) => {
        assert.ok(false, 'Unexpected call to next');
      });
    });

    it(
      'should execute next with an error if video is private an not part of user groups nor private groups',
      function(done) {
        request.params.id = '42';
        request.isAuthenticated = () => true;
        request.user = {
          id: '43',
          groups: []
        };
        expectedVideos = [
          {
            id: '42',
            metadata: {
              groups: []
            }
          }
        ];

        response.send = (result) => {
          assert.ok(false, 'Unexpected results');
        };

        videosController.getVideoAction(request, response, (error) => {
          openVeoProvider.getOne.should.have.been.called.exactly(1);
          assert.strictEqual(error, HTTP_ERRORS.GET_VIDEO_NOT_ALLOWED, 'Wrong error');
          done();
        });
      }
    );

  });

});

'use strict';

const path = require('path');
const chai = require('chai');
const spies = require('chai-spies');
const mock = require('mock-require');
const HTTP_ERRORS = process.require('app/server/httpErrors.js');

const assert = chai.assert;
chai.should();
chai.use(spies);

describe('StatisticsController', function() {
  let request;
  let response;
  let statisticsController;
  let openVeoProvider;
  let context;
  let conf;
  let expectedMedias;
  let viewsCacheOnCallbacks;

  // Mocks
  beforeEach(function() {
    expectedMedias = [];
    viewsCacheOnCallbacks = [];

    openVeoProvider = {
      getOne: chai.spy((location, id, fields, ttl, callback) => {
        callback(null, expectedMedias[0]);
      }),
      updateOne: chai.spy((location, id, data, callback) => {
        callback(null, 1);
      }),
      deleteDocumentCache: chai.spy((location, id, alsoRemoveFromPages) => {
        return;
      })
    };

    context = {
      openVeoProvider
    };

    conf = {
      conf: {
        cache: {
          videoTTL: 42
        }
      }
    };

    class Cache {
      constructor() {}
      on(eventName, callback) {
        viewsCacheOnCallbacks.push(callback);
      }
      del() {}
      get() {}
      set() {}
    }

    request = {
      body: {},
      params: {},
      query: {}
    };
    response = {};

    mock(path.join(process.root, 'app/server/conf.js'), conf);
    mock(path.join(process.root, 'app/server/context.js'), context);
    mock(path.join(process.root, 'app/server/Cache.js'), Cache);
  });

  // Initializes tests
  beforeEach(function() {
    const StatisticsController = mock.reRequire(
      path.join(process.root, 'app/server/controllers/StatisticsController.js')
    );
    statisticsController = new StatisticsController();
  });

  // Stop mocks
  afterEach(function() {
    mock.stopAll();
  });

  describe('statisticsAction', function() {

    it('should execute next if entity is not specified', function(done) {
      response.send = (result) => {
        assert.ok(false, 'Unexpected call to next');
      };

      statisticsController.statisticsAction(request, response, (error) => {
        done();
      });
    });

    it('should delete views cache when expiring', function() {
      const expectedKey = 'key';

      statisticsController.viewsCache.del = chai.spy((key) => {
        assert.equal(key, expectedKey, 'Wrong key');
      });

      viewsCacheOnCallbacks[0](expectedKey);
      statisticsController.viewsCache.del.should.have.been.called.exactly(1);
    });

    describe('video', function() {

      it('should execute next if type is not specified', function(done) {
        request.params.entity = 'video';

        response.send = (result) => {
          assert.ok(false, 'Unexpected call to next');
        };

        statisticsController.statisticsAction(request, response, (error) => {
          done();
        });
      });

    });

    describe('video/views', function() {

      beforeEach(function() {
        request.params.entity = 'video';
        request.params.type = 'views';
        request.params.id = '42';
      });

      it('should increment the number of views of a video', function(done) {
        expectedMedias = [
          {
            id: '42'
          }
        ];

        openVeoProvider.getOne = chai.spy((location, id, fields, ttl, callback) => {
          assert.equal(location, '/publish/videos', 'Wrong location');
          assert.equal(id, request.params.id, 'Wrong id');
          assert.equal(ttl, conf.conf.cache.videoTTL, 'Wrong TTL');
          callback(null, expectedMedias[0]);
        });

        openVeoProvider.updateOne = chai.spy((location, id, data, callback) => {
          assert.equal(location, '/publish/statistics/video/views', 'Wrong update location');
          assert.equal(id, expectedMedias[0].id, 'Wrong update id');
          assert.equal(data.count, 1, 'Wrong update count');
          callback(null, 1);
        });

        openVeoProvider.deleteDocumentCache = chai.spy((location, id, alsoRemoveFromPages) => {
          assert.equal(location, '/publish/videos', 'Wrong delete location');
          assert.equal(id, expectedMedias[0].id, 'Wrong delete id');
          assert.ok(alsoRemoveFromPages, 'Expected to also be removed from pages');
        });

        response.send = (result) => {
          openVeoProvider.getOne.should.have.been.called.exactly(1);
          openVeoProvider.updateOne.should.have.been.called.exactly(1);
          openVeoProvider.deleteDocumentCache.should.have.been.called.exactly(1);
          done();
        };

        statisticsController.statisticsAction(request, response, (error) => {
          assert.ok(false, 'Unexpected call to next');
        });
      });

      it('should execute next with an error if getting video failed', function(done) {
        openVeoProvider.getOne = chai.spy((location, id, fields, ttl, callback) => {
          callback(new Error('Something went wrong'));
        });

        response.send = (result) => {
          assert.ok(false, 'Unexpected result');
        };

        statisticsController.statisticsAction(request, response, (error) => {
          openVeoProvider.getOne.should.have.been.called.exactly(1);
          openVeoProvider.updateOne.should.have.been.called.exactly(0);
          openVeoProvider.deleteDocumentCache.should.have.been.called.exactly(0);
          assert.strictEqual(error, HTTP_ERRORS.STATISTICS_MEDIA_VIEWS_GET_ONE_ERROR, 'Wrong error');
          done();
        });
      });

      it('should execute next with an error if updating video failed', function(done) {
        expectedMedias = [
          {
            id: '42'
          }
        ];

        openVeoProvider.updateOne = chai.spy((location, id, data, callback) => {
          callback(new Error('Something went wrong'));
        });

        response.send = (result) => {
          assert.ok(false, 'Unexpected result');
        };

        statisticsController.statisticsAction(request, response, (error) => {
          openVeoProvider.getOne.should.have.been.called.exactly(1);
          openVeoProvider.updateOne.should.have.been.called.exactly(1);
          openVeoProvider.deleteDocumentCache.should.have.been.called.exactly(0);
          assert.strictEqual(error, HTTP_ERRORS.STATISTICS_MEDIA_VIEWS_INCREMENT_ERROR, 'Wrong error');
          done();
        });
      });

      it('should memorize that the user has seen the video', function(done) {
        request.sessionID = 'sessionId';
        expectedMedias = [
          {
            id: '42',
            metadata: {
              duration: 42
            }
          }
        ];

        statisticsController.viewsCache.set = chai.spy((key, value, ttl) => {
          assert.equal(key, `${request.sessionID}-${expectedMedias[0].id}`, 'Wrong key');
          assert.equal(value, true, 'Wrong value');
          assert.equal(ttl, expectedMedias[0].metadata.duration, 'Wrong TTL');
        });

        response.send = (result) => {
          done();
        };

        statisticsController.statisticsAction(request, response, (error) => {
          assert.ok(false, 'Unexpected result');
        });
      });

      it('should not increment the number of views more than once in the duration of the video', function(done) {
        request.sessionID = 'sessionId';
        expectedMedias = [
          {
            id: '42',
            metadata: {
              duration: 42
            }
          }
        ];

        statisticsController.viewsCache.get = chai.spy((key) => {
          assert.equal(key, `${request.sessionID}-${expectedMedias[0].id}`, 'Wrong key');
          return true;
        });

        response.send = (result) => {
          statisticsController.viewsCache.get.should.have.been.called.exactly(1);
          openVeoProvider.updateOne.should.have.been.called.exactly(0);
          openVeoProvider.deleteDocumentCache.should.have.been.called.exactly(0);
          done();
        };

        statisticsController.statisticsAction(request, response, (error) => {
          assert.ok(false, 'Unexpected result');
        });
      });

    });

  });

});

'use strict';

const path = require('path');
const chai = require('chai');
const spies = require('chai-spies');
const mock = require('mock-require');
const HTTP_ERRORS = process.require('app/server/httpErrors.js');

const assert = chai.assert;
chai.should();
chai.use(spies);

describe('GroupsController', function() {
  let request;
  let response;
  let groupsController;
  let openVeoProvider;
  let context;
  let expectedGroups;

  // Mocks
  beforeEach(function() {
    expectedGroups = [];
    openVeoProvider = {
      getAll: (location, filter, fields, sort, ttl, callback) => {
        callback(null, expectedGroups);
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

    mock(path.join(process.root, 'app/server/context.js'), context);
  });

  // Initializes tests
  beforeEach(function() {
    const GroupsController = mock.reRequire(
      path.join(process.root, 'app/server/controllers/GroupsController.js')
    );
    groupsController = new GroupsController();
  });

  // Stop mocks
  afterEach(function() {
    mock.stopAll();
  });

  describe('getGroupsAction', function() {

    it('should send response with the list of OpenVeo groups', function(done) {
      expectedGroups = [
        {
          id: '42',
          name: 'Group name',
          description: 'Group description'
        }
      ];
      openVeoProvider.getAll = chai.spy((location, filter, fields, sort, ttl, callback) => {
        assert.equal(location, '/groups', 'Wrong location');
        callback(null, expectedGroups);
      });

      response.send = (result) => {
        openVeoProvider.getAll.should.have.been.called.exactly(1);
        assert.equal(result.entities[0].id, expectedGroups[0].id, 'Wrong id');
        assert.equal(result.entities[0].name, expectedGroups[0].name, 'Wrong name');
        assert.equal(result.entities[0].description, expectedGroups[0].description, 'Wrong description');
        done();
      };

      groupsController.getGroupsAction(request, response, (error) => {
        assert.ok(false, 'Unexpected call to next');
      });
    });

    it('should execute next with an error if getting groups failed', function(done) {
      openVeoProvider.getAll = chai.spy((location, filter, fields, sort, ttl, callback) => {
        callback(new Error('Something went wrong'));
      });

      response.send = (result) => {
        assert.ok(false, 'Unexpected call to next');
      };

      groupsController.getGroupsAction(request, response, (error) => {
        openVeoProvider.getAll.should.have.been.called.exactly(1);
        assert.strictEqual(error, HTTP_ERRORS.GET_GROUPS_ERROR, 'Wrong error');
        done();
      });
    });

  });

});

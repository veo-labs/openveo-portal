'use strict';

const path = require('path');
const assert = require('chai').assert;
const mock = require('mock-require');
const api = require('@openveo/api');
const ResourceFilter = api.storages.ResourceFilter;

describe('UserProvider', function() {
  let EntityProvider;
  let UserProvider;
  let openVeoApi;
  let storage;
  let provider;
  let expectedUsers;
  let portalConf;
  const expectedLocation = 'location';

  // Initiates mocks
  beforeEach(function() {
    storage = {};

    EntityProvider = function() {
      this.storage = storage;
      this.location = expectedLocation;
    };
    EntityProvider.prototype.executeCallback = function() {
      const args = Array.prototype.slice.call(arguments);
      const callback = args.shift();
      if (callback) return callback.apply(null, args);
    };
    EntityProvider.prototype.getAll = function(filter, fields, sort, callback) {
      callback(null, []);
    };
    EntityProvider.prototype.add = function(resources, callback) {
      callback(null, expectedUsers.length, expectedUsers);
    };
    EntityProvider.prototype.getOne = function(filter, fields, callback) {
      callback(null, expectedUsers[0]);
    };
    EntityProvider.prototype.remove = function(filter, callback) {
      callback(null, expectedUsers.length);
    };

    openVeoApi = {
      providers: {
        EntityProvider
      },
      storages: {
        ResourceFilter
      },
      fileSystem: {
        getConfDir: function() {
          return '';
        }
      },
      passport: api.passport,
      util: api.util
    };

    portalConf = {
      passwordHashKey: 'hashkey'
    };

    mock('portal/conf.json', portalConf);
    mock('@openveo/api', openVeoApi);
  });

  // Initiates tests
  beforeEach(function() {
    UserProvider = mock.reRequire(path.join(process.root, 'app/server/providers/UserProvider.js'));
    provider = new UserProvider(storage, expectedLocation);
  });

  // Stop mocks
  afterEach(function() {
    mock.stopAll();
  });

  describe('add', function() {

    it('should add a list of users with generated passwords', function(done) {
      expectedUsers = [
        {
          id: '42',
          name: 'Name 42',
          email: 'email.42@domain.com',
          password: 'password42',
          passwordValidate: 'password42',
          locked: true,
          groups: ['group42']
        },
        {
          id: '43',
          name: 'Name 43',
          email: 'email.43@domain.com',
          password: 'password43',
          passwordValidate: 'password43',
          locked: false,
          groups: ['group43']
        }
      ];

      EntityProvider.prototype.add = function(resources, callback) {
        for (let i = 0; i < resources.length; i++) {
          assert.equal(resources[i].id, expectedUsers[i].id, `Wrong id for user "${i}"`);
          assert.equal(resources[i].name, expectedUsers[i].name, `Wrong name for user "${i}"`);
          assert.equal(resources[i].email, expectedUsers[i].email, `Wrong email for user "${i}"`);
          assert.equal(resources[i].locked, expectedUsers[i].locked, `Wrong locked for user "${i}"`);
          assert.equal(resources[i].origin, api.passport.STRATEGIES.LOCAL, `Wrong origin for user "${i}"`);
          assert.notEqual(resources[i].password, expectedUsers[i].password, `Wrong password for user "${i}"`);
          assert.isNotEmpty(resources[i].password, `Expected a password for user "${i}"`);
          assert.deepEqual(resources[i].groups, expectedUsers[i].groups, `Wrong groups for user "${i}"`);
        }

        callback(null, expectedUsers.length, expectedUsers);
      };

      provider.add(
        expectedUsers,
        (error, total, users) => {
          assert.isNull(error, 'Unexpected error');
          assert.equal(total, expectedUsers.length, 'Wrong number of inserted users');
          assert.strictEqual(users, expectedUsers, 'Wrong users');
          done();
        }
      );
    });

    it('should initialize groups to an empty array if no group specified', function(done) {
      expectedUsers = [
        {
          id: '42',
          name: 'Name 42',
          email: 'email.42@domain.com',
          password: 'password42',
          passwordValidate: 'password42',
          locked: true
        }
      ];

      EntityProvider.prototype.add = function(resources, callback) {
        for (let resource of resources)
          assert.isArray(resource.groups, `Expected empty groups for user "${resource.id}"`);

        callback(null, expectedUsers.length, expectedUsers);
      };

      provider.add(
        expectedUsers,
        (error, total, tokens) => {
          assert.isNull(error, 'Unexpected error');
          done();
        }
      );
    });

    it('should initialize locked to false if not specified', function(done) {
      expectedUsers = [
        {
          id: '42',
          name: 'Name 42',
          email: 'email.42@domain.com',
          password: 'password42',
          passwordValidate: 'password42',
          groups: ['group42']
        }
      ];

      EntityProvider.prototype.add = function(resources, callback) {
        for (let resource of resources)
          assert.notOk(resource.locked, `Unexpected lock on user "${resource.id}"`);

        callback(null, expectedUsers.length, expectedUsers);
      };

      provider.add(
        expectedUsers,
        (error, total, tokens) => {
          assert.isNull(error, 'Unexpected error');
          done();
        }
      );
    });

    it('should generate an id if not specified', function(done) {
      expectedUsers = [
        {
          name: 'Name 42',
          email: 'email.42@domain.com',
          password: 'password42',
          passwordValidate: 'password42',
          groups: ['group42']
        }
      ];

      EntityProvider.prototype.add = function(resources, callback) {
        for (let resource of resources)
          assert.isNotEmpty(resource.id, `Expected an id for user "${resource.name}"`);

        callback(null, expectedUsers.length, expectedUsers);
      };

      provider.add(
        expectedUsers,
        (error, total, tokens) => {
          assert.isNull(error, 'Unexpected error');
          done();
        }
      );
    });

    it('should exclude user passwords from response', function(done) {
      expectedUsers = [
        {
          name: 'Name 42',
          email: 'email.42@domain.com',
          password: 'password42',
          passwordValidate: 'password42',
          groups: ['group42']
        }
      ];

      provider.add(
        expectedUsers,
        (error, total, users) => {
          assert.notProperty(users[0], 'password', 'Unexpected property "password"');
          done();
        }
      );
    });

    it('should execute callback with an error if name is not specified', function(done) {
      expectedUsers = [
        {
          email: 'email.42@domain.com',
          password: 'password42',
          passwordValidate: 'password42',
          groups: ['group42']
        }
      ];

      provider.add(
        expectedUsers,
        (error, total, users) => {
          assert.instanceOf(error, TypeError, 'Wrong error');
          done();
        }
      );
    });

    it('should execute callback with an error if email is not specified', function(done) {
      expectedUsers = [
        {
          name: 'Name 42',
          password: 'password42',
          passwordValidate: 'password42',
          groups: ['group42']
        }
      ];

      provider.add(
        expectedUsers,
        (error, total, users) => {
          assert.instanceOf(error, TypeError, 'Wrong error');
          done();
        }
      );
    });

    it('should execute callback with an error if password is not specified', function(done) {
      expectedUsers = [
        {
          name: 'Name 42',
          email: 'email.42@domain.com',
          passwordValidate: 'password42',
          groups: ['group42']
        }
      ];

      provider.add(
        expectedUsers,
        (error, total, users) => {
          assert.instanceOf(error, TypeError, 'Wrong error');
          done();
        }
      );
    });

    it('should execute callback with an error if passwords do not match', function(done) {
      expectedUsers = [
        {
          name: 'Name 42',
          email: 'email.42@domain.com',
          password: 'password42',
          passwordValidate: 'doesNotMatch',
          groups: ['group42']
        }
      ];

      provider.add(
        expectedUsers,
        (error, total, users) => {
          assert.instanceOf(error, Error, 'Wrong error');
          done();
        }
      );
    });

    it('should execute callback with an error if email is not valid', function(done) {
      expectedUsers = [
        {
          name: 'Name 42',
          email: 'email.42',
          password: 'password42',
          passwordValidate: 'password42',
          groups: ['group42']
        }
      ];

      provider.add(
        expectedUsers,
        (error, total, users) => {
          assert.instanceOf(error, TypeError, 'Wrong error');
          done();
        }
      );
    });

    it('should execute callback with an error if getting users failed', function(done) {
      const expectedError = new Error('Something went wrong');
      expectedUsers = [
        {
          name: 'Name 42',
          email: 'email.42@domain.com',
          password: 'password42',
          passwordValidate: 'password42',
          groups: ['group42']
        }
      ];

      EntityProvider.prototype.getAll = function(filter, fields, sort, callback) {
        callback(expectedError);
      };

      provider.add(
        expectedUsers,
        (error, total, users) => {
          assert.strictEqual(error, expectedError, 'Wrong error');
          done();
        }
      );
    });

    it('should execute callback with an error if email is already used', function(done) {
      expectedUsers = [
        {
          name: 'Name 42',
          email: 'email.42@domain.com',
          password: 'password42',
          passwordValidate: 'password42',
          groups: ['group42']
        }
      ];

      EntityProvider.prototype.getAll = function(filter, fields, sort, callback) {
        assert.deepEqual(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.IN, 'email').value,
          [expectedUsers[0].email],
          'Wrong email'
        );
        assert.deepEqual(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.EQUAL, 'origin').value,
          api.passport.STRATEGIES.LOCAL,
          'Wrong origin'
        );
        callback(null, expectedUsers);
      };

      provider.add(
        expectedUsers,
        (error, total, users) => {
          assert.instanceOf(error, Error, 'Wrong error');
          done();
        }
      );
    });

    it('should execute callback with an error if adding users failed', function(done) {
      const expectedError = new Error('Something went wrong');
      expectedUsers = [
        {
          name: 'Name 42',
          email: 'email.42@domain.com',
          password: 'password42',
          passwordValidate: 'password42',
          groups: ['group42']
        }
      ];

      EntityProvider.prototype.add = function(users, callback) {
        callback(expectedError);
      };

      provider.add(
        expectedUsers,
        (error, total, users) => {
          assert.strictEqual(error, expectedError, 'Wrong error');
          done();
        }
      );
    });

  });

  describe('getUserByCredentials', function() {

    it('should get a user by its credentials', function(done) {
      const expectedEmail = 'email.42@domain.com';
      const expectedPassword = 'password42';
      const expectedUser = {};

      EntityProvider.prototype.getOne = function(filter, fields, callback) {
        assert.equal(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.EQUAL, 'origin').value,
          api.passport.STRATEGIES.LOCAL,
          'Wrong origin'
        );
        assert.equal(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.EQUAL, 'email').value,
          expectedEmail,
          'Wrong email'
        );
        assert.isNotEmpty(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.EQUAL, 'password').value,
          'Expected a password'
        );
        assert.notEqual(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.EQUAL, 'password').value,
          expectedPassword,
          'Wrong password'
        );
        callback(null, expectedUser);
      };

      provider.getUserByCredentials(
        expectedEmail,
        expectedPassword,
        (error, user) => {
          assert.isNull(error, 'Unexpected error');
          assert.strictEqual(user, expectedUser, 'Wrong user');
          done();
        }
      );
    });

    it('should exclude "password" field from response', function(done) {
      const expectedUser = {
        password: 'password42'
      };

      EntityProvider.prototype.getOne = function(filter, fields, callback) {
        assert.include(fields.exclude, 'password', 'Expected "password" to be excluded');
        callback(null, expectedUser);
      };

      provider.getUserByCredentials(
        'email.42@domain.com',
        'password42',
        (error, user) => {
          assert.isNull(error, 'Unexpected error');
          done();
        }
      );
    });

  });

  describe('getUserByEmail', function() {

    it('Get a user by its email', function(done) {
      const expectedUser = {};
      const expectedEmail = 'email.42@domain.com';

      EntityProvider.prototype.getOne = function(filter, fields, callback) {
        assert.equal(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.EQUAL, 'origin').value,
          api.passport.STRATEGIES.LOCAL,
          'Wrong origin'
        );
        assert.equal(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.EQUAL, 'email').value,
          expectedEmail,
          'Wrong email'
        );
        callback(null, expectedUser);
      };

      provider.getUserByEmail(
        expectedEmail,
        (error, user) => {
          assert.isNull(error, 'Unexpected error');
          assert.strictEqual(user, expectedUser, 'Wrong user');
          done();
        }
      );
    });

    it('should exclude "password" field from response', function(done) {
      const expectedUser = {
        password: 'password42'
      };

      EntityProvider.prototype.getOne = function(filter, fields, callback) {
        assert.include(fields.exclude, 'password', 'Expected "password" to be excluded');
        callback(null, expectedUser);
      };

      provider.getUserByEmail(
        'email.42@domain.com',
        (error, user) => {
          assert.isNull(error, 'Unexpected error');
          done();
        }
      );
    });

  });

  describe('updateOne', function() {

    beforeEach(function() {
      provider.getUserByEmail = (email, callback) => {
        callback(null, expectedUsers[0]);
      };
    });

    it('should update a user', function(done) {
      const expectedFilter = new ResourceFilter();
      const expectedTotal = 1;
      const expectedModifications = {
        name: 'New name',
        password: 'password43',
        passwordValidate: 'password43',
        email: 'email.43@domain.com',
        groups: ['group43']
      };
      expectedUsers = [
        {
          id: '42',
          name: 'Name 42',
          email: 'email.42@domain.com'
        }
      ];

      EntityProvider.prototype.getOne = function(filter, fields, callback) {
        assert.equal(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.EQUAL, 'origin').value,
          api.passport.STRATEGIES.LOCAL,
          'Wrong origin'
        );
        callback(null, expectedUsers[0]);
      };

      provider.getUserByEmail = (email, callback) => {
        assert.equal(email, expectedModifications.email, 'Wrong email');
        callback(null, expectedUsers[0]);
      };

      EntityProvider.prototype.updateOne = function(filter, data, callback) {
        assert.equal(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.EQUAL, 'origin').value,
          api.passport.STRATEGIES.LOCAL,
          'Wrong origin'
        );
        assert.equal(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.EQUAL, 'id').value,
          expectedUsers[0].id,
          'Wrong id'
        );
        assert.isNotEmpty(data.password, 'Expected a password');
        assert.notEqual(data.password, expectedModifications.password, 'Wrong password');
        assert.equal(data.name, expectedModifications.name, 'Wrong name');
        assert.equal(data.email, expectedModifications.email, 'Wrong email');
        assert.deepEqual(data.groups, expectedModifications.groups, 'Wrong groups');
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

    it('should update only email, password, groups and locked', function(done) {
      const expectedTotal = 1;
      const expectedModifications = {
        id: '43',
        unexpectedProperty: 'Unexpected property value'
      };
      expectedUsers = [
        {
          id: '42',
          name: 'Name 42',
          email: 'email.42@domain.com'
        }
      ];

      EntityProvider.prototype.updateOne = function(filter, data, callback) {
        assert.notProperty(data, 'id', 'Unexpected property "id"');
        assert.notProperty(data, 'unexpectedProperty', 'Unexpected property "unexpectedProperty"');
        callback(null, expectedTotal);
      };

      provider.updateOne(
        null,
        expectedModifications,
        (error, total) => {
          assert.isNull(error, 'Unexpected error');
          done();
        }
      );
    });

    it('should execute callback with an error if passwords do not match', function(done) {
      const expectedModifications = {
        password: 'password43',
        passwordValidate: 'does not match'
      };
      expectedUsers = [
        {
          id: '42',
          name: 'Name 42',
          email: 'email.42@domain.com'
        }
      ];

      EntityProvider.prototype.updateOne = function(filter, data, callback) {
        assert.ok(false, 'Unexpected update');
      };

      provider.updateOne(
        null,
        expectedModifications,
        (error, total) => {
          assert.instanceOf(error, Error, 'Wrong error');
          done();
        }
      );
    });

    it('should execute callback with an error if email is not valid', function(done) {
      const expectedModifications = {
        email: 'wrong.email'
      };
      expectedUsers = [
        {
          id: '42',
          name: 'Name 42',
          email: 'email.42@domain.com'
        }
      ];

      EntityProvider.prototype.updateOne = function(filter, data, callback) {
        assert.ok(false, 'Unexpected update');
      };

      provider.updateOne(
        null,
        expectedModifications,
        (error, total) => {
          assert.instanceOf(error, TypeError, 'Wrong error');
          done();
        }
      );
    });

    it('should execute callback with an error if user does not exist', function(done) {
      const expectedError = new Error('Something went wrong');
      const expectedModifications = {
        name: 'New name'
      };
      expectedUsers = [
        {
          id: '42',
          name: 'Name 42',
          email: 'email.42@domain.com'
        }
      ];

      EntityProvider.prototype.getOne = function(filter, fields, callback) {
        callback(expectedError);
      };

      EntityProvider.prototype.updateOne = function(filter, data, callback) {
        assert.ok(false, 'Unexpected update');
      };

      provider.updateOne(
        null,
        expectedModifications,
        (error, total) => {
          assert.strictEqual(error, expectedError, 'Wrong error');
          done();
        }
      );
    });

    it('should execute callback with an error if trying to use an email already attributed', function(done) {
      const expectedModifications = {
        email: 'email.43@domain.com'
      };
      expectedUsers = [
        {
          id: '42',
          name: 'Name 42',
          email: 'email.42@domain.com'
        },
        {
          id: '43',
          name: 'Name 43',
          email: expectedModifications.email
        }
      ];

      provider.getUserByEmail = (email, callback) => {
        callback(null, expectedUsers[1]);
      };

      EntityProvider.prototype.updateOne = function(filter, data, callback) {
        assert.ok(false, 'Unexpected update');
      };

      provider.updateOne(
        null,
        expectedModifications,
        (error, total) => {
          assert.instanceOf(error, Error, 'Wrong error');
          done();
        }
      );
    });

    it('should execute callback with an error if finding a user with by email failed', function(done) {
      const expectedError = new Error('Something went wrong');
      const expectedModifications = {
        email: 'email.43@domain.com'
      };
      expectedUsers = [
        {
          id: '42',
          name: 'Name 42',
          email: 'email.42@domain.com'
        }
      ];

      provider.getUserByEmail = function(email, callback) {
        callback(expectedError);
      };

      EntityProvider.prototype.updateOne = function(filter, data, callback) {
        assert.ok(false, 'Unexpected update');
      };

      provider.updateOne(
        null,
        expectedModifications,
        (error, total) => {
          assert.strictEqual(error, expectedError, 'Wrong error');
          done();
        }
      );
    });

    it('should execute callback with an error if updating user failed', function(done) {
      const expectedError = new Error('Something went wrong');
      const expectedModifications = {
        name: 'New name'
      };
      expectedUsers = [
        {
          id: '42',
          name: 'Name 42',
          email: 'email.42@domain.com'
        }
      ];

      EntityProvider.prototype.updateOne = function(filter, data, callback) {
        callback(expectedError);
      };

      provider.updateOne(
        null,
        expectedModifications,
        (error, total) => {
          assert.strictEqual(error, expectedError, 'Wrong error');
          done();
        }
      );
    });

  });

  describe('addThirdPartyUsers', function() {

    it('should add external users', function() {
      expectedUsers = [
        {
          id: '42',
          origin: api.passport.STRATEGIES.LDAP,
          originId: '42',
          name: 'Name 42',
          email: 'email.42@domain.com',
          originGroups: ['group42'],
          groups: ['group42']
        },
        {
          id: '43',
          origin: api.passport.STRATEGIES.CAS,
          originId: '43',
          name: 'Name 43',
          email: 'email.43@domain.com',
          originGroups: ['group43'],
          groups: ['group43']
        }
      ];

      EntityProvider.prototype.add = function(users, callback) {
        for (let i = 0; i < users.length; i++) {
          assert.equal(users[i].id, expectedUsers[i].id, `Wrong id for user "${i}"`);
          assert.equal(users[i].name, expectedUsers[i].name, `Wrong name for user "${i}"`);
          assert.equal(users[i].origin, expectedUsers[i].origin, `Wrong origin for user "${i}"`);
          assert.equal(users[i].originId, expectedUsers[i].originId, `Wrong originId for user "${i}"`);
          assert.equal(users[i].email, expectedUsers[i].email, `Wrong email for user "${i}"`);
          assert.deepEqual(users[i].originGroups, expectedUsers[i].originGroups, `Wrong groups for user "${i}"`);
          assert.deepEqual(users[i].groups, expectedUsers[i].groups, `Wrong groups for user "${i}"`);
          assert.ok(users[i].locked, `Expected user "${i}" to be locked`);
        }
        callback(null, expectedUsers.length, expectedUsers);
      };

      provider.addThirdPartyUsers(
        expectedUsers,
        (error, total, users) => {
          assert.isNull(error, 'Unexpected error');
          assert.equal(total, expectedUsers.length, 'Wrong total');
          assert.equal(users, expectedUsers, 'Wrong users');
        }
      );
    });

    it('should generate an id if user id is not specified', function() {
      expectedUsers = [
        {
          origin: api.passport.STRATEGIES.LDAP,
          originId: '42',
          name: 'Name 42',
          email: 'email.42@domain.com',
          originGroups: ['group42'],
          groups: ['group42']
        }
      ];

      EntityProvider.prototype.add = function(users, callback) {
        assert.isNotEmpty(users[0].id, 'Expected user id to be generated');
        callback(null, expectedUsers.length, expectedUsers);
      };

      provider.addThirdPartyUsers(
        expectedUsers,
        (error, total, users) => {
          assert.isNull(error, 'Unexpected error');
        }
      );
    });

    it('should initialize originGroups to an empty array if not specified', function() {
      expectedUsers = [
        {
          origin: api.passport.STRATEGIES.LDAP,
          originId: '42',
          name: 'Name 42',
          email: 'email.42@domain.com',
          groups: ['group42']
        }
      ];

      EntityProvider.prototype.add = function(users, callback) {
        assert.isArray(users[0].originGroups, 'Expected originGroups to be an array');
        assert.isEmpty(users[0].originGroups, 'Wrong originGroups');
        callback(null, expectedUsers.length, expectedUsers);
      };

      provider.addThirdPartyUsers(
        expectedUsers,
        (error, total, users) => {
          assert.isNull(error, 'Unexpected error');
        }
      );
    });

    it('should initialize groups to an empty array if not specified', function() {
      expectedUsers = [
        {
          origin: api.passport.STRATEGIES.LDAP,
          originId: '42',
          name: 'Name 42',
          email: 'email.42@domain.com'
        }
      ];

      EntityProvider.prototype.add = function(users, callback) {
        assert.isArray(users[0].groups, 'Expected groups to be an array');
        assert.isEmpty(users[0].groups, 'Wrong groups');
        callback(null, expectedUsers.length, expectedUsers);
      };

      provider.addThirdPartyUsers(
        expectedUsers,
        (error, total, users) => {
          assert.isNull(error, 'Unexpected error');
        }
      );
    });

    it('should execute callback with an error if origin is not specified', function() {
      expectedUsers = [
        {
          originId: '42',
          name: 'Name 42',
          email: 'email.42@domain.com'
        }
      ];

      EntityProvider.prototype.add = function(users, callback) {
        assert.ok(false, 'Unexpected add');
      };

      provider.addThirdPartyUsers(
        expectedUsers,
        (error, total, users) => {
          assert.instanceOf(error, TypeError, 'Wrong error');
        }
      );
    });

    it('should execute callback with an error if originId is not specified', function() {
      expectedUsers = [
        {
          origin: api.passport.STRATEGIES.LDAP,
          name: 'Name 42',
          email: 'email.42@domain.com'
        }
      ];

      EntityProvider.prototype.add = function(users, callback) {
        assert.ok(false, 'Unexpected add');
      };

      provider.addThirdPartyUsers(
        expectedUsers,
        (error, total, users) => {
          assert.instanceOf(error, TypeError, 'Wrong error');
        }
      );
    });

    it('should execute callback with an error if name is not specified', function() {
      expectedUsers = [
        {
          origin: api.passport.STRATEGIES.LDAP,
          originId: '42',
          email: 'email.42@domain.com'
        }
      ];

      EntityProvider.prototype.add = function(users, callback) {
        assert.ok(false, 'Unexpected add');
      };

      provider.addThirdPartyUsers(
        expectedUsers,
        (error, total, users) => {
          assert.instanceOf(error, TypeError, 'Wrong error');
        }
      );
    });

    it('should execute callback with an error if email is not specified', function() {
      expectedUsers = [
        {
          origin: api.passport.STRATEGIES.LDAP,
          originId: '42',
          name: 'Name 42'
        }
      ];

      EntityProvider.prototype.add = function(users, callback) {
        assert.ok(false, 'Unexpected add');
      };

      provider.addThirdPartyUsers(
        expectedUsers,
        (error, total, users) => {
          assert.instanceOf(error, TypeError, 'Wrong error');
        }
      );
    });

    it('should execute callback with an error if origin is local', function() {
      expectedUsers = [
        {
          origin: api.passport.STRATEGIES.LOCAL,
          originId: '42',
          name: 'Name 42',
          email: 'email.42@domain.com'
        }
      ];

      EntityProvider.prototype.add = function(users, callback) {
        assert.ok(false, 'Unexpected add');
      };

      provider.addThirdPartyUsers(
        expectedUsers,
        (error, total, users) => {
          assert.instanceOf(error, Error, 'Wrong error');
        }
      );
    });

  });

  describe('updateThirdPartyUser', function() {

    it('should update an external user', function(done) {
      const expectedFilter = new ResourceFilter();
      const expectedOrigin = api.passport.STRATEGIES.CAS;
      const expectedTotal = 1;
      const expectedModifications = {
        name: 'Name 42',
        email: 'email.42@domain.com',
        originGroups: ['group42'],
        groups: ['group42']
      };

      storage.updateOne = function(location, filter, modifications, callback) {
        assert.equal(location, expectedLocation, 'Wrong location');
        assert.equal(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.EQUAL, 'origin').value,
          expectedOrigin,
          'Wrong origin'
        );
        assert.equal(modifications.name, expectedModifications.name, 'Wrong name');
        assert.equal(modifications.email, expectedModifications.email, 'Wrong email');
        assert.equal(modifications.originGroups, expectedModifications.originGroups, 'Wrong originGroups');
        assert.equal(modifications.groups, expectedModifications.groups, 'Wrong groups');
        callback(null, expectedTotal);
      };

      provider.updateThirdPartyUser(
        expectedFilter,
        expectedModifications,
        expectedOrigin,
        (error, total) => {
          assert.isNull(error, 'Unexpected error');
          assert.equal(total, expectedTotal, 'Wrong total');
          done();
        }
      );
    });

    it('should update only name, email, originGroups and groups', function(done) {
      const expectedFilter = new ResourceFilter();
      const expectedModifications = {
        id: '42',
        origin: api.passport.STRATEGIES.LDAP,
        unexpectedProperty: 'Unexpected property value'
      };

      storage.updateOne = function(location, filter, modifications, callback) {
        assert.notProperty(modifications, 'id', 'Unexpected property "id"');
        assert.notProperty(modifications, 'origin', 'Unexpected property "origin"');
        assert.notProperty(modifications, 'unexpectedProperty', 'Unexpected property "unexpectedProperty"');
        callback(null, 1);
      };

      provider.updateThirdPartyUser(
        expectedFilter,
        expectedModifications,
        api.passport.STRATEGIES.CAS,
        (error, total) => {
          assert.isNull(error, 'Unexpected error');
          done();
        }
      );
    });

    it('should execute callback with an error if origin is local', function(done) {
      const expectedFilter = new ResourceFilter();
      const expectedModifications = {
        name: 'New name'
      };

      storage.updateOne = function(location, filter, modifications, callback) {
        callback(null, 1);
      };

      provider.updateThirdPartyUser(
        expectedFilter,
        expectedModifications,
        api.passport.STRATEGIES.LOCAL,
        (error, total) => {
          assert.instanceOf(error, Error, 'Wrong error');
          done();
        }
      );
    });

    it('should execute callback with an error if update failed', function(done) {
      const expectedFilter = new ResourceFilter();
      const expectedError = new Error('Something went wrong');
      const expectedModifications = {
        name: 'New name'
      };

      storage.updateOne = function(location, filter, modifications, callback) {
        callback(expectedError);
      };

      provider.updateThirdPartyUser(
        expectedFilter,
        expectedModifications,
        api.passport.STRATEGIES.CAS,
        (error, total) => {
          assert.strictEqual(error, expectedError, 'Wrong error');
          done();
        }
      );
    });

  });

});

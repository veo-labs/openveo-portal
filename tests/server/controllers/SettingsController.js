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

describe('SettingsController', function() {
  let request;
  let response;
  let settingsController;
  let expectedSettings;
  let SettingsProvider;
  let context;

  // Mocks
  beforeEach(function() {
    expectedSettings = [];

    SettingsProvider = function() {};
    SettingsProvider.prototype.getOne = chai.spy(function(filter, fields, callback) {
      callback(null, expectedSettings[0]);
    });
    SettingsProvider.prototype.add = chai.spy(function(settings, callback) {
      callback(null, 1);
    });

    context = {};

    request = {
      body: {},
      params: {}
    };
    response = {};

    mock(path.join(process.root, 'app/server/context.js'), context);
    mock(path.join(process.root, 'app/server/providers/SettingsProvider.js'), SettingsProvider);
  });

  // Initializes tests
  beforeEach(function() {
    const SettingsController = mock.reRequire(
      path.join(process.root, 'app/server/controllers/SettingsController.js')
    );
    settingsController = new SettingsController();
  });

  // Stop mocks
  afterEach(function() {
    mock.stopAll();
  });

  describe('getEntityAction', function() {

    it('should send response with the setting corresponding to the setting id', function(done) {
      const expectedSetting = {};
      request.params.id = '42';

      SettingsProvider.prototype.getOne = chai.spy(function(filter, fields, callback) {
        assert.equal(
          filter.getComparisonOperation(ResourceFilter.OPERATORS.EQUAL, 'id').value,
          request.params.id,
          'Wrong setting id'
        );
        callback(null, expectedSetting);
      });

      response.send = (result) => {
        assert.strictEqual(result.entity, expectedSetting, 'Wrong setting');
        SettingsProvider.prototype.getOne.should.have.been.called.exactly(1);
        done();
      };

      settingsController.getEntityAction(request, response, (error) => {
        assert.ok(false, 'Unexpected call to next');
      });
    });

    it('should send response with null if setting id does not correspond to any setting', function(done) {
      request.params.id = '42';

      SettingsProvider.prototype.getOne = chai.spy(function(filter, fields, callback) {
        callback();
      });

      response.send = (result) => {
        assert.isNull(result.entity, 'Unexpected setting');
        SettingsProvider.prototype.getOne.should.have.been.called.exactly(1);
        done();
      };

      settingsController.getEntityAction(request, response, (error) => {
        assert.ok(false, 'Unexpected call to next');
      });
    });

    it('should execute next with an error if parameter id is not specified', function(done) {
      response.send = (result) => {
        assert.ok(false, 'Unexpected result');
      };

      settingsController.getEntityAction(request, response, (error) => {
        assert.strictEqual(error, HTTP_ERRORS.GET_SETTING_MISSING_PARAMETERS, 'Wrong error');
        SettingsProvider.prototype.getOne.should.have.been.called.exactly(0);
        done();
      });
    });

    it('should execute next with an error if getting setting failed', function(done) {
      request.params.id = '42';

      SettingsProvider.prototype.getOne = chai.spy(function(filter, fields, callback) {
        callback(new Error('Something went wrong'));
      });

      response.send = (result) => {
        assert.ok(false, 'Unexpected result');
      };

      settingsController.getEntityAction(request, response, (error) => {
        assert.strictEqual(error, HTTP_ERRORS.GET_SETTING_ERROR, 'Wrong error');
        SettingsProvider.prototype.getOne.should.have.been.called.exactly(1);
        done();
      });
    });

  });

  describe('updateEntityAction', function() {

    it('should send response with a total of one when updating promoted-videos setting', function(done) {
      request.params.id = 'promoted-videos';
      request.body.value = ['42', '43', '44'];

      SettingsProvider.prototype.add = chai.spy(function(settings, callback) {
        assert.lengthOf(settings, 1, 'Wrong number of settings');
        assert.equal(settings[0].id, request.params.id, 'Wrong setting id');
        assert.deepEqual(settings[0].value, request.body.value, 'Wrong setting value');
        callback(null, 1);
      });

      response.send = (result) => {
        assert.equal(result.total, 1, 'Wrong total');
        SettingsProvider.prototype.add.should.have.been.called.exactly(1);
        done();
      };

      settingsController.updateEntityAction(request, response, (error) => {
        assert.ok(false, 'Unexpected call to next');
      });
    });

    it('should send response with a total of one when updating search setting', function(done) {
      request.params.id = 'search';
      request.body.value = {
        pois: true
      };

      SettingsProvider.prototype.add = chai.spy(function(settings, callback) {
        assert.lengthOf(settings, 1, 'Wrong number of settings');
        assert.equal(settings[0].id, request.params.id, 'Wrong setting id');
        assert.deepEqual(settings[0].value, request.body.value, 'Wrong setting value');
        callback(null, 1);
      });

      response.send = (result) => {
        assert.equal(result.total, 1, 'Wrong total');
        SettingsProvider.prototype.add.should.have.been.called.exactly(1);
        done();
      };

      settingsController.updateEntityAction(request, response, (error) => {
        assert.ok(false, 'Unexpected call to next');
      });
    });

    it('should send response with a total of one when updating live setting', function(done) {
      request.params.id = 'live';

      const values = [
        {
          activated: false,
          playerType: 'wowza'
        },
        {
          activated: true,
          playerType: 'wowza',
          url: 'https://wowza-example.local:1935/application-example/stream-example/playlist.m3u8',
          wowza: {
            playerLicenseKey: 'PLAY1-cerPw-zxezN-eMvje-9jHAD-8xA3j'
          },
          private: true,
          groups: ['groupId']
        },
        {
          activated: true,
          playerType: 'vimeo',
          url: 'https://vimeo.com/event/id',
          private: true,
          groups: ['groupId']
        },
        {
          activated: true,
          playerType: 'vodalys',
          url: 'https://console.vodalys.studio/vpage2/0hjertPpReB2Dbmr',
          private: true,
          groups: ['groupId']
        },
        {
          activated: true,
          playerType: 'youtube',
          url: 'https://www.youtube.com/watch?v=id',
          private: true,
          groups: ['groupId']
        }
      ];

      values.forEach((value) => {
        request.body.value = value;

        SettingsProvider.prototype.add = chai.spy(function(settings, callback) {
          assert.lengthOf(settings, 1, 'Wrong number of settings');
          assert.equal(settings[0].id, request.params.id, 'Wrong setting id');
          assert.deepEqual(settings[0].value, request.body.value, 'Wrong setting value');
          callback(null, 1);
        });

        response.send = (result) => {
          assert.equal(result.total, 1, 'Wrong total');
          SettingsProvider.prototype.add.should.have.been.called.exactly(1);
        };

        settingsController.updateEntityAction(request, response, (error) => {
          assert.ok(false, 'Unexpected call to next');
        });
      });

      done();
    });

    it('should execute next with an error if a live parameter is missing', function(done) {
      request.params.id = 'live';

      const values = [
        {},
        {
          activated: true,
          url: 'https://vimeo.com/event/id'
        },
        {
          activated: true,
          playerType: 'vimeo'
        },
        {
          activated: true,
          playerType: 'vimeo',
          url: 'https://vimeo.com/event/id',
          private: true
        }
      ];

      values.forEach((value) => {
        request.body.value = value;

        response.send = (result) => {
          assert.ok(false, 'Unexpected result');
        };

        settingsController.updateEntityAction(request, response, (error) => {
          SettingsProvider.prototype.add.should.have.been.called.exactly(0);
          assert.strictEqual(error, HTTP_ERRORS.UPDATE_SETTINGS_WRONG_PARAMETERS, 'Wrong error');
        });
      });

      done();
    });

    it('should execute next with an error if given player type is not supported', function(done) {
      request.params.id = 'live';
      request.body.value = {
        activated: true,
        playerType: 'wrong',
        url: 'https://vimeo.com/event/id'
      };

      response.send = (result) => {
        assert.ok(false, 'Unexpected result');
      };

      settingsController.updateEntityAction(request, response, (error) => {
        SettingsProvider.prototype.add.should.have.been.called.exactly(0);
        assert.strictEqual(error, HTTP_ERRORS.UPDATE_SETTINGS_WRONG_PARAMETERS, 'Wrong error');
        done();
      });
    });

    it('should execute next with an error if Wowza live URL is not valid', function(done) {
      request.params.id = 'live';
      request.body.value = {
        activated: true,
        playerType: 'wowza',
        wowza: {
          playerLicenseKey: 'PLAY1-cerPw-zxezN-eMvje-9jHAD-8xA3j'
        }
      };

      const values = [
        'https//wowza-example.local:1935/application-example/stream-example/playlist.m3u8',
        'https:/wowza-example.local:1935/application-example/stream-example/playlist.m3u8',
        'https://wowza-example.local:a1935/application-example/stream-example/playlist.m3u8',
        'https://wowza-example.local:1935/application-example/stream-example/playlist',
        'https://wowza-example.local:1935/application-example/stream-example/wrong.m3u8',
        'https://wowza-example.local:1935/stream-example/playlist.m3u8'
      ];

      values.forEach((value) => {
        request.body.value.url = value;

        response.send = (result) => {
          assert.ok(false, 'Unexpected result');
        };

        settingsController.updateEntityAction(request, response, (error) => {
          SettingsProvider.prototype.add.should.have.been.called.exactly(0);
          assert.strictEqual(error, HTTP_ERRORS.UPDATE_SETTINGS_WRONG_PARAMETERS, 'Wrong error');
        });
      });

      done();
    });

    it('should execute next with an error if Wowza player license is not valid', function(done) {
      request.params.id = 'live';
      request.body.value = {
        activated: true,
        playerType: 'wowza',
        url: 'https://wowza-example.local:1935/application-example/stream-example/playlist.m3u8',
        wowza: {}
      };

      const values = [
        '123456-cerPw-zxezN-eMvje-9jHAD-8xA3j',
        'PLAY1--cerPw-zxezN-eMvje-9jHAD-8xA3j',
        'PLAYé-cerPw-zxezN-eMvje-9jHAD-8xA3j',
        '-cerPw-zxezN-eMvje-9jHAD-8xA3j',
        '-'
      ];

      values.forEach((value) => {
        request.body.value.playerLicenseKey = value;

        response.send = (result) => {
          assert.ok(false, 'Unexpected result');
        };

        settingsController.updateEntityAction(request, response, (error) => {
          SettingsProvider.prototype.add.should.have.been.called.exactly(0);
          assert.strictEqual(error, HTTP_ERRORS.UPDATE_SETTINGS_WRONG_PARAMETERS, 'Wrong error');
        });
      });

      done();
    });

    it('should execute next with an error if Youtube live URL is not valid', function(done) {
      request.params.id = 'live';
      request.body.value = {
        activated: true,
        playerType: 'youtube'
      };

      const values = [
        'https://www.youtube.com/watch?v=',
        'https://www.youtube.com/watch?v=id with spaces',
        'https://www.youtube.com/watch?v=é',
        'https://www.youtube.com/watch?v',
        'https://www.youtube.com/watch?',
        'https://www.youtube.com/watch',
        'http://www.youtube.com/watch?v=id',
        'beforehttp://www.youtube.com/watch?v=id'
      ];

      values.forEach((value) => {
        request.body.value.url = value;

        response.send = (result) => {
          assert.ok(false, 'Unexpected result');
        };

        settingsController.updateEntityAction(request, response, (error) => {
          SettingsProvider.prototype.add.should.have.been.called.exactly(0);
          assert.strictEqual(error, HTTP_ERRORS.UPDATE_SETTINGS_WRONG_PARAMETERS, 'Wrong error');
        });
      });

      done();
    });

    it('should execute next with an error if Vodalys live URL is not valid', function(done) {
      request.params.id = 'live';
      request.body.value = {
        activated: true,
        playerType: 'vodalys'
      };

      const values = [
        'https://www.console.vodalys.studio/id',
        'https://console.vodalys/id',
        'https://console/id',
        'https://console.vodalys.studio/id?param=value',
        'https://console.vodalys.studio/id#something',
        'https://console.vodalys.studio/id#?embedded=true',
        'https://console.vodalys.studio/id/#?embedded=true',
        'https://console.vodalys.studio/vpage2/0hjertPpReB2Dbmr/#?embedded=true'
      ];

      values.forEach((value) => {
        request.body.value.url = value;

        response.send = (result) => {
          assert.ok(false, 'Unexpected result');
        };

        settingsController.updateEntityAction(request, response, (error) => {
          SettingsProvider.prototype.add.should.have.been.called.exactly(0);
          assert.strictEqual(error, HTTP_ERRORS.UPDATE_SETTINGS_WRONG_PARAMETERS, 'Wrong error');
        });
      });

      done();
    });

    it('should execute next with an error if Vimeo live URL is not valid', function(done) {
      request.params.id = 'live';
      request.body.value = {
        activated: true,
        playerType: 'vimeo'
      };

      const values = [
        'https://vimeo.com/event',
        'https://vimeo.com/event/',
        'https://vimeo.com/event/id with spaces',
        'https://vimeo.com/event/é',
        'https://www.vimeo.com/event/id',
        'http://vimeo.com/event/id',
        'beforehttps://vimeo.com/event/id'
      ];

      values.forEach((value) => {
        request.body.value.url = value;

        response.send = (result) => {
          assert.ok(false, 'Unexpected result');
        };

        settingsController.updateEntityAction(request, response, (error) => {
          SettingsProvider.prototype.add.should.have.been.called.exactly(0);
          assert.strictEqual(error, HTTP_ERRORS.UPDATE_SETTINGS_WRONG_PARAMETERS, 'Wrong error');
        });
      });

      done();
    });

    it('should execute next with an error if updating setting failed', function(done) {
      request.params.id = 'live';
      request.body.value = {
        activated: false,
        playerType: 'vimeo'
      };

      SettingsProvider.prototype.add = chai.spy(function(settings, callback) {
        callback(new Error('Something went wrong'));
      });

      response.send = (result) => {
        assert.ok(false, 'Unexpected result');
      };

      settingsController.updateEntityAction(request, response, (error) => {
        SettingsProvider.prototype.add.should.have.been.called.exactly(1);
        assert.strictEqual(error, HTTP_ERRORS.UPDATE_SETTINGS_ERROR, 'Wrong error');
        done();
      });
    });

    it('should execute next with an error if value for promoted-videos setting is invalid', function(done) {
      request.params.id = 'promoted-videos';

      const values = [
        true,
        {},
        'string',
        [true, false]
      ];

      values.forEach((value) => {
        request.body.value = value;

        response.send = (result) => {
          assert.ok(false, 'Unexpected result');
        };

        settingsController.updateEntityAction(request, response, (error) => {
          SettingsProvider.prototype.add.should.have.been.called.exactly(0);
          assert.strictEqual(error, HTTP_ERRORS.UPDATE_SETTINGS_WRONG_PARAMETERS, 'Wrong error');
        });
      });

      done();
    });

    it('should execute next with an error if setting id is missing', function(done) {
      request.body.value = {
        activated: false,
        playerType: 'vimeo'
      };

      response.send = (result) => {
        assert.ok(false, 'Unexpected result');
      };

      settingsController.updateEntityAction(request, response, (error) => {
        SettingsProvider.prototype.add.should.have.been.called.exactly(0);
        assert.strictEqual(error, HTTP_ERRORS.UPDATE_SETTINGS_MISSING_PARAMETERS, 'Wrong error');
        done();
      });
    });

  });

});


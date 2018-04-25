'use strict';

const fs = require('fs');
const path = require('path');
const chai = require('chai');
const spies = require('chai-spies');
const mock = require('mock-require');
const openVeoApi = require('@openveo/api');

const assert = chai.assert;
chai.should();
chai.use(spies);

describe('VersionController', function() {
  const atomFilePath = path.join(__dirname, 'atom.xml');
  let request;
  let response;
  let versionController;
  let packageConf;
  let https;

  // Mocks
  beforeEach(function() {
    packageConf = {
      version: '1.0.0',
      homepage: 'https://homePage.local/'
    };
    https = {
      get: chai.spy((url, callback) => {
        const fileStream = fs.createReadStream(atomFilePath);
        fileStream.statusCode = 200;
        fileStream.headers = {
          'content-type': 'application/atom+xml'
        };
        callback(fileStream);

        return {
          on: () => ''
        };
      })
    };

    request = {
      body: {},
      params: {},
      query: {}
    };
    response = {};

    mock(path.join(process.root, 'package.json'), packageConf);
    mock('https', https);
  });

  // Initializes tests
  beforeEach(function() {
    const VersionController = mock.reRequire(
      path.join(process.root, 'app/server/controllers/VersionController.js')
    );
    versionController = new VersionController();
  });

  // Stop mocks
  afterEach(function() {
    mock.stopAll();
  });

  // Remove atom mock file
  afterEach(function(done) {
    openVeoApi.fileSystem.rm(atomFilePath, done);
  });

  describe('getVersionAction', function() {

    it('should send response with information about OpenVeo Portal', function(done) {
      const expectedLatestVersion = '2.0.0';

      fs.writeFileSync(atomFilePath, `
        <id>tag:github.com,2008:Repository/76947326/${expectedLatestVersion}</id>
      `);

      response.send = chai.spy((info) => {
        assert.equal(info.version, packageConf.version, 'Wrong version');
        assert.equal(info.latestVersion, expectedLatestVersion, 'Wrong latest version');
        assert.equal(
          info.latestVersionReleaseUrl,
          `${packageConf.homepage}/releases/${expectedLatestVersion}`,
          'Wrong latest version release URL'
        );
        assert.equal(
          info.versionReleaseUrl,
          `${packageConf.homepage}/releases/${packageConf.version}`,
          'Wrong version release URL'
        );
        assert.equal(
          info.versionSourcesUrl,
          `${packageConf.homepage}/tree/${packageConf.version}`,
          'Wrong version sources URL'
        );
        assert.ok(info.updateAvailable, 'Expected a new version');
        done();
      });

      versionController.getVersionAction(request, response, (error) => {
        assert.ok(false, 'Unexpected error');
      });
    });

    it('should send response with only the actual version if getting feed failed', function(done) {
      fs.writeFileSync(atomFilePath, '<id>tag:github.com,2008:Repository/76947326/3.0.0</id>');

      https.get = chai.spy((url, callback) => {
        const fileStream = fs.createReadStream(atomFilePath);
        fileStream.statusCode = 500;
        fileStream.headers = {
          'content-type': 'application/atom+xml'
        };
        callback(fileStream);

        return {
          on: () => ''
        };
      });

      response.send = chai.spy((info) => {
        https.get.should.have.been.called.exactly(1);
        assert.equal(info.version, packageConf.version, 'Wrong version');
        assert.notProperty(info, 'latestVersion', 'Unexpected property "latestVersion"');
        assert.notProperty(info, 'latestVersionReleaseUrl', 'Unexpected property "latestVersionReleaseUrl"');
        assert.notProperty(info, 'versionReleaseUrl', 'Unexpected property "versionReleaseUrl"');
        assert.notProperty(info, 'versionSourcesUrl', 'Unexpected property "versionSourcesUrl"');
        assert.notProperty(info, 'updateAvailable', 'Unexpected property "updateAvailable"');
        done();
      });

      versionController.getVersionAction(request, response, (error) => {
        assert.ok(false, 'Unexpected error');
      });
    });

    it('should send response with only the actual version if feed is not an atom feed', function(done) {
      fs.writeFileSync(atomFilePath, '<id>tag:github.com,2008:Repository/76947326/3.0.0</id>');

      https.get = chai.spy((url, callback) => {
        const fileStream = fs.createReadStream(atomFilePath);
        fileStream.statusCode = 200;
        fileStream.headers = {
          'content-type': 'application/json'
        };
        callback(fileStream);

        return {
          on: () => ''
        };
      });

      response.send = chai.spy((info) => {
        https.get.should.have.been.called.exactly(1);
        assert.equal(info.version, packageConf.version, 'Wrong version');
        assert.notProperty(info, 'latestVersion', 'Unexpected property "latestVersion"');
        assert.notProperty(info, 'latestVersionReleaseUrl', 'Unexpected property "latestVersionReleaseUrl"');
        assert.notProperty(info, 'versionReleaseUrl', 'Unexpected property "versionReleaseUrl"');
        assert.notProperty(info, 'versionSourcesUrl', 'Unexpected property "versionSourcesUrl"');
        assert.notProperty(info, 'updateAvailable', 'Unexpected property "updateAvailable"');
        done();
      });

      versionController.getVersionAction(request, response, (error) => {
        assert.ok(false, 'Unexpected error');
      });
    });

    it('should send response with only the actual version if request to get feed failed', function(done) {
      let errorAction;
      fs.writeFileSync(atomFilePath, '<id>tag:github.com,2008:Repository/76947326/3.0.0</id>');

      https.get = chai.spy((url, callback) => {
        const fileStream = fs.createReadStream(atomFilePath);
        fileStream.statusCode = 200;
        fileStream.headers = {
          'content-type': 'application/atom+xml'
        };

        return {
          on: (name, action) => {
            errorAction = action;
          }
        };
      });

      response.send = chai.spy((info) => {
        https.get.should.have.been.called.exactly(1);
        assert.equal(info.version, packageConf.version, 'Wrong version');
        assert.notProperty(info, 'latestVersion', 'Unexpected property "latestVersion"');
        assert.notProperty(info, 'latestVersionReleaseUrl', 'Unexpected property "latestVersionReleaseUrl"');
        assert.notProperty(info, 'versionReleaseUrl', 'Unexpected property "versionReleaseUrl"');
        assert.notProperty(info, 'versionSourcesUrl', 'Unexpected property "versionSourcesUrl"');
        assert.notProperty(info, 'updateAvailable', 'Unexpected property "updateAvailable"');
        done();
      });

      versionController.getVersionAction(request, response, (error) => {
        assert.ok(false, 'Unexpected error');
      });

      errorAction(new Error('Something went wrong'));
    });

    it('should ignore unstable versions like beta, release candidates, alpha', function(done) {
      const expectedVersion = '3.0.0';
      fs.writeFileSync(atomFilePath, `
        <id>tag:github.com,2008:Repository/76947326/4.0.0-alpha1</id>
        <id>tag:github.com,2008:Repository/76947326/4.0.0-beta1</id>
        <id>tag:github.com,2008:Repository/76947326/4.0.0-RC1</id>
        <id>tag:github.com,2008:Repository/76947326/${expectedVersion}</id>
      `);

      response.send = chai.spy((info) => {
        https.get.should.have.been.called.exactly(1);
        assert.equal(info.latestVersion, expectedVersion, 'Wrong version');
        done();
      });

      versionController.getVersionAction(request, response, (error) => {
        assert.ok(false, 'Unexpected error');
      });
    });

    it('should indicate if a new version is available', function(done) {
      const expectedNewVersion = '3.0.0';

      fs.writeFileSync(atomFilePath, `
        <id>tag:github.com,2008:Repository/76947326/${expectedNewVersion}</id>
        <id>tag:github.com,2008:Repository/76947326/2.0.0</id>
        <id>tag:github.com,2008:Repository/76947326/1.2.0</id>
        <id>tag:github.com,2008:Repository/76947326/${packageConf.version}</id>
      `);

      response.send = chai.spy((info) => {
        https.get.should.have.been.called.exactly(1);
        assert.equal(info.latestVersion, expectedNewVersion, 'Wrong version');
        assert.ok(info.updateAvailable, 'Expected a new version');
        done();
      });

      versionController.getVersionAction(request, response, (error) => {
        assert.ok(false, 'Unexpected error');
      });
    });

    it('should indicate if a newer version available', function(done) {
      fs.writeFileSync(atomFilePath, `<id>tag:github.com,2008:Repository/76947326/${packageConf.version}</id>`);

      response.send = chai.spy((info) => {
        https.get.should.have.been.called.exactly(1);
        assert.equal(info.latestVersion, packageConf.version, 'Wrong version');
        assert.notOk(info.updateAvailable, 'Unexpected newer version');
        done();
      });

      versionController.getVersionAction(request, response, (error) => {
        assert.ok(false, 'Unexpected error');
      });
    });

  });

});

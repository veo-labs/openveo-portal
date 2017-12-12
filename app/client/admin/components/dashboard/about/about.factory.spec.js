'use strict';

window.assert = chai.assert;

describe('opaAboutFactory', function() {
  let $httpBackend;
  let opaAboutFactory;

  // Load modules
  beforeEach(function() {
    module('opa');
  });

  // Dependencies injections
  beforeEach(inject(function(_$httpBackend_, _opaAboutFactory_) {
    $httpBackend = _$httpBackend_;
    opaAboutFactory = _opaAboutFactory_;
  }));

  // Checks if no HTTP request stays without response
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getInfo', function() {

    it('should return a promise resolving with the response from the server', function() {
      const expectedResults = {version: '1.0.0'};
      $httpBackend.when('GET', '/be/version').respond(200, expectedResults);

      opaAboutFactory.getInfo().then((results) => {
        assert.deepEqual(results.data, expectedResults);
      }, (error) => {
        assert.ok(false, `Unexpected error: ${error.message}`);
      });

      $httpBackend.flush();
    });

    it('should return a promise rejecting if server return an error', function() {
      $httpBackend.when('GET', '/be/version').respond(500);

      opaAboutFactory.getInfo().then((results) => {
        assert.ok(false, 'Unexpected result');
      }, (error) => {
        assert.isDefined(error, 'Expected an error');
      });

      $httpBackend.flush();
    });

  });


});

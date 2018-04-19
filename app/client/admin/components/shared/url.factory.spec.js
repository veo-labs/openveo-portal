'use strict';

window.assert = chai.assert;

describe('opaUrlFactory', function() {
  let opaUrlFactory;

  // Load modules
  beforeEach(function() {
    module('opa');
  });

  // Dependencies injections
  beforeEach(inject(function(_opaUrlFactory_) {
    opaUrlFactory = _opaUrlFactory_;
  }));

  describe('setUrlParameter', function() {

    it('should be able to add a parameter to an URL', function() {
      const parameterName = 'param';
      const parameterValue = 'value';
      const urls = [
        'https://test.local/action',
        'https://test.local:3000/action',
        'http://test.local/action',
        'https://www.test.local/action',
        'https://www.test.local/action/',
        'https://www.test.local/action#anchor'
      ];

      for (const url of urls) {
        const parsedUrl = new URL(opaUrlFactory.setUrlParameter(url, parameterName, parameterValue));
        assert.equal(parsedUrl.searchParams.get(parameterName), parameterValue, `Wrong value for URL ${url}`);
      }
    });

    it('should be able to add query parameter to an URL already containing parameters', function() {
      const existingParameterName = 'existingParam';
      const existingParameterValue = 'existingParamValue';
      const parameterName = 'param';
      const parameterValue = 'value';
      const url = `https://www.test.local/action?${existingParameterName}=${existingParameterValue}`;
      const parsedUrl = new URL(opaUrlFactory.setUrlParameter(url, parameterName, parameterValue));
      assert.equal(parsedUrl.searchParams.get(parameterName), parameterValue, 'Wrong value');
      assert.equal(parsedUrl.searchParams.get(existingParameterName), existingParameterValue, 'Wrong value');
    });

    it('should be able to update a query parameter from an URL', function() {
      const parameterName = 'param';
      const parameterValue = 'value';
      const url = `https://www.test.local/action?${parameterName}=${parameterValue}`;
      const parsedUrl = new URL(opaUrlFactory.setUrlParameter(url, parameterName, parameterValue));
      assert.equal(parsedUrl.searchParams.get(parameterName), parameterValue, 'Wrong value');
    });

  });

});

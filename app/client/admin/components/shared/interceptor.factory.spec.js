'use strict';

window.assert = chai.assert;

describe('opaInterceptor', function() {
  let $rootScope;
  let $filter;
  let $sce;
  let opaInterceptor;

  // Load modules
  beforeEach(function() {
    module('opa');
  });

  // Dependencies injections
  beforeEach(inject(function(_$rootScope_, _$filter_, _$sce_, _opaInterceptor_) {
    $rootScope = _$rootScope_;
    $filter = _$filter_;
    $sce = _$sce_;
    opaInterceptor = _opaInterceptor_;
  }));

  describe('request', function() {

    it('should prefix each request url by the back office base path', function() {
      const validRelativePaths = ['path/to/endpoint', 'endpoint', '/endpoint', '/endpoint/'];
      const expectedPaths = ['/be/path/to/endpoint', '/be/endpoint', '/be/endpoint', '/be/endpoint/'];

      for (let i = 0; i < validRelativePaths.length; i++) {
        let validRelativePath = validRelativePaths[i];
        const config = opaInterceptor.request({
          url: validRelativePath
        });
        assert.equal(config.url, expectedPaths[i], `Wrong request path for ${validRelativePath}`);
      }
    });

    it('should not prefix request url if request is a template', function() {
      const validRelativePaths = ['path/to/template.html', 'template.html', '/template.html'];

      validRelativePaths.forEach((validRelativePath) => {
        const config = opaInterceptor.request({
          url: validRelativePath
        });
        assert.equal(config.url, validRelativePath, `Wrong template path for ${validRelativePath}`);
      });
    });

  });

  describe('responseError', function() {

    it(`should broadcast an "opaHttpError" indicating that authentication
       failed while receiving a 401 error`, function() {
      $rootScope.$on('opaHttpError', (event, data) => {
        assert.isOk(data.authenticationError, 'Expected an authentication error');
      });

      opaInterceptor.responseError({
        status: 401
      });
    });

    it('should broadcast an "opaHttpError" when a network error occured', function() {
      $rootScope.$on('opaHttpError', (event, data) => {
        assert.equal($sce.getTrustedHtml(data.message),
                     $sce.getTrustedHtml($filter('opaTranslate')('ERRORS.SERVER')), 'Wrong error message');
      });

      opaInterceptor.responseError({
        status: -1
      });
    });

    it(`should broadcast an "opaHttpError" whith a specific error message while
       receiving specific server errors`, function() {
      const errors = {
        'ERRORS.FORBIDDEN': 403,
        'ERRORS.CLIENT': 400
      };

      Object.keys(errors).forEach((error) => {
        const deregister = $rootScope.$on('opaHttpError', (event, data) => {
          assert.equal($sce.getTrustedHtml(data.message),
                       $sce.getTrustedHtml($filter('opaTranslate')(error)),
                       `Wrong error message for code ${errors[error]}`
          );
        });

        opaInterceptor.responseError({
          status: errors[error]
        });

        deregister();
      });

    });

    it(`should broadcast an "opaHttpError" whith a specific error message
      while receiving a server error with an error code`, function() {
      const serverErrorCode = '42';
      $rootScope.$on('opaHttpError', (event, data) => {
        assert.equal(data.message,
                     $sce.getTrustedHtml($filter('opaTranslate')('ERRORS.SERVER')) + ` (code=${serverErrorCode})`,
                     'Wrong error message'
        );
      });

      opaInterceptor.responseError({
        status: 500,
        data: {
          error: {
            code: serverErrorCode
          }
        }
      });
    });

    it('should ignore canceled requests', function() {
      $rootScope.$on('opaHttpError', (event, data) => {
        assert.ok(false, 'Unexpected message');
      });

      opaInterceptor.responseError({
        status: -1,
        config: {
          timeout: {
            status: 42
          }
        }
      });
    });
  });

});

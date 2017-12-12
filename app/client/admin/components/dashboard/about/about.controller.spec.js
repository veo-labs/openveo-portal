'use strict';

window.assert = chai.assert;

describe('OpaAboutController', function() {
  let $componentController;
  let $rootScope;
  let $q;
  let $filter;
  let $sce;

  // Load modules
  beforeEach(function() {
    module('opa');
  });

  // Dependencies injections
  beforeEach(inject(function(_$componentController_, _$rootScope_, _$q_, _$filter_, _$sce_) {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    $filter = _$filter_;
    $sce = _$sce_;
  }));

  it('should be loading at start', function() {
    const ctrl = $componentController('opaAbout', {
      opaAboutFactory: {
        getInfo: () => {}
      }
    });
    assert.ok(!ctrl.isLoaded, 'Expected component to be loading at start');
  });

  it('should build a message indicating that the version is up to date when it is the case', function() {
    const expectedData = {
      version: '1.0.0',
      latestVersion: '1.0.0',
      versionReleaseUrl: 'http://my.url.test/1.0.0',
      updateAvailable: false
    };
    const expectedMessage = $filter('opaTranslate')(
      'DASHBOARD.ABOUT.UP_TO_DATE_DESCRIPTION',
      0,
      {
        '%version%': expectedData.version,
        '%versionUrl%': expectedData.versionReleaseUrl,
        '%latestVersion%': expectedData.latestVersion
      }
    );

    const getInfo = chai.spy(() => {
      const deferred = $q.defer();
      deferred.resolve({
        data: expectedData
      });
      return deferred.promise;
    });
    const ctrl = $componentController('opaAbout', {
      opaAboutFactory: {
        getInfo
      }
    });
    ctrl.$onInit();
    $rootScope.$apply();

    getInfo.should.have.been.called.exactly(1);
    assert.equal($sce.getTrustedHtml(ctrl.message), $sce.getTrustedHtml(expectedMessage), 'Wrong message');
  });

  it('should build a message indicating that a new version is available when it is the case', function() {
    const expectedData = {
      version: '1.0.0',
      latestVersion: '2.0.0',
      versionReleaseUrl: 'http://my.url.test/1.0.0',
      latestVersionReleaseUrl: 'http://my.url.test/2.0.0',
      updateAvailable: true
    };
    const expectedMessage = $filter('opaTranslate')(
      'DASHBOARD.ABOUT.NEED_UPGRADE_DESCRIPTION',
      0,
      {
        '%version%': expectedData.version,
        '%versionUrl%': expectedData.versionReleaseUrl,
        '%latestVersion%': expectedData.latestVersion,
        '%latestVersionUrl%': expectedData.latestVersionReleaseUrl
      }
    );

    const getInfo = chai.spy(() => {
      const deferred = $q.defer();
      deferred.resolve({
        data: expectedData
      });
      return deferred.promise;
    });
    const ctrl = $componentController('opaAbout', {
      opaAboutFactory: {
        getInfo
      }
    });
    ctrl.$onInit();
    $rootScope.$apply();

    getInfo.should.have.been.called.exactly(1);
    assert.equal($sce.getTrustedHtml(ctrl.message), $sce.getTrustedHtml(expectedMessage), 'Wrong message');
  });

  it('should indicate that loading is done after building the message', function() {
    const expectedData = {
      version: '1.0.0',
      latestVersion: '1.0.0',
      updateAvailable: false
    };

    const getInfo = () => {
      const deferred = $q.defer();
      deferred.resolve({
        data: expectedData
      });
      return deferred.promise;
    };
    const ctrl = $componentController('opaAbout', {
      opaAboutFactory: {
        getInfo
      }
    });
    ctrl.$onInit();
    $rootScope.$apply();

    assert.ok(ctrl.isLoaded);
  });

  it('should indicate that loading is done when fetching information from server failed', function() {
    const getInfo = () => {
      const deferred = $q.defer();
      deferred.reject(new Error('Failed fetching data'));
      return deferred.promise;
    };
    const ctrl = $componentController('opaAbout', {
      opaAboutFactory: {
        getInfo
      }
    });
    ctrl.$onInit();
    $rootScope.$apply();

    assert.ok(ctrl.isLoaded);
  });
});
